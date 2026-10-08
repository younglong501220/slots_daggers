import { GameSymbol, SymbolId } from '../types/game';

export const SYMBOLS_CATALOG: Record<SymbolId, GameSymbol> = {
  DAGGER: {
    id: 'DAGGER',
    name: 'Dagger',
    nameZh: '短劍',
    icon: '🗡️',
    desc: 'Deals 4 physical damage to enemy.',
    descZh: '造成 4 點物理傷害。',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#b91c1c',
    baseValue: 4,
    jackpotDesc: '【三連斬】傷害乘算 2.5 倍（造成 30 點斬擊！）'
  },
  SHIELD: {
    id: 'SHIELD',
    name: 'Shield',
    nameZh: '護盾',
    icon: '🛡️',
    desc: 'Grants 5 armor to block incoming damage.',
    descZh: '獲得 5 點護甲，抵擋敵人攻擊。',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#1d4ed8',
    baseValue: 5,
    jackpotDesc: '【絕對防禦】護甲乘算 2.2 倍（獲得 33 點鋼鐵壁障！）'
  },
  COIN: {
    id: 'COIN',
    name: 'Coin',
    nameZh: '金幣',
    icon: '🪙',
    desc: 'Loot 4 gold for shop purchases.',
    descZh: '搜刮 4 枚金幣，用於黑市構築。',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#a16207',
    baseValue: 4,
    jackpotDesc: '【金幣噴發】額外獎勵 +20 枚黃金金庫大獎！'
  },
  POTION: {
    id: 'POTION',
    name: 'Potion',
    nameZh: '生命藥水',
    icon: '🧪',
    desc: 'Restores 6 HP immediately.',
    descZh: '立即回復 6 點生命值。',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#047857',
    baseValue: 6,
    jackpotDesc: '【甘露靈藥】回復 20 點生命並完全淨化身上所有毒素！'
  },
  POISON: {
    id: 'POISON',
    name: 'Poison',
    nameZh: '毒藥瓶',
    icon: '☠️',
    desc: 'Inflicts 3 poison stacks (damages every turn).',
    descZh: '施加 3 層劇毒（每回合扣血無視護甲，每回合遞減 1）。',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#7e22ce',
    baseValue: 3,
    jackpotDesc: '【毒爆連鎖】疊加毒素翻倍，瞬間造成 18 層致命劇毒！'
  },
  SKULL: {
    id: 'SKULL',
    name: 'Curse Skull',
    nameZh: '骷髏詛咒',
    icon: '💀',
    desc: 'Backfires! Deals 3 damage to yourself.',
    descZh: '詛咒反噬！自身受到 3 點自殘傷害。',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: '#475569',
    baseValue: 3,
    jackpotDesc: '【厄運降臨】自損 10 HP！儘快在黑市將其淨化移除！'
  },
  LIGHTNING: {
    id: 'LIGHTNING',
    name: 'Lightning',
    nameZh: '雷擊寶珠',
    icon: '⚡',
    desc: 'Deals 6 piercing damage directly bypassing shield.',
    descZh: '造成 6 點穿透傷害（直接無視敵人護甲！）。',
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#0284c7',
    baseValue: 6,
    jackpotDesc: '【天罰雷殛】造成 24 點穿透傷害並使敵人麻痺 1 回合！'
  },
  BLOOD: {
    id: 'BLOOD',
    name: 'Vampire Blood',
    nameZh: '嗜血符文',
    icon: '🩸',
    desc: 'Deals 5 damage and absorbs 3 HP.',
    descZh: '造成 5 點傷害並吸取 3 點生命。',
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#be123c',
    baseValue: 5,
    jackpotDesc: '【血族真祖】造成 20 點傷害並吸取 12 點生命！'
  },
  BOMB: {
    id: 'BOMB',
    name: 'Blast Bomb',
    nameZh: '破甲炸藥',
    icon: '💣',
    desc: 'Deals 7 damage and destroys 8 enemy armor.',
    descZh: '造成 7 點傷害並破壞敵人 8 點護甲。',
    color: '#fb923c',
    bgColor: 'rgba(251, 146, 60, 0.15)',
    borderColor: '#c2410c',
    baseValue: 7,
    jackpotDesc: '【核裂轟炸】造成 25 點爆炸傷害並粉碎敵人所有護甲！'
  }
};

/**
 * Initial reel strips for the three reels.
 * Each reel is an ordered strip of symbols.
 */
export const INITIAL_REEL_STRIPS: SymbolId[][] = [
  ['DAGGER', 'SHIELD', 'COIN', 'POISON', 'SKULL', 'DAGGER', 'SHIELD'],
  ['DAGGER', 'SHIELD', 'POTION', 'COIN', 'SKULL', 'SHIELD', 'POISON'],
  ['DAGGER', 'SHIELD', 'COIN', 'POTION', 'DAGGER', 'SKULL', 'COIN']
];
