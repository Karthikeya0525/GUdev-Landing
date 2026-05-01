"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Editor from "./Editor";
import Preview from "./Preview";
import WebPreview from "./WebPreview";
import { Button } from "./ui/button";
import { Download, RefreshCw, ArrowLeft, Code2, FileText, Monitor, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import ARPreview from "./ARPreview";
import QRCodeModal from "./QRCodeModal";
import CodeExport from "./CodeExport";
import StitchChat from "./StitchChat";

interface WorkspaceProps {
  initialData: any;
  generationId: string | null;
  onRegenerate: () => void;
  onReset: () => void;
}

// Strictly 4 exclusive view modes
type ActiveView = 'json' | 'prd' | 'web' | 'code';

export default function Workspace({ initialData, generationId, onRegenerate, onReset }: WorkspaceProps) {
  const [activeView, setActiveView] = useState<ActiveView>('prd'); // Default to PRD Preview
  const [jsonContent, setJsonContent] = useState(JSON.stringify(initialData, null, 2));
  const [debouncedJson] = useDebounce(jsonContent, 300);
  const [parsedData, setParsedData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isArMode, setIsArMode] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isStitchMode, setIsStitchMode] = useState(false);

  // Sync JSON changes to the data object
  useEffect(() => {
    try {
      const parsed = JSON.parse(debouncedJson);
      setParsedData(parsed);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, [debouncedJson]);

  const handleEditorChange = (value: string | undefined) => {
    setJsonContent(value || "");
  };

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    try {
      const response = await fetch('/api/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData }),
      });
      
      const result = await response.json();
      if (response.ok && result.pdfBase64) {
        const byteCharacters = atob(result.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${parsedData.project_name || 'PRD'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white">
      
      {/* 🛠 TOOLBAR */}
      <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-20 gap-4">
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-400 hover:text-black rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-900 tracking-tight text-xl">
                UI&UX design
            </h1>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest -mt-1">Founder Workspace</span>
          </div>
        </div>

        {/* 🔘 VIEW TOGGLE BUTTONS - Responsive Container */}
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          <div className="bg-gray-100 p-1 rounded-full flex items-center shadow-inner border border-gray-200 min-w-max">
            <TabButton 
              active={activeView === 'json'} 
              onClick={() => setActiveView('json')}
              icon={<Code2 className="h-4 w-4 sm:mr-2" />}
              label={<span className="hidden sm:inline">JSON Editor</span>}
            />
            <TabButton 
              active={activeView === 'prd'} 
              onClick={() => setActiveView('prd')}
              icon={<FileText className="h-4 w-4 sm:mr-2" />}
              label={<span className="hidden sm:inline">PRD Preview</span>}
            />
            <TabButton 
              active={activeView === 'web'} 
              onClick={() => setActiveView('web')}
              icon={<Monitor className="h-4 w-4 sm:mr-2" />}
              label={<span className="hidden sm:inline">Web Preview</span>}
            />
            <TabButton 
              active={activeView === 'code'} 
              onClick={() => setActiveView('code')}
              icon={<Code2 className="h-4 w-4 sm:mr-2" />}
              label={<span className="hidden sm:inline">Source Code</span>}
            />
            <button 
              onClick={() => setIsStitchMode(!isStitchMode)}
              className={cn(
                "flex items-center px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-wider ml-1 border",
                isStitchMode 
                  ? "bg-indigo-600 text-white border-indigo-500" 
                  : "text-indigo-500 bg-white border-gray-200"
              )}
            >
              <Sparkles className={cn("h-3 w-3 sm:h-4 sm:w-4 sm:mr-2", isStitchMode && "animate-pulse")} />
              <span className="hidden sm:inline">{isStitchMode ? "Active" : "Stitch"}</span>
            </button>
            <button 
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-wider text-gray-500 bg-white ml-1 border border-gray-200"
            >
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">AR</span>
            </button>
          </div>
        </div>
        </div>

        <AnimatePresence>
          {isArMode && (
            <ARPreview data={parsedData} onClose={() => setIsArMode(false)} />
          )}
        </AnimatePresence>

        <QRCodeModal 
          isOpen={isQrModalOpen} 
          onClose={() => setIsQrModalOpen(false)} 
          generationId={generationId} 
        />

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button 
            variant="outline" 
            onClick={onRegenerate} 
            className="rounded-full bg-black text-white border-none hover:bg-gray-800 font-semibold px-6 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Regenerate
          </Button>
          <Button 
            onClick={handleDownloadPDF} 
            disabled={!!error || isPdfLoading}
            className="bg-black hover:bg-gray-800 text-white rounded-full font-bold px-8 shadow-lg shadow-black/10 transition-all"
          >
            {isPdfLoading ? (
              <span className="animate-pulse">Building...</span>
            ) : (
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </div>
            )}
          </Button>
        </div>
      </header>

      {/* 🖼 MAIN CONTENT AREA */}
      <main className="flex-1 w-full overflow-hidden relative bg-gray-50/30">
        
        {/* Render ONLY the active view - Strict Conditional Rendering */}
        
        {activeView === 'json' && (
          <div className="h-full w-full animate-in fade-in duration-300">
             <div className="h-full flex flex-col bg-white">
                <div className="flex-1 overflow-hidden">
                  <Editor value={jsonContent} onChange={handleEditorChange} />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-600 text-[11px] p-4 border-t border-red-100 font-mono">
                    <span className="font-bold mr-2 uppercase tracking-tight">JSON Error:</span> {error}
                  </div>
                )}
             </div>
          </div>
        )}

        {activeView === 'prd' && (
          <div className="h-full w-full overflow-y-auto p-4 md:p-12 flex justify-center animate-in slide-in-from-bottom-2 duration-400">
             <div className="w-full max-w-4xl bg-white shadow-xl border border-gray-100 rounded-2xl min-h-full overflow-hidden">
                <Preview data={parsedData} error={error ? "Fix JSON to update PRD" : null} />
             </div>
          </div>
        )}

        {activeView === 'web' && (
          <div className="h-full w-full overflow-y-auto animate-in zoom-in-95 duration-500 bg-white">
            <WebPreview 
              data={parsedData} 
              isStitchMode={isStitchMode}
              onStitch={(section, prompt) => {
                // Simulate updating the data based on the section refinement
                const newData = { ...parsedData };
                if (section === 'hero') newData.tagline = `${prompt} (Stitched)`;
                setParsedData(newData);
                setJsonContent(JSON.stringify(newData, null, 2));
              }}
            />
          </div>
        )}

        {activeView === 'code' && (
          <div className="h-full w-full animate-in slide-in-from-right-4 duration-400">
            <CodeExport data={parsedData} variants={{}} />
          </div>
        )}

      </main>

      <StitchChat 
        isStitchMode={isStitchMode} 
        onRefine={(prompt) => {
          // Simulate global refinement
          console.log("Global refinement requested:", prompt);
        }} 
      />
    </div>
  );
}

// Specialized Tab Button Component
function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex items-center px-8 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider",
                active 
                    ? "bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)] scale-[1.02]" 
                    : "text-gray-400 hover:text-gray-600"
            )}
        >
            {icon}
            {label}
        </button>
    )
}
