"use client";
import { motion, AnimatePresence } from "motion/react";
import { BrandLogo } from "./editable/BrandLogo";
import type { LogoData } from "@/lib/content";

export default function Preloader({
  progress,
  isComplete,
  brand,
  tagline,
  logo,
}: {
  progress: number;
  isComplete: boolean;
  brand: string;
  tagline: string;
  logo?: LogoData;
}) {
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="mb-3 flex items-center justify-center">
                <BrandLogo logo={logo ? { ...logo, size: logo.mode === "image" ? (logo.size || 40) : 30 } : undefined} fallback={brand} />
              </div>
              <p
                className="text-[10px] font-medium tracking-[0.3em] uppercase max-w-[260px]"
                style={{ color: "var(--text-muted)" }}
              >
                {tagline}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span
                className="text-[11px] font-medium tracking-[0.15em] tabular-nums"
                style={{ color: "var(--text-muted)" }}
              >
                {Math.round(progress)}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
