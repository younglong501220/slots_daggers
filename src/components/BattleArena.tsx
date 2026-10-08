import React from 'react';
import { EnemyIntent, FloatingText, Relic } from '../types/game';

interface BattleArenaProps {
  heroHp: number;
  heroMaxHp: number;
  heroShield: number;
  heroPoison: number;
  heroHit: boolean;
  enemyName: string;
  enemyAvatar: string;
  enemyHp: number;
  enemyMaxHp: number;
  enemyShield: number;
  enemyPoison: number;
  enemyHit: boolean;
  enemyIntent: EnemyIntent | null;
  relics: Relic[];
  floatingTexts: FloatingText[];
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  heroHp,
  heroMaxHp,
  heroShield,
  heroPoison,
  heroHit,
  enemyName,
  enemyAvatar,
  enemyHp,
  enemyMaxHp,
  enemyShield,
  enemyPoison,
  enemyHit,
  enemyIntent,
  relics,
  floatingTexts
}) => {
  const heroHpPct = Math.max(0, Math.min(100, (heroHp / heroMaxHp) * 100));
  const enemyHpPct = Math.max(0, Math.min(100, (enemyHp / enemyMaxHp) * 100));

  return (
    <div className="relative mb-2.5">
      {/* Floating combat numbers over arena */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingTexts.map(ft => (
          <div
            key={ft.id}
            className={`absolute font-black text-sm sm:text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-float-fade ${
              ft.type === 'damage'
                ? 'text-rose-400'
                : ft.type === 'heal'
                ? 'text-emerald-400'
                : ft.type === 'shield'
                ? 'text-blue-400 font-extrabold'
                : ft.type === 'gold'
                ? 'text-yellow-400 font-extrabold'
                : ft.type === 'poison'
                ? 'text-purple-400'
                : ft.type === 'crit'
                ? 'text-amber-300 text-lg sm:text-xl font-extrabold'
                : 'text-neutral-300'
            }`}
            style={{ left: `${ft.x}%`, top: `${ft.y}%` }}
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Hero & Enemy Cards Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Player Card */}
        <div
          className={`relative bg-neutral-900/90 border-2 rounded-xl p-2.5 sm:p-3 transition-all ${
            heroHit ? 'border-rose-500 bg-rose-950/40 animate-shake' : 'border-neutral-800'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs sm:text-sm text-sky-400 flex items-center gap-1">
              <span>冒險者</span>
            </span>
            <div className="flex items-center gap-1">
              {heroPoison > 0 && (
                <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 border border-purple-600/70 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                  ☠️ {heroPoison}
                </span>
              )}
            </div>
          </div>

          {/* Avatar representation */}
          <div className="flex items-center justify-center my-1 relative">
            <div
              className={`text-3xl sm:text-4xl filter transition-transform duration-150 ${
                heroHit ? 'scale-90 text-rose-300' : 'hover:scale-105'
              }`}
            >
              🧙‍♂️
            </div>
          </div>

          {/* Health Bar */}
          <div className="mb-1">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-0.5">
              <span>HP</span>
              <span className="font-bold tabular-nums">
                {heroHp} / {heroMaxHp}
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  heroHpPct > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : heroHpPct > 25
                    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                    : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${heroHpPct}%` }}
              />
            </div>
          </div>

          {/* Armor / Shield indicator - Always visible */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-800/80">
            <span className="text-neutral-500 text-[10px] font-mono">護甲:</span>
            <span
              className={`font-bold font-mono px-1.5 py-0.2 rounded text-[11px] flex items-center gap-1 ${
                heroShield > 0
                  ? 'text-sky-300 bg-sky-950/80 border border-sky-600/80'
                  : 'text-neutral-500 bg-neutral-950/60 border border-neutral-800'
              }`}
            >
              <span>🛡️</span>
              <span>{heroShield}</span>
            </span>
          </div>

          {/* Equipped Relics strip */}
          {relics.length > 0 && (
            <div className="pt-1.5 mt-1 border-t border-neutral-800/60 flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
              <span className="text-[9px] text-neutral-500 font-mono">遺物:</span>
              {relics.map(r => (
                <span
                  key={r.id}
                  title={`${r.name}: ${r.desc}`}
                  className="cursor-help text-xs hover:scale-125 transition-transform"
                >
                  {r.icon}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Enemy Card */}
        <div
          className={`relative bg-neutral-900/90 border-2 rounded-xl p-2.5 sm:p-3 transition-all ${
            enemyHit ? 'border-rose-500 bg-rose-950/40 animate-shake' : 'border-neutral-800'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs sm:text-sm text-rose-400 truncate max-w-[100px] sm:max-w-none">
              {enemyName}
            </span>
            <div className="flex items-center gap-1">
              {enemyPoison > 0 && (
                <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 border border-purple-600/70 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                  ☠️ {enemyPoison}
                </span>
              )}
            </div>
          </div>

          {/* Avatar representation */}
          <div className="flex items-center justify-center my-1 relative">
            <div
              className={`text-3xl sm:text-4xl filter transition-transform duration-150 ${
                enemyHit ? 'scale-90 text-rose-300' : 'hover:scale-105'
              }`}
            >
              {enemyAvatar}
            </div>
          </div>

          {/* Health Bar */}
          <div className="mb-1">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-0.5">
              <span>HP</span>
              <span className="font-bold tabular-nums">
                {enemyHp} / {enemyMaxHp}
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300"
                style={{ width: `${enemyHpPct}%` }}
              />
            </div>
          </div>

          {/* Armor / Shield indicator & Intent */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-800/80">
            <span
              className={`font-bold font-mono px-1.5 py-0.2 rounded text-[11px] flex items-center gap-1 ${
                enemyShield > 0
                  ? 'text-sky-300 bg-sky-950/80 border border-sky-600/80'
                  : 'text-neutral-500 bg-neutral-950/60 border border-neutral-800'
              }`}
            >
              <span>🛡️</span>
              <span>{enemyShield}</span>
            </span>

            {enemyIntent ? (
              <span className="font-semibold text-amber-400 flex items-center gap-1 text-[11px]">
                <span>{enemyIntent.icon}</span>
                <span>{enemyIntent.textZh}</span>
              </span>
            ) : (
              <span className="text-neutral-500 text-[10px]">思考中...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
