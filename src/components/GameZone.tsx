import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Clock, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctIndex: number;
  runs: number;
}

interface GameZoneProps {
  availableBalls: (Question | null)[];
  onBallSelect: (ballNumber: number) => void;
  onAnswer: (result: { 
    batterCorrect?: boolean; 
    bowlerCorrect?: boolean; 
    runs?: number; 
    isExtra?: boolean; 
    extraType?: "wide" | "noball"; 
    extraRuns?: number; 
    questionId?: number;
  }) => void;
  canSelectBall?: boolean;
  selectedBatterName?: string | null;
  selectedBowlerName?: string | null;
}

export const GameZone = ({ availableBalls, onBallSelect, onAnswer, canSelectBall = true, selectedBatterName = null, selectedBowlerName = null }: GameZoneProps) => {
  const [selectedBall, setSelectedBall] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [baseTime, setBaseTime] = useState<number>(30);
  const [stage, setStage] = useState<"batter" | "bowler" | null>(null);
  const [batterAnswer, setBatterAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (selectedBall && stage && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - treat as wrong answer
            if (stage === "batter") {
              handleBatterWrong();
            } else {
              handleBowlerAnswer(false);
            }
            return baseTime;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedBall, stage, timeLeft, baseTime]);

  const handleBallClick = (ball: Question) => {
    if (!canSelectBall) return;
    // If this is an extra (wide or no-ball), auto-award 1 run, don't consume a legal ball, and don't open question UI
    if ((ball as any).type === "wide" || (ball as any).type === "noball") {
      onBallSelect(ball.id);
      onAnswer({ isExtra: true, extraType: (ball as any).type, extraRuns: 1, questionId: ball.id });
      return;
    }
    const runs = ball.runs;
    const mapped = runs >= 6 ? 60 : runs === 4 ? 45 : runs === 2 ? 30 : 20; // 1 or 0 => 20s
    setBaseTime(mapped);
    setSelectedBall(ball);
    setStage("batter");
    setTimeLeft(mapped);
    setBatterAnswer(null);
    onBallSelect(ball.id);
  };

  const handleBatterWrong = () => {
    setStage("bowler");
    setTimeLeft(baseTime);
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (!selectedBall) return;

    const isCorrect = optionIndex === selectedBall.correctIndex;

    if (stage === "batter") {
      if (isCorrect) {
        // Batter scored runs
        onAnswer({ batterCorrect: true, runs: selectedBall.runs });
        resetGame();
      } else {
        // Batter got it wrong, bowler's turn
        setBatterAnswer(optionIndex);
        handleBatterWrong();
      }
    } else if (stage === "bowler") {
      handleBowlerAnswer(isCorrect);
    }
  };

  const handleBowlerAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Bowler correct = Wicket
      onAnswer({ batterCorrect: false, bowlerCorrect: true, runs: 0 });
    } else {
      // Both wrong = Dot ball
      onAnswer({ batterCorrect: false, bowlerCorrect: false, runs: 0 });
    }
    resetGame();
  };

  const resetGame = () => {
    setSelectedBall(null);
    setStage(null);
    setTimeLeft(30);
    setBatterAnswer(null);
  };

  return (
    <div className="space-y-4">
      {/* Ball Selection Grid */}
      <Card className="bg-card/80 backdrop-blur-sm p-6 shadow-pitch border-2 border-primary/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-secondary" />
          <h3 className="text-xl font-bold text-center text-secondary">Select a Ball</h3>
          <Zap className="w-6 h-6 text-secondary" />
        </div>
        {!canSelectBall && (
          <div className="mb-4 text-center text-sm text-muted-foreground">
            Select bowler then batter to enable balls.
          </div>
        )}
        {canSelectBall && (selectedBowlerName || selectedBatterName) && (
          <div className="mb-4 text-center text-xs text-muted-foreground">
            {selectedBowlerName ? `Bowler: ${selectedBowlerName}` : ""}
            {selectedBowlerName && selectedBatterName ? " • " : ""}
            {selectedBatterName ? `Batter: ${selectedBatterName}` : ""}
          </div>
        )}
        <div className="grid grid-cols-5 gap-5">
          {availableBalls.map((ball, i) => {
            const isAvailable = ball !== null;
            return (
              <motion.div
                key={i + 1}
                whileHover={{ scale: isAvailable && canSelectBall ? 1.06 : 1 }}
                whileTap={{ scale: isAvailable && canSelectBall ? 0.98 : 1 }}
              >
                <Button
                  onClick={() => {
                    if (ball) handleBallClick(ball);
                  }}
                  disabled={!isAvailable || !canSelectBall}
                  aria-label={`Ball ${i + 1}`}
                  className={`rounded-full text-base font-bold transition-all relative overflow-hidden ring-1 ring-white/10 ${
                    isAvailable && canSelectBall
                      ? "cricket-ball hover:shadow-glow hover:-translate-y-0.5"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  } w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20`}
                >
                  <span className="relative z-10">{i + 1}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Question Display */}
      {selectedBall ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm p-8 shadow-stadium border-2 border-secondary/30">
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 w-24 h-24 rounded-full cricket-ball flex items-center justify-center text-lg font-bold">
                  Ball {selectedBall.id}
                </div>
                
                {/* Timer */}
                <motion.div 
                  className="flex items-center justify-center gap-2 mb-4"
                  animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
                >
                  <Clock className="w-5 h-5" />
                  <span className={`text-2xl font-bold ${timeLeft <= 10 ? "text-destructive" : "text-foreground"}`}>
                    {timeLeft}s
                  </span>
                </motion.div>

                {/* Stage indicator */}
                <div className="mb-4">
                  <motion.span 
                    className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-block"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stage === "batter" ? "🏏 Batter's Turn" : "⚾ Bowler's Turn"}
                  </motion.span>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2 break-words leading-relaxed">
                  {selectedBall.text}
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>Worth {selectedBall.runs} run{selectedBall.runs !== 1 ? "s" : ""}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedBall.choices.map((option, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: stage === "bowler" && batterAnswer === idx ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleAnswerClick(idx)}
                      size="lg"
                      disabled={stage === "bowler" && batterAnswer === idx}
                      className={`min-h-16 h-auto py-4 text-base bg-muted hover:bg-accent transition-all border-2 text-left whitespace-normal break-words ${
                        stage === "bowler" && batterAnswer === idx 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:border-primary"
                      }`}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card className="bg-card/80 backdrop-blur-sm p-12 shadow-stadium border-2 border-muted/50">
          <p className="text-center text-xl text-muted-foreground">
            Select a ball number to see the question
          </p>
        </Card>
      )}
    </div>
  );
};
