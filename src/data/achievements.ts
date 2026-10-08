import { Achievement } from '../types/achievement';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: '初入地城',
    description: '成功擊敗第 1 層的哥布林斥候。',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'jackpot_novice',
    title: '天選之子',
    description: '累計觸發 3 次 3-of-a-kind Jackpot 大獎。',
    icon: '🎰',
    unlocked: false
  },
  {
    id: 'jackpot_god',
    title: '幸運女神寵兒',
    description: '累計觸發 7 次 Jackpot 大獎。',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'gold_hoarder',
    title: '富可敵國',
    description: '單局冒險中持有金幣達到 50 🪙 以上。',
    icon: '💰',
    unlocked: false
  },
  {
    id: 'iron_fortress',
    title: '鐵壁銅牆',
    description: '單局護甲值累積堆疊達到 20 點以上。',
    icon: '🛡️',
    unlocked: false
  },
  {
    id: 'poison_master',
    title: '劇毒煉金師',
    description: '成功給敵方目標疊加 10 層以上劇毒。',
    icon: '☠️',
    unlocked: false
  },
  {
    id: 'untouchable',
    title: '無傷神話',
    description: '零傷亡通關！擊敗一層守衛時自身生命值保持滿血 (35/35 HP)。',
    icon: '🩹',
    unlocked: false
  },
  {
    id: 'curse_cleanser',
    title: '詛咒救贖',
    description: '在黑市成功淨化剔除輪盤上的骷髏詛咒。',
    icon: '💀',
    unlocked: false
  },
  {
    id: 'high_roller',
    title: '豪賭狂徒',
    description: '使用 3 倍額度下注並成功打出傷害。',
    icon: '🎲',
    unlocked: false
  },
  {
    id: 'relic_collector',
    title: '寶物獵人',
    description: '單場冒險中搜集裝備 3 件以上傳奇遺物。',
    icon: '💎',
    unlocked: false
  },
  {
    id: 'vampire_slayer',
    title: '古堡血夜終結者',
    description: '成功斬殺第 5 層古堡吸血領主！',
    icon: '👑',
    unlocked: false
  }
];

const STORAGE_KEY = 'slots_and_daggers_achievements_v1';

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Achievement[];
      // Merge with default list in case new achievements were added
      return INITIAL_ACHIEVEMENTS.map(def => {
        const found = parsed.find(p => p.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    }
  } catch {
    // ignore json parse error
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch {
    // ignore
  }
}
