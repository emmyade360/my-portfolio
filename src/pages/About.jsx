import { motion } from "framer-motion";
import { Mail, MapPin, Download, Globe, Database, Wrench, Github, Cpu, Link } from "lucide-react";
import { aboutParagraphs, profile, services, skillCategories } from "../data/profile";

const About = () => {
  const iconsByTitle = {
    Frontend: <Globe size={20} />,
    "Backend & Databases": <Database size={20} />,
    "AI & APIs": <Cpu size={20} />,
    "Blockchain / Web3": <Link size={20} />,
    "Tools & DevOps": <Wrench size={20} />,
  };

  return (
    <section id="about" className="min-h-screen py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="ai-heading text-4xl md:text-5xl font-bold mb-12 dark:text-white text-slate-900"
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {/* Left - Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Profile Card */}
            <div className="glass dark:bg-black/30 bg-white/10 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6 dark:text-white text-slate-900">{profile.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-cyan-400" size={20} />
                  <span className="dark:text-gray-300 text-slate-700">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-cyan-400" size={20} />
                  <span className="dark:text-gray-300 text-slate-700">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="text-cyan-400" size={20} />
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark:text-gray-300 text-slate-700 hover:text-cyan-300 transition-colors"
                  >
                    github.com/{profile.githubHandle}
                  </a>
                </div>
              </div>

              <a
                href="/Resume.pdf"
                download="Emmanuel-Adejoh-CV.pdf"
                className="lg-btn mt-6 inline-flex items-center gap-2 px-6 py-3 text-white font-medium"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download size={18} />
                  Download CV
                </span>
              </a>
            </div>

            {/* Skills */}
            <div className="glass dark:bg-black/30 bg-white/10 rounded-2xl p-8">
              <h4 className="text-lg font-semibold mb-4 dark:text-white text-slate-900">Skills</h4>
              <div className="space-y-4">
                {skillCategories.map((category, i) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="rounded-xl border border-white/15 dark:border-white/10 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-cyan-400">{iconsByTitle[category.title]}</span>
                      <h5 className="font-semibold dark:text-white text-slate-900">{category.title}</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => (
                        <span
                          key={item}
                          className="neon-pill px-3 py-1 rounded-full text-xs font-medium bg-white/20 dark:bg-white/10 text-slate-800 dark:text-gray-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Services */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="glass dark:bg-black/30 bg-white/10 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-slate-900">Overview</h3>
              <div className="space-y-4">
                {aboutParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="dark:text-gray-300 text-slate-600 text-sm leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-6 dark:text-white text-slate-900">What I Do</h3>
            <div className="space-y-4">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="glass dark:bg-black/30 bg-white/10 rounded-xl p-6 hover:bg-white/15 dark:hover:bg-black/40 transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold mb-2 dark:text-white text-slate-900">{service.title}</h4>
                  <p className="dark:text-gray-400 text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

