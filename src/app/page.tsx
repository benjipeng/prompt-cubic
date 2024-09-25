"use client";

import { ColorWheel } from "@/components/ColorWheel";
import AboutSection from "@/components/AboutSection";
import KnowMoreSection from "@/components/KnowMoreSection";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const ScrollHandler = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = searchParams.get("hash");
    if (hash === "about" || hash === "know-more") {
      const section = document.getElementById(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  return null;
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <div className="relative flex items-center justify-center h-screen overflow-hidden">
        <ColorWheel className="opacity-70" />
        <h1 className="text-4xl font-bold text-center relative">
          Welcome to PromptCubic
        </h1>
      </div>
      <AboutSection />
      <KnowMoreSection />
    </div>
  );
}
