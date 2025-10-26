import { useState, useEffect } from "react";
import { TeamPanel } from "./TeamPanel";
import { GameZone } from "./GameZone";
import { Scoreboard } from "./Scoreboard";
import { useToast } from "@/hooks/use-toast";
import { GamePopup } from "./ui/game-popup";
import { api, GameData } from "../services/api";
import { QUESTIONS } from "../data/questions";
interface GameScreenProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  battingFirst: "A" | "B";
  onNewGame?: () => void;
  onNavigateToDashboard?: () => void;
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

// Create two distinct 15-question pools so innings 1 and innings 2 use different questions
const generatePools = () => {
  const all = [...QUESTIONS];
  const shuffled = all.sort(() => Math.random() - 0.5);
  const first = shuffled.slice(0, 15).map((q, idx) => ({ ...q, id: idx + 1 }));
  const second = shuffled.slice(15, 30).map((q, idx) => ({ ...q, id: idx + 16 }));

  // Mark 5 random balls in each pool as extras (wide/noball)
  const markExtras = (pool: any[]) => {
    const idxs = Array.from({ length: pool.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 5);
    for (const i of idxs) {
      pool[i].type = Math.random() < 0.5 ? "wide" : "noball";
      // extras typically award 1 run
      pool[i].runs = 0; // extra doesn't carry runs from question
    }
  };

  markExtras(first);
  markExtras(second);
  return { first, second };
};

const [questionPools] = ((): [{ first: typeof QUESTIONS; second: typeof QUESTIONS }] => {
  // Use a stable initial value so pools don't reshuffle on re-render
  const pools = generatePools();
  return [pools as any];
})();

export const GameScreen = ({ teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst, onNewGame, onNavigateToDashboard }: GameScreenProps) => {
  const { toast } = useToast();
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
  const [popup, setPopup] = useState<{ type: "runs" | "wicket" | "dot" | "extra" | "winner"; value?: number; message?: string } | null>(null);

  const handleBallSelect = (ballNumber: number) => {
    setGameState(prev => ({
      ...prev,
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
      const batterName = battingPlayersLocal[prev.currentBatter % battingPlayersLocal.length] || "Unknown";
      const bowlerName = bowlingPlayersLocal[prev.currentBowler % bowlingPlayersLocal.length] || "Unknown";
      
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
        questionId: result.questionId,
        ballerCorrect: result.bowlerCorrect,
        timestamp: new Date().toISOString(),
      };

      // Handle extras first: award extraRuns (default 1), increment extras, but do not count as legal ball
      if (result.isExtra) {
        const added = result.extraRuns ?? 1;
        const newRuns = prev.runs + added;
        const newExtras = prev.extras + added;
        setPopup({ type: "extra", value: added, message: `Received ${result.extraType}` });
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
        setPopup({ type: "runs", value: result.runs ?? 0, message: "Great shot!" });
      } else if (result.bowlerCorrect) {
        // Wicket!
        newWickets += 1;
        setPopup({ type: "wicket", value: 0, message: "Bowler got it right!" });
      } else {
        // Dot ball (both wrong)
        setPopup({ type: "dot", value: 0, message: "Both got it wrong!" });
      }

      // Determine team sizes based on who's batting currently
      const battingSize = Math.max(1, battingPlayersLocal.length);
      const bowlingSize = Math.max(1, bowlingPlayersLocal.length);

      // Move to next batter (top to bottom) and wrap around smaller teams
      newBatter = (prev.currentBatter + 1) % battingSize;

      // Move to next bowler (bottom to top) and wrap using bowlingSize
      // Normalize prev.currentBowler to be within [0, bowlingSize-1]
      const normalizedPrevBowler = ((prev.currentBowler % bowlingSize) + bowlingSize) % bowlingSize;
      newBowler = (normalizedPrevBowler - 1 + bowlingSize) % bowlingSize;

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

        return {
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
        };
      }

      // If we're in innings 2, check for early victory or end of match after BALLS_PER_INNINGS
      if (prev.innings === 2) {
        const target = prev.teamAScore ? prev.teamAScore.runs + 1 : undefined;

        // Early chase success
        if (typeof target === "number" && newRuns >= target) {
          const winnerName = prev.battingTeam === "A" ? teamAName : teamBName;
          setPopup({ type: "winner", value: 0, message: `${winnerName} won by chasing the target!` });
          return {
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
          };
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

          setPopup({ type: "winner", value: 0, message: winnerName === "Tie" ? `The match is a tie.` : `${winnerName} won the match!` });

          return {
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
          };
        }
      }

      return {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        balls: newBalls,
        overs: newOvers,
        currentBatter: newBatter,
        currentBowler: newBowler,
        ballDetails: [...prev.ballDetails, ballDetail],
      };
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

  return (
    <div className="min-h-screen bg-gradient-stadium p-4 animate-fade-in">
      {popup && (
        <GamePopup
          type={popup.type}
          value={popup.value}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
      <div className="flex justify-end mb-2 gap-2">
        <button
          className="px-4 py-2 rounded-lg bg-gradient-gold text-secondary-foreground hover:opacity-90 transition-all font-semibold"
          onClick={() => {
            if (onNavigateToDashboard) return onNavigateToDashboard();
          }}
        >
          📊 Dashboard
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-semibold"
          onClick={() => {
            if (onNewGame) return onNewGame();
            if (window.confirm("Start a new game? This will reset teams and questions.")) {
              window.location.reload();
            }
          }}
        >
          New Game
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-all font-semibold"
          onClick={() => {
            const newWindow = window.open(window.location.href, '_blank');
            if (newWindow) {
              toast({ title: "Parallel game opened", description: "Running another game in a new window!" });
            }
          }}
        >
          Open Parallel Game →
        </button>
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
          currentPlayer={battingTeamPlayers.length > 0 ? gameState.currentBatter % battingTeamPlayers.length : 0}
          role="batting"
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
        />

        {/* Right: Bowling Team */}
        <TeamPanel
          teamName={gameState.battingTeam === "A" ? teamBName : teamAName}
          players={bowlingTeamPlayers}
          color={gameState.battingTeam === "A" ? "team-b" : "team-a"}
          currentPlayer={bowlingTeamPlayers.length > 0 ? gameState.currentBowler % bowlingTeamPlayers.length : 0}
          role="bowling"
        />
      </div>
    </div>
  );
};
