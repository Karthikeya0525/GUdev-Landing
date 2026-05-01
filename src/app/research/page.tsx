"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Bot, User, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ResearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Product Research AI. Need help defining your target audience, planning your MVP features, or researching market gaps? Let's deep dive into building your product from scratch." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].filter(
        m => !(m.role === 'assistant' && m.content.startsWith("Hi! I'm your Product Research AI"))
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        
        // Simple heuristic to check if ready
        if (data.reply.toLowerCase().includes("would you like to proceed") || data.reply.toLowerCase().includes("generate your blueprint")) {
          setIsReadyToGenerate(true);
          setResearchProgress(100);
        } else {
          // Increment progress slightly for each exchange
          setResearchProgress(prev => Math.min(prev + 20, 90));
        }
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to send message. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePRDFromResearch = () => {
    // Collect all user messages as the consolidated prompt
    const consolidatedPrompt = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join("\n");
    
    window.location.href = `/?prompt=${encodeURIComponent(consolidatedPrompt)}`;
  };

  return (
    <main className="h-screen flex flex-col relative overflow-hidden font-sans bg-[#F8FAFC]">
      {/* Dynamic Premium Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-purple-50/50 blur-[100px] opacity-80" />
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
            <p className="text-xs font-semibold text-indigo-500 tracking-wider uppercase">Deep Research Lab</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="hidden md:flex flex-col items-center gap-2 w-1/3">
          <div className="flex justify-between w-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>Research Depth</span>
            <span>{researchProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${researchProgress}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isReadyToGenerate && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={generatePRDFromResearch}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Sparkles className="w-3 h-3" /> Generate PRD
              </motion.button>
            )}
          </AnimatePresence>
          <div className="hidden sm:flex gap-6 text-sm font-semibold text-gray-500 items-center">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6">
        {/* Research Banner */}
        <div className="bg-indigo-600/5 border border-indigo-100 rounded-3xl p-6 mb-8 flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-indigo-50">
            <Bot className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">Deep PRD Interview Mode</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Our AI is now in Orchestration Mode. It will ask you targeted questions to build a professional-grade PRD. Answer as detail as possible for better results.
            </p>
          </div>
        </div>
        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn("flex gap-4", m.role === 'user' ? "flex-row-reverse" : "")}
            >
              <div className={cn(
                "w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-md border",
                m.role === 'user' ? "bg-gray-900 border-gray-800 text-white" : "bg-gradient-to-tr from-indigo-500 to-purple-500 border-indigo-400 text-white"
              )}>
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={cn(
                "px-6 py-4 rounded-3xl max-w-[85%] shadow-sm",
                m.role === 'user' 
                  ? "bg-gray-900 text-white rounded-tr-sm" 
                  : "bg-white/80 backdrop-blur-xl border border-gray-200/60 text-gray-800 rounded-tl-sm"
              )}>
                <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{m.content}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 border border-indigo-400 text-white flex items-center justify-center shadow-md">
                <Bot size={18} />
              </div>
              <div className="px-6 py-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-sm rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Input Area */}
      <div className="p-6 w-full relative z-10 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent pt-12 pb-8">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500" />
          <div className="relative flex items-center bg-white/90 backdrop-blur-2xl border border-gray-200/50 rounded-full p-2 shadow-xl">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about target audience, MVP features, competitor analysis..."
              className="w-full bg-transparent border-none py-3 pl-6 pr-4 focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-400 font-medium text-[15px]"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:hover:bg-gray-900 transition-all shadow-md group-hover:scale-[1.02] active:scale-95"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
