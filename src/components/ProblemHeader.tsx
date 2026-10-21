import React from 'react';
import type { Problem } from '../types/algo';
import { Clock, HardDrive, Sparkles } from 'lucide-react';

interface Props {
  problem: Problem;
}

export const ProblemHeader: React.FC<Props> = ({ problem }) => {
  const getBadgeStyle = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] transition-all">
      {/* Title & Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] m-0">
            {problem.title}
          </h1>
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getBadgeStyle(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/[0.04] text-[#6e6e73] border border-black/[0.04]">
            {problem.category}
          </span>
        </div>

        {/* Complexity badges */}
        <div className="flex items-center gap-2.5 text-xs text-[#6e6e73]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/[0.03] border border-black/[0.04] rounded-full font-mono">
            <Clock className="w-3.5 h-3.5 text-[#0071e3]" /> Time: {problem.timeComplexity}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/[0.03] border border-black/[0.04] rounded-full font-mono">
            <HardDrive className="w-3.5 h-3.5 text-[#af52de]" /> Space: {problem.spaceComplexity}
          </span>
        </div>
      </div>

      <p className="text-[#424245] text-sm sm:text-base leading-relaxed mb-4 max-w-4xl">
        {problem.problemStatement}
      </p>

      {/* Companies pill list */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs text-[#86868b]">
        <span className="font-medium mr-1 text-[#6e6e73]">Frequent in:</span>
        {problem.companyTags.map((company) => (
          <span
            key={company}
            className="px-2.5 py-0.5 bg-black/[0.03] border border-black/[0.04] rounded-full text-xs text-[#515154] font-medium"
          >
            {company}
          </span>
        ))}
      </div>

      {/* Strategy phases */}
      <div className="pt-4 border-t border-black/[0.06] grid grid-cols-1 md:grid-cols-3 gap-3">
        {problem.algorithmBreakdown.map((phase) => (
          <div
            key={phase.phase}
            className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.04] hover:bg-black/[0.03] transition-colors"
          >
            <div className="text-xs font-semibold text-[#0071e3] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> {phase.phase}
            </div>
            <div className="text-xs text-[#6e6e73] leading-relaxed">
              {phase.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
