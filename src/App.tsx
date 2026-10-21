import { useState, useEffect, useRef, useMemo } from 'react';
import { PROBLEMS } from './data/problems';
import { ProblemSelector } from './components/ProblemSelector';
import { DataStructureVisualizer } from './components/DataStructureVisualizer';
import { PlainWordsExplainer } from './components/PlainWordsExplainer';
import { CodeViewer } from './components/CodeViewer';
import { FloatingPlayer } from './components/FloatingPlayer';
import { CustomInputModal } from './components/CustomInputModal';
import { CustomCodeModal } from './components/CustomCodeModal';
import { traceCustomJavaScript } from './lib/customTracer';
import { analyzeCustomAlgorithm } from './lib/codeAnalyzer';
import type { Problem, ExecutionStep } from './types/algo';
import { 
  Layers, 
  Settings2, 
  ChevronDown, 
  Code2, 
  Info
} from 'lucide-react';

export function App() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);
  const [inputs, setInputs] = useState<any>(() => PROBLEMS[0].defaultInput);
  const timerRef = useRef<any>(null);

  // Custom User-Pasted Code state
  const [customProblem, setCustomProblem] = useState<Problem | null>(null);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // Drawers
  const [showProblemDrawer, setShowProblemDrawer] = useState<boolean>(false);
  const [showInputDrawer, setShowInputDrawer] = useState<boolean>(false);
  const [showInfoBanner, setShowInfoBanner] = useState<boolean>(false);

  // Active Problem
  const problem: Problem = useMemo(() => {
    if (customProblem && selectedProblemId === 'custom') {
      return customProblem;
    }
    return PROBLEMS.find((p) => p.id === selectedProblemId) || PROBLEMS[0];
  }, [selectedProblemId, customProblem]);

  // Compute steps
  const steps: ExecutionStep[] = useMemo(() => {
    try {
      return problem.runTracer(inputs);
    } catch (e) {
      console.error('Error generating trace:', e);
      return [];
    }
  }, [problem, inputs]);

  const handleSelectProblem = (id: string) => {
    const nextProb = PROBLEMS.find((p) => p.id === id) || PROBLEMS[0];
    setSelectedProblemId(id);
    setInputs({ ...nextProb.defaultInput });
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setShowProblemDrawer(false);
  };

  const handleLoadCustomCode = (title: string, userCode: string, inputArgs: string) => {
    const analysis = analyzeCustomAlgorithm(title, userCode);

    const custom: Problem = {
      id: 'custom',
      title: analysis.title,
      difficulty: analysis.difficulty,
      category: analysis.category,
      companyTags: ['Custom Algorithm', analysis.category],
      summary: analysis.summary,
      problemStatement: analysis.summary,
      defaultInput: { args: inputArgs },
      inputSchema: [],
      code: userCode,
      timeComplexity: analysis.timeComplexity,
      spaceComplexity: analysis.spaceComplexity,
      algorithmBreakdown: analysis.breakdown,
      runTracer: (_inp) => {
        return traceCustomJavaScript(userCode, inputArgs);
      },
    };

    setCustomProblem(custom);
    setSelectedProblemId('custom');
    setInputs({ args: inputArgs });
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setShowInfoBanner(true);
  };

  // Step controls
  const handleStepForward = () => {
    setCurrentStepIndex((prev) => {
      if (prev < steps.length - 1) return prev + 1;
      setIsPlaying(false);
      return prev;
    });
  };

  const handleStepBack = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStepIndex >= steps.length - 1) {
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, steps.length]);

  const currentStep = steps[currentStepIndex] || null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col pb-28 selection:bg-[#0071e3]/20">
      {/* Sticky Header & Drawers Container */}
      <div className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-2xl">
        <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#1d1d1f] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              λ
            </div>
            <span className="font-semibold text-base tracking-tight text-[#1d1d1f]">
              AlgoVision
            </span>

            {/* Problem Selector Pill with Anchored Floating Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProblemDrawer(!showProblemDrawer);
                  setShowInputDrawer(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  showProblemDrawer
                    ? 'bg-black/[0.08] text-[#1d1d1f] border-black/[0.1]'
                    : 'bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] border-black/[0.04]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#0071e3]" />
                <span className="max-w-[140px] sm:max-w-[200px] truncate">{problem.title}</span>
                <span className="text-[10px] text-[#86868b] px-1.5 py-0.2 bg-white rounded-full border border-black/[0.06]">
                  {problem.difficulty}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#86868b] transition-transform ${showProblemDrawer ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Anchored Popover Dropdown */}
              {showProblemDrawer && (
                <div className="fixed sm:absolute left-4 right-4 sm:left-0 sm:right-auto top-[54px] sm:top-[calc(100%+8px)] z-50 w-auto sm:w-[380px] max-h-[75vh] bg-white/95 backdrop-blur-2xl border border-black/[0.1] rounded-3xl shadow-[0_20px_48px_-12px_rgba(0,0,0,0.25)] p-3 animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                      Select Problem
                    </span>
                    <button
                      onClick={() => setShowProblemDrawer(false)}
                      className="text-xs text-[#0071e3] font-medium hover:underline cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[60vh] flex flex-col gap-1 pr-1">
                    <ProblemSelector
                      problems={PROBLEMS}
                      selectedProblemId={selectedProblemId}
                      onSelectProblem={handleSelectProblem}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Toolbar Buttons */}
          <div className="flex items-center gap-2">
            {/* Custom Code Paste Button */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm transition-all cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Paste Custom Code</span>
            </button>

            {/* Test Case Inputs (only for preloaded problems) */}
            {selectedProblemId !== 'custom' && (
              <button
                onClick={() => {
                  setShowInputDrawer(!showInputDrawer);
                  setShowProblemDrawer(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  showInputDrawer
                    ? 'bg-[#1d1d1f] text-white border-transparent'
                    : 'bg-white text-[#6e6e73] border-black/[0.06] hover:bg-black/[0.03]'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Test Input</span>
              </button>
            )}

            {/* Quick Info Toggle */}
            <button
              onClick={() => setShowInfoBanner(!showInfoBanner)}
              className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                showInfoBanner
                  ? 'bg-black/[0.08] text-[#1d1d1f] border-black/[0.08]'
                  : 'text-[#86868b] hover:text-[#1d1d1f] border-transparent'
              }`}
              title="Problem Statement"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Input Drawer */}
        {showInputDrawer && (
          <div className="border-b border-black/[0.08] bg-white/95 backdrop-blur-2xl p-5 shadow-2xl animate-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <CustomInputModal
                problem={problem}
                onApplyInput={(newInputs) => {
                  setInputs(newInputs);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                  setShowInputDrawer(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Enhanced Rich Info Banner */}
        {showInfoBanner && (
          <div className="bg-white/95 backdrop-blur-2xl border-b border-black/[0.08] px-6 py-4 text-xs text-[#424245] animate-in fade-in duration-150 shadow-md max-h-[50vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1d1d1f]">{problem.title}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/[0.04] text-[#6e6e73]">
                    {problem.category}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#0071e3] border border-blue-200/50">
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-[#6e6e73]">
                  <span className="bg-black/[0.03] px-2.5 py-1 rounded-full border border-black/[0.04]">
                    Time: <strong className="text-[#0071e3] font-semibold">{problem.timeComplexity}</strong>
                  </span>
                  <span className="bg-black/[0.03] px-2.5 py-1 rounded-full border border-black/[0.04]">
                    Space: <strong className="text-[#af52de] font-semibold">{problem.spaceComplexity}</strong>
                  </span>
                </div>
              </div>

              <p className="m-0 leading-relaxed text-[#424245] text-xs sm:text-[13px]">
                {problem.problemStatement}
              </p>

              {/* Strategy breakdown phases */}
              {problem.algorithmBreakdown && problem.algorithmBreakdown.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-black/[0.05]">
                  {problem.algorithmBreakdown.map((item) => (
                    <div
                      key={item.phase}
                      className="p-2.5 bg-black/[0.02] border border-black/[0.04] rounded-xl text-left"
                    >
                      <div className="font-semibold text-[11px] text-[#0071e3] mb-0.5">
                        {item.phase}
                      </div>
                      <div className="text-[11px] text-[#6e6e73] leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visualizer Row (at the top, clean and accessible) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {currentStep && (
          <div className="min-h-[190px]">
            <DataStructureVisualizer visualState={currentStep.visualState} />
          </div>
        )}
      </div>

      {/* CORE HERO SECTION: Code on Left, Plain English Explanation on Right */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[330px]">
          {/* LEFT: Code Viewer with Active Line Tracking */}
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Code (Active Execution Line)
              </span>
              <span className="text-[11px] font-mono text-[#0071e3]">
                {currentStep ? `Line ${currentStep.lineNumber}` : 'Idle'}
              </span>
            </div>
            <div className="flex-1">
              <CodeViewer
                code={problem.code}
                activeLine={currentStep ? currentStep.lineNumber : null}
              />
            </div>
          </div>

          {/* RIGHT: Plain Words Explanation Side-by-Side */}
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Plain English Explanation & Reasoning
              </span>
              <span className="text-[11px] text-[#6e6e73]">
                Step {steps.length > 0 ? currentStepIndex + 1 : 0} of {steps.length}
              </span>
            </div>
            <div className="flex-1">
              <PlainWordsExplainer step={currentStep} totalSteps={steps.length} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Player at the bottom */}
      <FloatingPlayer
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onPlayPause={handlePlayPause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        onSpeedChange={setPlaybackSpeed}
        onSeek={(idx) => {
          setIsPlaying(false);
          setCurrentStepIndex(idx);
        }}
      />

      {/* Custom Code Modal */}
      {showCustomModal && (
        <CustomCodeModal
          onLoadCustomCode={handleLoadCustomCode}
          onClose={() => setShowCustomModal(false)}
        />
      )}
    </div>
  );
}

export default App;
