import React from "react";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Terminal, 
  Waves, 
  ArrowUpRight 
} from "lucide-react";
import { useAccessibility } from "../../context/AccessibilityContext";

const ResourceCard = ({ title, description, href, icon: Icon, color, delay }) => {
  const { preferences } = useAccessibility();
  const shouldReduceMotion = preferences.mode === 'neurodiversity' || preferences.reducedMotion;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? {} : { y: -5 }}
      whileFocus={shouldReduceMotion ? {} : { scale: 1.05 }}
      aria-label={`Open ${title} in a new tab: ${description}`}
      className="relative group block p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 focus-visible:ring-4 focus-visible:ring-blue-600 outline-none"
    >
      <div 
        className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        aria-hidden="true"
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      <div className="flex justify-between items-start mb-2">
        <h2 className="text-24 font-bold text-zinc-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>

      <p className="text-zinc-600 leading-relaxed max-w-[280px]">
        {description}
      </p>

      <div className="mt-8 flex items-center text-sm font-semibold text-zinc-400 group-hover:text-blue-600 transition-colors">
        <span>Connect Now</span>
        <ExternalLink className="ml-2 w-4 h-4" />
      </div>
    </motion.a>
  );
};

const UserResource = () => {
  const resources = [
    {
      title: "BlueLab DevKit",
      description: "Comprehensive development toolkit with CLI commands, custom files, and sleek CSS utilities.",
      href: "https://dev.bluelabtech.space/",
      icon: Terminal,
      color: "bg-blue-600",
    },
    {
      title: "RepoWave",
      description: "The heartbeat of open source. Discover latest issues and start your contribution journey.",
      href: "https://www.repowave.space/",
      icon: Waves,
      color: "bg-indigo-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-6 sm:p-12 lg:p-20" role="main">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl sm:text-7xl font-black text-zinc-900 tracking-tighter mb-4"
          >
            HUB & RESOURCES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 font-medium max-w-2xl"
          >
            Power up your development workflow with our curated set of tools and community-driven platforms.
          </motion.p>
        </header>

        <section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          aria-label="Resources Grid"
        >
          {resources.map((res, index) => (
            <ResourceCard 
              key={res.title} 
              {...res} 
              delay={0.1 * (index + 1)} 
            />
          ))}
        </section>

        <footer className="mt-20 pt-10 border-t border-zinc-200">
          <p className="text-zinc-400 text-sm font-medium">
            &copy; 2026 BuildSpace Hub. Designed for maximum accessibility and performance.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default UserResource;

