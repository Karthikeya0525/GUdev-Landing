"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PreviewProps {
  data: any;
  error?: string | null;
}

export default function Preview({ data, error }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll if needed, or just keep position
  }, [data]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 bg-gray-50 text-red-500">
        <div className="text-center">
          <p className="font-bold">Invalid JSON</p>
          <p className="text-sm mt-2 font-mono bg-red-100 p-2 rounded">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400">
        Waiting for data...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full overflow-y-auto bg-white p-8 md:p-12 lg:p-16">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="border-b pb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {data.project_name || "Untitled Project"}
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            {data.tagline || "Project Tagline"}
          </p>
        </div>

        {/* Sections */}
        <Section title="Problem Statement" content={data.problem_statement} />
        <Section title="Solution" content={data.solution} />
        
        <ListSection title="Target Audience" items={data.target_audience} />
        
        <Section title="Market Opportunity" content={data.market_opportunity} />
        
        <ListSection title="Core Features" items={data.core_features} />
        
        <ListSection title="User Flow" items={data.user_flow} ordered />
        
        <Section title="Monetization Model" content={data.monetization_model} />
        
        <TechStack items={data.tech_stack_suggestion} />
        
        <BrandingColors colors={data.branding_colors} />
        
        <Section title="Timeline Estimate" content={data.timeline_estimate} />
        
        <ListSection title="Risks" items={data.risks} />
        
        <Section title="Future Scope" content={data.future_scope} />

      </div>
    </div>
  );
}

function Section({ title, content }: { title: string, content: string }) {
  if (!content) return null;
  return (
    <section>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-gray-800 leading-relaxed text-lg">{content}</p>
    </section>
  );
}

function ListSection({ title, items, ordered }: { title: string, items: string[], ordered?: boolean }) {
  if (!items || items.length === 0) return null;
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <section>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <Tag className={cn("pl-5 space-y-2 text-gray-800 leading-relaxed text-lg marker:text-gray-400", ordered ? "list-decimal" : "list-disc")}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </Tag>
    </section>
  );
}

function TechStack({ items }: { items: string[] }) {
    if (!items || items.length === 0) return null;
    return (
        <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tech Stack Suggestion</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((tech, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                        {tech}
                    </span>
                ))}
            </div>
        </section>
    );
}

function BrandingColors({ colors }: { colors?: { primary?: string; secondary?: string; background?: string; text?: string } }) {
    if (!colors) return null;
    return (
        <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Branding Colors</h3>
            <div className="flex flex-wrap gap-4">
                {Object.entries(colors).map(([key, hex]) => (
                    <div key={key} className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full shadow-sm border border-gray-200" 
                          style={{ backgroundColor: hex }} 
                        />
                        <div>
                            <p className="text-xs font-bold text-gray-600 capitalize">{key}</p>
                            <p className="text-xs text-gray-400 font-mono uppercase">{hex}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
