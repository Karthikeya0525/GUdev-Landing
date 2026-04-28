"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Camera, QrCode } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationId: string | null;
}

export default function QRCodeModal({ isOpen, onClose, generationId }: QRCodeModalProps) {
  if (!isOpen) return null;

  const previewUrl = generationId 
    ? `${window.location.origin}/preview/${generationId}`
    : window.location.href;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(previewUrl)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden relative p-8 md:p-12 text-center z-10"
        >
          <button onClick={onClose} className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-all z-20">
            <X size={24} />
          </button>

          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Smartphone size={32} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">View in AR</h2>
          <p className="text-gray-500 text-sm font-medium mb-8">Scan this code with your mobile device to see your product floating in your actual environment.</p>

          <div className="relative bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 inline-block mb-8">
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-48 h-48 md:w-64 md:h-64 object-contain mix-blend-multiply"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center">
               <QrCode className="text-indigo-600" size={24} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-3 text-left p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">1</div>
                <p className="text-[11px] font-bold text-gray-700 leading-tight">Open your mobile camera and scan the QR code above.</p>
             </div>
             <div className="flex items-center gap-3 text-left p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">2</div>
                <p className="text-[11px] font-bold text-gray-700 leading-tight">Allow camera access to enter the Spatial Preview mode.</p>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
