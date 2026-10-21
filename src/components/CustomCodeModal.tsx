import React, { useState } from 'react';
import { Sparkles, Code2 } from 'lucide-react';

interface Props {
  onLoadCustomCode: (title: string, code: string, inputArgs: string) => void;
  onClose: () => void;
}

const DEFAULT_SNIPPET = `function findMax(nums) {
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) {
      max = nums[i];
    }
  }
  return max;
}`;

export const CustomCodeModal: React.FC<Props> = ({ onLoadCustomCode, onClose }) => {
  const [title, setTitle] = useState('My Custom Algorithm');
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [inputArgs, setInputArgs] = useState('[3, 7, 2, 9, 5]');

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onLoadCustomCode(title.trim() || 'Custom Code', code, inputArgs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 sm:p-7 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.2)] max-w-2xl w-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0071e3] text-white flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f] m-0">
                Paste Your Own Code / Algorithm
              </h2>
              <p className="text-xs text-[#86868b] m-0">
                Paste any JavaScript function to visualize and translate side-by-side
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#86868b] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-black/[0.04]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleRun} className="flex flex-col gap-3.5">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#6e6e73]">Problem Name / Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 bg-[#f5f5f7] border border-black/[0.08] focus:border-[#0071e3] rounded-xl text-xs font-medium text-[#1d1d1f] outline-none"
              placeholder="e.g. Find Maximum Element"
            />
          </div>

          {/* Code */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#6e6e73]">JavaScript Function:</label>
              <span className="text-[11px] text-[#86868b]">Function or algorithm statements</span>
            </div>
            <textarea
              rows={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="p-3.5 bg-[#f5f5f7] border border-black/[0.08] focus:border-[#0071e3] rounded-2xl font-mono text-xs sm:text-[13px] leading-5 text-[#1d1d1f] outline-none resize-none"
              placeholder="Paste code here..."
              spellCheck={false}
            />
          </div>

          {/* Test Input Argument */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#6e6e73]">Input Arguments (Optional JSON/Array):</label>
            <input
              type="text"
              value={inputArgs}
              onChange={(e) => setInputArgs(e.target.value)}
              className="px-3.5 py-2 bg-[#f5f5f7] border border-black/[0.08] focus:border-[#0071e3] rounded-xl text-xs font-mono text-[#1d1d1f] outline-none"
              placeholder="e.g. [3, 7, 2, 9, 5]"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] rounded-full hover:bg-black/[0.04]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visualize & Translate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
