import React, { useState } from 'react';
import { Relic, SymbolId } from '../types/game';
import { SYMBOLS_CATALOG } from '../data/symbols';
import { ALL_RELICS } from '../data/relics';
import { SFX } from '../utils/audio';
import { SymbolIcon } from './SymbolIcon';

interface ShopModalProps {
  gold: number;
  floor: number;
  heroHp: number;
  heroMaxHp: number;
  reelStrips: SymbolId[][];
  ownedRelics: Relic[];
  onBuySymbol: (reelIndex: number, symbolId: SymbolId, cost: number) => void;
  onRemoveSkull: (reelIndex: number, cost: number) => void;
  onBuyRelic: (relic: Relic) => void;
  onCampfireHeal: (cost: number, healAmount: number) => void;
  onProceedNextFloor: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  gold,
  floor,
  heroHp,
  heroMaxHp,
  reelStrips,
  ownedRelics,
  onBuySymbol,
  onRemoveSkull,
  onBuyRelic,
  onCampfireHeal,
  onProceedNextFloor
}) => {
  const [activeTab, setActiveTab] = useState<'symbols' | 'relics' | 'purge'>('symbols');
  const [selectedTargetReel, setSelectedTargetReel] = useState<number>(0);

  // Symbol offers available for purchase
  const symbolOffers: { id: SymbolId; cost: number }[] = [
    { id: 'DAGGER', cost: 10 },
    { id: 'SHIELD', cost: 10 },
    { id: 'POISON', cost: 12 },
    { id: 'POTION', cost: 12 },
    { id: 'LIGHTNING', cost: 15 },
    { id: 'BLOOD', cost: 16 },
    { id: 'BOMB', cost: 15 }
  ];

  // Relics not yet owned
  const availableRelics = ALL_RELICS.filter(
    r => !ownedRelics.some(owned => owned.id === r.id)
  );

  // Check if any reel has skulls
  const skullLocations = reelStrips.map((strip, idx) => ({
    reelIdx: idx,
    count: strip.filter(s => s === 'SKULL').length
  }));
  const totalSkulls = skullLocations.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-neutral-900 border-2 border-amber-600/80 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-neutral-900 to-amber-950/60 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎪</span>
              <h2 className="text-lg font-bold text-amber-400">地下城黑市與篝火</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              擊敗當前守衛！在前往第 {floor + 1} 層前構築你的輪盤與力量
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400">持有金幣</span>
            <div className="text-lg font-bold text-amber-400 font-mono">
              🪙 {gold}
            </div>
          </div>
        </div>

        {/* Campfire quick heal section */}
        <div className="bg-neutral-950/80 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span>🔥 篝火休憩 (HP: {heroHp}/{heroMaxHp})</span>
          </div>
          <button
            type="button"
            disabled={gold < 8 || heroHp >= heroMaxHp}
            onClick={() => onCampfireHeal(8, 15)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              gold >= 8 && heroHp < heroMaxHp
                ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>包紮傷口 (+15 HP)</span>
            <span className="text-amber-300 font-mono">🪙 8</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-3 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('symbols')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'symbols'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            符號擴充 ({symbolOffers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('purge')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'purge'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            淨化骷髏 ({totalSkulls} 詛咒)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('relics')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'relics'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            傳奇遺物 ({availableRelics.length})
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'symbols' && (
            <div>
              {/* Target reel selector */}
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 mb-3 flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-medium">
                  將符號植入至：
                </span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        SFX.click();
                        setSelectedTargetReel(idx);
                      }}
                      className={`px-2.5 py-1 text-xs rounded font-bold cursor-pointer transition-all ${
                        selectedTargetReel === idx
                          ? 'bg-amber-600 text-neutral-950 ring-1 ring-amber-400'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      滾輪 {idx + 1} ({reelStrips[idx].length} 符號)
                    </button>
                  ))}
                </div>
              </div>

              {/* Symbol cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {symbolOffers.map(offer => {
                  const sym = SYMBOLS_CATALOG[offer.id];
                  const canAfford = gold >= offer.cost;

                  return (
                    <div
                      key={offer.id}
                      className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between hover:border-neutral-700 transition-all"
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className="p-1 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                          <SymbolIcon id={offer.id} size="md" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-neutral-200">
                              {sym.nameZh}
                            </span>
                            <span className="font-mono text-xs font-bold text-amber-400">
                              🪙 {offer.cost}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                            {sym.descZh}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuySymbol(selectedTargetReel, offer.id, offer.cost)}
                        className={`w-full py-1.5 text-xs font-bold rounded-lg transition-all ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 cursor-pointer shadow'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        購買植入滾輪 {selectedTargetReel + 1}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'purge' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                骷髏詛咒會導致自傷！花費 15 金幣將骷髏從指定滾輪永久移除，提高中獎率與存活率。
              </p>

              {totalSkulls === 0 ? (
                <div className="p-6 text-center bg-neutral-950 rounded-xl border border-neutral-800 text-emerald-400 text-sm">
                  ✨ 太棒了！所有滾輪上已無任何骷髏詛咒！
                </div>
              ) : (
                <div className="space-y-2">
                  {skullLocations.map(loc => {
                    const canAfford = gold >= 15;
                    const hasSkull = loc.count > 0;

                    return (
                      <div
                        key={loc.reelIdx}
                        className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💀</span>
                          <div>
                            <div className="font-bold text-xs text-neutral-200">
                              滾輪 {loc.reelIdx + 1}
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              詛咒數量：{loc.count} 枚
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!hasSkull || !canAfford}
                          onClick={() => onRemoveSkull(loc.reelIdx, 15)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            hasSkull && canAfford
                              ? 'bg-rose-700 hover:bg-rose-600 text-white cursor-pointer'
                              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          }`}
                        >
                          {hasSkull ? '淨化移除 (🪙 15)' : '已無詛咒'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'relics' && (
            <div className="space-y-2.5">
              {availableRelics.length === 0 ? (
                <div className="p-6 text-center bg-neutral-950 rounded-xl border border-neutral-800 text-amber-400 text-sm">
                  🏆 你已搜集了當前黑市的所有傳奇遺物！
                </div>
              ) : (
                availableRelics.map(relic => {
                  const canAfford = gold >= relic.cost;

                  return (
                    <div
                      key={relic.id}
                      className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                          {relic.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-amber-300">
                              {relic.name}
                            </span>
                            <span className="text-xs font-mono text-amber-400">
                              🪙 {relic.cost}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {relic.desc}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuyRelic(relic)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 cursor-pointer shadow'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        購買遺物
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            完成構築後繼續前進
          </span>
          <button
            type="button"
            onClick={onProceedNextFloor}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg transition-all"
          >
            前往第 {floor + 1} 層 ➔
          </button>
        </div>
      </div>
    </div>
  );
};
