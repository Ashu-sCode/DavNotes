import { useState, useEffect, useRef } from "react";

export default function ProgressBar({ progress }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    let start;
    const duration = 500;
    const initial = animatedProgress;
    const diff = progress - initial;

    if (diff === 0) return;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percent = Math.min(elapsed / duration, 1);
      setAnimatedProgress(initial + diff * percent);
      if (percent < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [progress]);

  return (
    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner relative">
      <div
        className="h-3 rounded-full bg-indigo-600 shadow-lg
                   bg-[repeating-linear-gradient(45deg,#6366f1, #6366f1 10px, #4f46e5 10px, #4f46e5 20px)]
                   animate-stripe-move transition-all duration-500 ease-out"
        style={{ width: `${animatedProgress}%` }}
      />
    </div>
  );
}
