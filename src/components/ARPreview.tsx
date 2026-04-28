"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Hand, Sparkles, Smartphone, Move } from "lucide-react";

interface ARPreviewProps {
  data: any;
  onClose: () => void;
}

export default function ARPreview({ data, onClose }: ARPreviewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isHandActive, setIsHandActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Simulate hand gesture movement (vertical)
  const [handPos, setHandPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  // Simple Hand Gesture Simulation Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHandActive) return;
    const deltaY = e.movementY;
    if (scrollRef.current) {
      scrollRef.current.scrollTop += deltaY * 2;
    }
    setHandPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center">
      
      {/* 📷 AR CAMERA FEED */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[30%]"
      />

      {/* ✨ SCENE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

      {/* 📱 FLOATING WEBSITE (3D) */}
      <motion.div 
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        className="relative z-10 w-[350px] h-[700px] md:w-[400px] md:h-[800px] bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[12px] border-gray-900 overflow-hidden transform"
        style={{
          perspective: "1000px",
          rotateY: "15deg",
          rotateX: "5deg"
        }}
        onMouseMove={handleMouseMove}
      >
         {/* Internal Content */}
         <div ref={scrollRef} className="h-full overflow-y-auto no-scrollbar scroll-smooth">
            <div className="p-8 text-center bg-gray-900 text-white pt-16">
               <Sparkles className="mx-auto mb-4 text-indigo-400" size={32} />
               <h1 className="text-3xl font-black tracking-tighter mb-2">{data.project_name}</h1>
               <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{data.tagline}</p>
            </div>
            
            {/* Simulation of the WebPreview content */}
            <div className="p-8 space-y-12 bg-white min-h-[1500px]">
               <div className="space-y-4">
                  <div className="h-4 w-24 bg-gray-100 rounded-full" />
                  <div className="h-10 w-full bg-gray-900 rounded-2xl" />
                  <div className="h-20 w-full bg-gray-50 rounded-2xl border border-gray-100" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-3xl p-4 flex flex-col justify-end">
                       <div className="h-3 w-12 bg-gray-300 rounded-full mb-2" />
                       <div className="h-5 w-full bg-gray-900 rounded-lg" />
                    </div>
                  ))}
               </div>

               <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white text-center">
                  <h2 className="text-2xl font-bold mb-4 italic">Ready?</h2>
                  <div className="h-12 w-full bg-white rounded-2xl" />
               </div>
            </div>
         </div>

         {/* Gesture Indicator Overlay */}
         <AnimatePresence>
           {isHandActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-indigo-500/10 pointer-events-none flex items-center justify-center border-4 border-indigo-500/30 rounded-[3.5rem]"
              >
                 <div className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse">
                    <Hand size={14} /> Gesture Mode Active
                 </div>
              </motion.div>
           )}
         </AnimatePresence>
      </motion.div>

      {/* 🎮 CONTROLS */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
         <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-2 rounded-full flex items-center gap-2 shadow-2xl">
            <button 
              onClick={() => setIsHandActive(!isHandActive)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                isHandActive ? "bg-indigo-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <Hand size={14} /> {isHandActive ? "Disable Gestures" : "Enable Gestures"}
            </button>
            <div className="h-4 w-[1px] bg-white/20" />
            <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
              <X size={20} />
            </button>
         </div>
      </div>

      {/* UI Guidance */}
      <div className="absolute bottom-12 text-center text-white/40 font-bold text-[10px] uppercase tracking-[0.4em] z-50">
        Move your mouse vertically over the device to simulate hand gestures
      </div>

      {/* Animated Cursor for Gesture Simulation */}
      {isHandActive && (
        <motion.div 
          className="fixed pointer-events-none z-[110] text-indigo-400"
          style={{ x: handPos.x - 20, y: handPos.y - 20 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Hand size={40} className="drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        </motion.div>
      )}

    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
