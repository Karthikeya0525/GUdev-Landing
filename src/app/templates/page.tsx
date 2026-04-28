"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Monitor, Smartphone, ExternalLink, Sparkles, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Dummy data for templates using Unsplash images
const webTemplates = [
  {
    id: 1,
    title: "SaaS Dashboard Pro",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500",
    prompt: "A professional B2B SaaS dashboard for managing analytics, team members, and subscription billing. Dark mode ready with complex data visualization widgets."
  },
  {
    id: 2,
    title: "E-Commerce Storefront",
    category: "Landing Page",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500",
    prompt: "A modern, high-converting e-commerce storefront for a premium clothing brand. Features a hero carousel, product grids, and a seamless checkout flow."
  },
  {
    id: 3,
    title: "Fintech Portal",
    category: "Dashboard",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800&h=500",
    prompt: "A secure fintech web portal for users to track personal finances, view transaction history, and manage investments with line charts and budget breakdown."
  },
  {
    id: 4,
    title: "Creative Agency",
    category: "Portfolio",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800&h=500",
    prompt: "A bold, minimalist creative agency portfolio highlighting case studies, team members, and a contact form. Heavy focus on typography and large imagery."
  },
  {
    id: 5,
    title: "CRM Analytics",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800&h=500",
    prompt: "A Customer Relationship Management (CRM) analytics page showing lead conversion rates, sales pipelines, and active marketing campaigns."
  },
  {
    id: 6,
    title: "AI Startup Landing",
    category: "Landing Page",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800&h=500",
    prompt: "A futuristic landing page for a new AI startup. Must include a dark theme, glowing neon accents, a hero section with a video demo, and pricing tiers."
  }
];

const mobileTemplates = [
  {
    id: 101,
    title: "Fitness Tracker App",
    category: "iOS & Android",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400&h=800",
    prompt: "A mobile app for tracking daily workouts, calories burned, and step count. Needs a clean white interface with vibrant energetic colors like orange and green."
  },
  {
    id: 102,
    title: "Food Delivery UI",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=400&h=800",
    prompt: "A food delivery mobile app interface showing local restaurants, popular dishes, and a real-time order tracking map."
  },
  {
    id: 103,
    title: "Banking Wallet",
    category: "Finance App",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400&h=800",
    prompt: "A sleek, trustworthy mobile banking wallet app. Shows total balance, quick send/receive buttons, and recent transactions. Uses blue and green trust colors."
  },
  {
    id: 104,
    title: "Social Network",
    category: "iOS App",
    image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=400&h=800",
    prompt: "A modern social media app feed. Needs user profile avatars, image posts with like/comment buttons, and a bottom navigation bar."
  }
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<'web' | 'mobile'>('web');

  return (
    <main className="min-h-screen relative overflow-hidden font-sans selection:bg-blue-100/50 bg-gray-50/50">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/40 blur-[120px]" />
      </div>

      {/* Unified Premium Header */}
      <header className="px-8 py-6 flex justify-between items-center w-full border-b border-gray-200/50 bg-white/60 backdrop-blur-2xl relative z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="w-10 h-10 bg-gray-900 hover:bg-black transition-colors rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-gray-900/10 border border-gray-800 cursor-pointer">
              U
            </div>
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">Agentic UX</h1>
            <p className="text-xs font-semibold text-indigo-500 tracking-wider uppercase">Templates</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-6 text-sm font-semibold text-gray-500 items-center">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <Link href="/templates" className="text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50 transition-colors flex items-center gap-1.5">
             <LayoutTemplate className="w-4 h-4"/> Templates
          </Link>
          <Link href="/research" className="hover:text-gray-900 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4"/> Deep Dive
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-8 pb-32">
        
        {/* Title & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">Template Library</h2>
            <p className="text-gray-500 text-lg">Start your next project with a premium, AI-ready foundation.</p>
          </div>
          
          <div className="flex bg-gray-100/80 p-1.5 rounded-full border border-gray-200 shadow-inner">
            <button
              onClick={() => setActiveTab('web')}
              className={cn(
                "flex items-center px-6 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wider",
                activeTab === 'web' ? "bg-white text-black shadow-sm scale-[1.02]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Monitor className="h-4 w-4 mr-2" />
              Web Screens
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={cn(
                "flex items-center px-6 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wider",
                activeTab === 'mobile' ? "bg-white text-black shadow-sm scale-[1.02]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Screens
            </button>
          </div>
        </div>

        {/* Grid Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'web' && (
            <motion.div 
              key="web"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {webTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} type="web" />
              ))}
            </motion.div>
          )}

          {activeTab === 'mobile' && (
            <motion.div 
              key="mobile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {mobileTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} type="mobile" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}

function TemplateCard({ template, type }: { template: any, type: 'web' | 'mobile' }) {
  const router = useRouter();

  const handleUseTemplate = () => {
    router.push(`/?prompt=${encodeURIComponent(template.prompt)}`);
  };

  return (
    <div onClick={handleUseTemplate} className="group cursor-pointer flex flex-col">
      <div className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-200",
        type === 'web' ? 'aspect-[16/10]' : 'aspect-[9/19]'
      )}>
        <img 
          src={template.image} 
          alt={template.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Use Template <ExternalLink className="ml-2 w-4 h-4" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 px-2">
        <h3 className="font-bold text-gray-900 text-lg">{template.title}</h3>
        <p className="text-gray-500 text-sm font-medium mt-1">{template.category}</p>
      </div>
    </div>
  );
}
