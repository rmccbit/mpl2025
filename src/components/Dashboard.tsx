import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Users, Award, Download, ArrowLeft, RefreshCw, Eye } from "lucide-react";
import { api, GameData } from "../services/api";
import { useToast } from "@/hooks/use-toast";
import { GameReportModal } from "./GameReportModal";

interface DashboardProps {
  onBack: () => void;
  onStartGame?: () => void;
}

export const Dashboard = ({ onBack, onStartGame }: DashboardProps) => {
  const [games, setGames] = useState<GameData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlayers: 0,
    completedGames: 0,
    averageScore: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const gameHistory = await api.getGameHistory(100);
      setGames(gameHistory);

      // Calculate statistics
      const totalGames = gameHistory.length;
      const completedGames = gameHistory.filter(g => g.gameOver).length;
      
      const allPlayers = new Set<string>();
      gameHistory.forEach(game => {
        game.teamA.players.forEach(p => allPlayers.add(p));
        game.teamB.players.forEach(p => allPlayers.add(p));
      });

      const scores = gameHistory
        .filter(g => g.gameOver && g.teamA.score && g.teamB.score)
        .map(g => (g.teamA.score?.runs || 0) + (g.teamB.score?.runs || 0));

      const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 0;

      setStats({
        totalGames,
        totalPlayers: allPlayers.size,
        completedGames,
        averageScore: avgScore,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({ title: "Loading Error", description: "Failed to load dashboard data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamInningsTimeSeconds = (game: GameData, teamName: string): number | null => {
    if (!game.ballDetails || game.ballDetails.length === 0) return null;
    const teamBalls = game.ballDetails.filter(b => b.batterTeam === teamName && b.timestamp);
    if (teamBalls.length === 0) return null;
    const times = teamBalls
      .map(b => new Date(b.timestamp).getTime())
      .filter(t => !isNaN(t));
    if (times.length === 0) return null;
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    if (!isFinite(minT) || !isFinite(maxT) || maxT < minT) return null;
    return Math.round((maxT - minT) / 1000);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(games, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mpl-games-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data Exported", description: "Game data downloaded successfully." });
  };

  return (
    <div className="min-h-screen bg-gradient-stadium p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button onClick={onStartGame || onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-8 h-8 text-secondary" />
              MPL Dashboard
            </h1>
            <p className="text-muted-foreground">Complete game statistics and history</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onStartGame || onBack} variant="default" size="sm">
            <Trophy className="w-4 h-4 mr-2" />
            Start New Game
          </Button>
          <Button onClick={loadDashboardData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 bg-gradient-pitch">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Games</h3>
                <Trophy className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalGames}</p>
            </Card>

            <Card className="p-6 bg-gradient-pitch">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Players</h3>
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalPlayers}</p>
            </Card>

            <Card className="p-6 bg-gradient-pitch">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.completedGames}</p>
            </Card>

            <Card className="p-6 bg-gradient-pitch">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Avg Score</h3>
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.averageScore}</p>
            </Card>
          </div>

          {/* Game History */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-secondary" />
              Game History
            </h2>
            <div className="space-y-3">
              {games.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No games found</p>
                  <p className="text-sm">Start playing to see your game history here!</p>
                </div>
              ) : (
                games.map((game, idx) => (
                  <Card 
                    key={idx} 
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <p className="font-bold text-foreground">
                            {game.teamA.name} vs {game.teamB.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(game.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Team A</p>
                          <p className="font-bold">
                            {game.teamA.score ? `${game.teamA.score.runs}/${game.teamA.score.wickets}` : 'N/A'}
                            {" "}
                            {(() => {
                              const secs = getTeamInningsTimeSeconds(game, game.teamA.name);
                              return typeof secs === 'number' ? `· ${secs}s` : '';
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Team B</p>
                          <p className="font-bold">
                            {game.teamB.score ? `${game.teamB.score.runs}/${game.teamB.score.wickets}` : 'N/A'}
                            {" "}
                            {(() => {
                              const secs = getTeamInningsTimeSeconds(game, game.teamB.name);
                              return typeof secs === 'number' ? `· ${secs}s` : '';
                            })()}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        {game.winner && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-gold mb-2">
                            <Trophy className="w-4 h-4" />
                            <span className="font-bold">{game.winner}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Batting First: {game.battingFirst}
                        </p>
                      </div>

                      <div className="text-right">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </>
      )}

      {/* Game Report Modal */}
      {selectedGame && (
        <GameReportModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}
    </div>
  );
};

