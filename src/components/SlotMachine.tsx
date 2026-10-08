import React, { useEffect, useRef } from 'react';
import { SymbolId } from '../types/game';
import { SYMBOLS_CATALOG } from '../data/symbols';
import { SFX } from '../utils/audio';
import { SymbolIcon } from './SymbolIcon';

interface SlotMachineProps {
  reelStrips: SymbolId[][];
  spinning: boolean[];
  results: (SymbolId | null)[];
  onStartSpin: () => void;
  onStopReel: (reelIndex: number, symbol: SymbolId) => void;
  onStopAll: () => void;
  canSpin: boolean;
  hasCloverRelic: boolean;
  highlightJackpot: boolean;
  // Bet controls
  currentBet: number;
  onSetBet: (bet: number) => void;
  playerGold: number;
}

const ITEM_HEIGHT = 64; // 64px per symbol
const VISIBLE_COUNT = 3; // 3 rows visible (top, center payline, bottom)
const WINDOW_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT; // 192px

export const SlotMachine: React.FC<SlotMachineProps> = ({
  reelStrips,
  spinning,
  results,
  onStartSpin,
  onStopReel,
  onStopAll,
  canSpin,
  hasCloverRelic,
  highlightJackpot,
  currentBet,
  onSetBet,
  playerGold
}) => {
  // Track continuous indices and animation refs for all 3 reels
  const offsetsRef = useRef<number[]>([0, 0, 0]);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const timerRefs = useRef<(number | null)[]>([null, null, null]);

  // Base speed: 90ms. If clover relic is active, 120ms for easier manual timing.
  const stepInterval = hasCloverRelic ? 120 : 92;

  // Initialize track positions on mount or strip change
  useEffect(() => {
    reelStrips.forEach((strip, reelIdx) => {
      const track = trackRefs.current[reelIdx];
      if (track && !spinning[reelIdx]) {
        const offset = offsetsRef.current[reelIdx];
        const targetY = -(offset * ITEM_HEIGHT) + ITEM_HEIGHT;
        track.style.transition = 'none';
        track.style.transform = `translateY(${targetY}px)`;
      }
    });
  }, [reelStrips]);

  // Handle start/stop reel loops
  useEffect(() => {
    spinning.forEach((isSpinning, reelIdx) => {
      if (isSpinning && timerRefs.current[reelIdx] === null) {
        // Start spinning this reel
        const stripLen = reelStrips[reelIdx].length;
        if (stripLen === 0) return;

        timerRefs.current[reelIdx] = window.setInterval(() => {
          let curr = offsetsRef.current[reelIdx] + 1;
          // Keep offset within repeated boundaries (render 4 repeats)
          if (curr >= stripLen * 3) {
            curr = stripLen;
          }
          offsetsRef.current[reelIdx] = curr;

          const track = trackRefs.current[reelIdx];
          if (track) {
            const targetY = -(curr * ITEM_HEIGHT) + ITEM_HEIGHT;
            track.style.transition = `transform ${stepInterval * 0.9}ms linear`;
            track.style.transform = `translateY(${targetY}px)`;
          }
          SFX.spinTick();
        }, stepInterval);
      } else if (!isSpinning && timerRefs.current[reelIdx] !== null) {
        // Stop reel loop
        clearInterval(timerRefs.current[reelIdx]!);
        timerRefs.current[reelIdx] = null;
      }
    });

    return () => {
      timerRefs.current.forEach(timer => {
        if (timer !== null) clearInterval(timer);
      });
    };
  }, [spinning, reelStrips, stepInterval]);

  const handleManualStop = (reelIdx: number) => {
    if (!spinning[reelIdx]) return;

    if (timerRefs.current[reelIdx] !== null) {
      clearInterval(timerRefs.current[reelIdx]!);
      timerRefs.current[reelIdx] = null;
    }

    const strip = reelStrips[reelIdx];
    const currOffset = offsetsRef.current[reelIdx];
    const actualIndex = currOffset % strip.length;
    const paylineSymbol = strip[actualIndex];

    // Mechanical brake recoil animation: slight snap with cubic-bezier
    const track = trackRefs.current[reelIdx];
    if (track) {
      const targetY = -(currOffset * ITEM_HEIGHT) + ITEM_HEIGHT;
      track.style.transition = 'transform 0.18s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
      track.style.transform = `translateY(${targetY}px)`;
    }

    SFX.stopReel(reelIdx);
    onStopReel(reelIdx, paylineSymbol);
  };

  const isAnySpinning = spinning.some(Boolean);

  const betOptions = [1, 2, 3];

  return (
    <div
      className={`relative bg-neutral-950 rounded-xl p-3 sm:p-4 border-2 transition-all duration-300 shadow-2xl ${
        highlightJackpot
          ? 'border-yellow-400 ring-4 ring-yellow-400/50 shadow-yellow-500/30'
          : 'border-amber-600/70 shadow-amber-950/40'
      }`}
    >
      {/* Top Arcade Header Bar */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-neutral-800 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-bold text-amber-300 tracking-wider font-mono text-[11px] sm:text-xs">
            RETRO REEL-3000
          </span>
          {hasCloverRelic && (
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-1.5 py-0.5 rounded flex items-center gap-1">
              🍀 緩速目押輔助
            </span>
          )}
        </div>
        <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
          <span className="text-amber-400">中獎線:</span> 中央金線 (Payline)
        </div>
      </div>

      {/* Reel Windows Container */}
      <div className="relative grid grid-cols-3 gap-2 sm:gap-3 mb-3 bg-neutral-900/90 p-2 sm:p-2.5 rounded-lg border border-neutral-800">
        {/* Payline Global Laser Beam across all 3 reels */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-20 flex items-center justify-between"
          style={{
            top: `${ITEM_HEIGHT + 10}px`,
            height: `${ITEM_HEIGHT}px`
          }}
        >
          {/* Left Arrow indicator */}
          <div className="text-amber-400 text-xs font-bold pl-0.5 animate-pulse select-none">
            ▶
          </div>
          {/* Payline Box Overlay */}
          <div className="flex-1 mx-1 h-full rounded border-y-2 border-amber-400/90 bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center justify-center">
            <span className="text-[9px] tracking-widest font-mono uppercase text-amber-300/80 select-none font-bold">
              PAYLINE
            </span>
          </div>
          {/* Right Arrow indicator */}
          <div className="text-amber-400 text-xs font-bold pr-0.5 animate-pulse select-none">
            ◀
          </div>
        </div>

        {/* 3 Reel Columns */}
        {[0, 1, 2].map(reelIdx => {
          const strip = reelStrips[reelIdx];
          const isReelSpinning = spinning[reelIdx];
          const resultSymbolKey = results[reelIdx];
          const resultSymbol = resultSymbolKey ? SYMBOLS_CATALOG[resultSymbolKey] : null;

          return (
            <div key={reelIdx} className="flex flex-col items-center">
              {/* Reel Window */}
              <div
                className={`relative w-full rounded-md overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border ${
                  isReelSpinning
                    ? 'border-amber-500/80 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]'
                    : resultSymbol
                    ? 'border-neutral-600 shadow-inner'
                    : 'border-neutral-800'
                }`}
                style={{ height: `${WINDOW_HEIGHT}px` }}
              >
                {/* Vignette Shadow Gradients at top & bottom for 3D barrel illusion */}
                <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black via-black/70 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

                {/* Strip Track */}
                <div
                  ref={el => {
                    trackRefs.current[reelIdx] = el;
                  }}
                  className="absolute top-0 left-0 w-full flex flex-col will-change-transform"
                >
                  {/* Repeat 4 times for seamless infinite circular scroll */}
                  {[0, 1, 2, 3].map(repeatIdx => (
                    <React.Fragment key={repeatIdx}>
                      {strip.map((symKey, symIdx) => {
                        return (
                          <div
                            key={`${repeatIdx}-${symIdx}`}
                            className="flex items-center justify-center select-none"
                            style={{ height: `${ITEM_HEIGHT}px` }}
                          >
                            <SymbolIcon
                              id={symKey}
                              size="md"
                              animated={!isReelSpinning}
                              className="transform hover:scale-110 transition-transform"
                            />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Individual Reel Stop Button (Manual Timing) */}
              <button
                type="button"
                onClick={() => handleManualStop(reelIdx)}
                disabled={!isReelSpinning}
                aria-label={`手動煞停滾輪 ${reelIdx + 1}`}
                className={`mt-2 w-full py-2 sm:py-2.5 px-1 rounded-md font-bold text-xs sm:text-sm tracking-wide transition-all border ${
                  isReelSpinning
                    ? 'bg-rose-600 hover:bg-rose-500 active:scale-95 text-white border-rose-400 shadow-[0_3px_0_#9f1239] cursor-pointer'
                    : 'bg-neutral-800 text-neutral-500 border-neutral-700/60 cursor-not-allowed opacity-70'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>STOP {reelIdx + 1}</span>
                  <kbd className="hidden sm:inline-block text-[9px] bg-neutral-900/60 px-1 py-0.5 rounded text-neutral-300 border border-neutral-700">
                    {reelIdx + 1}
                  </kbd>
                </div>
              </button>

              {/* Settled Symbol Name Indicator */}
              <div className="h-5 mt-1 text-[11px] font-medium text-center truncate w-full flex items-center justify-center gap-1">
                {resultSymbol ? (
                  <>
                    <SymbolIcon id={resultSymbol.id} size="sm" animated={false} />
                    <span style={{ color: resultSymbol.color }}>
                      {resultSymbol.nameZh}
                    </span>
                  </>
                ) : isReelSpinning ? (
                  <span className="text-amber-400/80 text-[10px] animate-pulse">
                    滾動中...
                  </span>
                ) : (
                  <span className="text-neutral-500 text-[10px]">待命中</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bet (Wager) Control Row */}
      <div className="mb-2 p-2 bg-neutral-900/70 border border-neutral-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-400">下注倍率:</span>
          <span className="font-bold text-amber-400 font-mono">
            {currentBet > 0 ? `${currentBet}x` : '免費'}
          </span>
          <span className="text-[10px] text-neutral-500 hidden sm:inline">
            (數值效果翻 {currentBet} 倍)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {betOptions.map(betVal => {
            const isAffordable = playerGold >= betVal;
            const isSelected = currentBet === betVal;
            return (
              <button
                key={betVal}
                type="button"
                disabled={isAnySpinning || (!isAffordable && playerGold > 0)}
                onClick={() => {
                  SFX.click();
                  onSetBet(betVal);
                }}
                className={`px-2.5 py-1 text-xs rounded font-bold font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-300 shadow'
                    : isAffordable
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                    : 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed opacity-50'
                }`}
              >
                {betVal} 🪙
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Control Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
        {/* Spin Lever Main Button */}
        <button
          type="button"
          onClick={onStartSpin}
          disabled={!canSpin || isAnySpinning}
          className={`sm:col-span-3 py-3 px-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all ${
            canSpin && !isAnySpinning
              ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:translate-y-0.5 text-neutral-950 border-2 border-amber-300 shadow-[0_4px_0_#92400e] cursor-pointer'
              : 'bg-neutral-800 text-neutral-500 border-2 border-neutral-700 cursor-not-allowed shadow-none'
          }`}
        >
          <span>
            🎰 {currentBet > 0 && playerGold >= currentBet ? `下注 ${currentBet}🪙 拉桿` : '拉下搖桿'} (SPIN)
          </span>
          <kbd className="hidden sm:inline-block text-xs font-mono font-normal bg-neutral-900/40 text-neutral-900 px-1.5 py-0.5 rounded border border-neutral-900/30">
            Space
          </kbd>
        </button>

        {/* Quick Stop All Button for casual gameplay */}
        <button
          type="button"
          onClick={onStopAll}
          disabled={!isAnySpinning}
          className={`sm:col-span-1 py-3 px-2 rounded-lg font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-0.5 transition-all border ${
            isAnySpinning
              ? 'bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-amber-300 border-amber-600/80 shadow-[0_2px_0_#451a03] cursor-pointer'
              : 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed'
          }`}
        >
          <span>全部煞停</span>
          <span className="text-[9px] text-neutral-400 font-normal">
            (順序全停)
          </span>
        </button>
      </div>
    </div>
  );
};
