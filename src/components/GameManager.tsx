import { useState, useEffect } from "react";
import { GameScreen } from "./GameScreen";
import { api, GameData } from "../services/api";
import { useToast } from "@/hooks/use-toast";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { History, Play } from "lucide-react";
import { Dashboard } from "./Dashboard";

interface GameManagerProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  battingFirst: "A" | "B";
  onNewGame?: () => void;
  onNavigateToDashboard?: () => void;
}

export const GameManager = ({ teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst, onNewGame, onNavigateToDashboard }: GameManagerProps) => {
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
      {/* Dashboard Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Game History</h2>
                <div className="flex gap-2">
                  <Button onClick={() => { setShowHistory(false); setShowDashboard(true); }} variant="default" size="sm">
                    Full Dashboard
                  </Button>
                  <Button onClick={handleOpenNewGame} variant="default" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    New Parallel Game
                  </Button>
                  <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">Close</Button>
                </div>
              </div>
              <div className="space-y-2">
                {gameHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No game history yet</p>
                ) : (
                  gameHistory.map((game, idx) => (
                    <Card key={idx} className="p-4 hover:bg-muted/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{game.teamA.name} vs {game.teamB.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {game.winner && `Winner: ${game.winner}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(game.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {game.teamA.score && <p className="text-sm">{game.teamA.name}: {game.teamA.score.runs}/{game.teamA.score.wickets}</p>}
                          {game.teamB.score && <p className="text-sm">{game.teamB.name}: {game.teamB.score.runs}/{game.teamB.score.wickets}</p>}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
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
      />
    </>
  );
};

