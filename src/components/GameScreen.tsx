import { useState, useEffect } from "react";
import { TeamPanel } from "./TeamPanel";
import { GameZone } from "./GameZone";
import { Scoreboard } from "./Scoreboard";
import { useToast } from "@/hooks/use-toast";
import { GamePopup } from "./ui/game-popup";
import { api, GameData } from "../services/api";
import { QUESTIONS } from "../data/questions";
import { CelebrationOverlay } from "./CelebrationOverlay";
import { TournamentStage } from "./AuthScreen";
import { LayoutDashboard, History, RefreshCw, Zap } from "lucide-react";

interface GameScreenProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  battingFirst: "A" | "B";
  onNewGame?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToHistory?: () => void;
}

export interface BallDetails {
  ballNumber: number;
  innings: number;
  batterName: string;
  bowlerName: string;
  batterTeam: string;
  bowlerTeam: string;
  result: string; // "runs", "wicket", "dot", "extra"
  runsScored: number;
  isExtra: boolean;
  extraType?: "wide" | "noball";
  questionId?: number;
  correctAnswer?: boolean;
  ballerCorrect?: boolean;
  timestamp: string;
}

export interface GameState {
  innings: 1 | 2;
  battingTeam: "A" | "B";
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: number;
  currentBatter: number;
  currentBowler: number;
  usedBalls: number[];
  teamAScore?: { runs: number; wickets: number; overs: number };
  gameOver?: boolean;
  winner?: string;
  ballDetails: BallDetails[];
}

// Get the current user's tournament stage from session storage
const getUserStage = (): TournamentStage => {
  try {
    const authData = sessionStorage.getItem("mpl_auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      // If organizer or no stage specified, default to group stage
      return parsed.stage || "group";
    }
  } catch (error) {
    console.error("Error parsing auth data:", error);
  }
  return "group"; // Default to group stage
};

