"use client";

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

SyntaxHighlighter.registerLanguage('json', json);

interface JSONViewerProps {
  data: any;
}

export function JSONViewer({ data }: JSONViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col border-none shadow-none bg-gray-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white border-b">
        <CardTitle className="text-xs font-bold text-gray-400 tracking-wider">STRUCTURED DATA</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6">
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-400" />}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0 text-xs font-mono">
        <SyntaxHighlighter 
          language="json" 
          style={docco} 
          customStyle={{ background: 'transparent', padding: '1.5rem', margin: 0 }}
          wrapLongLines={true}
        >
          {JSON.stringify(data, null, 2)}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
}
