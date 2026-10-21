import React from 'react';
import type { Problem } from '../types/algo';
import { ChevronRight } from 'lucide-react';

interface Props {
  problems: Problem[];
  selectedProblemId: string;
  onSelectProblem: (id: string) => void;
}

export const ProblemSelector: React.FC<Props> = ({
  problems,
  selectedProblemId,
  onSelectProblem,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl p-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-1">
        Problems
      </div>
      <div className="flex flex-col gap-1.5">
        {problems.map((prob) => {
          const isSelected = prob.id === selectedProblemId;
          return (
            <button
              key={prob.id}
              onClick={() => onSelectProblem(prob.id)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all text-xs group ${
                isSelected
                  ? 'bg-[#0071e3] text-white shadow-[0_4px_16px_rgba(0,113,227,0.25)] font-medium'
                  : 'text-[#1d1d1f] hover:bg-black/[0.04]'
              }`}
            >
              <div className="flex flex-col gap-0.5 truncate pr-2">
                <span className={`truncate font-medium text-sm ${isSelected ? 'text-white' : 'text-[#1d1d1f]'}`}>
                  {prob.title}
                </span>
                <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#86868b]'}`}>
                  {prob.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : prob.difficulty === 'Easy'
                      ? 'text-emerald-700 bg-emerald-50'
                      : prob.difficulty === 'Medium'
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-rose-700 bg-rose-50'
                  }`}
                >
                  {prob.difficulty}
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                    isSelected ? 'text-white' : 'text-[#86868b]'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
