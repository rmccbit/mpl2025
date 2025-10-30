import { useState, useEffect } from "react";
import { GameScreen } from "./GameScreen";
import { api, GameData } from "../services/api";
import { useToast } from "@/hooks/use-toast";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { History, Play, LayoutDashboard, X } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { TournamentStage } from "./AuthScreen";

interface GameManagerProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  battingFirst: "A" | "B";
  tournamentStage: TournamentStage;
  onNewGame?: () => void;
  onNavigateToDashboard?: () => void;
}

export const GameManager = ({ 
  teamAName, 
  teamBName, 
  teamAPlayers, 
  teamBPlayers, 
  battingFirst, 
  tournamentStage,
  onNewGame, 
  onNavigateToDashboard 
}: GameManagerProps) => {
  const [gameHistory, setGameHistory] = useState<GameData[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await api.getGameHistory(20);
        setGameHistory(history);
      } catch (error) {
        console.error("Failed to load game history:", error);
      }
    };
    loadHistory();
  }, []);

  const handleOpenNewGame = () => {
    // Open a new window/tab for parallel game execution
    const newWindow = window.open(window.location.href, '_blank');
    if (newWindow) {
      toast({ title: "New game window opened", description: "You can now run multiple games in parallel!" });
    }
  };

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} onStartGame={onNewGame} />;
  }

  return (
    <>
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-6xl w-full max-h-[90vh] overflow-hidden bg-card/95 border border-border/50 shadow-stadium rounded-xl flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-card/95 border-b border-border/50 px-5 py-4 backdrop-blur">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-bold">Game History</h2>
                </div>
                <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-5">
              {gameHistory.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 mb-4">
                    <History className="w-10 h-10 text-indigo-500/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Games Played Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Start playing matches and they'll appear here. Track your tournament progress and review past games.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-semibold text-foreground">{gameHistory.length}</span> recent {gameHistory.length === 1 ? 'game' : 'games'}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {gameHistory.map((game, idx) => (
                      <Card key={idx} className="group p-0 border border-border/50 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden bg-card">
                        <div className="p-4">
                          {/* Match Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <p className="font-bold text-base truncate">
                                  {game.teamA.name} <span className="text-muted-foreground font-normal mx-1">vs</span> {game.teamB.name}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                  <span>📅</span>
                                  {new Date(game.timestamp).toLocaleDateString()} at {new Date(game.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {game.tournamentStage && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    game.tournamentStage === "group" ? "bg-indigo-500/15 text-indigo-600 border border-indigo-500/30" :
                                    game.tournamentStage === "playoffs" ? "bg-blue-500/15 text-blue-600 border border-blue-500/30" :
                                    game.tournamentStage === "semifinals" ? "bg-orange-500/15 text-orange-600 border border-orange-500/30" :
                                    "bg-yellow-500/15 text-yellow-600 border border-yellow-500/30"
                                  }`}>
                                    {game.tournamentStage === "group" ? "🏁 GROUP" :
                                     game.tournamentStage === "playoffs" ? "⚔️ PLAYOFFS" :
                                     game.tournamentStage === "semifinals" ? "🔥 SEMIFINALS" :
                                     "🏆 FINALS"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Scores */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {game.teamA.score && (
                              <div className="p-3 rounded-lg bg-gradient-to-br from-muted/80 to-muted/40 border border-border/30">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{game.teamA.name}</p>
                                <p className="font-black text-2xl leading-none">{game.teamA.score.runs}<span className="text-muted-foreground text-lg">/{game.teamA.score.wickets}</span></p>
                                <p className="text-xs text-muted-foreground mt-1">{game.teamA.score.overs} overs</p>
                              </div>
                            )}
                            {game.teamB.score && (
                              <div className="p-3 rounded-lg bg-gradient-to-br from-muted/80 to-muted/40 border border-border/30">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{game.teamB.name}</p>
                                <p className="font-black text-2xl leading-none">{game.teamB.score.runs}<span className="text-muted-foreground text-lg">/{game.teamB.score.wickets}</span></p>
                                <p className="text-xs text-muted-foreground mt-1">{game.teamB.score.overs} overs</p>
                              </div>
                            )}
                          </div>

                          {/* Winner Badge */}
                          {game.winner && (
                            <div className="flex items-center justify-center pt-2 border-t border-border/30">
                              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/30">
                                <span className="text-lg">🏆</span>
                                <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                  {game.winner === "Tie" ? "Match Tied" : `${game.winner} Won`}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <GameScreen
        teamAName={teamAName}
        teamBName={teamBName}
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
        battingFirst={battingFirst}
        onNewGame={onNewGame}
        onNavigateToDashboard={() => setShowDashboard(true)}
        onNavigateToHistory={() => setShowHistory(true)}
      />
    </>
  );
};