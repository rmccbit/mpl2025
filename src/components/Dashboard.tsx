import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Users, Award, Download, ArrowLeft, RefreshCw, Eye, Sparkles, Target, Zap } from "lucide-react";
import { api, GameData } from "../services/api";
import { useToast } from "@/hooks/use-toast";
import { GameReportModal } from "./GameReportModal";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-stadium p-6 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(79, 70, 229, 0.03) 100%)'
          }}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, rgba(180, 83, 9, 0.03) 100%)'
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 relative z-10"
      >
        <div className="flex items-center gap-4">
          <Button 
            onClick={onStartGame || onBack} 
            variant="outline" 
            size="sm"
            className="backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-5xl font-black text-indigo-600 flex items-center gap-3"
              style={{
                textShadow: '0 2px 10px rgba(99, 102, 241, 0.25)',
                letterSpacing: '-0.02em'
              }}
            >
              <motion.div
                // animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-12 h-12 text-amber-500" />
              </motion.div>
              MPL Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Complete game statistics and history
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onStartGame || onBack} 
            variant="default" 
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 gap-2 hover:scale-105 transition-all border-0"
          >
            <Trophy className="w-4 h-4" />
            Start New Game
          </Button>
          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            size="sm"
            className="gap-2 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            onClick={exportData} 
            variant="outline" 
            size="sm"
            className="gap-2 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-12 h-12 text-blue-600" />
          </motion.div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-card/95 backdrop-blur-xl border-indigo-500/30 hover:border-indigo-400/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Games</h3>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Trophy className="w-6 h-6 text-indigo-500" />
                  </motion.div>
                </div>
                <p className="text-4xl font-black text-indigo-600">{stats.totalGames}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="w-3 h-3" />
                  All matches
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-card/95 backdrop-blur-xl border-violet-500/30 hover:border-violet-400/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Players</h3>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Users className="w-6 h-6 text-violet-500" />
                  </motion.div>
                </div>
                <p className="text-4xl font-black text-violet-600">{stats.totalPlayers}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  Unique players
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-card/95 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-400/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed</h3>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </motion.div>
                </div>
                <p className="text-4xl font-black text-emerald-600">{stats.completedGames}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  Finished matches
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-card/95 backdrop-blur-xl border-amber-500/30 hover:border-amber-400/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Avg Score</h3>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Award className="w-6 h-6 text-amber-500" />
                  </motion.div>
                </div>
                <p className="text-4xl font-black text-amber-600">{stats.averageScore}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="w-3 h-3" />
                  Combined runs
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Game History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <Card className="p-6 bg-card/95 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black flex items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  <Award className="w-8 h-8 text-violet-500" />
                  Game History
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {games.length} matches
                </div>
              </div>
              <div className="space-y-3">
                {games.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Trophy className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30" />
                    </motion.div>
                    <p className="text-lg font-semibold text-foreground mb-2">No games found</p>
                    <p className="text-sm text-muted-foreground">Start playing to see your game history here!</p>
                    <Button 
                      onClick={onStartGame || onBack}
                      className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Start First Game
                    </Button>
                  </motion.div>
                ) : (
                  games.map((game, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <Card 
                        className="p-5 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer border-l-4"
                        onClick={() => setSelectedGame(game)}
                        style={{
                          borderLeftColor: idx % 4 === 0 ? 'rgb(99, 102, 241)' : 
                                         idx % 4 === 1 ? 'rgb(139, 92, 246)' : 
                                         idx % 4 === 2 ? 'rgb(16, 185, 129)' : 
                                         'rgb(245, 158, 11)',
                          boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-green-500"
                              />
                              <p className="font-bold text-foreground text-lg">
                                {game.teamA.name} vs {game.teamB.name}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {new Date(game.timestamp).toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-card/50 p-3 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                              <p className="text-xs text-muted-foreground mb-1 font-semibold">Team A</p>
                              <p className="font-black text-indigo-600 text-lg">
                                {game.teamA.score ? `${game.teamA.score.runs}/${game.teamA.score.wickets}` : 'N/A'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(() => {
                                  const secs = getTeamInningsTimeSeconds(game, game.teamA.name);
                                  return typeof secs === 'number' ? `${secs}s` : '';
                                })()}
                              </p>
                            </div>
                            <div className="bg-card/50 p-3 rounded-lg backdrop-blur-sm border border-violet-500/30">
                              <p className="text-xs text-muted-foreground mb-1 font-semibold">Team B</p>
                              <p className="font-black text-violet-600 text-lg">
                                {game.teamB.score ? `${game.teamB.score.runs}/${game.teamB.score.wickets}` : 'N/A'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(() => {
                                  const secs = getTeamInningsTimeSeconds(game, game.teamB.name);
                                  return typeof secs === 'number' ? `${secs}s` : '';
                                })()}
                              </p>
                            </div>
                          </div>

                          <div className="text-center">
                            {game.winner && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 mb-2"
                              >
                                <Trophy className="w-4 h-4 text-amber-600" />
                                <span className="font-bold text-amber-600">{game.winner}</span>
                              </motion.div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Batting First: <span className="font-semibold text-foreground">{game.battingFirst}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2 border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent transition-all"
                            >
                              <Eye className="w-4 h-4" />
                              View Report
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
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

