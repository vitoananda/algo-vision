import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  code: string;
  activeLine: number | null;
  onCodeChange?: (newCode: string) => void;
  isEditable?: boolean;
}

export const CodeViewer: React.FC<Props> = ({ code, activeLine, onCodeChange, isEditable }) => {
  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
      {/* Window bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[0.06] bg-black/[0.01]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-xs font-mono text-[#86868b] ml-2">solution.js</span>
          {isEditable && (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-full font-medium ml-1">
              Editable
            </span>
          )}
        </div>
        {activeLine && (
          <span className="text-xs font-mono text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full font-medium">
            Executing Line {activeLine}
          </span>
        )}
      </div>

      {/* Editor Content */}
      {isEditable ? (
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
            className="w-full h-full p-3 font-mono text-xs sm:text-sm leading-6 bg-black/[0.02] border border-black/[0.06] rounded-2xl resize-none outline-none focus:border-[#0071e3] text-[#1d1d1f]"
            placeholder="Paste your JavaScript function here..."
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 font-mono text-xs sm:text-sm leading-6">
          {lines.map((lineText, idx) => {
            const lineNumber = idx + 1;
            const isActive = lineNumber === activeLine;

            return (
              <motion.div
                key={lineNumber}
                animate={{
                  backgroundColor: isActive ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                }}
                className={`flex items-start rounded-xl px-2.5 py-0.5 transition-colors duration-150 relative ${
                  isActive ? 'text-[#0071e3] font-semibold' : 'text-[#333336]'
                }`}
              >
                {/* Line number */}
                <span
                  className={`w-7 select-none text-right pr-3 text-xs ${
                    isActive ? 'text-[#0071e3] font-semibold' : 'text-[#c7c7cc]'
                  }`}
                >
                  {lineNumber}
                </span>

                {/* Code line */}
                <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-xs sm:text-[13px]">
                  {lineText || ' '}
                </pre>

                {isActive && (
                  <span className="text-[#0071e3] font-medium text-xs select-none ml-2">
                    ←
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
