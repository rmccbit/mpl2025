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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-card/95 shadow-2xl border-2" onClick={(e) => e.stopPropagation()}>
        {/* Header with Match Info */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 backdrop-blur-md z-10 border-b-2 border-primary/20 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {game.teamA.name} vs {game.teamB.name}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  📅 {new Date(game.timestamp).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  🕐 {new Date(game.timestamp).toLocaleTimeString()}
                </span>
                {game.winner && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-gold text-secondary-foreground font-bold text-sm">
                    <Trophy className="w-4 h-4" />
                    Winner: {game.winner}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportReport} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {ballDetails.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
                <Target className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-30 relative" />
              </div>
              <p className="text-xl font-semibold text-muted-foreground mb-2">No Ball-by-Ball Data Available</p>
              <p className="text-sm text-muted-foreground">Ball tracking is only available for new games</p>
            </div>
          ) : (
            <>
              {/* Match Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Team A Card */}
                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{game.teamA.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {game.teamA.players.length} Players
                      </p>
                    </div>
                    {game.winner === game.teamA.name && (
                      <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
                    )}
                  </div>
                  {game.teamA.score && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-5xl font-bold text-blue-400">{game.teamA.score.runs}</span>
                        <span className="text-3xl font-semibold text-muted-foreground">/{game.teamA.score.wickets}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">in {game.teamA.score.overs} overs</p>
                    </div>
                  )}
                </Card>

                {/* Team B Card */}
                <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/20 hover:border-orange-500/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{game.teamB.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {game.teamB.players.length} Players
                      </p>
                    </div>
                    {game.winner === game.teamB.name && (
                      <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
                    )}
                  </div>
                  {game.teamB.score && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-5xl font-bold text-orange-400">{game.teamB.score.runs}</span>
                        <span className="text-3xl font-semibold text-muted-foreground">/{game.teamB.score.wickets}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">in {game.teamB.score.overs} overs</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Innings 1 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-blue-500/30">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg">
                      1st Innings
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        {game.battingFirst === "A" ? game.teamA.name : game.teamB.name} batting
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {stats1.fours} fours, {stats1.sixes} sixes
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" /> {stats1.dots} dots
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {stats1.extras} extras
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-foreground">
                      {stats1.totalRuns}/{stats1.wickets}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {innings1.length} balls
                    </p>
                  </div>
                </div>

                {/* Player Stats for Innings 1 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Batting Performance
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {getPlayerStats(innings1, true).map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-background/50">
                          <span className="font-semibold">{player.name}</span>
                          <span className="text-muted-foreground">{player.runs} runs ({player.balls} balls)</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-red-500" />
                      Bowling Performance
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {getPlayerStats(innings1, false).map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-background/50">
                          <span className="font-semibold">{player.name}</span>
                          <span className="text-muted-foreground">{player.wickets} wickets ({player.balls} balls)</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Ball by Ball Innings 1 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {innings1.map((ball, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${getResultColor(ball.result)} hover:scale-105 transition-transform cursor-pointer`}
                      title={`${ball.batterName} vs ${ball.bowlerName}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {getResultIcon(ball.result)}
                          <span className="font-bold text-xs">#{ball.ballNumber}</span>
                        </div>
                        <span className="font-bold text-sm">
                          {ball.result === "runs" && ball.runsScored > 0 ? ball.runsScored : 
                           ball.result === "wicket" ? "W" : 
                           ball.result === "extra" ? `+${ball.runsScored}` : "•"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {ball.batterName.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Innings 2 */}
              {innings2.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-purple-500/30">
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-lg shadow-lg">
                        2nd Innings
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {game.battingFirst === "A" ? game.teamB.name : game.teamA.name} batting
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" /> {stats2.fours} fours, {stats2.sixes} sixes
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" /> {stats2.dots} dots
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {stats2.extras} extras
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-foreground">
                        {stats2.totalRuns}/{stats2.wickets}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {innings2.length} balls
                      </p>
                    </div>
                  </div>

                  {/* Player Stats for Innings 2 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Batting Performance
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getPlayerStats(innings2, true).map((player, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-background/50">
                            <span className="font-semibold">{player.name}</span>
                            <span className="text-muted-foreground">{player.runs} runs ({player.balls} balls)</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-red-500" />
                        Bowling Performance
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getPlayerStats(innings2, false).map((player, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-background/50">
                            <span className="font-semibold">{player.name}</span>
                            <span className="text-muted-foreground">{player.wickets} wickets ({player.balls} balls)</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Ball by Ball Innings 2 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {innings2.map((ball, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-2 ${getResultColor(ball.result)} hover:scale-105 transition-transform cursor-pointer`}
                        title={`${ball.batterName} vs ${ball.bowlerName}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            {getResultIcon(ball.result)}
                            <span className="font-bold text-xs">#{ball.ballNumber}</span>
                          </div>
                          <span className="font-bold text-sm">
                            {ball.result === "runs" && ball.runsScored > 0 ? ball.runsScored : 
                             ball.result === "wicket" ? "W" : 
                             ball.result === "extra" ? `+${ball.runsScored}` : "•"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
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

