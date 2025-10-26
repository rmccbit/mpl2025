import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, Zap, XCircle } from "lucide-react";

interface GamePopupProps {
  type: "runs" | "wicket" | "dot" | "extra" | "winner";
  value?: number;
  message?: string;
  onClose: () => void;
}

export const GamePopup = ({ type, value, message, onClose }: GamePopupProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "runs":
        return <Zap className="w-16 h-16 text-yellow-400" />;
      case "wicket":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "dot":
        return <Target className="w-16 h-16 text-gray-400" />;
      case "extra":
        return <Zap className="w-16 h-16 text-orange-400" />;
      case "winner":
        return <Trophy className="w-20 h-20 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "runs":
        return `${value} RUN${value !== 1 ? "S" : ""}!`;
      case "wicket":
        return "WICKET! 🎯";
      case "dot":
        return "DOT BALL ⚪";
      case "extra":
        return `EXTRA +${value || 1}`;
      case "winner":
        return "MATCH WON! 🏆";
      default:
        return "";
    }
  };

  const getColor = () => {
    switch (type) {
      case "runs":
        return "from-green-500 to-emerald-600";
      case "wicket":
        return "from-red-500 to-rose-600";
      case "dot":
        return "from-gray-500 to-slate-600";
      case "extra":
        return "from-orange-500 to-amber-600";
      case "winner":
        return "from-yellow-500 to-gold-600";
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`bg-gradient-to-br ${getColor()} p-8 rounded-3xl shadow-2xl backdrop-blur-sm border-4 border-white/50`}
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {getIcon()}
              </motion.div>
              <h2 className="text-4xl font-bold text-white mt-4 mb-2 drop-shadow-lg">
                {getTitle()}
              </h2>
              {message && (
                <p className="text-lg text-white/90 font-semibold drop-shadow">
                  {message}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

