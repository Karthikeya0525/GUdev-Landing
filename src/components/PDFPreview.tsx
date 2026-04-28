"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PDFPreviewProps {
  base64: string;
  projectName: string;
}

export function PDFPreview({ base64, projectName }: PDFPreviewProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // Convert base64 to Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    setUrl(blobUrl);

    return () => URL.revokeObjectURL(blobUrl);
  }, [base64]);

  return (
    <Card className="h-full flex flex-col border-none shadow-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="text-sm font-medium text-gray-500">PRD PREVIEW</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <a href={url || '#'} download={`${projectName.replace(/\s+/g, '_')}_PRD.pdf`}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative bg-gray-100">
        {url && (
          <iframe 
            src={url} 
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        )}
      </CardContent>
    </Card>
  );
}
