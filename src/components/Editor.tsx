"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-full border-r border-gray-200 bg-white">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">JSON Editor</span>
        <span className="text-[10px] text-gray-400">Auto-saving</span>
      </div>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="light" // "vs-dark" for dark mode
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          wordWrap: "on",
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
