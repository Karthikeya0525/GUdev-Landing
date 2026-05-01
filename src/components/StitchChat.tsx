"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StitchChatProps {
  onRefine: (prompt: string) => void;
  isStitchMode: boolean;
}

export default function StitchChat({ onRefine, isStitchMode }: StitchChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'audit'>('chat');
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', content: "I'm the Stitch AI Orchestrator. What global changes would you like to apply to the entire design system or PRD?" }
  ]);

  const auditMetrics = [
    { label: 'Accessibility (A11y)', score: 94, status: 'AAA Compliant' },
    { label: 'Conversion Logic', score: 88, status: 'F-Pattern Optimized' },
    { label: 'Visual Hierarchy', score: 92, status: 'Bento Focused' },
    { label: 'Performance', score: 98, status: 'Edge Ready' }
  ];

  const handleSend = () => {
    if (!prompt.trim()) return;
    setMessages([...messages, { role: 'user', content: prompt }]);
    onRefine(prompt);
    setPrompt("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: "Re-orchestrating design tokens and layout logic... Your changes are being applied in real-time." }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-gray-100 mb-6 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 bg-gray-900 text-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">Stitch AI Chat</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Global Orchestrator</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={cn(
                    "pb-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === 'chat' ? "text-white border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  Discussion
                </button>
                <button 
                  onClick={() => setActiveTab('audit')}
                  className={cn(
                    "pb-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === 'audit' ? "text-white border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  AI Audit
                </button>
              </div>
            </div>

            {/* Content Area */}
            {activeTab === 'chat' ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                      m.role === 'user' ? "bg-gray-200 text-gray-700" : "bg-indigo-600 text-white"
                    )}>
                      {m.role === 'user' ? <Zap size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed max-w-[80%]",
                      m.role === 'user' ? "bg-gray-900 text-white rounded-tr-sm" : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
                 <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                       <Shield size={12} /> System Healthy
                    </div>
                    <h4 className="text-4xl font-black text-gray-900">92%</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global UX Score</p>
                 </div>

                 <div className="space-y-4">
                    {auditMetrics.map((m, i) => (
                       <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                             <span className="text-xs font-bold text-gray-900">{m.label}</span>
                             <span className="text-xs font-black text-indigo-600">{m.score}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${m.score}%` }} />
                          </div>
                          <p className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.status}</p>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="relative">
                <input 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="e.g., 'Make it more professional'..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-4 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all",
          isOpen ? "bg-white text-gray-900 border border-gray-100" : "bg-gray-900 text-white"
        )}
      >
        {isOpen ? <X /> : <MessageSquare />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
