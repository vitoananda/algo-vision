import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualState } from '../types/algo';

interface Props {
  visualState: VisualState;
}

export const DataStructureVisualizer: React.FC<Props> = ({ visualState }) => {
  const { array, pointers, highlights, stack, window, hashMap, customMessage, returnValue } = visualState;

  // Apple-inspired soft pastel accents
  const getCellColor = (index: number) => {
    const highlight = highlights?.[index];
    switch (highlight) {
      case 'primary':
        return 'bg-[#0071e3]/10 border-[#0071e3] text-[#0071e3] shadow-[0_4px_16px_rgba(0,113,227,0.15)]';
      case 'secondary':
        return 'bg-[#af52de]/10 border-[#af52de] text-[#af52de] shadow-[0_4px_16px_rgba(175,82,222,0.15)]';
      case 'success':
        return 'bg-[#34c759]/15 border-[#34c759] text-[#248a3d] shadow-[0_4px_16px_rgba(52,199,89,0.2)]';
      case 'warning':
        return 'bg-[#ff9500]/15 border-[#ff9500] text-[#c97500] shadow-[0_4px_16px_rgba(255,149,0,0.15)]';
      case 'danger':
        return 'bg-[#ff3b30]/10 border-[#ff3b30] text-[#d70015] shadow-[0_4px_16px_rgba(255,59,48,0.15)]';
      case 'dimmed':
        return 'bg-black/[0.02] border-black/[0.04] text-[#86868b] opacity-40';
      default:
        return 'bg-white border-black/[0.08] text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.04)]';
    }
  };

  const isInWindow = (index: number) => {
    if (!window) return false;
    return index >= window.left && index <= window.right;
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Top status bar */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-black/[0.05]">
        <div className="text-xs font-semibold tracking-tight text-[#86868b] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34c759]"></span>
          Visualization
        </div>
        {returnValue !== undefined && (
          <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full">
            Returned: {JSON.stringify(returnValue)}
          </div>
        )}
      </div>

      {/* Subtle message banner */}
      {customMessage && (
        <div className="mb-4 px-4 py-2.5 bg-black/[0.03] border border-black/[0.04] rounded-2xl text-xs text-[#1d1d1f] font-medium leading-relaxed">
          {customMessage}
        </div>
      )}

      {/* Main interactive canvas */}
      <div className="flex-1 flex flex-col justify-center items-center overflow-x-auto py-4">
        {/* Multi-Array Display (e.g. nums1 and nums2) */}
        {visualState.multiArray && visualState.multiArray.length > 0 && (
          <div className="flex flex-col gap-4 items-center w-full">
            {visualState.multiArray.map((mArr, aIdx) => (
              <div key={aIdx} className="flex flex-col items-center">
                <div className="text-[11px] font-semibold text-[#86868b] mb-1 font-mono">
                  {mArr.label} (length: {mArr.items.length})
                </div>
                {/* Pointers row */}
                <div className="flex gap-2 mb-1.5 min-h-[22px]">
                  {mArr.items.map((_, idx) => {
                    const activePointers = mArr.pointers
                      ? Object.entries(mArr.pointers).filter(([_, ptrIdx]) => ptrIdx === idx)
                      : [];
                    return (
                      <div key={idx} className="w-11 flex flex-col items-center justify-end">
                        {activePointers.map(([name]) => (
                          <span
                            key={name}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#0071e3] text-white shadow-sm"
                          >
                            {name}↓
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
                {/* Array row */}
                <div className="flex gap-2 p-2 bg-black/[0.02] border border-black/[0.04] rounded-2xl">
                  {mArr.items.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-11 h-11 rounded-xl bg-white border border-black/[0.08] shadow-sm flex flex-col items-center justify-center font-mono font-semibold text-sm relative"
                    >
                      <span>{val}</span>
                      <span className="text-[8px] text-[#86868b] absolute bottom-0.5">{idx}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Single Array Display */}
        {(!visualState.multiArray || visualState.multiArray.length === 0) && array && array.length > 0 && (
          <div className="flex flex-col items-center">
            {/* Pointer labels */}
            <div className="flex gap-2.5 mb-2 relative">
              {array.map((_, idx) => {
                const activePointers = pointers
                  ? Object.entries(pointers).filter(([_, ptrIdx]) => ptrIdx === idx)
                  : [];

                return (
                  <div key={idx} className="w-13 h-8 flex flex-col items-center justify-end">
                    {activePointers.map(([name], pIdx) => (
                      <motion.div
                        key={name}
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm ${
                          name.toLowerCase().includes('left') || name.toLowerCase().includes('low') || name.toLowerCase().includes('buy')
                            ? 'bg-[#0071e3] text-white'
                            : name.toLowerCase().includes('right') || name.toLowerCase().includes('high') || name.toLowerCase().includes('sell')
                            ? 'bg-[#af52de] text-white'
                            : name.toLowerCase().includes('mid')
                            ? 'bg-[#ff9500] text-white'
                            : 'bg-[#34c759] text-white'
                        }`}
                        style={{ marginTop: pIdx > 0 ? '2px' : '0' }}
                      >
                        {name} ↓
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Array Box Elements */}
            <div className="flex gap-2.5 p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
              {array.map((val, idx) => {
                const isWindowed = isInWindow(idx);
                return (
                  <motion.div
                    key={idx}
                    layout
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className={`w-13 h-13 rounded-2xl border flex flex-col items-center justify-center font-mono font-semibold text-base transition-all duration-200 relative ${getCellColor(
                      idx
                    )} ${isWindowed ? 'ring-2 ring-[#0071e3]/60 bg-[#0071e3]/5' : ''}`}
                  >
                    <span>{val}</span>
                    <span className="text-[9px] text-[#86868b] font-sans font-normal absolute bottom-0.5">
                      {idx}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {window && (
              <div className="mt-2.5 text-xs text-[#0071e3] font-medium">
                Window: [{window.left}..{window.right}] ({window.right - window.left + 1} items)
              </div>
            )}
          </div>
        )}

        {/* Stack visualization */}
        {stack !== undefined && (
          <div className="mt-6 flex flex-col items-center">
            <div className="text-xs font-semibold text-[#86868b] mb-1.5 flex items-center gap-1.5">
              <span>Stack (LIFO)</span>
              <span className="text-[10px] px-2 py-0.5 bg-black/[0.04] rounded-full text-[#6e6e73]">
                depth: {stack.length}
              </span>
            </div>
            <div className="w-28 min-h-[120px] max-h-[180px] p-2 bg-black/[0.02] border-x border-b border-black/[0.1] rounded-b-2xl flex flex-col-reverse items-center justify-start gap-1.5 overflow-y-auto">
              {stack.length === 0 ? (
                <div className="text-xs text-[#86868b] self-center my-auto italic">Empty</div>
              ) : (
                stack.map((item, sIdx) => (
                  <motion.div
                    key={sIdx}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full py-1.5 bg-white border border-black/[0.08] text-[#1d1d1f] rounded-xl text-center font-mono font-semibold text-xs shadow-sm"
                  >
                    {item}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Hash Map Visualizer */}
        {hashMap !== undefined && Object.keys(hashMap).length > 0 && (
          <div className="mt-5 w-full max-w-md">
            <div className="text-xs font-semibold text-[#86868b] mb-2 px-1">
              Hash Map (`seen`): {Object.keys(hashMap).length} entries
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-black/[0.02] border border-black/[0.04] rounded-2xl">
              <AnimatePresence>
                {Object.entries(hashMap).map(([key, val]) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-between px-3 py-1.5 bg-white border border-black/[0.06] rounded-xl text-xs shadow-sm"
                  >
                    <span className="font-mono text-[#0071e3] font-semibold">{key}</span>
                    <span className="text-[#86868b]">→</span>
                    <span className="font-mono text-[#ff9500]">idx {val}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-auto pt-3 border-t border-black/[0.05] flex flex-wrap gap-4 text-[11px] text-[#86868b] justify-center">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0071e3]"></span> Pointer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#af52de]"></span> Secondary
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#34c759]"></span> Match
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ff9500]"></span> Candidate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ff3b30]"></span> Evict
        </span>
      </div>
    </div>
  );
};
