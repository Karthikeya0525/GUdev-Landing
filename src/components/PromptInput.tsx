"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function PromptInput({ onSubmit, isLoading, initialValue }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialValue || "");

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto relative z-10"
    >
      {/* Glass Card Container */}
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/40 ring-1 ring-black/5 transition-all focus-within:ring-blue-500/20 focus-within:shadow-blue-500/10">
        
        <div className="relative">
            <Textarea
              placeholder="Describe your startup idea (e.g., 'An AI-powered travel planner for digital nomads')..."
              className="min-h-[160px] text-lg md:text-xl border-none focus-visible:ring-0 resize-none p-4 placeholder:text-gray-400 bg-transparent text-gray-800 font-medium leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 p-2 opacity-50 pointer-events-none">
                <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>AI Architect Ready</span>
            </div>
            
            <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !prompt.trim()}
                className="bg-gray-900 hover:bg-black text-white rounded-full px-8 py-6 h-auto text-base font-bold shadow-xl shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner className="mr-2 h-5 w-5 text-blue-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                            Building...
                        </span>
                    </>
                ) : (
                    <div className="flex items-center">
                        Generate Blueprint
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </Button>
        </div>
      </div>
      
      {/* Decorative Glow Behind Card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[34px] blur-2xl opacity-10 -z-10 animate-pulse"></div>

    </motion.div>
  );
}