// Create two distinct 15-question pools so innings 1 and innings 2 use different questions
// Filter by tournament stage
const generatePools = (stage: TournamentStage) => {
  // Filter questions by stage
  const stageQuestions = QUESTIONS.filter(q => q.stage === stage);
  
  if (stageQuestions.length < 30) {
    console.warn(`Not enough questions for stage ${stage}. Found ${stageQuestions.length}, need at least 30.`);
    // Fall back to all questions if not enough stage-specific questions
    const all = [...QUESTIONS];
    const shuffled = all.sort(() => Math.random() - 0.5);
    const first = shuffled.slice(0, 15).map((q, idx) => ({ ...q, id: idx + 1 }));
    const second = shuffled.slice(15, 30).map((q, idx) => ({ ...q, id: idx + 16 }));
    
    const markExtras = (pool: any[]) => {
      const indices = Array.from({ length: pool.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
      if (indices.length >= 3) {
        pool[indices[0]].type = "wide";
        pool[indices[1]].type = "wide";
        pool[indices[2]].type = "noball";
        pool[indices[0]].runs = 0;
        pool[indices[1]].runs = 0;
        pool[indices[2]].runs = 0;
      }
    };
    
    markExtras(first);
    markExtras(second);
    return { first, second };
  }
  
  const shuffled = stageQuestions.sort(() => Math.random() - 0.5);
  const first = shuffled.slice(0, 15).map((q, idx) => ({ ...q, id: idx + 1 }));
  const second = shuffled.slice(15, 30).map((q, idx) => ({ ...q, id: idx + 16 }));

  // Mark exactly 3 random balls in each pool as extras: 2 wides and 1 no-ball
  const markExtras = (pool: any[]) => {
    const indices = Array.from({ length: pool.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
    if (indices.length >= 3) {
      // First two as wide, third as no-ball
      pool[indices[0]].type = "wide";
      pool[indices[1]].type = "wide";
      pool[indices[2]].type = "noball";
      pool[indices[0]].runs = 0;
      pool[indices[1]].runs = 0;
      pool[indices[2]].runs = 0;
    }
  };

  markExtras(first);
  markExtras(second);
  return { first, second };
};

export const GameScreen = ({ teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst, onNewGame, onNavigateToDashboard, onNavigateToHistory }: GameScreenProps) => {
  const { toast } = useToast();
  
  // Get user's stage and generate pools accordingly
  const [userStage] = useState<TournamentStage>(() => getUserStage());
  const [questionPools] = useState(() => generatePools(userStage));
  const [gameState, setGameState] = useState<GameState>({
    innings: 1,
    battingTeam: battingFirst,
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: 0,
    currentBatter: 0,
    currentBowler: 10, // Start from bottom (last player)
    usedBalls: [],
    gameOver: false,
    ballDetails: [],
  });
  const [selectedBowlerIndex, setSelectedBowlerIndex] = useState<number | null>(null);
  const [selectedBatterIndex, setSelectedBatterIndex] = useState<number | null>(null);
  const [lockedBattersA, setLockedBattersA] = useState<number[]>([]);
  const [lockedBattersB, setLockedBattersB] = useState<number[]>([]);
  const [popup, setPopup] = useState<{ type: "runs" | "wicket" | "dot" | "extra" | "winner"; value?: number; message?: string } | null>(null);
  const [pendingQuestionId, setPendingQuestionId] = useState<number | null>(null);
  const [celebration, setCelebration] = useState<{ type: "four" | "six" | "win" | null; visible: boolean; winnerName?: string }>({ type: null, visible: false });

  // Show stage notification on mount
  useEffect(() => {
    const stageEmojis = {
      group: "🏁",
      playoffs: "⚔️",
      semifinals: "🔥",
      finals: "🏆"
    };
    const stageNames = {
      group: "Group Stage",
      playoffs: "Playoffs",
      semifinals: "Semi-Finals",
      finals: "Finals"
    };
    
    toast({
      title: `${stageEmojis[userStage]} ${stageNames[userStage]} Questions`,
      description: `Playing with ${stageNames[userStage]} difficulty level.`,
      duration: 3000,
    });
  }, [userStage, toast]);

  const handleBallSelect = (ballNumber: number) => {
    if (selectedBowlerIndex === null || selectedBatterIndex === null) {
      toast({ title: "Select Players", description: "Pick a bowler and a batter before selecting a ball." });
      return;
    }
    
    // Prevent selecting another question if one is already pending
    if (pendingQuestionId !== null) {
      toast({ 
        title: "Question in Progress", 
        description: "Please answer the current question first.",
        variant: "destructive"
      });
      return;
    }
    
    setPendingQuestionId(ballNumber);
    setGameState(prev => ({
      ...prev,
      currentBatter: selectedBatterIndex,
      currentBowler: selectedBowlerIndex,
      usedBalls: [...prev.usedBalls, ballNumber],
    }));
  };

  const handleAnswer = (result: { 
    batterCorrect?: boolean; 
    bowlerCorrect?: boolean; 
    runs?: number; 
    isExtra?: boolean; 
    extraType?: "wide" | "noball"; 
    extraRuns?: number;
    questionId?: number;
    ballNumber?: number;
  }) => {
    setGameState(prev => {
      const battingPlayersLocal = prev.battingTeam === "A" ? teamAPlayers : teamBPlayers;
      const bowlingPlayersLocal = prev.battingTeam === "A" ? teamBPlayers : teamAPlayers;
      const batterIndex = selectedBatterIndex !== null ? selectedBatterIndex : prev.currentBatter % battingPlayersLocal.length;
      const bowlerIndex = selectedBowlerIndex !== null ? selectedBowlerIndex : prev.currentBowler % bowlingPlayersLocal.length;
      const batterName = battingPlayersLocal[batterIndex] || "Unknown";
      const bowlerName = bowlingPlayersLocal[bowlerIndex] || "Unknown";
      
      // Track ball details
      let ballResult = "";
      let runsScored = 0;
      
      if (result.isExtra) {
        ballResult = "extra";
        runsScored = result.extraRuns ?? 1;
      } else if (result.batterCorrect) {
        ballResult = "runs";
        runsScored = result.runs ?? 0;
      } else if (result.bowlerCorrect) {
        ballResult = "wicket";
        runsScored = 0;
      } else {
        ballResult = "dot";
        runsScored = 0;
      }
      // Create ball detail for tracking
      const ballDetail: BallDetails = {
        ballNumber: prev.balls + 1,
        innings: prev.innings,
        batterName: batterName,
        bowlerName: bowlerName,
        batterTeam: prev.battingTeam === "A" ? teamAName : teamBName,
        bowlerTeam: prev.battingTeam === "A" ? teamBName : teamAName,
        result: ballResult,
        runsScored: runsScored,
        isExtra: result.isExtra || false,
        extraType: result.extraType,
        questionId: pendingQuestionId ?? result.questionId,
        ballerCorrect: result.bowlerCorrect,
        timestamp: new Date().toISOString(),
      };

      // Handle extras first: award extraRuns (default 1), increment extras, but do not count as legal ball
      if (result.isExtra) {
        const added = result.extraRuns ?? 1;
        const newRuns = prev.runs + added;
        const newExtras = prev.extras + added;
        setPopup({ type: "extra", value: added, message: `Received ${result.extraType}` });
        setPendingQuestionId(null); // Clear pending question for extras
        // Reset player selections for extras, just like regular questions
        setSelectedBatterIndex(null);
        setSelectedBowlerIndex(null);
        return { 
          ...prev, 
          runs: newRuns, 
          extras: newExtras,
          ballDetails: [...prev.ballDetails, ballDetail],
        };
      }

      const newBalls = prev.balls + 1;
      const newOvers = prev.overs + (newBalls % 6 === 0 ? 1 : 0);
      const ballsInOver = newBalls % 6;

      let newRuns = prev.runs;
      let newWickets = prev.wickets;
      let newBatter = prev.currentBatter;
      let newBowler = prev.currentBowler;

      if (result.batterCorrect) {
        // Batter scored runs
        newRuns += result.runs ?? 0;
        // Only show popup for runs less than 4 (celebration handles 4 and 6)
        if ((result.runs ?? 0) < 4) {
          setPopup({ type: "runs", value: result.runs ?? 0, message: "Great shot!" });
        }
        if ((result.runs ?? 0) >= 4) {
          setCelebration({ type: (result.runs ?? 0) >= 6 ? "six" : "four", visible: true });
        }
      } else if (result.bowlerCorrect) {
        // Wicket!
        newWickets += 1;
        setPopup({ type: "wicket", value: 0, message: "Bowler got it right!" });
        // Lock this batter for this innings
        if (prev.battingTeam === "A") {
          setLockedBattersA(old => Array.from(new Set([...old, batterIndex])));
        } else {
          setLockedBattersB(old => Array.from(new Set([...old, batterIndex])));
        }
      } else {
        // Dot ball (both wrong)
        setPopup({ type: "dot", value: 0, message: "Both got it wrong!" });
      }

      // If wicket fell and all batters are now locked, end the innings/match immediately
      if (result.bowlerCorrect) {
        const numBatters = battingPlayersLocal.length;
        const currentLocks = prev.battingTeam === "A" ? lockedBattersA : lockedBattersB;
        const projectedLockCount = new Set([...(currentLocks || []), batterIndex]).size;

        if (projectedLockCount >= numBatters) {
          // All out condition reached
          if (prev.innings === 1) {
            const nextBatting = prev.battingTeam === "A" ? "B" : "A";
            setPopup({ type: "extra", value: 0, message: `All out. End of innings 1. Target: ${newRuns + 1} runs.` });

            const nextState = {
              ...prev,
              teamAScore: prev.battingTeam === "A" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : prev.teamAScore ?? { runs: newRuns, wickets: newWickets, overs: newOvers },
              innings: 2,
              battingTeam: nextBatting,
              runs: 0,
              wickets: 0,
              overs: 0,
              balls: 0,
              currentBatter: 0,
              currentBowler: 10,
              usedBalls: [],
              ballDetails: [...prev.ballDetails, ballDetail],
            } as GameState;
            // Clear selections and locks when innings change
            setSelectedBatterIndex(null);
            setSelectedBowlerIndex(null);
            setLockedBattersA([]);
            setLockedBattersB([]);
            setPendingQuestionId(null);
            return nextState;
          } else {
            // Innings 2 all out -> end match and decide winner
            const firstInningsRuns = prev.teamAScore ? prev.teamAScore.runs : 0;
            const secondInningsRuns = newRuns;
            let winnerName = "";
            if (secondInningsRuns > firstInningsRuns) {
              winnerName = prev.battingTeam === "A" ? teamAName : teamBName;
            } else if (secondInningsRuns < firstInningsRuns) {
              winnerName = prev.battingTeam === "A" ? teamBName : teamAName;
            } else {
              winnerName = "Tie";
            }

            // Only show popup for tie (celebration handles win)
            if (winnerName === "Tie") {
              setPopup({ type: "winner", value: 0, message: `The match is a tie.` });
            }
            if (winnerName !== "Tie") {
              setCelebration({ type: "win", visible: true, winnerName });
            }

            const endState = {
              ...prev,
              runs: newRuns,
              wickets: newWickets,
              overs: newOvers,
              balls: newBalls,
              currentBatter: newBatter,
              currentBowler: newBowler,
              gameOver: true,
              winner: winnerName,
              ballDetails: [...prev.ballDetails, ballDetail],
            } as GameState;
            setSelectedBatterIndex(null);
            setSelectedBowlerIndex(null);
            setPendingQuestionId(null);
            return endState;
          }
        }
      }

      // Manual selection mode: do not auto-rotate batter/bowler after delivery
      newBatter = prev.currentBatter;
      newBowler = prev.currentBowler;

      // Check innings boundaries: 10 balls per innings
      const BALLS_PER_INNINGS = 10;

      // If currently in innings 1 and we've completed the allotted balls, end innings 1
      if (prev.innings === 1 && newBalls >= BALLS_PER_INNINGS) {
        // Save team A score (score of first innings regardless of which team batted first)
        const teamAScore = prev.battingTeam === "A" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : prev.teamAScore ?? { runs: 0, wickets: 0, overs: 0 };
        const teamBScore = prev.battingTeam === "B" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : undefined;

        // Determine new batting team (switch)
        const nextBatting = prev.battingTeam === "A" ? "B" : "A";

        setPopup({ type: "extra", value: 0, message: `End of innings 1. Target: ${newRuns + 1} runs.` });

        const nextState = {
          ...prev,
          // store the first innings score in teamAScore regardless (for target display logic)
          teamAScore: prev.battingTeam === "A" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : prev.teamAScore ?? { runs: newRuns, wickets: newWickets, overs: newOvers },
          innings: 2,
          battingTeam: nextBatting,
          // reset match-specific counters for the chase
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          currentBatter: 0,
          currentBowler: 10,
          // reset usedBalls so all 15 questions are available again for innings 2
          usedBalls: [],
          // Keep ball details
          ballDetails: [...prev.ballDetails, ballDetail],
        } as GameState;
        // Clear selections and locks when innings change
        setSelectedBatterIndex(null);
        setSelectedBowlerIndex(null);
        setLockedBattersA([]);
        setLockedBattersB([]);
        setPendingQuestionId(null);
        return nextState;
      }

      // If we're in innings 2, check for early victory or end of match after BALLS_PER_INNINGS
      if (prev.innings === 2) {
        const target = prev.teamAScore ? prev.teamAScore.runs + 1 : undefined;

        // Early chase success
        if (typeof target === "number" && newRuns >= target) {
          const winnerName = prev.battingTeam === "A" ? teamAName : teamBName;
          // Only celebration, no popup for win
          setCelebration({ type: "win", visible: true, winnerName });
          const endWinState = {
            ...prev,
            runs: newRuns,
            wickets: newWickets,
            overs: newOvers,
            balls: newBalls,
            currentBatter: newBatter,
            currentBowler: newBowler,
            gameOver: true,
            winner: winnerName,
            ballDetails: [...prev.ballDetails, ballDetail],
          } as GameState;
          setSelectedBatterIndex(null);
          setSelectedBowlerIndex(null);
          setPendingQuestionId(null);
          return endWinState;
        }

        // End of second innings by balls exhausted
        if (newBalls >= BALLS_PER_INNINGS) {
          // Compare scores and declare winner or tie
          const firstInningsRuns = prev.teamAScore ? prev.teamAScore.runs : 0;
          const secondInningsRuns = newRuns;
          let winnerName = "";
          if (secondInningsRuns > firstInningsRuns) {
            winnerName = prev.battingTeam === "A" ? teamAName : teamBName;
          } else if (secondInningsRuns < firstInningsRuns) {
            // Winner is the team that batted first
            winnerName = prev.battingTeam === "A" ? teamBName : teamAName;
          } else {
            winnerName = "Tie";
          }

          // Only show popup for tie (celebration handles win)
          if (winnerName === "Tie") {
            setPopup({ type: "winner", value: 0, message: `The match is a tie.` });
          }
          if (winnerName !== "Tie") {
            setCelebration({ type: "win", visible: true, winnerName });
          }

          const endState = {
            ...prev,
            runs: newRuns,
            wickets: newWickets,
            overs: newOvers,
            balls: newBalls,
            currentBatter: newBatter,
            currentBowler: newBowler,
            gameOver: true,
            winner: winnerName,
            ballDetails: [...prev.ballDetails, ballDetail],
          } as GameState;
          setSelectedBatterIndex(null);
          setSelectedBowlerIndex(null);
          setPendingQuestionId(null);
          return endState;
        }
      }

      const midState = {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        balls: newBalls,
        overs: newOvers,
        currentBatter: newBatter,
        currentBowler: newBowler,
        ballDetails: [...prev.ballDetails, ballDetail],
      } as GameState;
      // Clear selections after each delivery to enforce selection flow
      setSelectedBatterIndex(null);
      setSelectedBowlerIndex(null);
      setPendingQuestionId(null);
      return midState;
    });
  };

  const battingTeamPlayers = gameState.battingTeam === "A" ? teamAPlayers : teamBPlayers;
  const bowlingTeamPlayers = gameState.battingTeam === "A" ? teamBPlayers : teamAPlayers;
  // Save game data when game is over
  useEffect(() => {
    if (gameState.gameOver && gameState.winner && gameState.ballDetails.length > 0) {
      // Determine team scores correctly
      let teamAScore: { runs: number; wickets: number; overs: number } | undefined;
      let teamBScore: { runs: number; wickets: number; overs: number } | undefined;

      if (battingFirst === "A") {
        // Team A batted first, Team B batted second
        teamAScore = gameState.teamAScore;
        if (gameState.innings === 2) {
          teamBScore = { runs: gameState.runs, wickets: gameState.wickets, overs: gameState.overs };
        }
      } else {
        // Team B batted first, Team A batted second
        teamBScore = gameState.teamAScore;
        if (gameState.innings === 2) {
          teamAScore = { runs: gameState.runs, wickets: gameState.wickets, overs: gameState.overs };
        }
      }

      const gameData: GameData = {
        teamA: {
          name: teamAName,
          players: teamAPlayers,
          score: teamAScore,
        },
        teamB: {
          name: teamBName,
          players: teamBPlayers,
          score: teamBScore,
        },
        battingFirst,
        winner: gameState.winner,
        gameOver: true,
        timestamp: new Date().toISOString(),
        tournamentStage: userStage,
        ballDetails: gameState.ballDetails,
      };
      
      console.log("Saving game data:", gameData);
      console.log("Ball details count:", gameState.ballDetails.length);
      
      // Only save if we have ball details (for new games)
      if (gameState.ballDetails.length === 0) {
        console.warn("No ball details to save - game may have been created before ball tracking was implemented");
      }
      
      api.saveGame(gameData).then(() => {
        console.log("Game saved successfully!");
        toast({ title: "Game Saved!", description: `Your game data has been saved with ${gameState.ballDetails.length} ball details.` });
      }).catch((error) => {
        console.error("Error saving game:", error);
        toast({ title: "Save Failed", description: "Game saved to local storage instead.", variant: "destructive" });
      });
    }
  }, [gameState, teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst]);

  // Persist and restore game
  useEffect(() => {
    const key = `mpl_current_game`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.meta && parsed.meta.teamAName === teamAName && parsed.meta.teamBName === teamBName && parsed.gameState && parsed.gameState.gameOver === false) {
          setGameState(parsed.gameState);
          setSelectedBatterIndex(parsed.selectedBatterIndex ?? null);
          setSelectedBowlerIndex(parsed.selectedBowlerIndex ?? null);
          setLockedBattersA(parsed.lockedBattersA ?? []);
          setLockedBattersB(parsed.lockedBattersB ?? []);
          setPendingQuestionId(parsed.pendingQuestionId ?? null);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const key = `mpl_current_game`;
    const payload = {
      meta: { teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst },
      gameState,
      selectedBatterIndex,
      selectedBowlerIndex,
      lockedBattersA,
      lockedBattersB,
      pendingQuestionId,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  }, [gameState, selectedBatterIndex, selectedBowlerIndex, lockedBattersA, lockedBattersB, teamAName, teamBName, battingFirst]);

  return (
    <div className="min-h-screen bg-gradient-stadium p-4 animate-fade-in">
      <CelebrationOverlay
        type={celebration.type}
        visible={celebration.visible}
        winnerName={celebration.winnerName}
        onDone={() => setCelebration({ type: null, visible: false })}
      />
      {popup && (
        <GamePopup
          type={popup.type}
          value={popup.value}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
      {/* Header Bar */}
      <div className="mb-3 p-3 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center gap-3">
          {/* Tournament Stage Badge */}
          <div className={`px-4 py-2 rounded-lg font-bold text-sm border-2 backdrop-blur ${
            userStage === "group" ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-100" :
            userStage === "playoffs" ? "bg-blue-500/20 border-blue-500/50 text-blue-100" :
            userStage === "semifinals" ? "bg-orange-500/20 border-orange-500/50 text-orange-100" :
            "bg-yellow-500/20 border-yellow-500/50 text-yellow-100"
          }`}>
            {userStage === "group" ? "🏁 GROUP STAGE" :
             userStage === "playoffs" ? "⚔️ PLAYOFFS" :
             userStage === "semifinals" ? "🔥 SEMI-FINALS" :
             "🏆 FINALS"}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-2"
              onClick={() => {
                if (onNavigateToDashboard) return onNavigateToDashboard();
              }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-2"
              onClick={() => {
                if (onNavigateToHistory) return onNavigateToHistory();
              }}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-muted border border-border hover:bg-muted/80 transition-all font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-2"
              onClick={() => {
                try { localStorage.removeItem('mpl_current_game'); } catch {}
                setSelectedBatterIndex(null);
                setSelectedBowlerIndex(null);
                setLockedBattersA([]);
                setLockedBattersB([]);
                setPendingQuestionId(null);
                if (onNewGame) return onNewGame();
                if (window.confirm("Start a new game? This will reset teams and questions.")) {
                  window.location.reload();
                }
              }}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">New Game</span>
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-1.5"
              onClick={() => {
                const newWindow = window.open(window.location.href, '_blank');
                if (newWindow) {
                  toast({ title: "Parallel game opened", description: "Running another game in a new window!" });
                }
              }}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Parallel</span>
              <span className="hidden md:inline">Game</span>
            </button>
          </div>
        </div>
      </div>
      <Scoreboard
        teamAName={teamAName}
        teamBName={teamBName}
        gameState={gameState}
      />

      <div className="grid lg:grid-cols-[300px_1fr_300px] gap-4 mt-4">
        {/* Left: Batting Team */}
        <TeamPanel
          teamName={gameState.battingTeam === "A" ? teamAName : teamBName}
          players={battingTeamPlayers}
          color={gameState.battingTeam === "A" ? "team-a" : "team-b"}
          currentPlayer={selectedBatterIndex ?? -1}
          role="batting"
          selectable
          selectedIndex={selectedBatterIndex}
          onSelect={(idx) => {
            const locks = gameState.battingTeam === "A" ? lockedBattersA : lockedBattersB;
            if (locks.includes(idx)) {
              toast({ title: "Batter locked", description: "This batter is out. Select another.", variant: "destructive" });
              return;
            }
            setSelectedBatterIndex(idx);
          }}
          lockedIndices={gameState.battingTeam === "A" ? lockedBattersA : lockedBattersB}
        />

        {/* Center: Game Zone */}
        <GameZone
          availableBalls={((): (typeof QUESTIONS[number] | null)[] => {
            const pool = gameState.innings === 1 ? questionPools.first : questionPools.second;
            // create 15 slots; if a question from pool is used, slot becomes null
            return pool.map(q => (gameState.usedBalls.includes(q.id) ? null : q));
          })()}
          onBallSelect={handleBallSelect}
          onAnswer={handleAnswer}
          canSelectBall={selectedBowlerIndex !== null && selectedBatterIndex !== null && !gameState.gameOver && pendingQuestionId === null}
          selectedBowlerName={(gameState.battingTeam === "A" ? teamBPlayers : teamAPlayers)[selectedBowlerIndex ?? -1]}
          selectedBatterName={(gameState.battingTeam === "A" ? teamAPlayers : teamBPlayers)[selectedBatterIndex ?? -1]}
        />

        {/* Right: Bowling Team */}
        <TeamPanel
          teamName={gameState.battingTeam === "A" ? teamBName : teamAName}
          players={bowlingTeamPlayers}
          color={gameState.battingTeam === "A" ? "team-b" : "team-a"}
          currentPlayer={selectedBowlerIndex ?? -1}
          role="bowling"
          selectable
          selectedIndex={selectedBowlerIndex}
          onSelect={(idx) => setSelectedBowlerIndex(idx)}
        />
      </div>
    </div>
  );
};
