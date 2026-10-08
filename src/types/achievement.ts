export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PlayerStats {
  jackpots: number;
  totalDamage: number;
  enemiesDefeated: number;
  maxGold: number;
  highestShield: number;
  highestPoison: number;
  highestBetUsed: number;
  cursesPurged: number;
  relicsCount: number;
  floorsClearedNoDamage: number;
}
