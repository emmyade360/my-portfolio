import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Cpu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const links = ["Home", "About", "Experience", "Projects", "Contact"];

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-3 md:px-6">
      <a
        href="#home"
        onClick={() => setIsOpen(false)}
        className="logo-text text-xl md:text-2xl font-bold text-cyan-300 flex items-center gap-2 relative z-10"
        aria-label="Go to home"
      >
        <Cpu className="w-5 h-5" />
        <span className="hidden sm:inline">MyPortfolio</span>
      </a>

      {/* Desktop */}
      <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center">
        <button
          onClick={toggleTheme}
          className="theme-toggle group relative inline-flex h-11 w-[9.5rem] items-center rounded-full p-1 text-sm font-semibold"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          aria-pressed={isDark}
        >
          <span
            className={`theme-toggle-thumb ${isDark ? "translate-x-[4.45rem]" : "translate-x-0"}`}
          />
          <span className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 transition-colors ${isDark ? "text-slate-400" : "text-slate-950"}`}>
            <Sun className="h-3.5 w-3.5" />
            Light
          </span>
          <span className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 transition-colors ${isDark ? "text-cyan-100" : "text-slate-500"}`}>
            <Moon className="h-3.5 w-3.5" />
            Dark
          </span>
        </button>
      </div>

      <div className="hidden md:flex items-center">
        <ul className="flex items-center gap-7 dark:text-white text-slate-900">
          {links.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="relative font-semibold tracking-wide hover:text-cyan-300 transition-colors duration-200"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-3">
        <button
          onClick={toggleTheme}
          className="theme-toggle relative inline-flex h-10 w-[6.75rem] items-center rounded-full p-1 text-xs font-semibold"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          aria-pressed={isDark}
        >
          <span className={`theme-toggle-thumb h-8 w-[3rem] ${isDark ? "translate-x-[2.7rem]" : "translate-x-0"}`} />
          <span className={`relative z-10 flex w-1/2 items-center justify-center transition-colors ${isDark ? "text-slate-400" : "text-slate-950"}`}>
            <Sun className="h-3.5 w-3.5" />
          </span>
          <span className={`relative z-10 flex w-1/2 items-center justify-center transition-colors ${isDark ? "text-cyan-100" : "text-slate-500"}`}>
            <Moon className="h-3.5 w-3.5" />
          </span>
        </button>

        <button
          className="dark:text-white text-slate-900"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full glass flex flex-col items-center gap-4 py-6 dark:text-white text-slate-900 md:hidden"
          >
            {links.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="font-semibold text-lg hover:text-cyan-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      </div>
    </nav>
  );
}
