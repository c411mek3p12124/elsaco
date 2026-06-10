"use client";
import { useState } from "react";
import ThemeProvider from "./ThemeProvider";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./Preloader";
import Header from "./Header";
import FullscreenMenu from "./FullscreenMenu";
import HeroSequence from "./HeroSequence";
import Sections from "./Sections";
import { EditProvider, type EditCtx } from "./editable/EditContext";
import { ThemeApplier } from "./editable/ThemePanel";
import type { SiteContent } from "@/lib/content";

export default function LandingClient({ content }: { content: SiteContent }) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Read-only context so per-element styles render on the live site too.
  const roCtx: EditCtx = {
    editing: false,
    setPath: () => {}, addItem: () => {}, removeItem: () => {},
    upload: async () => "",
    getStyle: (p) => content.styles?.[p] ?? {},
  };

  return (
    <ThemeProvider>
      <ThemeApplier theme={content.theme} button={content.buttonStyle} />
      <EditProvider value={roCtx}>
      <Preloader
        progress={progress}
        isComplete={loaded}
        brand={content.brand.name}
        tagline={content.brand.tagline}
        logo={content.brand.logo}
      />

      <SmoothScroll>
        <Header
          brand={content.brand.name}
          logo={content.brand.logo}
          onMenuToggle={() => setMenuOpen((o) => !o)}
          isMenuOpen={menuOpen}
        />
        <FullscreenMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          email={content.contact.email}
          whatsapp={content.contact.whatsapp}
        />

        <main>
          <section id="home">
            <HeroSequence hero={content.hero} onProgress={setProgress} onDone={() => setLoaded(true)} />
          </section>

          <Sections content={content} />
        </main>
      </SmoothScroll>
      </EditProvider>
    </ThemeProvider>
  );
}
