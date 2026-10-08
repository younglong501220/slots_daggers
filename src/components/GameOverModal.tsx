import React from 'react';
import { Achievement } from '../types/achievement';

interface GameOverModalProps {
  isWin: boolean;
  floor: number;
  gold: number;
  jackpotCount: number;
  totalDamageDealt: number;
  achievements: Achievement[];
  onRestart: () => void;
  onContinueEndless?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isWin,
  floor,
  gold,
  jackpotCount,
  totalDamageDealt,
  achievements,
  onRestart,
  onContinueEndless
}) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-neutral-900 border-2 rounded-2xl w-full max-w-lg p-5 sm:p-6 text-center shadow-2xl relative overflow-hidden border-neutral-700 max-h-[92vh] flex flex-col">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isWin ? 'bg-amber-500/20' : 'bg-rose-500/20'
          }`}
        />

        <div className="text-4xl sm:text-5xl mb-2">{isWin ? '🏆' : '💀'}</div>

        <h2
          className={`text-xl sm:text-2xl font-black mb-1.5 tracking-wide ${
            isWin ? 'text-amber-400' : 'text-rose-500'
          }`}
        >
          {isWin ? '古堡凱旋！地城大捷！' : '冒險者倒下了...'}
        </h2>

        <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
          {isWin
            ? '你以精準的目押技藝與強大的輪盤構築，成功討伐了古堡吸血領主！地城重獲安寧！'
            : `你在第 ${floor} 層遭遇強敵不幸陣亡。調整符號搭配與淨化骷髏，再來一次吧！`}
        </p>

        {/* Scrollable stats and badges area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 text-left no-scrollbar">
          {/* Stats Grid */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] text-neutral-500 block">到達層數</span>
              <span className="text-sm sm:text-base font-bold font-mono text-neutral-200">
                第 {floor} 層
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">搜刮金幣</span>
              <span className="text-sm sm:text-base font-bold font-mono text-amber-400">
                🪙 {gold}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">觸發 Jackpot</span>
              <span className="text-sm sm:text-base font-bold font-mono text-yellow-300">
                {jackpotCount} 次
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">累計輸出傷害</span>
              <span className="text-sm sm:text-base font-bold font-mono text-rose-400">
                {totalDamageDealt} 點
              </span>
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>🏆</span>
                <span>已解鎖成就徽章 ({unlockedAchievements.length} / {achievements.length})</span>
              </span>
            </div>

            {unlockedAchievements.length === 0 ? (
              <p className="text-[11px] text-neutral-500 italic py-1">
                尚未解鎖任何徽章，多嘗試目押、賺取金幣與無傷擊殺敵人吧！
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {unlockedAchievements.map(ach => (
                  <div
                    key={ach.id}
                    className="p-1.5 bg-amber-950/30 border border-amber-500/40 rounded-lg flex items-center gap-1.5"
                  >
                    <span className="text-lg">{ach.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-amber-300 truncate">
                        {ach.title}
                      </div>
                      <div className="text-[9px] text-neutral-400 truncate">
                        {ach.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          {isWin && onContinueEndless && (
            <button
              type="button"
              onClick={onContinueEndless}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg cursor-pointer"
            >
              🌌 挑戰無盡深淵模式 (Endless) ➔
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg cursor-pointer"
          >
            🔄 重新開始冒險
          </button>
        </div>
      </div>
    </div>
  );
};
