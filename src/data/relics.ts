import { Relic } from '../types/game';

export const ALL_RELICS: Relic[] = [
  {
    id: 'lucky_clover',
    name: '幸運四葉草',
    icon: '🍀',
    desc: '滾輪滾動速度放緩 25%，使「目押手動煞車」更加游刃有餘！',
    cost: 16
  },
  {
    id: 'whetstone',
    name: '研磨石',
    icon: '🪨',
    desc: '短劍鋒利度提升，所有【短劍】造成傷害 +2 點。',
    cost: 14
  },
  {
    id: 'spiked_shield',
    name: '荊棘盾牌',
    icon: '🛡️',
    desc: '獲得護甲時，同時反彈 2 點傷害刺向敵人。',
    cost: 14
  },
  {
    id: 'midas_magnet',
    name: '點金磁鐵',
    icon: '🧲',
    desc: '每搜刮一枚【金幣】，額外多獲得 2 枚金幣收益。',
    cost: 12
  },
  {
    id: 'alchemist_flask',
    name: '鍊金燒瓶',
    icon: '🧪',
    desc: '【生命藥水】治療效果額外 +3 點生命。',
    cost: 12
  },
  {
    id: 'toxic_catalyst',
    name: '劇毒催化劑',
    icon: '⚗️',
    desc: '每次成功施加毒素時，額外追加 +1 層毒素。',
    cost: 15
  },
  {
    id: 'iron_will',
    name: '先遣胸甲',
    icon: '🎽',
    desc: '每場戰鬥開始時，冒險者直接自帶 8 點初始護甲。',
    cost: 15
  },
  {
    id: 'crystal_dagger',
    name: '極限水晶刃',
    icon: '💎',
    desc: '三連短劍【大獎 Jackpot】傷害乘數提升至 3.2 倍！',
    cost: 18
  }
];
