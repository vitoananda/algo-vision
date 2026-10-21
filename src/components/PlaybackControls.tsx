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

export const PlaybackControls: React.FC<Props> = ({
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      {/* Primary Step-by-Step & Play Controls */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset to Step 1"
          className="p-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Previous Step button */}
        <button
          onClick={onStepBack}
          disabled={currentStepIndex <= 0}
          title="Previous Step"
          className="flex items-center gap-1 px-3 py-2 text-[#1d1d1f] bg-black/[0.04] hover:bg-black/[0.08] disabled:opacity-30 disabled:hover:bg-black/[0.04] rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* Big Prominent "Next Step" Button */}
        <button
          onClick={onStepForward}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Step Forward manually"
          className="flex items-center gap-1.5 px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white disabled:opacity-40 disabled:hover:bg-[#0071e3] rounded-xl text-xs font-semibold shadow-[0_4px_14px_rgba(0,113,227,0.25)] transition-all cursor-pointer"
        >
          <span>Next Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Optional Auto-Play Toggle */}
        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play through steps'}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
            isPlaying
              ? 'bg-[#1d1d1f] text-white border-transparent shadow-sm'
              : 'bg-white text-[#515154] border-black/[0.08] hover:bg-black/[0.03]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Auto</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auto Play</span>
            </>
          )}
        </button>
      </div>

      {/* Scrubber timeline */}
      <div className="flex-1 w-full flex items-center gap-3">
        <span className="text-xs font-mono text-[#86868b] select-none min-w-[55px] text-right font-medium">
          {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-[#0071e3]"
        />
      </div>

      {/* Auto-Play Speed Dropdown */}
      <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
        <span className="font-medium text-[11px]">Speed:</span>
        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-black/[0.04] border border-black/[0.06] text-[#1d1d1f] rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-[#0071e3] transition-colors cursor-pointer"
        >
          <option value={2000}>0.5×</option>
          <option value={1000}>1.0×</option>
          <option value={500}>2.0×</option>
        </select>
      </div>
    </div>
  );
};
