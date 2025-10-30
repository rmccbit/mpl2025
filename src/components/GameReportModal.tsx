import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Award, Target, Zap, AlertCircle, Trophy, TrendingUp, Users, BarChart3, Download } from "lucide-react";

interface GameData {
  id?: string;
  teamA: {
    name: string;
    players: string[];
    score?: { runs: number; wickets: number; overs: number };
  };
  teamB: {
    name: string;
    players: string[];
    score?: { runs: number; wickets: number; overs: number };
  };
  battingFirst: "A" | "B";
  winner?: string;
  gameOver: boolean;
  timestamp: string;
  ballDetails?: Array<{
    ballNumber: number;
    innings: number;
    batterName: string;
    bowlerName: string;
    batterTeam: string;
    bowlerTeam: string;
    result: string;
    runsScored: number;
    isExtra: boolean;
    extraType?: string;
    questionId?: number;
    timestamp: string;
  }>;
}

interface GameReportModalProps {
  game: GameData;
  onClose: () => void;
}

export const GameReportModal = ({ game, onClose }: GameReportModalProps) => {
  const getResultIcon = (result: string) => {
    switch (result) {
      case "runs":
        return <Zap className="w-4 h-4 text-green-500" />;
      case "wicket":
        return <Award className="w-4 h-4 text-red-500" />;
      case "dot":
        return <Target className="w-4 h-4 text-gray-500" />;
      case "extra":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getResultText = (result: string, runs: number) => {
    switch (result) {
      case "runs":
        return `${runs} run${runs !== 1 ? "s" : ""}`;
      case "wicket":
        return "WICKET!";
      case "dot":
        return "Dot ball";
      case "extra":
        return `Extra +${runs}`;
      default:
        return result;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "runs":
        return "bg-green-500/20 text-green-400 border-green-500";
      case "wicket":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "dot":
        return "bg-gray-500/20 text-gray-400 border-gray-500";
      case "extra":
        return "bg-orange-500/20 text-orange-400 border-orange-500";
      default:
        return "bg-muted";
    }
  };

  const ballDetails = game.ballDetails || [];

  // Group balls by innings
  const innings1 = ballDetails.filter(b => b.innings === 1);
  const innings2 = ballDetails.filter(b => b.innings === 2);

  // Calculate statistics
  const calculateStats = (innings: typeof ballDetails) => {
    const totalRuns = innings.reduce((sum, ball) => sum + ball.runsScored, 0);
    const wickets = innings.filter(ball => ball.result === "wicket").length;
    const dots = innings.filter(ball => ball.result === "dot").length;
    const fours = innings.filter(ball => ball.runsScored === 4).length;
    const sixes = innings.filter(ball => ball.runsScored === 6).length;
    const extras = innings.filter(ball => ball.isExtra).length;
    
    return { totalRuns, wickets, dots, fours, sixes, extras };
  };

  const stats1 = calculateStats(innings1);
  const stats2 = calculateStats(innings2);

  // Calculate player statistics
  const getPlayerStats = (innings: typeof ballDetails, isBatting: boolean) => {
    const playerMap = new Map<string, { runs: number; balls: number; wickets?: number }>();
    
    innings.forEach(ball => {
      const playerName = isBatting ? ball.batterName : ball.bowlerName;
      const existing = playerMap.get(playerName) || { runs: 0, balls: 0, wickets: 0 };
      
      if (isBatting) {
        existing.balls++;
        existing.runs += ball.runsScored;
      } else {
        existing.balls++;
        if (ball.result === "wicket") existing.wickets = (existing.wickets || 0) + 1;
      }
      
      playerMap.set(playerName, existing);
    });
    
    return Array.from(playerMap.entries()).map(([name, stats]) => ({ name, ...stats }));
  };

  const exportReport = () => {
    const reportData = {
      match: `${game.teamA.name} vs ${game.teamB.name}`,
      date: new Date(game.timestamp).toLocaleString(),
      winner: game.winner,
      teamAScore: game.teamA.score,
      teamBScore: game.teamB.score,
      ballDetails: ballDetails,
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `match-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card/98 via-card to-card/95 shadow-2xl border-2 border-border/50" onClick={(e) => e.stopPropagation()}>
        {/* Header with Match Info */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 backdrop-blur-xl z-10 border-b-2 border-border/50 p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                    Match Report
                  </h2>
                  <p className="text-xl font-bold text-muted-foreground">
                    {game.teamA.name} <span className="text-primary/60">vs</span> {game.teamB.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 backdrop-blur border border-border/30">
                  📅 {new Date(game.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 backdrop-blur border border-border/30">
                  🕐 {new Date(game.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {game.winner && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border-2 border-yellow-500/40 font-bold text-sm shadow-lg">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Winner: {game.winner}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportReport} variant="outline" size="sm" className="gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={onClose} variant="outline" size="sm" className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {ballDetails.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
                <div className="relative inline-flex p-6 rounded-full bg-muted/30 border-2 border-border/30">
                  <Target className="w-16 h-16 text-muted-foreground opacity-40" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">No Ball-by-Ball Data Available</p>
              <p className="text-base text-muted-foreground">Ball tracking is only available for new games</p>
            </div>
          ) : (
            <>
              {/* Match Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Team A Card */}
                <Card className="p-6 bg-gradient-to-br from-blue-500/15 via-blue-600/10 to-blue-700/5 border-2 border-blue-500/30 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-foreground mb-2">{game.teamA.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <span>{game.teamA.players.length} Players</span>
                        </div>
                      </div>
                      {game.winner === game.teamA.name && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-500/30 blur-xl animate-pulse" />
                          <Trophy className="w-10 h-10 text-yellow-500 relative animate-bounce" />
                        </div>
                      )}
                    </div>
                    {game.teamA.score && (
                      <div className="space-y-3">
                        <div className="flex items-end gap-2">
                          <span className="text-6xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">{game.teamA.score.runs}</span>
                          <span className="text-4xl font-bold text-muted-foreground pb-1">/{game.teamA.score.wickets}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                            <p className="text-sm font-semibold text-blue-300">{game.teamA.score.overs} overs</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Team B Card */}
                <Card className="p-6 bg-gradient-to-br from-orange-500/15 via-orange-600/10 to-orange-700/5 border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-foreground mb-2">{game.teamB.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="p-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30">
                            <Users className="w-3.5 h-3.5 text-orange-400" />
                          </div>
                          <span>{game.teamB.players.length} Players</span>
                        </div>
                      </div>
                      {game.winner === game.teamB.name && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-500/30 blur-xl animate-pulse" />
                          <Trophy className="w-10 h-10 text-yellow-500 relative animate-bounce" />
                        </div>
                      )}
                    </div>
                    {game.teamB.score && (
                      <div className="space-y-3">
                        <div className="flex items-end gap-2">
                          <span className="text-6xl font-black bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">{game.teamB.score.runs}</span>
                          <span className="text-4xl font-bold text-muted-foreground pb-1">/{game.teamB.score.wickets}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
                            <p className="text-sm font-semibold text-orange-300">{game.teamB.score.overs} overs</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Innings 1 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/20 rounded-xl border-2 border-indigo-500/40 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-lg shadow-xl border border-white/20">
                      1st Innings
                    </div>
                    <div>
                      <p className="font-black text-lg text-foreground">
                        {game.battingFirst === "A" ? game.teamA.name : game.teamB.name} batting
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm mt-1.5">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                          <Zap className="w-3.5 h-3.5" /> {stats1.fours} 4s, {stats1.sixes} 6s
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30">
                          <Target className="w-3.5 h-3.5" /> {stats1.dots} dots
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          <AlertCircle className="w-3.5 h-3.5" /> {stats1.extras} extras
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {stats1.totalRuns}<span className="text-3xl text-muted-foreground">/{stats1.wickets}</span>
                    </p>
                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                      {innings1.length} balls
                    </p>
                  </div>
                </div>

                {/* Player Stats for Innings 1 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-5 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-green-600/5 border-2 border-green-500/30 hover:border-green-500/50 transition-all shadow-lg hover:shadow-green-500/20">
                    <h4 className="font-black text-lg mb-4 flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      Batting Performance
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {getPlayerStats(innings1, true).map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-lg bg-background/60 border border-green-500/20 hover:bg-background/80 hover:border-green-500/40 transition-all">
                          <span className="font-bold text-foreground">{player.name}</span>
                          <span className="font-semibold text-muted-foreground">{player.runs} <span className="text-xs">({player.balls}b)</span></span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5 bg-gradient-to-br from-red-500/15 via-rose-500/10 to-red-600/5 border-2 border-red-500/30 hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/20">
                    <h4 className="font-black text-lg mb-4 flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                        <BarChart3 className="w-5 h-5 text-red-400" />
                      </div>
                      Bowling Performance
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {getPlayerStats(innings1, false).map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-lg bg-background/60 border border-red-500/20 hover:bg-background/80 hover:border-red-500/40 transition-all">
                          <span className="font-bold text-foreground">{player.name}</span>
                          <span className="font-semibold text-muted-foreground">{player.wickets}w <span className="text-xs">({player.balls}b)</span></span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Ball by Ball Innings 1 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {innings1.map((ball, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${getResultColor(ball.result)} hover:scale-105 transition-all cursor-pointer shadow-sm hover:shadow-md`}
                      title={`${ball.batterName} vs ${ball.bowlerName}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {getResultIcon(ball.result)}
                          <span className="font-bold text-xs opacity-70">#{ball.ballNumber}</span>
                        </div>
                        <span className="font-black text-base">
                          {ball.result === "runs" && ball.runsScored > 0 ? ball.runsScored : 
                           ball.result === "wicket" ? "W" : 
                           ball.result === "extra" ? `+${ball.runsScored}` : "•"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate font-medium">
                        {ball.batterName.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Innings 2 */}
              {innings2.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/15 to-pink-500/20 rounded-xl border-2 border-purple-500/40 shadow-lg backdrop-blur">
                    <div className="flex items-center gap-4">
                      <div className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-black text-lg shadow-xl border border-white/20">
                        2nd Innings
                      </div>
                      <div>
                        <p className="font-black text-lg text-foreground">
                          {game.battingFirst === "A" ? game.teamB.name : game.teamA.name} batting
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm mt-1.5">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                            <Zap className="w-3.5 h-3.5" /> {stats2.fours} 4s, {stats2.sixes} 6s
                          </span>
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30">
                            <Target className="w-3.5 h-3.5" /> {stats2.dots} dots
                          </span>
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            <AlertCircle className="w-3.5 h-3.5" /> {stats2.extras} extras
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-5xl font-black bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {stats2.totalRuns}<span className="text-3xl text-muted-foreground">/{stats2.wickets}</span>
                      </p>
                      <p className="text-sm text-muted-foreground font-semibold mt-1">
                        {innings2.length} balls
                      </p>
                    </div>
                  </div>

                  {/* Player Stats for Innings 2 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-5 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-green-600/5 border-2 border-green-500/30 hover:border-green-500/50 transition-all shadow-lg hover:shadow-green-500/20">
                      <h4 className="font-black text-lg mb-4 flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        Batting Performance
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {getPlayerStats(innings2, true).map((player, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-lg bg-background/60 border border-green-500/20 hover:bg-background/80 hover:border-green-500/40 transition-all">
                            <span className="font-bold text-foreground">{player.name}</span>
                            <span className="font-semibold text-muted-foreground">{player.runs} <span className="text-xs">({player.balls}b)</span></span>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-5 bg-gradient-to-br from-red-500/15 via-rose-500/10 to-red-600/5 border-2 border-red-500/30 hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/20">
                      <h4 className="font-black text-lg mb-4 flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                          <BarChart3 className="w-5 h-5 text-red-400" />
                        </div>
                        Bowling Performance
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {getPlayerStats(innings2, false).map((player, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-lg bg-background/60 border border-red-500/20 hover:bg-background/80 hover:border-red-500/40 transition-all">
                            <span className="font-bold text-foreground">{player.name}</span>
                            <span className="font-semibold text-muted-foreground">{player.wickets}w <span className="text-xs">({player.balls}b)</span></span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Ball by Ball Innings 2 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {innings2.map((ball, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-2 ${getResultColor(ball.result)} hover:scale-105 transition-all cursor-pointer shadow-sm hover:shadow-md`}
                        title={`${ball.batterName} vs ${ball.bowlerName}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {getResultIcon(ball.result)}
                            <span className="font-bold text-xs opacity-70">#{ball.ballNumber}</span>
                          </div>
                          <span className="font-black text-base">
                            {ball.result === "runs" && ball.runsScored > 0 ? ball.runsScored : 
                             ball.result === "wicket" ? "W" : 
                             ball.result === "extra" ? `+${ball.runsScored}` : "•"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate font-medium">
                          {ball.batterName.split(' ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

