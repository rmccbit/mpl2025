// src/components/CelebrationOverlay.tsx
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Star, Sparkles } from "lucide-react";

interface CelebrationOverlayProps {
  type: "four" | "six" | "win" | null;
  visible: boolean;
  onDone: () => void;
  winnerName?: string;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  type,
  visible,
  onDone,
  winnerName,
}) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!visible || !type) return;

    const fireConfetti = () => {
      const duration = type === "win" ? 2500 : 2000;
      const end = Date.now() + duration;
      
      const colors = type === "win" 
        ? ["#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
        : type === "six"
        ? ["#FF0000", "#FF4500", "#FFD700", "#FFA500"]
        : ["#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

      (function frame() {
        confetti({
          particleCount: type === "win" ? 7 : 4,
          angle: 60,
          spread: type === "win" ? 130 : 110,
          origin: { x: 0 },
          colors,
          gravity: type === "win" ? 0.7 : 0.9,
          scalar: type === "win" ? 1.4 : 1.1,
          ticks: 300,
          shapes: ['circle', 'square'],
          drift: type === "win" ? 0.2 : 0,
        });
        confetti({
          particleCount: type === "win" ? 7 : 4,
          angle: 120,
          spread: type === "win" ? 130 : 110,
          origin: { x: 1 },
          colors,
          gravity: type === "win" ? 0.7 : 0.9,
          scalar: type === "win" ? 1.4 : 1.1,
          ticks: 300,
          shapes: ['circle', 'square'],
          drift: type === "win" ? -0.2 : 0,
        });
        
        // Extra center burst for win
        if (type === "win" && Math.random() > 0.6) {
          confetti({
            particleCount: 15,
            angle: 90,
            spread: 360,
            origin: { x: 0.5, y: 0.4 },
            colors,
            gravity: 0.4,
            scalar: 1.8,
            ticks: 400,
          });
        }

        // Additional confetti bursts for six
        if (type === "six" && Math.random() > 0.5) {
          confetti({
            particleCount: 8,
            angle: 90,
            spread: 180,
            origin: { x: 0.5, y: 0.3 },
            colors,
            gravity: 0.6,
            scalar: 1.3,
          });
        }
        
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    };

    // Play appropriate sound
    const soundMap: Record<string, string> = {
      four: "/sounds/four.mp3",
      six: "/sounds/six.mp3",
      win: "/sounds/ipl_win.mp3",
    };

    const audio = new Audio(soundMap[type]);
    audio.play().catch(() => {});
    fireConfetti();
    
    // Show text after a short delay for dramatic effect
    setTimeout(() => setShowText(true), 100);

    const timer = setTimeout(() => {
      setShowText(false);
      setTimeout(onDone, 400);
    }, type === "win" ? 2500 : 2000);
    
    return () => {
      clearTimeout(timer);
      setShowText(false);
    };
  }, [visible, type, onDone]);

  if (!visible) return null;

  const getContent = () => {
    switch (type) {
      case "four":
        return {
          icon: <Zap className="w-28 h-28" />,
          title: "FOUR!",
          subtitle: "What a shot!",
          emoji: "🏏",
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          bgGradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
          glow: "shadow-[0_0_100px_rgba(34,211,238,0.9)]",
          ringColor: "rgba(34,211,238,0.6)",
        };
      case "six":
        return {
          icon: <Star className="w-36 h-36" />,
          title: "IT'S A SIX!",
          subtitle: "Out of the park!",
          emoji: "🚀",
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          bgGradient: "from-red-500/20 via-orange-500/20 to-yellow-500/20",
          glow: "shadow-[0_0_120px_rgba(251,146,60,1)]",
          ringColor: "rgba(251,146,60,0.7)",
        };
      case "win":
        return {
          icon: <Trophy className="w-44 h-44" />,
          title: winnerName || "CHAMPIONS!",
          subtitle: winnerName ? "WINS THE MATCH!" : "Victory is yours!",
          emoji: "🏆",
          gradient: "from-yellow-300 via-amber-400 to-orange-400",
          bgGradient: "from-yellow-500/20 via-amber-500/20 to-orange-500/20",
          glow: "shadow-[0_0_150px_rgba(251,191,36,1)]",
          ringColor: "rgba(251,191,36,0.8)",
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-md z-50"
        >
          {/* Animated background gradient orbs */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 bg-gradient-to-br ${content.bgGradient} blur-3xl`}
          />

          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1,
              rotate: 0,
              opacity: 1,
            }}
            exit={{ 
              scale: 0.8,
              opacity: 0,
            }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.6,
            }}
            className="relative flex flex-col items-center gap-8 z-10"
          >
            {/* Floating particles effect */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: [0, Math.cos(i * Math.PI / 6) * 150, Math.cos(i * Math.PI / 6) * 250],
                  y: [0, Math.sin(i * Math.PI / 6) * 150, Math.sin(i * Math.PI / 6) * 250],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                className="absolute"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
            ))}

            {/* Animated Icon with pulsing glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: type === "win" ? [0, -8, 8, 0] : [0, -5, 5, 0],
              }}
              transition={{ 
                duration: type === "win" ? 1.2 : 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Glowing backdrop */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 bg-gradient-to-br ${content.gradient} blur-2xl rounded-full ${content.glow}`}
              />
              
              {/* Icon container with emoji */}
              <div className="relative">
                <motion.div
                  className={`text-white ${content.glow} relative z-10`}
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(255,255,255,0.4))',
                  }}
                >
                  {content.icon}
                </motion.div>
                
                {/* Emoji badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="absolute -bottom-3 -right-3 text-5xl"
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                  }}
                >
                  {content.emoji}
                </motion.div>
              </div>
            </motion.div>

            {/* Main Title with enhanced styling */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5,
                type: "spring",
                stiffness: 150,
              }}
              className="text-center relative"
            >
              {/* Glowing text background */}
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 bg-gradient-to-r ${content.gradient} blur-3xl`}
              />

              <motion.h1
                animate={{ 
                  scale: [1, 1.03, 1],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`relative ${
                  type === "win" && winnerName 
                    ? "text-6xl md:text-8xl lg:text-9xl" 
                    : "text-8xl md:text-[10rem]"
                } font-black bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent`}
                style={{
                  textShadow: "0 0 40px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.4)",
                  WebkitTextStroke: "3px rgba(255,255,255,0.4)",
                  letterSpacing: "0.05em",
                }}
              >
                {content.title}
              </motion.h1>
              
              {/* Subtitle with slide-in effect */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4, 
                  duration: 0.5,
                  type: "spring",
                }}
                className="relative text-4xl md:text-5xl font-bold text-white mt-6"
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.3)",
                }}
              >
                {content.subtitle}
              </motion.p>

              {/* Decorative underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={`h-1.5 mt-6 mx-auto rounded-full bg-gradient-to-r ${content.gradient}`}
                style={{
                  width: '60%',
                  boxShadow: `0 0 20px ${content.ringColor}`,
                }}
              />
            </motion.div>

            {/* Animated pulsing rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 2.5 + i * 0.5, 3.5 + i * 0.5],
                  opacity: [0.7, 0.4, 0],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
                className={`absolute inset-0 rounded-full border-4`}
                style={{ 
                  borderColor: content.ringColor,
                  boxShadow: `0 0 30px ${content.ringColor}`,
                }}
              />
            ))}
            
            {type === "win" && (
              <>
                {/* Extra sparkle burst for win */}
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.2, 0],
                      opacity: [0, 1, 0],
                      x: Math.cos(i * Math.PI / 8) * 250,
                      y: Math.sin(i * Math.PI / 8) * 250,
                      rotate: [0, 180, 360],
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                    className="absolute w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"
                    style={{ 
                      filter: 'blur(1px)',
                      boxShadow: '0 0 15px rgba(251,191,36,0.8)',
                    }}
                  />
                ))}
              </>
            )}

            {type === "six" && (
              <>
                {/* Extra flame effect for six */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.9, 0],
                      y: [0, -150, -250],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeOut",
                    }}
                    className="absolute w-8 h-8 bg-gradient-to-t from-red-500 via-orange-500 to-yellow-400 rounded-full"
                    style={{ 
                      filter: 'blur(4px)',
                      left: `${40 + i * 4}%`,
                      bottom: '-50px',
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
