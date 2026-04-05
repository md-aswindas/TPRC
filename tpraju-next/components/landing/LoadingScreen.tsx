"use client";
import { useEffect, useState } from "react";

export function TPRCLoader() {
  const [percent, setPercent] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setExit(true), 800); 
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  if (exit) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#0a0a0a] transition-opacity duration-1000 ${percent === 100 ? "opacity-0" : "opacity-100"}`}>
      
      <div className="flex flex-col items-center">
        {/* Text Reveal Container */}
        <div className="relative overflow-hidden py-1">
          <h1 className="text-5xl md:text-7xl font-black tracking-[0.25em] text-charcoal dark:text-white animate-reveal">
            TPRC
          </h1>
        </div>

        {/* Middle-Out Progress Line */}
        <div className="relative h-[1.5px] w-48 md:w-64 bg-gray-100 dark:bg-gray-900 mt-4 overflow-hidden">
          <div 
            className="absolute top-0 left-1/2 h-full bg-primary transition-all duration-500 ease-out"
            style={{ 
              width: `${percent}%`,
              transform: "translateX(-50%)" // Keeps the bar centered as it grows
            }}
          />
        </div>

        {/* Minimalist Caption */}
        <div className="mt-6">
          <p className="text-[9px] font-bold tracking-[0.6em] uppercase text-gray-400 animate-fade-in">
            Engineering Excellence
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes reveal {
          0% { transform: translateY(110%); }
          100% { transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-reveal {
          animation: reveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}