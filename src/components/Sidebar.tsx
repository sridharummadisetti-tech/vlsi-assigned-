import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface SidebarProps {
  onGenerateRtl: (description: string) => void;
  isGenerating: boolean;
  onDesignChip: (description: string) => void;
  isDesigning: boolean;
}

export function Sidebar({ onGenerateRtl, isGenerating, onDesignChip, isDesigning }: SidebarProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerateRtl(prompt);
    }
  };

  return (
    <div className="w-80 h-full flex flex-col bg-[#151619]">
      <div className="p-4 border-b border-white/10 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Sparkles size={18} />
        </div>
        <div>
          <h1 className="font-semibold text-gray-200 text-sm">VLSI AI Assistant</h1>
          <p className="text-xs text-gray-500">RTL Generation & Verification</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-[#1A1C20] p-3 rounded-lg border border-white/5 text-sm text-gray-400">
          Describe the digital logic module you want to build. For example:
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-gray-500">
            <li>A 4-bit synchronous up/down counter with reset</li>
            <li>An APB to I2C bridge</li>
            <li>A parameterized FIFO buffer</li>
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex flex-col space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your RTL module or Chip Architecture..."
            className="w-full h-32 bg-[#1A1C20] border border-white/10 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => prompt.trim() && !isGenerating && !isDesigning && onGenerateRtl(prompt)}
              disabled={!prompt.trim() || isGenerating || isDesigning}
              className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 disabled:opacity-50 transition-colors text-sm font-medium flex justify-center items-center"
            >
              {isGenerating ? 'Generating...' : 'Generate RTL'}
            </button>
            <button
              onClick={() => prompt.trim() && !isGenerating && !isDesigning && onDesignChip(prompt)}
              disabled={!prompt.trim() || isGenerating || isDesigning}
              className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 disabled:opacity-50 transition-colors text-sm font-medium flex justify-center items-center"
            >
              {isDesigning ? 'Designing...' : 'Design Chip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
