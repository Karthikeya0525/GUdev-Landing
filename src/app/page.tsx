"use client";

import { useState, useEffect, Suspense } from "react";
import { PromptInput } from "@/components/PromptInput";
import Workspace from "@/components/Workspace";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LayoutTemplate, Sparkles, CheckCircle2, Users, Settings, Zap, Shield, Rocket, Bot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

function HomeContent() {
  const [step, setStep] = useState<'input' | 'workspace'>('input');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const searchParams = useSearchParams();
  const templatePrompt = searchParams.get('prompt') || undefined;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-trigger generation if prompt is in URL (from Deep Dive)
  useEffect(() => {
    if (templatePrompt && step === 'input' && !data && !loading) {
      handleGenerate(templatePrompt);
    }
  }, [templatePrompt, step, data, loading]);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setGenerationId(result.id);

        // Save project if user is logged in
        if (user) {
          await supabase.from('projects').insert([{
            user_id: user.id,
            name: result.data.project_name,
            prompt: prompt,
            data: result.data
          }]);
        }

        setStep('workspace');
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate PRD");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setData(null);
  };

  const handleRegenerate = () => {
    if (confirm("Regenerating will lose current edits. Continue?")) {
      setStep('input');
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden font-sans bg-[#FBFBFE]">
      {/* 🎭 PREMIUM BACKGROUND ORNAMENTATION */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-t-2 border-b-2 border-indigo-600 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Bot className="w-10 h-10 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Orchestrating Agents</h3>
               <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mt-2">Finalizing Digital Strategy...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col relative z-10 min-h-screen"
          >
            {/* Unified Premium Header */}
            <header className="px-6 md:px-12 py-4 flex justify-between items-center w-full border-b border-white/20 bg-white/60 backdrop-blur-3xl fixed top-0 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <div className="w-10 h-10 bg-gray-900 hover:bg-black transition-colors rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-gray-900/10 border border-gray-800 cursor-pointer">
                    U
                  </div>
                </Link>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold tracking-tight text-gray-900">Agentic UX</h1>
                </div>
              </div>
              <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600 items-center">
                <Link href="/templates" className="hover:text-black transition-colors flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4" /> Templates
                </Link>
                <Link href="/research" className="hover:text-black transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Deep Dive
                </Link>

              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 hidden lg:block">{user.email}</span>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="text-sm font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsAuthOpen(true)} className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-black">
                    Sign In
                  </button>
                )}
                <Link href="/dashboard" className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-black transition-all hover:scale-105 active:scale-95">
                  {user ? "Dashboard" : "Get Started"}
                </Link>
              </div>
            </header>

            {/* Elite Hero Section */}
            <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto w-full text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-indigo-100/30 to-purple-100/20 rounded-full blur-[150px] -z-10"></div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Floating Lab Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-10 shadow-lg shadow-indigo-500/5 ring-1 ring-black/5"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Agentic Discovery Lab v4.0
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tight text-gray-900 leading-[0.9] mb-10 uppercase">
                   Architect Your <br />
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600">
                    Digital Empire.
                   </span>
                </h1>

                <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium mb-16 tracking-tight">
                  The first AI-native design engine that transforms raw intent into professional PRDs and production-ready React ecosystems.
                </p>

                {/* Agentic Generator Input - Enhanced */}
                <div className="max-w-4xl mx-auto mb-24 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Decorative Floaters */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-12 -left-12 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 hidden lg:block"
                  >
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -bottom-8 -right-12 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 hidden lg:block"
                  >
                    <Bot className="w-6 h-6 text-indigo-500" />
                  </motion.div>

                  <div className="relative bg-white/70 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-white/50">
                    <PromptInput onSubmit={handleGenerate} isLoading={loading} initialValue={templatePrompt} />
                  </div>
                </div>

                {/* Elite Social Proof */}
                <div className="pt-16 border-t border-gray-100/80 max-w-5xl mx-auto">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12">POWERING THE NEXT UNICORNS</p>
                  <div className="flex flex-wrap justify-center gap-16 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <span className="font-black text-3xl tracking-tighter uppercase">Nexus</span>
                    <span className="font-black text-3xl tracking-tighter uppercase">Quantum</span>
                    <span className="font-black text-3xl tracking-tighter uppercase">Aether</span>
                    <span className="font-black text-3xl tracking-tighter uppercase">Loom</span>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Disruptive Value: The Command Center */}
            <section className="py-32 px-6 bg-gray-900 text-white relative overflow-hidden border-y border-gray-800">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-indigo-500/30">
                      System Transparency
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">Beyond simple prompts.</h2>
                    <p className="text-gray-400 text-xl font-medium leading-relaxed mb-12 max-w-xl">
                      While others give you a template, we deploy a **Swarm of 9 Agents** that argue, refine, and validate every design choice before you see it.
                    </p>
                    <div className="space-y-6">
                      <BenefitLine title="Contextual Reasoning" desc="Agents analyze market trends specific to your startup's niche." />
                      <BenefitLine title="Cross-Agent Validation" desc="Design agents verify that the developer agent can implement the UI." />
                      <BenefitLine title="Automated PRD Synthesis" desc="Extract deep documentation from just a single sentence." />
                    </div>
                  </div>
                  <div className="lg:w-1/2 w-full">
                    {/* The Command Console UI */}
                    <div className="bg-[#1e1e1e] rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden aspect-video relative group">
                      <div className="absolute top-0 inset-x-0 h-10 bg-black/40 backdrop-blur-md flex items-center px-6 justify-between border-b border-gray-800">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Agentic_Orchestrator_v2.log</span>
                      </div>
                      <div className="p-8 pt-16 font-mono text-[11px] space-y-3 custom-scrollbar h-full overflow-y-auto">
                        <div className="text-emerald-400">[SYSTEM] Initialization of 9-Stage Engine...</div>
                        <div className="text-indigo-400">[STRATEGIST] Analyzing market gap for ${data?.project_name || 'Project'}...</div>
                        <div className="text-gray-500">[ARCHITECT] Drafting layout_pattern: saas_landing</div>
                        <div className="text-gray-500">[DESIGNER] Selecting primary palette: #6366f1 (Indigo Elite)</div>
                        <div className="text-rose-400">[VALIDATOR] Conflict detected: Typography vs Contrast...</div>
                        <div className="text-emerald-400">[VALIDATOR] Fixed. Contrast ratio optimized to 7.2:1</div>
                        <div className="text-indigo-400">[CODER] Generating React components for Hero_v3...</div>
                        <div className="text-gray-500">[SYSTEM] All 9 agents synchronized. Preview Ready.</div>
                        <div className="mt-6 flex justify-center">
                          <div className="px-6 py-3 bg-indigo-600 rounded-full font-black text-white text-[10px] tracking-widest uppercase animate-pulse">
                            LIVE ORCHESTRATION IN PROGRESS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* System Architecture Section */}
            <section id="architecture" className="py-32 bg-white px-6 border-y border-gray-100 relative">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">The 9-Stage Agentic Engine</h2>
                  <p className="text-gray-500 text-xl max-w-3xl mx-auto font-medium">
                    Our multi-agent pipeline orchestrates the entire lifecycle from initial idea to production-ready code and design assets.
                  </p>
                </div>

                <div className="relative w-full h-[600px] md:h-[800px] max-w-[800px] mx-auto flex items-center justify-center border-2 border-dashed border-gray-50 rounded-full">

                  {/* SVG Background Connections */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 800" fill="none">
                    <circle cx="400" cy="400" r="180" stroke="#6366f1" strokeWidth="2" strokeDasharray="8 8" />
                    {/* Radial lines from center */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1="400" y1="400"
                        x2={400 + 280 * Math.cos((angle * Math.PI) / 180)}
                        y2={400 + 280 * Math.sin((angle * Math.PI) / 180)}
                        stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4"
                      />
                    ))}
                  </svg>

                  {/* Core Node */}
                  <div className="relative z-30 w-48 h-48 md:w-64 md:h-64 bg-gray-900 rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-gray-800 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-500/40">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-1">Agentic UX</h3>
                    <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">AI Pipeline System</p>
                  </div>

                  {/* Surrounding Agents/Nodes */}
                  {[
                    { title: "User", sub: "Founder / Designer / PM", color: "bg-emerald-50 text-emerald-900 border-emerald-200", angle: 270, label: "Idea Input / Approval" },
                    { title: "Stakeholders", sub: "Receive PRD export", color: "bg-amber-50 text-amber-900 border-amber-200", angle: 315, label: "PRD Export" },
                    { title: "File Storage", sub: "Artifacts + Assets", color: "bg-indigo-50 text-indigo-900 border-indigo-200", angle: 0, label: "Save/Retrieve" },
                    { title: "Design Team", sub: "Receives UI assets", color: "bg-rose-50 text-rose-900 border-rose-200", angle: 45, label: "UI Visuals" },
                    { title: "Developer", sub: "Receives code output", color: "bg-teal-50 text-teal-900 border-teal-200", angle: 90, label: "React + Tailwind" },
                    { title: "Mobile Device", sub: "AR Preview (Optional)", color: "bg-red-50 text-red-900 border-red-200", angle: 135, label: "WebXR Scene" },
                    { title: "LLM API", sub: "Claude / GPT-4", color: "bg-blue-50 text-blue-900 border-blue-200", angle: 180, label: "Agent Prompts" },
                    { title: "PRD Document", sub: "User-uploaded input", color: "bg-orange-50 text-orange-900 border-orange-200", angle: 225, label: "Upload PRD" }
                  ].map((node, i) => {
                    const radius = 280; // Safer radius
                    const x = radius * Math.cos((node.angle * Math.PI) / 180);
                    const y = radius * Math.sin((node.angle * Math.PI) / 180);

                    return (
                      <div
                        key={i}
                        className="absolute z-20 flex flex-col items-center"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl border shadow-lg text-center min-w-[140px] md:min-w-[180px] ${node.color}`}>
                          <h4 className="font-bold text-[10px] md:text-sm uppercase tracking-wide">{node.title}</h4>
                          <p className="text-[9px] md:text-[10px] font-medium opacity-70 mt-1">{node.sub}</p>
                        </div>
                        <div className="mt-2 px-2 py-1 bg-white border border-gray-100 rounded-full shadow-sm text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                          {node.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mb-16">
                  <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">Orchestration Layer</h2>
                  <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 uppercase leading-[0.85]">
                    Meet your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Swarm.</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <AgentCard 
                    name="The Strategist" 
                    role="Market & Product Fit" 
                    desc="Analyzes 2M+ market data points to ensure your product solves a real-world problem."
                    color="bg-blue-500"
                  />
                  <AgentCard 
                    name="The Chromatician" 
                    role="Visual Identity" 
                    desc="Generates accessible, high-conversion color palettes based on psychological triggers."
                    color="bg-purple-500"
                  />
                  <AgentCard 
                    name="The Architect" 
                    role="Structural Logic" 
                    desc="Designs the underlying information architecture and user flow hierarchies."
                    color="bg-emerald-500"
                  />
                  <AgentCard 
                    name="The Component Engineer" 
                    role="React Implementation" 
                    desc="Synthesizes production-ready Tailwind and React components with atomic precision."
                    color="bg-orange-500"
                  />
                  <AgentCard 
                    name="The Quality Validator" 
                    role="Conflict Resolution" 
                    desc="Acts as a senior peer-reviewer, arguing against design flaws before you see them."
                    color="bg-rose-500"
                  />
                  <AgentCard 
                    name="The SEO Alchemist" 
                    role="Growth Optimization" 
                    desc="Injects semantic HTML and meta-layer intelligence for organic search dominance."
                    color="bg-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* New: The "15-Scene" Efficiency Timeline */}
            <section className="py-32 px-6 bg-gray-50/50">
              <div className="max-w-5xl mx-auto">
                 <div className="flex flex-col gap-24">
                    <TimelineStep 
                      number="01" 
                      title="Intent Extraction" 
                      desc="We don't just take your prompt; we interpret your vision and fill in the strategic gaps." 
                    />
                    <TimelineStep 
                      number="02" 
                      title="Agentic Argument" 
                      desc="Our agents deliberate in a recursive loop to optimize the UI/UX for maximum engagement." 
                      active
                    />
                    <TimelineStep 
                      number="03" 
                      title="Production Synthesis" 
                      desc="Zero placeholders. We deliver high-fidelity designs and clean code in under 30 seconds." 
                    />
                 </div>
              </div>
            </section>

            {/* New: Enterprise FAQ */}
            <section className="py-32 px-6 bg-white">
               <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl font-black tracking-tight mb-16 text-center uppercase">Common Intelligence Queries</h2>
                  <div className="space-y-8">
                     <FAQItem 
                       q="How is this different from basic AI builders?" 
                       a="Standard AI builders use a single prompt. We use an orchestrator that manages 9 specialized agents that critique and refine each other's work." 
                     />
                     <FAQItem 
                       q="Can I export the code to my own servers?" 
                       a="Yes. Every generation provides a clean, production-ready React/Tailwind export that you can deploy anywhere." 
                     />
                     <FAQItem 
                       q="Is the design really unique?" 
                       a="Every palette, layout, and component is generated from scratch based on your startup's specific persona and goals." 
                     />
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-24 px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                 <div className="max-w-sm">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl mb-6 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">A</div>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                      Agentic UX is the world's first multi-agent design ecosystem. We don't build websites; we build autonomous product teams.
                    </p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                    <FooterColumn title="Platform" links={['Engine', 'Agents', 'Dashboard', 'Pricing']} />
                    <FooterColumn title="Resources" links={['Documentation', 'API', 'Community', 'Research']} />
                    <FooterColumn title="Legal" links={['Privacy', 'Terms', 'Security']} />
                 </div>
              </div>
              <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-gray-800 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                 © 2026 Agentic UX — The Future of Product Design
              </div>
            </footer>

          </motion.div>
        )}

        {step === 'workspace' && data && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full relative z-10 bg-white"
          >
            <Workspace
              initialData={data}
              generationId={generationId}
              onReset={handleReset}
              onRegenerate={handleRegenerate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <HomeContent />
    </Suspense>
  );
}

function BenefitLine({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 text-left">
      <div className="shrink-0 w-6 h-6 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
        <CheckCircle2 size={14} className="text-indigo-400" />
      </div>
      <div>
        <h4 className="font-bold text-gray-100 mb-1">{title}</h4>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function AgentCard({ name, role, desc, color }: { name: string, role: string, desc: string, color: string }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
      <div className={`w-12 h-12 ${color} rounded-2xl mb-6 shadow-lg shadow-indigo-100 flex items-center justify-center text-white`}>
        <Bot size={24} />
      </div>
      <h4 className="text-xl font-bold mb-1 text-gray-900">{name}</h4>
      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">{role}</p>
      <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function TimelineStep({ number, title, desc, active }: { number: string, title: string, desc: string, active?: boolean }) {
  return (
    <div className="flex gap-8 md:gap-16 items-start">
      <div className={cn(
        "text-6xl md:text-8xl font-black tracking-tighter shrink-0",
        active ? "text-indigo-600" : "text-gray-200"
      )}>
        {number}
      </div>
      <div className="pt-4">
        <h4 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 uppercase">{title}</h4>
        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-xl">{desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 pb-8 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-900">{q}</h4>
        <div className={cn("transition-transform duration-300", isOpen ? "rotate-45" : "")}>
          <Rocket size={20} className="text-indigo-500" />
        </div>
      </div>
      {isOpen && (
        <p className="text-gray-500 font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {a}
        </p>
      )}
    </div>
  );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div>
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">{title}</h4>
      <ul className="space-y-4 text-sm font-bold text-gray-400">
        {links.map(l => (
          <li key={l} className="hover:text-white cursor-pointer transition-colors">{l}</li>
        ))}
      </ul>
    </div>
  );
}

