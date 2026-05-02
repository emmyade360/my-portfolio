import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Card({ title, description, link, imageUrl, liveUrl, language }) {
  const previewHref = liveUrl || link;
  const [failedImageUrl, setFailedImageUrl] = useState("");
  const hasImageError = failedImageUrl === imageUrl;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="glass cursor-pointer rounded-2xl p-5"
      style={{ willChange: "transform" }}
    >
      <a
        href={previewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-4 block"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
          {imageUrl && !hasImageError ? (
            <img
              src={imageUrl}
              alt={`${title} preview`}
              className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
              onError={() => setFailedImageUrl(imageUrl)}
            />
          ) : (
            <div className="flex h-44 w-full flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-cyan-300">
                <span>Project Preview</span>
                <span>{language || "Web App"}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Open the project to view its source or live build.
                </p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent px-4 py-3 text-xs font-medium text-white">
            <span>{liveUrl ? "Live project preview" : "Repository preview"}</span>
            <span className="text-cyan-300">{liveUrl ? "Open site ->" : "Open source ->"}</span>
          </div>
        </div>
      </a>

      <h3 className="mb-2 text-xl font-bold text-cyan-400">{title}</h3>
      <div className="mb-4 text-sm leading-relaxed text-gray-300 dark:text-gray-200">{description}</div>

      <div className="flex items-center gap-3">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg-btn px-4 py-1.5 text-sm font-medium text-cyan-300"
          >
            <span className="relative z-10">{"Live Site ->"}</span>
          </a>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="lg-btn px-4 py-1.5 text-sm font-medium text-cyan-200"
          >
            <span className="relative z-10">{"Source ->"}</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
