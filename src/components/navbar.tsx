"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import AuthModal from "@/components/AuthModal";

const Logo = ({ className = "w-6 h-6", isScrolled = false }) => (
  <svg
    className={`${className} transition-transform duration-300 ${
      isScrolled ? "rotate-90" : "rotate-0"
    }`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, session, setUser, setSession } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setIsScrolled(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null);
      setSession(null);
    }
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const renderAuthButton = () => {
    if (user && session) {
      return (
        <>
          <span className="mr-4">
            {user.user_metadata.display_name || user.email}
          </span>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-red-600 hover:bg-red-300 text-white dark:bg-red-500 dark:hover:bg-red-800"
          >
            Log Out
          </Button>
        </>
      );
    } else {
      return (
        <Button onClick={() => setIsAuthModalOpen(true)}>
          Sign In / Sign Up
        </Button>
      );
    }
  };

  const renderThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="mr-4"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo isScrolled={isScrolled} />
              <span
                className={`ml-2 text-lg font-bold transition-all duration-300 ${
                  isScrolled
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto"
                }`}
              >
                PromptCubic
              </span>
            </Link>
            <div
              className={`flex space-x-8 transition-all duration-300 ${
                isScrolled ? "ml-2" : "ml-6"
              }`}
            >
              <Link
                href="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/know-more"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Know More
              </Link>
              {user && session && (
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {renderThemeToggle()}
            {renderAuthButton()}
          </div>
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/about"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/know-more"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Know More
            </Link>
            <div className="flex flex-col space-y-2">
              {renderThemeToggle()}
              {renderAuthButton()}
            </div>
          </div>
        </div>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
    </nav>
  );
}
