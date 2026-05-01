"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, ImagePlus, X } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function PromptInput({ onSubmit, isLoading, initialValue }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialValue || "");
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // For now, we append a notice about the sketch to the prompt
    // In a production app, we would send the image base64 to the multimodal endpoint
    const finalPrompt = image ? `${prompt}\n\n[Visual Reference Provided: ${image.substring(0, 50)}...]` : prompt;
    onSubmit(finalPrompt);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            
            {/* Image Preview Thumbnail */}
            <AnimatePresence>
              {image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-4 left-4 group/img"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-black/5">
                    <img src={image} className="w-full h-full object-cover" alt="Reference" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">Sketch</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 p-2 opacity-50 pointer-events-none">
                <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100/50">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>AI Architect Ready</span>
                </div>
                
                <div className="h-4 w-px bg-gray-100" />
                
                <label className="cursor-pointer group/upload relative">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    <span>Upload Sketch</span>
                  </div>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover/upload:w-full transition-all duration-300" />
                </label>
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
