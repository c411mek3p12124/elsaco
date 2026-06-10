"use client";
import type { SiteContent } from "@/lib/content";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Services from "./sections/Services";
import WhyElsa from "./sections/WhyElsa";
import Testimonials from "./sections/Testimonials";
import Process from "./sections/Process";
import Pricing from "./sections/Pricing";
import FAQ from "./sections/FAQ";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="divider" />
    </div>
  );
}

/** All content sections below the hero — shared by the live site and the editor. */
export default function Sections({ content }: { content: SiteContent }) {
  return (
    <div className="relative z-10 atmosphere">
      <About data={content.about} />
      <Divider />
      <Skills data={content.skills} />
      <Divider />
      <Services data={content.services} />
      <Divider />
      <WhyElsa data={content.why} />
      <Divider />
      <Testimonials data={content.testimonials} />
      <Divider />
      <Process data={content.process} />
      <Divider />
      <Pricing data={content.pricing} />
      <Divider />
      <FAQ data={content.faq} />
      <Contact data={content.contact} />
      <Footer data={content.footer} brand={content.brand.name} />
    </div>
  );
}
