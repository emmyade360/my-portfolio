import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Eye, EyeOff, ExternalLink, Github,
  ArrowLeft, Save, Globe, RefreshCw, CheckCircle,
} from "lucide-react";
import { getAdminProjects, saveAdminProject, deleteAdminProject } from "../lib/adminProjects";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

const buildSitePreview = (url) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=800`;

const normalizeUrl = (raw) => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};

const EMPTY_FORM = {
  displayName: "",
  description: "",
  liveUrl: "",
  html_url: "",
  language: "JavaScript",
};

function PasswordGate({ onAuth }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-authed", "1");
      onAuth();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-[#06101f] bg-[#c4b9ad]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass dark:bg-black/30 bg-white/60 rounded-2xl p-8 w-full max-w-sm border border-white/20"
      >
        <h1 className="ai-heading text-2xl font-bold mb-2 text-cyan-400">Admin</h1>
        <p className="text-sm dark:text-gray-400 text-slate-500 mb-6">Enter your password to manage projects.</p>

        <div className="relative mb-3">
          <input
            type={showPw ? "text" : "password"}
            placeholder="Password"
            value={password}
            autoFocus
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="lg-input w-full px-4 py-3 pr-11 rounded-lg dark:text-white text-slate-900"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-sm mb-3"
            >
              Incorrect password
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={submit}
          className="lg-btn w-full py-3 text-white font-medium"
        >
          <span className="relative z-10">Login</span>
        </button>
      </motion.div>
    </div>
  );
}

function LivePreview({ liveUrl }) {
  const [src, setSrc] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | error
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    const normalized = normalizeUrl(liveUrl);
    if (!normalized) {
      setSrc("");
      setStatus("idle");
      return;
    }
    setStatus("loading");
    timerRef.current = setTimeout(() => {
      setSrc(buildSitePreview(normalized));
    }, 900);
    return () => clearTimeout(timerRef.current);
  }, [liveUrl]);

  if (status === "idle" && !src) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 border-b border-white/10">
        <span className="text-xs text-slate-400 truncate max-w-[80%]">{normalizeUrl(liveUrl)}</span>
        {status === "loading" && <RefreshCw size={12} className="text-cyan-400 animate-spin" />}
        {status === "loaded" && <CheckCircle size={12} className="text-green-400" />}
      </div>
      {status === "loading" ? (
        <div className="h-40 flex items-center justify-center text-slate-500 text-sm gap-2">
          <RefreshCw size={14} className="animate-spin" /> Generating preview…
        </div>
      ) : (
        <img
          key={src}
          src={src}
          alt="Site preview"
          className="w-full h-40 object-cover object-top"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
      {status === "error" && (
        <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
          Preview unavailable
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass dark:bg-black/30 bg-white/60 rounded-xl border border-white/15 overflow-hidden"
    >
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.displayName}
          className="w-full h-32 object-cover object-top border-b border-white/10"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold dark:text-white text-slate-900 truncate">{project.displayName}</p>
          {project.language && (
            <span className="text-xs text-cyan-400 font-medium">{project.language}</span>
          )}
          {project.description && (
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1 line-clamp-2">{project.description}</p>
          )}
          <div className="flex gap-3 mt-2 flex-wrap">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">
                <ExternalLink size={11} /> Live site
              </a>
            )}
            {project.html_url && (
              <a href={project.html_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-cyan-300 flex items-center gap-1 hover:underline">
                <Github size={11} /> Source
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 p-1 rounded hover:bg-red-400/10"
          title="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin-authed") === "1"
  );
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authed) setProjects(getAdminProjects());
  }, [authed]);

  const refresh = () => setProjects(getAdminProjects());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.displayName.trim()) return;

    const liveUrl = normalizeUrl(form.liveUrl);
    const project = {
      displayName: form.displayName.trim(),
      description: form.description.trim(),
      liveUrl,
      html_url: normalizeUrl(form.html_url),
      language: form.language.trim(),
      name: form.displayName.trim().toLowerCase().replace(/\s+/g, "-"),
      imageUrl: liveUrl ? buildSitePreview(liveUrl) : null,
    };

    saveAdminProject(project);
    refresh();
    setForm(EMPTY_FORM);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id) => {
    deleteAdminProject(id);
    refresh();
  };

  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />;
  }

  const inputClass =
    "lg-input w-full px-4 py-2.5 rounded-lg dark:text-white text-slate-900 text-sm";

  const labelClass = "text-xs font-medium dark:text-gray-400 text-slate-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="min-h-screen dark:bg-[#06101f] bg-[#c4b9ad] py-10 px-6 md:px-14">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <a
            href="/#projects"
            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={15} /> Back to portfolio
          </a>
          <div>
            <h1 className="ai-heading text-3xl font-bold dark:text-white text-slate-900">
              Projects Admin
            </h1>
            <p className="text-sm dark:text-slate-400 text-slate-500 mt-0.5">
              Projects added here appear live on the portfolio.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">

          {/* ── Form ── */}
          <div className="glass dark:bg-black/30 bg-white/60 rounded-2xl p-6 border border-white/15 sticky top-8">
            <h2 className="text-lg font-semibold dark:text-white text-slate-900 flex items-center gap-2 mb-5">
              <Plus size={18} className="text-cyan-400" /> Add Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Display Name *</label>
                <input
                  required
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="My Awesome Project"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this project do?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe size={12} className="text-cyan-400" /> Live Site URL
                  </span>
                </label>
                <input
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  placeholder="https://myproject.vercel.app"
                  className={inputClass}
                />
              </div>

              {/* Live preview */}
              <LivePreview liveUrl={form.liveUrl} />

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Github size={12} className="text-cyan-400" /> Source Code URL
                  </span>
                </label>
                <input
                  value={form.html_url}
                  onChange={(e) => setForm({ ...form, html_url: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Language / Stack</label>
                <input
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  placeholder="TypeScript, React, Node.js…"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="lg-btn w-full py-3 text-white font-medium flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Add to Portfolio</>}
                </span>
              </button>
            </form>
          </div>

          {/* ── Saved projects ── */}
          <div>
            <h2 className="text-lg font-semibold dark:text-white text-slate-900 mb-4">
              Saved Projects{" "}
              <span className="text-cyan-400 font-normal text-base">({projects.length})</span>
            </h2>

            {projects.length === 0 ? (
              <div className="glass dark:bg-black/30 bg-white/60 rounded-2xl p-10 text-center border border-white/15 dark:text-slate-500 text-slate-400">
                No projects yet. Add one with the form.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
