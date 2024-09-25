"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface ColorWheelProps {
  className?: string;
}

export function ColorWheel({ className = "" }: ColorWheelProps) {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      drawWheelEffect();
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [mousePosition, theme]);

  const drawWheelEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 2;

    const gradientColors =
      theme === "dark"
        ? ["#4B0082", "#000080", "#191970", "#4B0082", "#000000"]
        : ["#FFB6C1", "#FFA07A", "#98FB98", "#87CEFA", "#FFFFFF"];

    // Apply rotation to the entire context
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(performance.now() / 10000); // Slower rotation (5 times slower)
    ctx.translate(-centerX, -centerY);

    // Create conic gradient for wheel-like effect
    const gradient = ctx.createConicGradient(0, centerX, centerY);
    gradientColors.forEach((color, index) => {
      const startAngle = index / gradientColors.length;
      const endAngle = (index + 1) / gradientColors.length;

      // Add multiple color stops for smoother transitions
      for (let i = 0; i <= 10; i++) {
        const stopPosition = startAngle + (endAngle - startAngle) * (i / 10);
        const nextColor = gradientColors[(index + 1) % gradientColors.length];
        const interpolatedColor = interpolateColor(color, nextColor, i / 10);
        gradient.addColorStop(stopPosition, interpolatedColor);
      }
    });

    // Apply gradient
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore the context to remove rotation for subsequent operations

    // Add noise texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const noise = Math.random() * 10 - 5;
      pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));
      pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise));
      pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);

    // Add blur effect
    ctx.filter = "blur(60px)";
    ctx.globalAlpha = 0.8;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";
    ctx.globalAlpha = 1.0;

    // Remove the following block as it's causing the square artifact
    // ctx.save();
    // ctx.translate(centerX, centerY);
    // ctx.rotate(performance.now() / 2000);
    // ctx.translate(-centerX, -centerY);
    // ctx.globalAlpha = 0.05;
    // ctx.drawImage(canvas, 0, 0);
    // ctx.restore();
  };

  // Helper function to interpolate between two colors
  function interpolateColor(
    color1: string,
    color2: string,
    factor: number
  ): string {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full z-0 ${className}`}
    />
  );
}
