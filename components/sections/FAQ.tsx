"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, AddBtn, DeleteBtn } from "../editable/Editable";
import { useEdit } from "../editable/EditContext";

export default function FAQ({ data }: { data: SiteContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  const { editing } = useEdit();

  return (
    <section id="faq" className="section-pad">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="faq.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="faq.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <div className="glass-static px-6 md:px-8">
          {data.items.map((item, i) => {
            const isOpen = editing || open === i;
            return (
              <div key={i} className="ed-item faq-row" style={i === data.items.length - 1 ? { borderBottom: "none" } : undefined}>
                <DeleteBtn p="faq.items" i={i} />
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-heading font-semibold text-[15px]" style={{ color: "var(--text)" }}>
                    <T p={`faq.items.${i}.q`}>{item.q}</T>
                  </span>
                  {!editing && (
                    <motion.span
                      animate={{ rotate: open === i ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-xl shrink-0"
                      style={{ color: "var(--primary)" }}
                    >
                      +
                    </motion.span>
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        <T p={`faq.items.${i}.a`}>{item.a}</T>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-6">
          <AddBtn p="faq.items" label="Tambah pertanyaan" />
        </div>
      </div>
    </section>
  );
}
