import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Award, Target, Zap, AlertCircle } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-card z-10 border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{game.teamA.name} vs {game.teamB.name}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(game.timestamp).toLocaleString()} • {game.winner && `Winner: ${game.winner}`}
            </p>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {ballDetails.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">No ball-by-ball data available</p>
              <p className="text-sm text-muted-foreground mt-2">Ball tracking is only available for new games</p>
            </div>
          ) : (
            <>
              {/* Innings 1 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold">
                    Innings 1
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {game.battingFirst === "A" ? game.teamA.name : game.teamB.name} batting
                  </p>
                  {game.teamA.score && game.battingFirst === "A" && (
                    <p className="ml-auto font-bold">
                      {game.teamA.score.runs}/{game.teamA.score.wickets}
                    </p>
                  )}
                  {game.teamB.score && game.battingFirst === "B" && (
                    <p className="ml-auto font-bold">
                      {game.teamB.score.runs}/{game.teamB.score.wickets}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  {innings1.map((ball, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${getResultColor(ball.result)}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getResultIcon(ball.result)}
                          <span className="font-bold">Ball {ball.ballNumber}</span>
                        </div>
                        <span className="font-semibold text-sm">
                          {getResultText(ball.result, ball.runsScored)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold">{ball.batterName}</span> vs{" "}
                        <span className="font-semibold">{ball.bowlerName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Innings 2 */}
              {innings2.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold">
                      Innings 2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {game.battingFirst === "A" ? game.teamB.name : game.teamA.name} batting
                    </p>
                    {game.teamB.score && game.battingFirst === "A" && (
                      <p className="ml-auto font-bold">
                        {game.teamB.score.runs}/{game.teamB.score.wickets}
                      </p>
                    )}
                    {game.teamA.score && game.battingFirst === "B" && (
                      <p className="ml-auto font-bold">
                        {game.teamA.score.runs}/{game.teamA.score.wickets}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {innings2.map((ball, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-2 ${getResultColor(ball.result)}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getResultIcon(ball.result)}
                            <span className="font-bold">Ball {ball.ballNumber}</span>
                          </div>
                          <span className="font-semibold text-sm">
                            {getResultText(ball.result, ball.runsScored)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold">{ball.batterName}</span> vs{" "}
                          <span className="font-semibold">{ball.bowlerName}</span>
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

