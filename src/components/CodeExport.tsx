"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Download, Code2 } from "lucide-react";

interface CodeExportProps {
  data: any;
  variants: any;
}

export default function CodeExport({ data, variants }: CodeExportProps) {
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const colors = data.branding_colors || { primary: '#6366F1' };
    
    return `"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Target, Shield, Bot, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function GeneratedLandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              ${data.project_name?.charAt(0) || "P"}
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-gray-900">${data.project_name || "Startup"}</span>
          </div>
          <button className="bg-[${colors.primary}] px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-xl hover:scale-105 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-24 text-center max-w-6xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-100/30 rounded-full blur-[140px] -z-10" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-2xl">
            <Sparkles size={14} className="text-indigo-400" /> Premium AI Architecture
          </div>
          <h1 className="text-7xl md:text-[90px] font-black tracking-tighter text-gray-900 mb-10 leading-[0.9] max-w-5xl mx-auto uppercase">
            ${data.tagline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            ${data.solution}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="bg-[${colors.primary}] px-12 py-6 rounded-2xl text-xl font-black text-white shadow-2xl flex items-center gap-4">
              START BUILDING <ArrowRight />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          ${data.core_features?.map((f: string, i: number) => `
          <div key={${i}} className="group p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-2xl">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-8 shadow-sm">
              {${i === 0 ? '<Zap size={32} />' : i === 1 ? '<Target size={32} />' : '<Shield size={32} />'}}
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">${f}</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Enterprise-grade implementation of ${f.toLowerCase()} tailored for your specific scale.</p>
          </div>`).join('')}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm font-bold">© 2026 ${data.project_name}. All rights reserved.</p>
          <div className="flex gap-8 text-gray-400 text-sm font-bold uppercase tracking-widest">
             <span>Twitter</span><span>LinkedIn</span><span>GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generateCode()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "LandingPage.tsx";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 bg-[#252526] border-b border-white/5">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
               <Code2 size={20} />
            </div>
            <h2 className="text-white font-bold tracking-tight">Source Code Export</h2>
            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 font-mono">React + Tailwind</span>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all border border-white/5"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
            >
              <Download size={14} />
              Download .tsx
            </button>
         </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <SyntaxHighlighter 
          language="typescript" 
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '2rem',
            fontSize: '13px',
            lineHeight: '1.6',
            backgroundColor: 'transparent'
          }}
        >
          {generateCode()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
