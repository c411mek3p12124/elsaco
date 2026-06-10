"use client";
import { motion, AnimatePresence } from "motion/react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function FullscreenMenu({
  isOpen,
  onClose,
  email,
  whatsapp,
}: {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  whatsapp: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center"
          style={{ background: "var(--overlay)" }}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="w-full px-8 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-16">
            <nav className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                >
                  <a href={l.href} className="menu-link" onClick={onClose}>
                    <span
                      className="font-body font-normal text-sm mr-3 align-top"
                      style={{ color: "var(--text-muted)" }}
                    >
                      0{i + 1}
                    </span>
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <p
                className="text-[10px] font-medium tracking-[0.3em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Get in touch
              </p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:translate-x-1 transition-transform"
                style={{ color: "var(--whatsapp)" }}
              >
                WhatsApp →
              </a>
              <a
                href={`mailto:${email}`}
                className="text-sm font-medium"
                style={{ color: "var(--primary)" }}
              >
                {email}
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
