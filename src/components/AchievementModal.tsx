import React from 'react';
import { Achievement } from '../types/achievement';

interface AchievementModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievements,
  onClose
}) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const pct = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-neutral-900 border-2 border-amber-600/70 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-neutral-900 to-amber-950/60 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-400">
                成就徽章館 (Achievements)
              </h2>
              <p className="text-xs text-neutral-400">
                已解鎖 {unlockedCount} / {achievements.length} ({pct}%)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold flex items-center justify-center cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-800">
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Badges List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-amber-950/25 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                  : 'bg-neutral-950/60 border-neutral-800/80 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                  ach.unlocked
                    ? 'bg-gradient-to-br from-amber-600 to-yellow-600 border-amber-300 shadow-md text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 filter grayscale'
                }`}
              >
                {ach.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      ach.unlocked ? 'text-amber-300' : 'text-neutral-400'
                    }`}
                  >
                    {ach.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      ach.unlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-900 text-neutral-500'
                    }`}
                  >
                    {ach.unlocked ? '已達成' : '未解鎖'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 leading-snug">
                  {ach.description}
                </p>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="text-[10px] text-amber-400/60 font-mono mt-1 block">
                    達成時間: {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
