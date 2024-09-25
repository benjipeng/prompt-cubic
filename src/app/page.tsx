"use client";

import { ColorWheel } from "@/components/ColorWheel";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex items-center justify-center h-screen overflow-hidden">
        <ColorWheel className="opacity-70" />
        <h1 className="text-4xl font-bold text-center relative">
          Welcome to PromptCubic
        </h1>
      </div>
      <AboutSection />
    </div>
  );
}
