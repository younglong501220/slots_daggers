import React from 'react';
import { SYMBOLS_CATALOG } from '../data/symbols';
import { SymbolId } from '../types/game';
import { SymbolIcon } from './SymbolIcon';

interface RuleGuideModalProps {
  onClose: () => void;
}

export const RuleGuideModal: React.FC<RuleGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="text-base sm:text-lg font-bold text-amber-400">
              冒險者手冊：拉霸與目押戰鬥指南
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm text-neutral-300">
          {/* Rule 1: Timing */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <h3 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span>🎯</span>
              <span>1. 目押煞停 (Eye-Timing Stop)</span>
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              按下「🎰 拉下搖桿」後，三個滾輪會以每 92 毫秒一格的節奏轉動。三個滾輪的符號順序是**完全固定**的！當你看準想要的符號即將進入中央金線（<strong className="text-amber-300">Payline 判定線</strong>）時，按下各滾輪的「STOP」按鈕（或鍵盤數字鍵 1、2、3），即可精準鎖定目標！
            </p>
          </div>

          {/* Rule 2: Bet System */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <h3 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span>🪙</span>
              <span>2. 下注機制 (Bet Wager)</span>
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              你可以自由選擇下注額度（1🪙、2🪙 或 3🪙）。下注倍率會直接**成倍放大**該回合的所有數值輸出（包含短劍傷害、護盾值、金幣搜刮與治療效果！）。若金幣耗盡，亦可享受 0🪙 冒險者免費保底拉霸！
            </p>
          </div>

          {/* Rule 3: Combos & Jackpot */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <h3 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span>🔥</span>
              <span>3. 三連擊爆發 (Jackpot)</span>
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              當三枚滾輪的中獎符號完全相同時，將觸發全螢幕 <strong className="text-amber-300">JACKPOT 大獎</strong>！不僅傷害與防禦數值獲得 2.2 ~ 2.5 倍乘算，藥水更能解除全身劇毒，金幣也能獲得大量金庫額外獎勵。
            </p>
          </div>

          {/* Rule 4: Symbols Catalog */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <span>💎</span>
              <span>4. 符號動態與效果一覽</span>
            </h3>
            <div className="space-y-1.5">
              {(Object.keys(SYMBOLS_CATALOG) as SymbolId[]).map(key => {
                const s = SYMBOLS_CATALOG[key];
                return (
                  <div
                    key={key}
                    className="p-2 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-start gap-2"
                  >
                    <div className="shrink-0 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                      <SymbolIcon id={key} size="md" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs" style={{ color: s.color }}>
                          {s.nameZh}
                        </span>
                        <span className="text-[10px] text-amber-400/90 font-mono">
                          {s.jackpotDesc}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {s.descZh}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rule 5: Pool building & Achievements */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <h3 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span>🎪</span>
              <span>5. 地城黑市與成就徽章</span>
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              每通過一層戰鬥可進入黑市構築滾輪。記得淨化 <strong className="text-neutral-200">💀 骷髏詛咒</strong>！遊戲內置成就系統，無論是達成 7 次 Jackpot、無傷擊潰首領或搜刮 50 枚金幣，都能解鎖榮譽徽章！
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer"
          >
            我明白了，開始戰鬥！
          </button>
        </div>
      </div>
    </div>
  );
};
