"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowRight, Shield, Zap, Target, Rocket, LayoutDashboard, 
  Users, Settings, Search, ShoppingBag, Menu, Home, 
  Compass, User, CreditCard, RefreshCw, Palette, Layers,
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Bot, X, Smartphone, Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebPreviewProps {
  data: any;
  isStitchMode?: boolean;
  onStitch?: (section: string, prompt: string) => void;
}

/**
 * PREMIUM COMPONENT-BASED WEB PREVIEW
 * Allows cycling through variants for each section independently.
 */
export default function WebPreview({ data, isStitchMode, onStitch }: WebPreviewProps) {
  const [variants, setVariants] = useState({
    hero: 0,
    features: 0,
    audience: 0,
    cta: 0,
    footer: 0
  });
  const [showIntel, setShowIntel] = useState(false);
  const [stitchingSection, setStitchingSection] = useState<string | null>(null);
  const [stitchPrompt, setStitchPrompt] = useState("");
  const [viewportMode, setViewportMode] = useState<'web' | 'mobile'>('web');

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
    <div className="w-full bg-[#fbfbfb] text-gray-900 font-sans selection:bg-indigo-100 overflow-y-auto h-full scroll-smooth relative custom-scrollbar">
      {/* 🎨 CANVAS GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
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
                    title={`UX Strategy: ${data.ux_strategy?.primary_goal || 'Conversion'}`} 
                    desc={data.ux_strategy?.rationale || `The ${data.design_system?.layout_pattern || 'SaaS Landing'} pattern was chosen to maximize conversion for ${data.target_audience?.[0]}.`}
                  />
                  <IntelBlock 
                    icon={<Palette className="text-rose-600" />} 
                    title={`Color Theory: ${data.color_theory?.palette_type || 'Custom'}`} 
                    desc={data.color_theory?.rationale || `A ${colors.primary} primary was selected to evoke trust and high-performance energy, contrasted with ${colors.text} for elite readability.`}
                  />
                  <IntelBlock 
                    icon={<Bot className="text-indigo-600" />} 
                    title="Psychological Triggers" 
                    desc={`This design leverages ${data.ux_strategy?.psychological_triggers?.join(', ') || 'Trust and Clarity'} to engage users at a cognitive level.`}
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

      {/* 🧵 STITCH DIALOG */}
      <AnimatePresence>
        {stitchingSection && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setStitchingSection(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border border-gray-100 p-10"
            >
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <RefreshCw size={24} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight">Stitch Section</h3>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Refining {stitchingSection}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Describe how you want to transform this {stitchingSection} section. Our agents will re-orchestrate the design and logic.
                  </p>
                  <textarea 
                    value={stitchPrompt}
                    onChange={(e) => setStitchPrompt(e.target.value)}
                    placeholder="e.g., 'Make it more minimalist with larger typography' or 'Add a secondary CTA button'..."
                    className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        onStitch?.(stitchingSection, stitchPrompt);
                        setStitchingSection(null);
                        setStitchPrompt("");
                      }}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                      Re-Stitch Now
                    </button>
                    <button 
                      onClick={() => setStitchingSection(null)}
                      className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
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
            
            {/* Viewport Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setViewportMode('web')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewportMode === 'web' ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setViewportMode('mobile')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewportMode === 'mobile' ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Smartphone size={16} />
              </button>
            </div>

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

      {/* VIEWPORT CONTAINER */}
      <div className={cn(
        "w-full transition-all duration-700 ease-in-out",
        viewportMode === 'mobile' ? "max-w-[375px] mx-auto border-x-8 border-gray-900 rounded-[3rem] my-10 shadow-2xl overflow-hidden min-h-[812px]" : "max-w-full"
      )}>
        {/* SECTIONS */}
        <SectionWrapper onCycle={() => cycleVariant('hero')} onStitch={() => setStitchingSection('hero')} label="Hero Style" isStitchMode={isStitchMode} viewportMode={viewportMode} setShowIntel={setShowIntel}>
          <HeroSection data={data} variant={variants.hero} colors={colors} />
        </SectionWrapper>

        <SectionWrapper onCycle={() => cycleVariant('features')} onStitch={() => setStitchingSection('features')} label="Features Layout" isStitchMode={isStitchMode} viewportMode={viewportMode} setShowIntel={setShowIntel}>
          <FeaturesSection data={data} variant={variants.features} colors={colors} />
        </SectionWrapper>

        <SectionWrapper onCycle={() => cycleVariant('audience')} onStitch={() => setStitchingSection('audience')} label="Audience Block" isStitchMode={isStitchMode} viewportMode={viewportMode} setShowIntel={setShowIntel}>
          <AudienceSection data={data} variant={variants.audience} colors={colors} />
        </SectionWrapper>

        <SectionWrapper onCycle={() => cycleVariant('cta')} onStitch={() => setStitchingSection('cta')} label="CTA Style" isStitchMode={isStitchMode} viewportMode={viewportMode} setShowIntel={setShowIntel}>
          <CTASection data={data} variant={variants.cta} colors={colors} />
        </SectionWrapper>

        <SectionWrapper onCycle={() => cycleVariant('footer')} onStitch={() => setStitchingSection('footer')} label="Footer Layout" isStitchMode={isStitchMode} viewportMode={viewportMode} setShowIntel={setShowIntel}>
          <FooterSection data={data} variant={variants.footer} colors={colors} />
        </SectionWrapper>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// SECTION WRAPPERS & UTILS
// -------------------------------------------------------------------------

function SectionWrapper({ children, onCycle, onStitch, label, isStitchMode, viewportMode, setShowIntel }: { 
  children: React.ReactNode, 
  onCycle: () => void, 
  onStitch?: () => void,
  label: string,
  isStitchMode?: boolean,
  viewportMode?: 'web' | 'mobile',
  setShowIntel?: (show: boolean) => void
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group/section transition-all duration-500",
        viewportMode === 'web' && "max-w-7xl mx-auto my-8 rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden",
        isStitchMode && "ring-4 ring-indigo-500/30 ring-inset z-10 scale-[1.01]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Variant Selector Overlay */}
      <AnimatePresence>
        {(isHovered || isStitchMode) && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 z-40 flex items-center gap-2"
          >
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{label}</span>
              
              {!isStitchMode && (
                <button 
                  onClick={onCycle}
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  <RefreshCw size={14} className="group-active:rotate-180 transition-transform" />
                </button>
              )}

              {isStitchMode && (
                <button 
                  onClick={onStitch}
                  className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-[10px] font-black uppercase tracking-tighter"
                >
                  <Sparkles size={14} /> Stitch
                </button>
              )}

              <button 
                onClick={() => setShowIntel?.(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg text-[10px] font-black uppercase tracking-tighter"
              >
                <Bot size={14} /> Why?
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stitch Mode Hint */}
      {isStitchMode && !isHovered && (
        <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none border-2 border-indigo-500/10 rounded-sm" />
      )}

      {children}
    </motion.div>
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
              <img 
                src={`https://source.unsplash.com/featured/?${data.project_name?.replace(/\s/g, '+')},technology,abstract`} 
                className="w-full h-full object-cover" 
                alt="Dashboard" 
              />
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
       {/* 🎥 PREMIUM VIDEO BACKGROUND */}
       <div className="absolute inset-0 opacity-40">
          <video 
            autoPlay muted loop playsInline 
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-background-30043-preview.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900" />
       </div>
       
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
    <section className="px-6 py-32 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Built for Scale</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">Explore our high-performance feature set engineered for modern enterprises.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
           {/* Primary Bento Card */}
           <div className="md:col-span-2 md:row-span-2 bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group min-h-[300px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] group-hover:bg-indigo-600/40 transition-colors" />
              <Zap className="w-12 h-12 text-indigo-400 mb-6" />
              <h3 className="text-3xl font-bold mb-4">{features[0] || 'Real-time Sync'}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">Experience zero-latency orchestration across your entire infrastructure with our proprietary state engine.</p>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
           </div>

           {/* Secondary Cards */}
           <div className="md:col-span-2 bg-indigo-50 rounded-[2.5rem] p-10 flex flex-col justify-between group hover:bg-indigo-100 transition-colors min-h-[250px]">
              <div className="flex justify-between items-start">
                 <Shield className="w-10 h-10 text-indigo-600" />
                 <div className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">Enterprise</div>
              </div>
              <div>
                 <h3 className="text-xl font-bold mb-2">{features[1] || 'Bank-grade Security'}</h3>
                 <p className="text-gray-500 text-sm font-medium">End-to-end encryption for every data packet.</p>
              </div>
           </div>

           <div className="bg-rose-50 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center group hover:bg-rose-100 transition-colors min-h-[200px]">
              <Users className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-lg font-bold mb-1">{features[2] || 'Multi-user'}</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Collab Ready</p>
           </div>

           <div className="bg-emerald-50 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center group hover:bg-emerald-100 transition-colors min-h-[200px]">
              <Rocket className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-lg font-bold mb-1">Fast Deploy</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">1-Click Setup</p>
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

