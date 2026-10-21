import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface Props {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // in ms
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (stepIndex: number) => void;
}

export const FloatingPlayer: React.FC<Props> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
  onSeek,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-3 px-5 py-3 bg-white/85 backdrop-blur-2xl border border-black/[0.08] rounded-full shadow-[0_12px_36px_-6px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.05] transition-all">
        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            title="Reset"
            className="p-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onStepBack}
            disabled={currentStepIndex <= 0}
            title="Previous Step"
            className="p-2 text-[#1d1d1f] hover:bg-black/[0.05] disabled:opacity-30 disabled:hover:bg-transparent rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Big Primary Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Next Step (Manual)"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white disabled:opacity-30 disabled:hover:bg-[#0071e3] rounded-full text-xs font-semibold shadow-[0_4px_14px_rgba(0,113,227,0.3)] transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Auto play toggle */}
          <button
            onClick={onPlayPause}
            title={isPlaying ? 'Pause Auto' : 'Start Auto Play'}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-[#1d1d1f] text-white'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.05]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 flex items-center gap-2.5 mx-2">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-[#0071e3]"
          />
          <span className="text-[11px] font-mono text-[#86868b] select-none whitespace-nowrap min-w-[50px] text-right font-medium">
            {totalSteps > 0 ? currentStepIndex + 1 : 0}/{totalSteps}
          </span>
        </div>

        {/* Speed */}
        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-black/[0.04] border border-black/[0.06] text-[#1d1d1f] rounded-full px-2.5 py-1 text-[11px] font-medium focus:outline-none focus:border-[#0071e3] cursor-pointer"
        >
          <option value={2000}>0.5×</option>
          <option value={1000}>1.0×</option>
          <option value={500}>2.0×</option>
        </select>
      </div>
    </div>
  );
};
