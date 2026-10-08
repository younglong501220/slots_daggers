export type SymbolId =
  | 'DAGGER'
  | 'SHIELD'
  | 'COIN'
  | 'POTION'
  | 'POISON'
  | 'SKULL'
  | 'LIGHTNING'
  | 'BLOOD'
  | 'BOMB';

export interface GameSymbol {
  id: SymbolId;
  name: string;
  nameZh: string;
  icon: string;
  desc: string;
  descZh: string;
  color: string;
  bgColor: string;
  borderColor: string;
  baseValue: number;
  jackpotDesc: string;
}

export type EnemyIntentType = 'ATTACK' | 'DEFEND' | 'POISON' | 'DRAIN' | 'BUFF';

export interface EnemyIntent {
  type: EnemyIntentType;
  value: number;
  textZh: string;
  icon: string;
}

export interface EnemyTemplate {
  id: string;
  name: string;
  maxHp: number;
  avatar: string;
  baseAtk: number;
  description: string;
  intentsPattern: EnemyIntent[];
}

export interface Relic {
  id: string;
  name: string;
  icon: string;
  desc: string;
  cost: number;
}

export interface FloatingText {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'shield' | 'gold' | 'poison' | 'crit' | 'skull';
  x: number;
  y: number;
}

export interface CombatLogEntry {
  id: string;
  text: string;
  type: 'hero' | 'enemy' | 'combo' | 'system' | 'hazard' | 'gold';
  timestamp: string;
}
