import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
  persistKey?: string; // localStorage key to mark intro as shown
}

export const IntroAnimation = ({ onComplete, persistKey = "mpl_intro_shown" }: IntroAnimationProps) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Sequence timings (ms)
    const timers: number[] = [];

    // Throw ball to center
    timers.push(window.setTimeout(() => setStage(1), 100));
    // Bat appears and swing / hit
    timers.push(window.setTimeout(() => setStage(2), 1000));
    // Text reveal
    timers.push(window.setTimeout(() => setStage(3), 1700));
    // End of animation -> complete
    timers.push(window.setTimeout(() => {
      try { localStorage.setItem(persistKey, "1"); } catch {}
      onComplete();
    }, 3000));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [onComplete, persistKey]);

  const handleSkip = () => {
    try { localStorage.setItem(persistKey, "1"); } catch {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#061018] to-[#0b2230]">
      <style>{`
        .intro-stage { position: relative; width: 100%; height: 100%; }
        .animation-area { width: min(900px, 90%); height: 360px; position: relative; }
        .ball { position: absolute; left: -80px; top: 50%; width: 48px; height: 48px; border-radius: 9999px; background: radial-gradient(circle at 30% 30%, #fff, #ffdd57); box-shadow: 0 6px 18px rgba(0,0,0,0.4); transform: translateY(-50%); }
        .ball.throw { animation: throwBall 900ms cubic-bezier(.2,.8,.2,1) forwards; }
        @keyframes throwBall { to { left: calc(50% - 24px); } }

        .bat { position: absolute; right: 16%; top: 46%; width: 220px; height: 24px; transform-origin: 10% 50%; background: linear-gradient(90deg,#5b3e2b,#8b5a3c); border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,0.35); opacity: 0; }
        .bat.show { opacity: 1; animation: batSwing 700ms ease forwards; }
        @keyframes batSwing { 0% { transform: rotate(-30deg) translateX(20px); } 50% { transform: rotate(10deg) translateX(-6px); } 100% { transform: rotate(-6deg) translateX(-10px); } }

        .hit-spark { position: absolute; width: 6px; height: 6px; background: #ffd34d; border-radius: 50%; filter: blur(0.4px); opacity: 0; }
        .hit-spark.show { animation: sparkPop 360ms linear forwards; }
        @keyframes sparkPop { 0% { opacity: 1; transform: scale(0.3); } 100% { opacity: 0; transform: scale(2) translateX(20px); } }

        .title { position: absolute; left: 50%; top: 70%; transform: translate(-50%, 0); color: white; font-weight: 800; font-size: 48px; letter-spacing: 2px; opacity: 0; }
        .title.show { animation: titleIn 800ms cubic-bezier(.2,.9,.3,1) forwards; }
        @keyframes titleIn { 0% { opacity: 0; transform: translate(-50%, 10px) scale(0.9); } 60% { transform: translate(-50%, -6px) scale(1.03); opacity: 1; } 100% { transform: translate(-50%, 0) scale(1); } }

        .sub { display:block; font-size:14px; opacity:0.85; font-weight:600; margin-top:6px; letter-spacing:1px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto; }

        .skip-btn { position: absolute; right: 24px; top: 24px; background: rgba(255,255,255,0.06); color: #fff; padding: 8px 12px; border-radius: 8px; backdrop-filter: blur(6px); cursor: pointer; border: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      <div className="intro-stage flex items-center justify-center w-full h-full">
        <div className="animation-area">
          <button aria-label="Skip intro" className="skip-btn" onClick={handleSkip}>
            Skip
          </button>

          <div className={`ball ${stage >= 1 ? "throw" : ""}`} />

          <div className={`bat ${stage >= 2 ? "show" : ""}`} />

          {/* Sparks near the center when hit */}
          <div style={{ left: 'calc(50% + 30px)', top: '46%' }} className={`hit-spark ${stage >= 2 ? "show" : ""}`} />
          <div style={{ left: 'calc(50% + 55px)', top: '50%' }} className={`hit-spark ${stage >= 2 ? "show" : ""}`} />

          <div className={`title ${stage >= 3 ? "show" : ""}`}>
            <span style={{ display: 'block', fontSize: 56 }}>MPL</span>
            <span className="sub">by RMC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
