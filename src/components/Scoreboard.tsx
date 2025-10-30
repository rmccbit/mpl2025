import { Card } from "@/components/ui/card";
import { Trophy, Target, TrendingUp } from "lucide-react";
import { GameState } from "./GameScreen";
import { motion } from "framer-motion";

interface ScoreboardProps {
  teamAName: string;
  teamBName: string;
  gameState: GameState;
}

export const Scoreboard = ({ teamAName, teamBName, gameState }: ScoreboardProps) => {
  const battingTeamName = gameState.battingTeam === "A" ? teamAName : teamBName;
  const bowlingTeamName = gameState.battingTeam === "A" ? teamBName : teamAName;

  // Calculate total overs as a decimal including balls
  const totalOvers = gameState.overs + (gameState.balls % 6) / 6;
  const runRate = totalOvers > 0 ? (gameState.runs / totalOvers).toFixed(2) : "0.00";

  return (
    <Card className="bg-card/95 p-4 md:p-5 shadow-stadium border border-border/50 backdrop-blur-sm">
      {/* Show result if game over */}
      {gameState.gameOver && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center"
        >
          <h2 className="text-xl md:text-2xl font-extrabold text-indigo-600">Match Result</h2>
          <p className="text-base mt-2 text-foreground">
            {gameState.winner === "Tie" ? "It's a Tie!" : `${gameState.winner} won! 🏆`}
          </p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-start">
        {/* Current Score */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Trophy className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base md:text-lg font-bold text-foreground">Current Innings</h3>
          </div>
          <div className="bg-card/60 border border-border/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1 font-semibold">
              {battingTeamName} <span className="text-indigo-500">(Batting)</span>
            </p>
            <div className="mt-1 inline-block rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5">
              <motion.div
                key={`${gameState.runs}-${gameState.wickets}`}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="text-5xl md:text-6xl font-black text-foreground leading-tight"
              >
                {gameState.runs}/{gameState.wickets}
              </motion.div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-1.5">
              {gameState.overs}.{gameState.balls % 6} overs
            </p>
          </div>
        </motion.div>

        {/* Innings Info */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2.5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10">
            <span className="text-sm font-extrabold tracking-wide text-violet-600">INNINGS {gameState.innings}</span>
          </div>
          {gameState.innings === 2 && gameState.teamAScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1.5 p-3 rounded-lg bg-muted/60 border border-border/40"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-indigo-500" />
                <p className="text-xs md:text-sm font-bold">Target</p>
              </div>
              <p className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                {gameState.teamAScore.runs + 1}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Match Stats */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} className="p-3.5 rounded-xl bg-card/60 border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">Extras</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{gameState.extras}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-3.5 rounded-xl bg-card/60 border border-border/50 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <p className="text-xs text-muted-foreground">Run Rate</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{runRate}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bowling team info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {bowlingTeamName} <span className="text-foreground/80">(Bowling)</span>
        </p>
      </motion.div>
    </Card>
  );
};
