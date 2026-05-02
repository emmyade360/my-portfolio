import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Cpu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const links = ["Home", "About", "Experience", "Projects", "Contact"];
  const toggleLabel = isDark ? "Dark mode" : "Light mode";

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="glass mx-auto max-w-6xl rounded-[1.75rem] px-4 py-3 md:rounded-full md:px-6">
        <div className="relative flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="logo-text relative z-10 flex min-w-0 items-center gap-2 text-lg font-bold text-cyan-300 sm:text-xl md:text-2xl"
            aria-label="Go to home"
          >
            <Cpu className="h-5 w-5 shrink-0" />
            <span className="truncate">MyPortfolio</span>
          </a>

          <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center">
            <button
              onClick={toggleTheme}
              className="theme-toggle group relative inline-flex h-11 w-[9.5rem] items-center rounded-full p-1 text-sm font-semibold"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              aria-pressed={isDark}
              title={toggleLabel}
            >
              <span
                className={`theme-toggle-thumb ${isDark ? "translate-x-[4.45rem]" : "translate-x-0"}`}
              />
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-950"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </span>
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 transition-colors ${
                  isDark ? "text-cyan-100" : "text-slate-500"
                }`}
              >
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

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="theme-toggle relative inline-flex h-10 w-[7.5rem] items-center rounded-full p-1 text-xs font-semibold"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              aria-pressed={isDark}
              title={toggleLabel}
            >
              <span
                className={`theme-toggle-thumb h-8 w-[3.35rem] ${isDark ? "translate-x-[3.1rem]" : "translate-x-0"}`}
              />
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-950"
                }`}
              >
                <Sun className="h-3 w-3" />
                <span>Day</span>
              </span>
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1 transition-colors ${
                  isDark ? "text-cyan-100" : "text-slate-500"
                }`}
              >
                <Moon className="h-3 w-3" />
                <span>Night</span>
              </span>
            </button>

            <button
              className="mobile-icon-btn dark:text-white text-slate-900"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="md:hidden"
            >
              <div className="mt-3 rounded-[1.5rem] border border-white/10 bg-white/10 px-3 py-3 dark:bg-slate-950/20">
                <ul className="grid gap-2">
                  {links.map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="block rounded-2xl px-4 py-3 text-base font-semibold dark:text-white text-slate-900 transition-colors hover:bg-white/10 hover:text-cyan-300"
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
