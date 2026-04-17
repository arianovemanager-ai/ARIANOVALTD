"use client";

import { useState, useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // We use a hidden image object to detect when the high-res background is actually ready
  useEffect(() => {
    const img = new Image();
    img.src = "/images/Distesa1.jpg";
    img.onload = () => setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0B0B0B]">
      {/* Distesa Background Image with Fade-in */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-out scale-105 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        style={{ backgroundImage: "url('/images/Distesa1.jpg')" }}
      />

      {/* Soft dark  overlay */}
      <div className="absolute inset-0 bg-brand-surface/40 mix-blend-multiply pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg/60 pointer-events-none z-[2]" />

      <div className="relative z-10 w-full max-w-md pt-12">
        <div className="text-center mb-8 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-6xl text-brand-accent tracking-[0.05em] mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Arianova </h1>
        </div>

        {children}
      </div>
    </div>
  )
}
