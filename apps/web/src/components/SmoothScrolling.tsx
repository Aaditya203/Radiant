
"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Keep native scrolling and taps on touch devices; Lenis is only used for
    // desktop wheel input, where it does not change the mobile interaction path.
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    let frame = 0;
    function raf(time: number) {
      if (document.hidden) return;
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    const start = () => {
      if (!document.hidden && !frame) frame = requestAnimationFrame(raf);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const handleVisibility = () => document.hidden ? stop() : start();
    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

