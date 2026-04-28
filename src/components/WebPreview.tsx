"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowRight, Shield, Zap, Target, Rocket, LayoutDashboard, 
  Users, Settings, Search, ShoppingBag, Menu, Home, 
  Compass, User, CreditCard, RefreshCw, Palette, Layers,
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Bot, X, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebPreviewProps {
  data: any;
}

/**
 * PREMIUM COMPONENT-BASED WEB PREVIEW
 * Allows cycling through variants for each section independently.
 */
export default function WebPreview({ data }: WebPreviewProps) {
  const [variants, setVariants] = useState({
    hero: 0,
    features: 0,
    audience: 0,
    cta: 0,
    footer: 0
  });
  const [showIntel, setShowIntel] = useState(false);

  if (!data) return null;

  const colors = data.branding_colors || {
    primary: '#6366F1',
    secondary: '#A855F7',
    background: '#FFFFFF',
    text: '#111827'
  };

  const cycleVariant = (section: keyof typeof variants) => {
    setVariants(prev => ({
      ...prev,
      [section]: (prev[section] + 1) % 3 
    }));
  };

  return (
    <div className="w-full bg-white text-gray-900 font-sans selection:bg-indigo-100 overflow-y-auto h-full scroll-smooth relative">
      
      {/* 🧠 DESIGN INTELLIGENCE SIDEBAR */}
      <AnimatePresence>
        {showIntel && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowIntel(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[400px] bg-white z-[70] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] border-l border-gray-100 p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight">Design Intelligence</h3>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Orchestration Rationale</p>
                    </div>
                  </div>
                  <button onClick={() => setShowIntel(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={20}/></button>
               </div>

               <div className="space-y-10">
                  <IntelBlock 
                    icon={<Layers className="text-indigo-600" />} 
                    title="Layout Strategy" 
                    desc={`The ${data.design_system?.layout_pattern || 'SaaS Landing'} pattern was chosen to maximize conversion for ${data.target_audience?.[0]}.`}
                  />
                  <IntelBlock 
                    icon={<Palette className="text-rose-600" />} 
                    title="Chromatic Architecture" 
                    desc={`A ${colors.primary} primary was selected to evoke trust and high-performance energy, contrasted with ${colors.text} for elite readability.`}
                  />
                  <IntelBlock 
                    icon={<Smartphone className="text-emerald-600" />} 
                    title="Component Logic" 
                    desc="We've implemented modular bento grids to ensure information density remains readable across all device sizes."
                  />
                  
                  <div className="pt-10 border-t border-gray-100">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">SYSTEM STATUS</p>
                     <div className="space-y-2">
                        <StatusLine label="Persona Alignment" active />
                        <StatusLine label="Accessibility (WCAG)" active />
                        <StatusLine label="Mobile Optimization" active />
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              {data.project_name?.charAt(0) || "P"}
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-gray-900">{data.project_name || "Startup"}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#audience" className="hover:text-black transition-colors">Audience</a>
            <button 
              onClick={() => setShowIntel(true)}
              className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              <Bot size={14} /> AI Intel
            </button>
          </div>
          <button 
            style={{ backgroundColor: colors.primary }} 
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-all shadow-indigo-500/20"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* SECTIONS */}
      <SectionWrapper onCycle={() => cycleVariant('hero')} label="Hero Style">
        <HeroSection data={data} variant={variants.hero} colors={colors} />
      </SectionWrapper>

      <SectionWrapper onCycle={() => cycleVariant('features')} label="Features Layout">
        <FeaturesSection data={data} variant={variants.features} colors={colors} />
      </SectionWrapper>

      <SectionWrapper onCycle={() => cycleVariant('audience')} label="Audience Block">
        <AudienceSection data={data} variant={variants.audience} colors={colors} />
      </SectionWrapper>

      <SectionWrapper onCycle={() => cycleVariant('cta')} label="CTA Style">
        <CTASection data={data} variant={variants.cta} colors={colors} />
      </SectionWrapper>

      <SectionWrapper onCycle={() => cycleVariant('footer')} label="Footer Layout">
        <FooterSection data={data} variant={variants.footer} colors={colors} />
      </SectionWrapper>
    </div>
  );
}

// -------------------------------------------------------------------------
// SECTION WRAPPERS & UTILS
// -------------------------------------------------------------------------

function SectionWrapper({ children, onCycle, label }: { children: React.ReactNode, onCycle: () => void, label: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group/section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Variant Selector Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 z-40 flex items-center gap-2"
          >
            <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{label}</span>
              <button 
                onClick={onCycle}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <RefreshCw size={14} className="group-active:rotate-180 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

// -------------------------------------------------------------------------
// HERO VARIANTS
// -------------------------------------------------------------------------

function HeroSection({ data, variant, colors }: { data: any, variant: number, colors: any }) {
  if (variant === 0) return <HeroV1 data={data} colors={colors} />;
  if (variant === 1) return <HeroV2 data={data} colors={colors} />;
  return <HeroV3 data={data} colors={colors} />;
}

function HeroV1({ data, colors }: { data: any, colors: any }) {
  return (
    <section className="px-6 pt-32 pb-24 text-center max-w-6xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-100/30 rounded-full blur-[140px] -z-10" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-2xl">
          <Sparkles size={14} className="text-indigo-400" /> Premium AI Architecture
        </div>
        <h1 className="text-7xl md:text-[100px] font-black tracking-tighter text-gray-900 mb-10 leading-[0.9] max-w-5xl mx-auto">
          {data.tagline || "The future of automation is here."}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
          {data.solution}
        </p>
        
        {/* Elite Device Mockup */}
        <div className="relative max-w-5xl mx-auto mb-20 group">
           <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
           <div className="relative bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden aspect-video">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" className="w-full h-full object-cover" alt="Dashboard" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button style={{ backgroundColor: colors.primary }} className="px-12 py-6 rounded-2xl text-xl font-black text-white hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(99,102,241,0.3)] flex items-center gap-4">
            START BUILDING <ArrowRight />
          </button>
          <button className="px-12 py-6 rounded-2xl text-xl font-black text-gray-900 border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-4">
            VIEW CASE STUDIES
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function HeroV2({ data, colors }: { data: any, colors: any }) {
  return (
    <section className="px-6 pt-40 pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-8 leading-none uppercase">
          {data.tagline || "Work Smarter."}
        </h1>
        <div className="w-24 h-2 bg-indigo-600 mb-8" />
        <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-xl font-semibold">
          {data.solution}
        </p>
        <div className="flex gap-4">
          <button style={{ backgroundColor: colors.primary }} className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl hover:opacity-90">
            Join the Waitlist
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative aspect-square bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl border border-gray-800 p-12 flex flex-col justify-end"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
        <div className="relative z-10">
           <div className="text-indigo-400 font-bold mb-2">LIVE METRICS</div>
           <div className="text-6xl font-bold text-white tracking-tighter mb-4">99.9%</div>
           <p className="text-gray-400 font-medium">Efficiency boost reported by current users.</p>
        </div>
      </motion.div>
    </section>
  );
}

function HeroV3({ data, colors }: { data: any, colors: any }) {
  return (
    <section className="px-6 py-32 bg-gray-900 text-white relative overflow-hidden">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
       <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h1 className="text-6xl md:text-9xl font-black tracking-tight mb-10 leading-none">
              {data.project_name?.toUpperCase() || "STARTUP"}
            </h1>
            <p className="text-2xl md:text-3xl text-indigo-400 font-bold mb-16 max-w-4xl mx-auto leading-tight italic">
              "{data.tagline}"
            </p>
            <div className="flex justify-center">
               <button className="bg-white text-gray-900 px-12 py-5 rounded-full font-black text-xl hover:bg-indigo-50 transition-colors shadow-2xl flex items-center gap-3">
                 ENTER WORKSPACE <ChevronRight />
               </button>
            </div>
          </motion.div>
       </div>
    </section>
  );
}

// -------------------------------------------------------------------------
// FEATURE VARIANTS
// -------------------------------------------------------------------------

function FeaturesSection({ data, variant, colors }: { data: any, variant: number, colors: any }) {
  const features = data.core_features || [];
  if (variant === 0) return <FeaturesV1 features={features} colors={colors} />;
  if (variant === 1) return <FeaturesV2 features={features} colors={colors} />;
  return <FeaturesV3 features={features} colors={colors} />;
}

function FeaturesV1({ features, colors }: { features: string[], colors: any }) {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto bg-white">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for Excellence</h2>
        <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">Everything you need to scale your product in one place.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i} className="group p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-2xl">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
              {i === 0 ? <Zap size={32} /> : i === 1 ? <Target size={32} /> : <Shield size={32} />}
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">{f}</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Enterprise-grade implementation of {f.toLowerCase()} tailored for your specific scale.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesV2({ features, colors }: { features: string[], colors: any }) {
  return (
    <section className="py-32 px-6 bg-gray-50">
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-bold mb-8">Core Capabilities</h2>
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                   <div className="shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{i+1}</div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">{f}</h3>
                     <p className="text-gray-500 text-sm font-medium">Optimized for high-performance workflows.</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-[3rem] p-12 flex flex-col justify-center text-center text-white shadow-2xl">
             <Bot size={80} className="mx-auto mb-8 text-indigo-400" />
             <h3 className="text-3xl font-bold mb-4">Autonomous Logic</h3>
             <p className="text-gray-400 leading-relaxed font-medium">Our agents handle the heavy lifting while you focus on the vision.</p>
          </div>
       </div>
    </section>
  );
}

function FeaturesV3({ features, colors }: { features: string[], colors: any }) {
  return (
    <section className="py-32 px-6">
       <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {features.map((f, i) => (
                <div key={i} className="aspect-square p-8 bg-indigo-600 text-white rounded-[2rem] flex flex-col justify-between hover:bg-indigo-700 transition-colors">
                   <LayoutDashboard size={40} />
                   <h3 className="text-xl font-bold leading-tight">{f}</h3>
                </div>
             ))}
             <div className="aspect-square p-8 bg-gray-900 text-white rounded-[2rem] flex flex-col justify-center items-center text-center border-4 border-indigo-600">
                <span className="text-4xl font-bold mb-2">10x</span>
                <span className="text-xs font-bold tracking-widest opacity-60">SPEED BOOST</span>
             </div>
          </div>
       </div>
    </section>
  );
}

// -------------------------------------------------------------------------
// AUDIENCE VARIANTS
// -------------------------------------------------------------------------

function AudienceSection({ data, variant, colors }: { data: any, variant: number, colors: any }) {
  const audience = data.target_audience || [];
  return (
    <section id="audience" className="py-32 px-6 bg-white border-y border-gray-100">
       <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
             <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">Designed for the world's most <span className="text-indigo-600">ambitious</span> teams.</h2>
                <div className="space-y-4">
                  {audience.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-xl font-bold text-gray-700">
                      <CheckCircle2 className="text-emerald-500" /> {a}
                    </div>
                  ))}
                </div>
             </div>
             <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <div className="h-48 bg-gray-50 rounded-3xl border border-gray-100 p-8 flex flex-col justify-end">
                  <p className="text-3xl font-bold mb-1">500+</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Early Adopters</p>
                </div>
                <div className="h-48 bg-gray-900 text-white rounded-3xl p-8 flex flex-col justify-end shadow-2xl">
                  <p className="text-3xl font-bold mb-1">24/7</p>
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Active Support</p>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
}

// -------------------------------------------------------------------------
// CTA VARIANTS
// -------------------------------------------------------------------------

function CTASection({ data, variant, colors }: { data: any, variant: number, colors: any }) {
  return (
    <section id="cta" className="py-32 px-6">
       <div style={{ backgroundColor: colors.primary }} className="max-w-7xl mx-auto rounded-[3.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight">Ready to transform your vision?</h2>
            <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-medium">Join thousands of teams building the next generation of products with {data.project_name}.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl">Start Building</button>
               <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all">Schedule Demo</button>
            </div>
          </div>
       </div>
    </section>
  );
}

// -------------------------------------------------------------------------
// FOOTER VARIANTS
// -------------------------------------------------------------------------

function FooterSection({ data, variant, colors }: { data: any, variant: number, colors: any }) {
  return (
    <footer className="py-24 px-6 border-t border-gray-100 bg-white">
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">{data.project_name?.charAt(0)}</div>
               <span className="font-bold text-2xl tracking-tighter">{data.project_name}</span>
             </div>
             <p className="text-gray-500 max-w-sm font-medium leading-relaxed">{data.tagline}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-8 text-gray-400">Product</h4>
            <ul className="space-y-4 font-bold text-gray-600">
               <li className="hover:text-black cursor-pointer">Features</li>
               <li className="hover:text-black cursor-pointer">Security</li>
               <li className="hover:text-black cursor-pointer">Enterprise</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-8 text-gray-400">Company</h4>
            <ul className="space-y-4 font-bold text-gray-600">
               <li className="hover:text-black cursor-pointer">About</li>
               <li className="hover:text-black cursor-pointer">Press</li>
               <li className="hover:text-black cursor-pointer">Careers</li>
            </ul>
          </div>
       </div>
       <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm font-bold">© 2026 {data.project_name}. All rights reserved.</p>
          <div className="flex gap-8 text-gray-400 text-sm font-bold">
             <span>Twitter</span><span>LinkedIn</span><span>GitHub</span>
          </div>
       </div>
    </footer>
  );
}

function IntelBlock({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StatusLine({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-bold text-gray-600 tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-emerald-600 uppercase">Optimized</span>
      </div>
    </div>
  );
}

