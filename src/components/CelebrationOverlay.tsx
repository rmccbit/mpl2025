// src/components/CelebrationOverlay.tsx
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

interface CelebrationOverlayProps {
  type: "four" | "six" | "win" | null;
  visible: boolean;
  onDone: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  type,
  visible,
  onDone,
}) => {
  useEffect(() => {
    if (!visible || !type) return;

    const fireConfetti = () => {
      const end = Date.now() + 2 * 1000;
      const colors = ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#ff00ff"];
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 100,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 100,
          origin: { x: 1 },
          colors,
        });
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

    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, [visible, type, onDone]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
        {type === "four"
          ? "That's a FOUR!"
          : type === "six"
          ? "Ohh, that’s a SIXER!"
          : "🏆 CHAMPIONS 🏆"}
      </h1>
    </div>
  );
};
