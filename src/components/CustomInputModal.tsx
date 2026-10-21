import React, { useState } from 'react';
import type { Problem } from '../types/algo';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface Props {
  problem: Problem;
  onApplyInput: (newInputs: any) => void;
}

export const CustomInputModal: React.FC<Props> = ({ problem, onApplyInput }) => {
  const [formData, setFormData] = useState<any>(() => {
    return { ...problem.defaultInput };
  });

  const handleChange = (name: string, rawVal: string, type: 'array' | 'number' | 'string') => {
    if (type === 'number') {
      setFormData((prev: any) => ({ ...prev, [name]: Number(rawVal) }));
    } else if (type === 'array') {
      try {
        const parsed = JSON.parse(rawVal);
        setFormData((prev: any) => ({ ...prev, [name]: parsed }));
      } catch {
        setFormData((prev: any) => ({ ...prev, [name]: rawVal }));
      }
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: rawVal }));
    }
  };

  const handleReset = () => {
    setFormData({ ...problem.defaultInput });
    onApplyInput({ ...problem.defaultInput });
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyInput(formData);
  };

  return (
    <form
      onSubmit={handleApply}
      className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-tight text-[#1d1d1f]">
          <SlidersHorizontal className="w-4 h-4 text-[#0071e3]" />
          <span>Test Input</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-[#86868b] hover:text-[#1d1d1f] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mb-4">
        {problem.inputSchema.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#6e6e73] px-1">{field.label}:</label>
            <input
              type="text"
              value={typeof formData[field.name] === 'object' ? JSON.stringify(formData[field.name]) : formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value, field.type)}
              className="bg-[#f5f5f7] border border-black/[0.08] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#1d1d1f] transition-all outline-none"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-xs font-medium shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
      >
        Run Custom Test
      </button>
    </form>
  );
};
