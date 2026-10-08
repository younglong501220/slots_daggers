import React from 'react';
import { SymbolId } from '../types/game';
import { SYMBOLS_CATALOG } from '../data/symbols';
import { SymbolIcon } from './SymbolIcon';

interface ReelInspectorModalProps {
  reelStrips: SymbolId[][];
  onClose: () => void;
}

export const ReelInspectorModal: React.FC<ReelInspectorModalProps> = ({
  reelStrips,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100">
              輪盤池檢視器 (Reel Inspector)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold flex items-center justify-center cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs text-neutral-400">
            以下為三個滾輪的固定符號順序與構成。各輪盤在旋轉時會依序循環，你可以藉此掌握目押節奏與大獎機率：
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map(reelIdx => {
              const strip = reelStrips[reelIdx];
              // Group counts
              const counts: Record<string, number> = {};
              strip.forEach(sym => {
                counts[sym] = (counts[sym] || 0) + 1;
              });

              return (
                <div
                  key={reelIdx}
                  className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                    <span className="font-bold text-xs sm:text-sm text-amber-400">
                      滾輪 {reelIdx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      共 {strip.length} 個符號
                    </span>
                  </div>

                  {/* Strip sequence view */}
                  <div className="mb-3">
                    <span className="text-[10px] text-neutral-400 block mb-1">
                      循環鏈條 (由前至後):
                    </span>
                    <div className="flex flex-wrap gap-1 p-1.5 bg-neutral-900 rounded-lg border border-neutral-800">
                      {strip.map((symKey, i) => {
                        const sym = SYMBOLS_CATALOG[symKey];
                        return (
                          <span
                            key={i}
                            title={`${sym.nameZh} (${i + 1})`}
                            className="p-1 bg-neutral-950 rounded hover:scale-110 transition-transform cursor-help flex items-center justify-center"
                          >
                            <SymbolIcon id={symKey} size="sm" />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Frequency breakdown */}
                  <div className="space-y-1 mt-auto">
                    <span className="text-[10px] text-neutral-400 block mb-0.5">
                      符號分佈:
                    </span>
                    {Object.entries(counts).map(([symKey, count]) => {
                      const sym = SYMBOLS_CATALOG[symKey as SymbolId];
                      const pct = Math.round((count / strip.length) * 100);
                      return (
                        <div
                          key={symKey}
                          className="flex items-center justify-between text-[11px] text-neutral-300 py-0.5 px-1 rounded bg-neutral-900/60"
                        >
                          <span className="flex items-center gap-1.5">
                            <SymbolIcon id={symKey as SymbolId} size="sm" animated={false} />
                            <span>{sym ? sym.nameZh : symKey}</span>
                          </span>
                          <span className="font-mono text-neutral-400">
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer"
          >
            關閉檢視器
          </button>
        </div>
      </div>
    </div>
  );
};

