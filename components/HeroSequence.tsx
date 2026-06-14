"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import type { SiteContent } from "@/lib/content";
import { useTheme } from "./ThemeProvider";

export default function HeroSequence({
  hero,
  onProgress,
  onDone,
}: {
  hero: SiteContent["hero"];
  onProgress: (n: number) => void;
  onDone: () => void;
}) {
  const { theme } = useTheme();
  const box = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const frames = useRef<string[]>([]); // auto-detected frame URLs (no count limit)
  const fr = useRef(0);
  const raf = useRef<number | null>(null);
  const firstLoad = useRef(true);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: box, offset: ["start start", "end end"] });

  // Headline block: visible at start, fades out as you scroll in.
  const headOp = useTransform(scrollYProgress, [0, 0.18, 0.26], [1, 1, 0]);
  const headY = useTransform(scrollYProgress, [0, 0.26], [0, -40]);
  // Stats block: fades in mid-scroll, out near the end.
  const statsOp = useTransform(scrollYProgress, [0.34, 0.46, 0.74, 0.86], [0, 1, 1, 0]);
  const statsY = useTransform(scrollYProgress, [0.34, 0.46], [40, 0]);

  useEffect(() => {
    let alive = true;
    // Do NOT blank the canvas on theme change — keep the current frame showing while the
    // new theme's frames load, then swap as soon as the visible frame is ready (instant).
    fetch("/sequences.json").then((r) => (r.ok ? r.json() : {})).then((man: any) => {
      if (!alive) return;
      // theme-aware: pick the active theme's frames; fall back to whichever exists.
      const flist: string[] = (man && (man[theme]?.length ? man[theme] : (man.light || man.dark || man.sequence))) || [];
      frames.current = flist;
      if (!flist.length) { onProgress(100); if (firstLoad.current) { firstLoad.current = false; onDone(); } return; }
      const arr: HTMLImageElement[] = new Array(flist.length);
      let n = 0; let swapped = false;
      const curIdx = Math.min(flist.length - 1, fr.current);
      // Load the currently-visible frame FIRST so the preloader dismisses (and theme swaps) instantly.
      const order = [curIdx, ...flist.map((_, i) => i).filter((i) => i !== curIdx)];
      order.forEach((i) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          if (!alive) return;
          n++; if (!swapped) onProgress((n / flist.length) * 100);
          if (!swapped && i === curIdx) {
            swapped = true; imgs.current = arr; setReady(true); draw(curIdx);
            if (firstLoad.current) { firstLoad.current = false; onProgress(100); onDone(); }
          }
          if (n === flist.length) { imgs.current = arr; setReady(true); draw(Math.min(arr.length - 1, fr.current)); }
        };
        img.src = flist[i];
        arr[i] = img;
      });
    }).catch(() => { onProgress(100); if (firstLoad.current) { firstLoad.current = false; onDone(); } });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const draw = useCallback((fi: number) => {
    const c = cvs.current,
      ctx = c?.getContext("2d"),
      img = imgs.current[fi];
    if (!c || !ctx || !img?.complete) return;
    const d = devicePixelRatio || 1,
      r = c.getBoundingClientRect();
    c.width = r.width * d;
    c.height = r.height * d;
    ctx.scale(d, d);
    ctx.clearRect(0, 0, r.width, r.height);
    const ir = img.naturalWidth / img.naturalHeight,
      cr = r.width / r.height;
    let dw: number, dh: number, ox: number, oy: number;
    if (r.width < 768) {
      // mobile: "contain" — show the whole frame (no heavy crop / over-zoom on phones)
      if (ir > cr) { dw = r.width; dh = dw / ir; ox = 0; oy = (r.height - dh) / 2; }
      else { dh = r.height; dw = dh * ir; ox = (r.width - dw) / 2; oy = 0; }
    } else {
      // desktop: "cover" — fill the screen
      if (ir > cr) { dh = r.height; dw = dh * ir; ox = (r.width - dw) / 2; oy = 0; }
      else { dw = r.width; dh = dw / ir; ox = 0; oy = (r.height - dh) / 2; }
    }
    ctx.drawImage(img, ox, oy, dw, dh);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!ready) return;
    const N = frames.current.length; if (!N) return;
    const fi = Math.min(N - 1, Math.floor(v * N));
    if (fi !== fr.current) {
      fr.current = fi;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => draw(fi));
    }
  });

  useEffect(() => {
    const h = () => ready && draw(fr.current);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [ready, draw]);

  return (
    <div ref={box} className="relative h-[360vh]">
      <div className="seq-sticky">
        {/* semi-monochrome: gentle desaturation over the sequence (not too strong) */}
        <canvas ref={cvs} className="w-full h-full" style={{ background: "var(--canvas-bg)", filter: "saturate(0.7)" }} />
        {/* subtle readability scrim */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--bg-rgb),0.55) 0%, rgba(var(--bg-rgb),0.15) 35%, rgba(var(--bg-rgb),0.15) 65%, rgba(var(--bg-rgb),0.6) 100%)",
          }}
        />

        {/* Headline */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: headOp, y: headY }}
        >
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {hero.eyebrow}
          </motion.p>
          <h1
            className="font-heading font-extrabold text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.05] tracking-tight max-w-4xl"
            style={{ color: "var(--text)" }}
          >
            {hero.headline}
          </h1>
          <p
            className="mt-6 text-[clamp(0.9rem,1.6vw,1.05rem)] leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {hero.subheadline}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <a
              href={hero.ctaPrimaryHref}
              target={hero.ctaPrimaryHref.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              {hero.ctaPrimaryText}
            </a>
            <a href={hero.ctaSecondaryHref} className="btn-outline">
              {hero.ctaSecondaryText}
            </a>
          </div>
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }}>
              Scroll
            </span>
            <div className="w-[1px] h-8" style={{ background: "var(--border-hover)" }} />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ opacity: statsOp, y: statsY }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full">
            {hero.stats.map((s, i) => (
              <div key={i} className="glass-static p-8 text-center">
                <div
                  className="font-heading font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] mb-3"
                  style={{ color: "var(--primary)" }}
                >
                  {s.value}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
