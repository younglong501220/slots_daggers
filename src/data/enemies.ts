import { EnemyTemplate } from '../types/game';

export const DUNGEON_ENEMIES: EnemyTemplate[] = [
  {
    id: 'goblin_scout',
    name: '哥布林斥候',
    maxHp: 24,
    avatar: '👺',
    baseAtk: 5,
    description: '揮舞著生鏽匕首的先遣哥布林，動作敏捷但防禦脆弱。',
    intentsPattern: [
      { type: 'ATTACK', value: 5, textZh: '突刺攻擊 5', icon: '⚔️' },
      { type: 'ATTACK', value: 6, textZh: '狂亂揮砍 6', icon: '⚔️' },
      { type: 'DEFEND', value: 4, textZh: '木盾防禦 4', icon: '🛡️' }
    ]
  },
  {
    id: 'corrupted_slime',
    name: '腐化史萊姆',
    maxHp: 36,
    avatar: '🦠',
    baseAtk: 7,
    description: '散發惡臭的黏稠膠體，會噴吐腐蝕酸液使人中毒。',
    intentsPattern: [
      { type: 'POISON', value: 3, textZh: '噴吐酸液 (施加3毒)', icon: '☠️' },
      { type: 'ATTACK', value: 7, textZh: '黏液重壓 7', icon: '⚔️' },
      { type: 'DEFEND', value: 6, textZh: '凝膠硬化 6', icon: '🛡️' }
    ]
  },
  {
    id: 'shadow_spider',
    name: '幽暗蜘蛛女王',
    maxHp: 48,
    avatar: '🕷️',
    baseAtk: 9,
    description: '潛伏在地城暗處的劇毒巨蛛，擅長利用蛛網防禦並連續下毒。',
    intentsPattern: [
      { type: 'DEFEND', value: 8, textZh: '蛛絲結界 8', icon: '🕸️' },
      { type: 'ATTACK', value: 10, textZh: '尖牙撕咬 10', icon: '⚔️' },
      { type: 'POISON', value: 4, textZh: '注入劇毒 (施加4毒)', icon: '☠️' }
    ]
  },
  {
    id: 'armored_skeleton',
    name: '骷髏重裝衛兵',
    maxHp: 65,
    avatar: '💀',
    baseAtk: 12,
    description: '遠古王國的狂信近衛，手持塔盾與巨錘，防禦極其堅固。',
    intentsPattern: [
      { type: 'DEFEND', value: 12, textZh: '王國巨盾 12', icon: '🛡️' },
      { type: 'ATTACK', value: 13, textZh: '重錘撼地 13', icon: '⚔️' },
      { type: 'ATTACK', value: 16, textZh: '狂怒連枷 16', icon: '💥' }
    ]
  },
  {
    id: 'vampire_lord',
    name: '古堡吸血領主',
    maxHp: 95,
    avatar: '🧛',
    baseAtk: 15,
    description: '佔據地城深處的吸血鬼長老，能吸取活人生命並化身血蝠。',
    intentsPattern: [
      { type: 'DRAIN', value: 12, textZh: '嗜血奪命 12 (傷害並自愈)', icon: '🩸' },
      { type: 'ATTACK', value: 16, textZh: '血翼斬切 16', icon: '⚔️' },
      { type: 'POISON', value: 5, textZh: '黑血詛咒 (施加5毒)', icon: '☠️' },
      { type: 'DEFEND', value: 14, textZh: '暗影蝠群 14', icon: '🦇' }
    ]
  }
];

export function generateEndlessEnemy(floor: number): EnemyTemplate {
  const loopCount = Math.floor(floor / 5);
  const hp = 80 + (floor - 5) * 16;
  const atk = 14 + (floor - 5) * 2;
  const avatars = ['🐲', '👿', '🦹', '🧙', '👹'];
  const titles = ['深淵黑龍', '虛空魔將', '褻瀆狂信徒', '巫妖大法師', '修羅修女'];
  const avatar = avatars[(floor - 1) % avatars.length];
  const name = `${titles[(floor - 1) % titles.length]} (Lv.${floor})`;

  return {
    id: `endless_${floor}`,
    name,
    maxHp: hp,
    avatar,
    baseAtk: atk,
    description: `第 ${floor} 層遭遇的深淵強敵，攻擊力與生命值大幅強化。`,
    intentsPattern: [
      { type: 'ATTACK', value: atk, textZh: `深淵打擊 ${atk}`, icon: '⚔️' },
      { type: 'DRAIN', value: Math.round(atk * 0.8), textZh: `靈魂吮吸 ${Math.round(atk * 0.8)}`, icon: '🩸' },
      { type: 'DEFEND', value: atk + 4, textZh: `虛空護障 ${atk + 4}`, icon: '🛡️' },
      { type: 'POISON', value: 4 + loopCount, textZh: `深淵腐蝕 (${4 + loopCount}毒)`, icon: '☠️' }
    ]
  };
}
