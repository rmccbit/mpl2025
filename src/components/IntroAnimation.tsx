import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const IntroAnimation = ({ onComplete }: { onComplete?: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 6000); // duration of animation
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#000000] via-[#0b1b33] to-[#001F3F] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          {/* Stadium Lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-between px-16">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="w-32 h-32 bg-white/20 blur-2xl rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.4 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              />
            ))}
          </div>

          {/* Lightning Stroke */}
          <motion.div
            className="absolute w-2 h-screen bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 blur-sm"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />

          {/* Cricket Ball */}
          <motion.div
            className="absolute rounded-full bg-red-600 shadow-[0_0_50px_rgba(255,0,0,0.7)]"
            style={{ width: 100, height: 100 }}
            initial={{ x: "-120%", rotate: -360 }}
            animate={{ x: "120%", rotate: 720 }}
            transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
          />

          {/* Energy Lines */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                delay: 1 + i * 0.2,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              style={{ top: `${30 + i * 10}%` }}
            />
          ))}

          {/* Team Name Reveal */}
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-white tracking-widest text-center drop-shadow-[0_0_25px_#00ffff]"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: [0.2, 1.2, 1],
              opacity: [0, 1],
              textShadow: [
                "0 0 20px #00FFFF",
                "0 0 40px #00FFFF",
                "0 0 60px #00FFFF",
              ],
            }}
            transition={{
              duration: 2,
              delay: 2.8,
              type: "tween",
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            MPL 2025
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-2xl text-gray-300 mt-4 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 1 }}
          >
            The Battle of Titans Begins
          </motion.p>

          {/* Fade-Out Overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ delay: 5.5, duration: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
