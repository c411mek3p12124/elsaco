"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  brand: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Header({ brand, onMenuToggle, isMenuOpen }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10 py-3 transition-all duration-500 ${
        scrolled ? "glass-static !rounded-none !border-l-0 !border-r-0 !border-t-0" : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <a href="#home" className="flex items-center gap-3">
        <span
          className="font-heading font-bold text-base tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {brand}
        </span>
      </a>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="icon-btn"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button onClick={onMenuToggle} className="icon-btn" aria-label="Menu">
          <div className="flex flex-col gap-[5px]">
            <motion.span
              className="block w-[18px] h-[1.5px] origin-center"
              style={{ background: "var(--text)" }}
              animate={isMenuOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-[18px] h-[1.5px] origin-center"
              style={{ background: "var(--text)" }}
              animate={isMenuOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </button>
      </div>
    </motion.header>
  );
}
