import React from 'react';
import type { ExecutionStep } from '../types/algo';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  step: ExecutionStep | null;
  totalSteps: number;
}

export const PlainWordsExplainer: React.FC<Props> = ({ step, totalSteps }) => {
  if (!step) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-[#86868b] italic bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl">
        Click Next to view plain-language algorithm explanations.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl p-4 sm:p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.05]">
        <div className="text-xs font-semibold tracking-tight text-[#86868b]">
          Plain English Explanation
        </div>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#6e6e73]">
          Step {step.stepNumber} of {totalSteps}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.stepNumber}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1"
        >
          {/* Main Action Callout */}
          <div className="p-4 rounded-2xl bg-[#0071e3]/[0.04] border border-[#0071e3]/10">
            <div className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider mb-1">
              Current Action
            </div>
            <p className="text-[#1d1d1f] text-sm sm:text-base leading-relaxed font-medium">
              {step.plainEnglish}
            </p>
          </div>

          {/* Reasoning */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
            <div className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider mb-1">
              Why this step?
            </div>
            <p className="text-[#424245] text-xs sm:text-sm leading-relaxed">
              {step.whyThisStep}
            </p>
          </div>

          {/* Invariant if present */}
          {step.invariantOrRule && (
            <div className="p-3.5 rounded-2xl bg-[#ff9500]/[0.06] border border-[#ff9500]/20">
              <div className="text-[10px] font-semibold text-[#c97500] uppercase tracking-wider mb-0.5">
                Invariant Maintained
              </div>
              <p className="text-[#8a5000] text-xs font-mono">
                {step.invariantOrRule}
              </p>
            </div>
          )}

          {/* Variables row */}
          <div className="mt-auto pt-3 border-t border-black/[0.05]">
            <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
              Scope Variables (Line {step.lineNumber})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(step.variables).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-black/[0.03] border border-black/[0.04] rounded-full text-xs font-mono"
                >
                  <span className="text-[#0071e3] font-medium">{k}:</span>
                  <span className="text-[#1d1d1f] font-semibold">{JSON.stringify(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
