import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  SymbolId,
  Relic,
  EnemyTemplate,
  EnemyIntent,
  FloatingText,
  CombatLogEntry
} from './types/game';
import { Achievement } from './types/achievement';
import { SYMBOLS_CATALOG, INITIAL_REEL_STRIPS } from './data/symbols';
import { DUNGEON_ENEMIES, generateEndlessEnemy } from './data/enemies';
import { loadAchievements, saveAchievements } from './data/achievements';
import { SFX } from './utils/audio';

import { SlotMachine } from './components/SlotMachine';
import { BattleArena } from './components/BattleArena';
import { ShopModal } from './components/ShopModal';
import { ReelInspectorModal } from './components/ReelInspectorModal';
import { RuleGuideModal } from './components/RuleGuideModal';
import { GameOverModal } from './components/GameOverModal';
import { AchievementModal } from './components/AchievementModal';

type TurnState = 'IDLE' | 'SPINNING' | 'RESOLVING' | 'ENEMY_TURN';

export default function App() {
  // Game progress state
  const [floor, setFloor] = useState<number>(1);
  const [gold, setGold] = useState<number>(15);
  const [bet, setBet] = useState<number>(1);
  const [relics, setRelics] = useState<Relic[]>([]);
  const [reelStrips, setReelStrips] = useState<SymbolId[][]>(INITIAL_REEL_STRIPS);

  // Hero state
  const [heroHp, setHeroHp] = useState<number>(35);
  const [heroMaxHp, setHeroMaxHp] = useState<number>(35);
  const [heroShield, setHeroShield] = useState<number>(0);
  const [heroPoison, setHeroPoison] = useState<number>(0);
  const [heroHit, setHeroHit] = useState<boolean>(false);

  // Enemy state
  const [enemyTemplate, setEnemyTemplate] = useState<EnemyTemplate>(DUNGEON_ENEMIES[0]);
  const [enemyHp, setEnemyHp] = useState<number>(DUNGEON_ENEMIES[0].maxHp);
  const [enemyMaxHp, setEnemyMaxHp] = useState<number>(DUNGEON_ENEMIES[0].maxHp);
  const [enemyShield, setEnemyShield] = useState<number>(0);
  const [enemyPoison, setEnemyPoison] = useState<number>(0);
  const [enemyHit, setEnemyHit] = useState<boolean>(false);
  const [enemyIntentIndex, setEnemyIntentIndex] = useState<number>(0);
  const [enemyIntent, setEnemyIntent] = useState<EnemyIntent | null>(
    DUNGEON_ENEMIES[0].intentsPattern[0]
  );

  // Turn state
  const [turnState, setTurnState] = useState<TurnState>('IDLE');
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [results, setResults] = useState<(SymbolId | null)[]>([null, null, null]);
  const [jackpotBanner, setJackpotBanner] = useState<string | null>(null);

  // Achievement state
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements());
  const [unlockedToast, setUnlockedToast] = useState<Achievement | null>(null);

  // Modals & UI controls
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [isVictoryEnd, setIsVictoryEnd] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [crtFilter, setCrtFilter] = useState<boolean>(false);

  // Statistics
  const [jackpotCount, setJackpotCount] = useState<number>(0);
  const [totalDamageDealt, setTotalDamageDealt] = useState<number>(0);

  // Visual cues
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([
    {
      id: 'init-1',
      text: '⚔️ 進入地下城！選擇下注額度並瞄準中央 Payline 判定線！',
      type: 'system',
      timestamp: '00:00'
    }
  ]);

  const logBoxRef = useRef<HTMLDivElement>(null);

  // Synchronous internal refs to guarantee zero race condition or state desync
  const spinningRef = useRef<boolean[]>([false, false, false]);
  const resultsRef = useRef<(SymbolId | null)[]>([null, null, null]);
  const turnStateRef = useRef<TurnState>('IDLE');

  const heroHpRef = useRef<number>(35);
  const heroMaxHpRef = useRef<number>(35);
  const heroShieldRef = useRef<number>(0);
  const heroPoisonRef = useRef<number>(0);

  const enemyHpRef = useRef<number>(DUNGEON_ENEMIES[0].maxHp);
  const enemyMaxHpRef = useRef<number>(DUNGEON_ENEMIES[0].maxHp);
  const enemyShieldRef = useRef<number>(0);
  const enemyPoisonRef = useRef<number>(0);
  const enemyIntentRef = useRef<EnemyIntent | null>(DUNGEON_ENEMIES[0].intentsPattern[0]);
  const enemyIntentIndexRef = useRef<number>(0);

  const betRef = useRef<number>(1);
  const relicsRef = useRef<Relic[]>([]);
  const floorRef = useRef<number>(1);
  const goldRef = useRef<number>(15);

  // Keep refs synchronized with state
  useEffect(() => {
    heroHpRef.current = heroHp;
    heroMaxHpRef.current = heroMaxHp;
    heroShieldRef.current = heroShield;
    heroPoisonRef.current = heroPoison;
  }, [heroHp, heroMaxHp, heroShield, heroPoison]);

  useEffect(() => {
    enemyHpRef.current = enemyHp;
    enemyMaxHpRef.current = enemyMaxHp;
    enemyShieldRef.current = enemyShield;
    enemyPoisonRef.current = enemyPoison;
    enemyIntentRef.current = enemyIntent;
    enemyIntentIndexRef.current = enemyIntentIndex;
  }, [enemyHp, enemyMaxHp, enemyShield, enemyPoison, enemyIntent, enemyIntentIndex]);

  useEffect(() => {
    betRef.current = bet;
    relicsRef.current = relics;
    floorRef.current = floor;
    goldRef.current = gold;
  }, [bet, relics, floor, gold]);

  // Check if player has clover relic
  const hasCloverRelic = relics.some(r => r.id === 'lucky_clover');

  // Trigger achievement unlock helper
  const unlockAchievement = useCallback((achId: string) => {
    setAchievements(prev => {
      const target = prev.find(a => a.id === achId);
      if (target && !target.unlocked) {
        const now = new Date();
        const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
        const updated = prev.map(a =>
          a.id === achId ? { ...a, unlocked: true, unlockedAt: timeStr } : a
        );
        saveAchievements(updated);

        setUnlockedToast(target);
        SFX.jackpot();
        setTimeout(() => {
          setUnlockedToast(null);
        }, 3500);

        return updated;
      }
      return prev;
    });
  }, []);

  // Spawn floating combat text
  const addFloatingText = useCallback(
    (text: string, type: FloatingText['type'], target: 'hero' | 'enemy') => {
      const id = Math.random().toString(36).substring(2, 9);
      const x = target === 'hero' ? 22 + Math.random() * 8 : 68 + Math.random() * 8;
      const y = 35 + Math.random() * 15;
      setFloatingTexts(prev => [...prev, { id, text, type, x, y }]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(item => item.id !== id));
      }, 1200);
    },
    []
  );

  // Add combat log entry
  const addLog = useCallback(
    (text: string, type: CombatLogEntry['type'] = 'system') => {
      const now = new Date();
      const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
      const entry: CombatLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        text,
        type,
        timestamp: timeStr
      };
      setCombatLogs(prev => [entry, ...prev.slice(0, 49)]);
    },
    []
  );

  // Initialize new enemy battle
  const initBattle = useCallback(
    (floorNum: number) => {
      let template: EnemyTemplate;
      if (floorNum <= DUNGEON_ENEMIES.length) {
        template = DUNGEON_ENEMIES[floorNum - 1];
      } else {
        template = generateEndlessEnemy(floorNum);
      }

      setEnemyTemplate(template);
      setEnemyHp(template.maxHp);
      setEnemyMaxHp(template.maxHp);
      setEnemyShield(0);
      setEnemyPoison(0);
      setEnemyIntentIndex(0);
      setEnemyIntent(template.intentsPattern[0]);

      enemyHpRef.current = template.maxHp;
      enemyMaxHpRef.current = template.maxHp;
      enemyShieldRef.current = 0;
      enemyPoisonRef.current = 0;
      enemyIntentIndexRef.current = 0;
      enemyIntentRef.current = template.intentsPattern[0];

      // Iron Will relic check: grant 8 free shield at start
      const hasIronWill = relicsRef.current.some(r => r.id === 'iron_will');
      const startShield = hasIronWill ? 8 : 0;
      setHeroShield(startShield);
      heroShieldRef.current = startShield;

      spinningRef.current = [false, false, false];
      resultsRef.current = [null, null, null];
      turnStateRef.current = 'IDLE';

      setSpinning([false, false, false]);
      setResults([null, null, null]);
      setTurnState('IDLE');
      setJackpotBanner(null);

      addLog(`⚔️ 第 ${floorNum} 層：遭遇守衛【${template.name}】！`, 'system');
      if (hasIronWill) {
        addLog(`🛡️ 【先遣胸甲】生效，冒險者獲得 8 點初始壁障！`, 'hero');
      }
    },
    [addLog]
  );

  // Check achievements passively
  useEffect(() => {
    if (gold >= 50) {
      unlockAchievement('gold_hoarder');
    }
    if (heroShield >= 20) {
      unlockAchievement('iron_fortress');
    }
    if (enemyPoison >= 10) {
      unlockAchievement('poison_master');
    }
    if (jackpotCount >= 3) {
      unlockAchievement('jackpot_novice');
    }
    if (jackpotCount >= 7) {
      unlockAchievement('jackpot_god');
    }
    if (relics.length >= 3) {
      unlockAchievement('relic_collector');
    }
  }, [gold, heroShield, enemyPoison, jackpotCount, relics, unlockAchievement]);

  // Start Spin
  const handleStartSpin = useCallback(() => {
    if (turnStateRef.current !== 'IDLE' || heroHpRef.current <= 0 || enemyHpRef.current <= 0) {
      return;
    }

    // Deduct bet if affordable
    const currentBet = betRef.current;
    const currentGold = goldRef.current;
    const actualBet = Math.min(currentBet, currentGold);

    if (actualBet > 0) {
      const nextGold = currentGold - actualBet;
      goldRef.current = nextGold;
      setGold(nextGold);
      SFX.coin();
      addLog(`🎰 下注 ${actualBet} 🪙！輪盤旋轉開始！`, 'gold');
    } else {
      addLog(`🎰 破釜沉舟拉桿！(免費下注 1x 基礎效果)`, 'system');
    }

    turnStateRef.current = 'SPINNING';
    spinningRef.current = [true, true, true];
    resultsRef.current = [null, null, null];

    setTurnState('SPINNING');
    setSpinning([true, true, true]);
    setResults([null, null, null]);
    setJackpotBanner(null);
  }, [addLog]);

  // Handle enemy defeat
  const handleEnemyDefeat = useCallback(() => {
    SFX.victory();
    addLog(`🎉 【${enemyTemplate.name}】倒下了！戰鬥大獲全勝！`, 'combo');

    if (floorRef.current === 1) {
      unlockAchievement('first_blood');
    }
    if (floorRef.current === 5) {
      unlockAchievement('vampire_slayer');
    }
    if (heroHpRef.current >= heroMaxHpRef.current) {
      unlockAchievement('untouchable');
    }

    const baseReward = 8 + floorRef.current * 4;
    const hasMidas = relicsRef.current.some(r => r.id === 'midas_magnet');
    const finalReward = hasMidas ? baseReward + 6 : baseReward;

    const nextGold = goldRef.current + finalReward;
    goldRef.current = nextGold;
    setGold(nextGold);
    addLog(`🪙 搜刮戰利品：獲得 ${finalReward} 枚金幣！`, 'gold');

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    turnStateRef.current = 'IDLE';
    setTurnState('IDLE');

    if (floorRef.current === 5) {
      setTimeout(() => {
        setIsVictoryEnd(true);
        setShowGameOver(true);
      }, 700);
    } else {
      setTimeout(() => {
        setShowShop(true);
      }, 700);
    }
  }, [enemyTemplate, addLog, unlockAchievement]);

  // Damage calculation utility
  const applyDamage = (
    currentHp: number,
    currentShield: number,
    dmg: number,
    isPiercing: boolean = false
  ) => {
    let finalShield = currentShield;
    let finalHp = currentHp;
    let effectiveDmg = dmg;

    if (isPiercing) {
      finalHp = Math.max(0, currentHp - effectiveDmg);
    } else {
      if (finalShield > 0) {
        if (finalShield >= effectiveDmg) {
          finalShield -= effectiveDmg;
          effectiveDmg = 0;
        } else {
          effectiveDmg -= finalShield;
          finalShield = 0;
        }
      }
      finalHp = Math.max(0, currentHp - effectiveDmg);
    }

    return { finalHp, finalShield, effectiveDmg };
  };

  // Enemy Turn
  const executeEnemyTurn = useCallback(() => {
    if (enemyHpRef.current <= 0 || heroHpRef.current <= 0) {
      turnStateRef.current = 'IDLE';
      setTurnState('IDLE');
      return;
    }

    addLog(`👹 【${enemyTemplate.name}】開始行動...`, 'enemy');

    // 1. Enemy poison tick
    if (enemyPoisonRef.current > 0) {
      const pDmg = enemyPoisonRef.current;
      enemyHpRef.current = Math.max(0, enemyHpRef.current - pDmg);
      setEnemyHp(enemyHpRef.current);
      addFloatingText(`-${pDmg} ☠️`, 'poison', 'enemy');
      addLog(`敵人毒發受到 ${pDmg} 點劇毒傷害！`, 'enemy');

      enemyPoisonRef.current = Math.max(0, enemyPoisonRef.current - 1);
      setEnemyPoison(enemyPoisonRef.current);

      if (enemyHpRef.current <= 0) {
        setTimeout(() => handleEnemyDefeat(), 400);
        return;
      }
    }

    // 2. Enemy executes intent
    const intent = enemyIntentRef.current;
    if (intent) {
      if (intent.type === 'ATTACK') {
        SFX.hurt();
        setHeroHit(true);
        setTimeout(() => setHeroHit(false), 350);

        const res = applyDamage(
          heroHpRef.current,
          heroShieldRef.current,
          intent.value,
          false
        );
        heroHpRef.current = res.finalHp;
        heroShieldRef.current = res.finalShield;

        setHeroHp(heroHpRef.current);
        setHeroShield(heroShieldRef.current);

        addFloatingText(`-${intent.value}`, 'damage', 'hero');
        addLog(`敵人發動攻擊，造成 ${intent.value} 點傷害！`, 'enemy');

        if (heroHpRef.current <= 0) {
          setTimeout(() => {
            SFX.defeat();
            setShowGameOver(true);
            setIsVictoryEnd(false);
          }, 600);
        }
      } else if (intent.type === 'DEFEND') {
        SFX.shield();
        enemyShieldRef.current += intent.value;
        setEnemyShield(enemyShieldRef.current);
        addFloatingText(`+${intent.value} 🛡️`, 'shield', 'enemy');
        addLog(`敵人築起防線，獲得 ${intent.value} 點護甲！`, 'enemy');
      } else if (intent.type === 'POISON') {
        SFX.poison();
        heroPoisonRef.current += intent.value;
        setHeroPoison(heroPoisonRef.current);
        addFloatingText(`+${intent.value} ☠️`, 'poison', 'hero');
        addLog(`敵人噴灑劇毒，使冒險者中毒 ${intent.value} 層！`, 'enemy');
      } else if (intent.type === 'DRAIN') {
        SFX.hurt();
        setHeroHit(true);
        setTimeout(() => setHeroHit(false), 350);

        const drainVal = intent.value;
        const res = applyDamage(
          heroHpRef.current,
          heroShieldRef.current,
          drainVal,
          false
        );
        heroHpRef.current = res.finalHp;
        heroShieldRef.current = res.finalShield;

        setHeroHp(heroHpRef.current);
        setHeroShield(heroShieldRef.current);

        const healAmt = Math.round(drainVal * 0.6);
        enemyHpRef.current = Math.min(enemyMaxHpRef.current, enemyHpRef.current + healAmt);
        setEnemyHp(enemyHpRef.current);

        addFloatingText(`-${drainVal}`, 'damage', 'hero');
        addFloatingText(`+${healAmt} 🩸`, 'heal', 'enemy');
        addLog(`敵人嗜血奪命造成 ${drainVal} 點傷害並汲取了 ${healAmt} 點生命！`, 'enemy');

        if (heroHpRef.current <= 0) {
          setTimeout(() => {
            SFX.defeat();
            setShowGameOver(true);
            setIsVictoryEnd(false);
          }, 600);
        }
      }
    }

    // 3. Player poison tick
    if (heroPoisonRef.current > 0) {
      const pDmg = heroPoisonRef.current;
      heroHpRef.current = Math.max(0, heroHpRef.current - pDmg);
      setHeroHp(heroHpRef.current);
      addFloatingText(`-${pDmg} ☠️`, 'poison', 'hero');
      addLog(`你體內的毒素發作，受到 ${pDmg} 點毒傷！`, 'enemy');

      heroPoisonRef.current = Math.max(0, heroPoisonRef.current - 1);
      setHeroPoison(heroPoisonRef.current);

      if (heroHpRef.current <= 0) {
        setTimeout(() => {
          SFX.defeat();
          setShowGameOver(true);
          setIsVictoryEnd(false);
        }, 600);
      }
    }

    // 4. Advance enemy intent
    const nextIdx = (enemyIntentIndexRef.current + 1) % enemyTemplate.intentsPattern.length;
    enemyIntentIndexRef.current = nextIdx;
    enemyIntentRef.current = enemyTemplate.intentsPattern[nextIdx];
    setEnemyIntentIndex(nextIdx);
    setEnemyIntent(enemyTemplate.intentsPattern[nextIdx]);

    // Turn finished! Reset to IDLE so player can immediately spin again!
    turnStateRef.current = 'IDLE';
    setTurnState('IDLE');
  }, [enemyTemplate, addFloatingText, addLog, handleEnemyDefeat]);

  // Execute Turn Resolution with the stopped symbols
  const executeTurnResolution = useCallback(
    (finalSymbols: SymbolId[]) => {
      const betMultiplier = Math.max(1, betRef.current);
      const relicsList = relicsRef.current;

      const sym1 = SYMBOLS_CATALOG[finalSymbols[0]];
      const sym2 = SYMBOLS_CATALOG[finalSymbols[1]];
      const sym3 = SYMBOLS_CATALOG[finalSymbols[2]];

      addLog(`🎰 定格結果：${sym1.nameZh} / ${sym2.nameZh} / ${sym3.nameZh} (下注 ${betMultiplier}x)`, 'system');

      if (betMultiplier >= 3) {
        unlockAchievement('high_roller');
      }

      // Count occurrences
      const counts: Partial<Record<SymbolId, number>> = {};
      finalSymbols.forEach(k => {
        counts[k] = (counts[k] || 0) + 1;
      });

      let totalDmg = 0;
      let piercingDmg = 0;
      let totalShield = 0;
      let totalCoins = 0;
      let totalHeal = 0;
      let totalPoison = 0;
      let lifesteal = 0;
      let armorBreak = 0;
      let selfDmg = 0;

      // Relic bonuses
      const hasWhetstone = relicsList.some(r => r.id === 'whetstone');
      const hasSpikedShield = relicsList.some(r => r.id === 'spiked_shield');
      const hasAlchemistFlask = relicsList.some(r => r.id === 'alchemist_flask');
      const hasMidasMagnet = relicsList.some(r => r.id === 'midas_magnet');
      const hasToxicCatalyst = relicsList.some(r => r.id === 'toxic_catalyst');
      const hasCrystalDagger = relicsList.some(r => r.id === 'crystal_dagger');

      // 3-of-a-kind Jackpot check
      let jackpotSymbol: SymbolId | null = null;
      for (const k in counts) {
        if (counts[k as SymbolId] === 3) {
          jackpotSymbol = k as SymbolId;
          break;
        }
      }

      // 2-of-a-kind Pair check
      let pairSymbol: SymbolId | null = null;
      if (!jackpotSymbol) {
        for (const k in counts) {
          if (counts[k as SymbolId] === 2) {
            pairSymbol = k as SymbolId;
            break;
          }
        }
      }

      if (jackpotSymbol) {
        SFX.jackpot();
        setJackpotCount(prev => prev + 1);
        const jSym = SYMBOLS_CATALOG[jackpotSymbol];
        setJackpotBanner(`🔥 大獎 JACKPOT！三連【${jSym.nameZh}】！`);
        addLog(`🔥【大獎 JACKPOT!】三連 ${jSym.nameZh}！效果巨幅增強！`, 'combo');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }
      } else if (pairSymbol) {
        SFX.pairSynergy();
        const pSym = SYMBOLS_CATALOG[pairSymbol];
        addLog(`✨ 二連擊共鳴！【${pSym.nameZh}】效果額外強化！`, 'combo');
      }

      // Base values multiplied by bet
      finalSymbols.forEach(key => {
        switch (key) {
          case 'DAGGER':
            totalDmg += (SYMBOLS_CATALOG.DAGGER.baseValue + (hasWhetstone ? 2 : 0)) * betMultiplier;
            break;
          case 'SHIELD':
            totalShield += SYMBOLS_CATALOG.SHIELD.baseValue * betMultiplier;
            break;
          case 'COIN':
            totalCoins += (SYMBOLS_CATALOG.COIN.baseValue + (hasMidasMagnet ? 2 : 0)) * betMultiplier;
            break;
          case 'POTION':
            totalHeal += (SYMBOLS_CATALOG.POTION.baseValue + (hasAlchemistFlask ? 3 : 0)) * betMultiplier;
            break;
          case 'POISON':
            totalPoison += (SYMBOLS_CATALOG.POISON.baseValue + (hasToxicCatalyst ? 1 : 0)) * betMultiplier;
            break;
          case 'SKULL':
            selfDmg += SYMBOLS_CATALOG.SKULL.baseValue;
            break;
          case 'LIGHTNING':
            piercingDmg += SYMBOLS_CATALOG.LIGHTNING.baseValue * betMultiplier;
            break;
          case 'BLOOD':
            totalDmg += SYMBOLS_CATALOG.BLOOD.baseValue * betMultiplier;
            lifesteal += 3 * betMultiplier;
            break;
          case 'BOMB':
            totalDmg += SYMBOLS_CATALOG.BOMB.baseValue * betMultiplier;
            armorBreak += 8 * betMultiplier;
            break;
        }
      });

      // Pair synergies
      if (pairSymbol) {
        if (pairSymbol === 'DAGGER') totalDmg += 3 * betMultiplier;
        if (pairSymbol === 'SHIELD') totalShield += 4 * betMultiplier;
        if (pairSymbol === 'COIN') totalCoins += 3 * betMultiplier;
        if (pairSymbol === 'POTION') totalHeal += 3 * betMultiplier;
        if (pairSymbol === 'POISON') totalPoison += 2 * betMultiplier;
      }

      // 3-of-a-kind multipliers
      if (jackpotSymbol) {
        if (jackpotSymbol === 'DAGGER') {
          const mult = hasCrystalDagger ? 3.2 : 2.5;
          totalDmg = Math.round(totalDmg * mult);
        }
        if (jackpotSymbol === 'SHIELD') {
          totalShield = Math.round(totalShield * 2.2);
        }
        if (jackpotSymbol === 'COIN') {
          totalCoins += 20 * betMultiplier;
        }
        if (jackpotSymbol === 'POTION') {
          totalHeal += 14 * betMultiplier;
          heroPoisonRef.current = 0;
          setHeroPoison(0);
          addLog(`🧪 甘露靈藥淨化了冒險者體內的所有劇毒！`, 'hero');
        }
        if (jackpotSymbol === 'POISON') {
          totalPoison = Math.round(totalPoison * 2.2);
        }
        if (jackpotSymbol === 'LIGHTNING') {
          piercingDmg = 24 * betMultiplier;
        }
        if (jackpotSymbol === 'BLOOD') {
          totalDmg = 20 * betMultiplier;
          lifesteal = 12 * betMultiplier;
        }
        if (jackpotSymbol === 'BOMB') {
          totalDmg = 25 * betMultiplier;
          armorBreak = 99;
        }
        if (jackpotSymbol === 'SKULL') {
          selfDmg = 10;
        }
      }

      // Spiked shield bonus
      if (totalShield > 0 && hasSpikedShield) {
        totalDmg += 2;
        addLog(`🛡️ 【荊棘盾牌】反刺敵方 2 點傷害！`, 'hero');
      }

      // 1. Armor break
      if (armorBreak > 0 && enemyShieldRef.current > 0) {
        enemyShieldRef.current = Math.max(0, enemyShieldRef.current - armorBreak);
        setEnemyShield(enemyShieldRef.current);
        addLog(`💣 炸藥粉碎了敵人 ${armorBreak} 點護甲！`, 'hero');
      }

      // 2. Physical & Piercing damage
      const combinedDmg = totalDmg + piercingDmg;
      if (combinedDmg > 0) {
        SFX.slash();
        setEnemyHit(true);
        setTimeout(() => setEnemyHit(false), 350);

        const resDmg = applyDamage(
          enemyHpRef.current,
          enemyShieldRef.current,
          totalDmg,
          false
        );
        const resPiercing = applyDamage(
          resDmg.finalHp,
          resDmg.finalShield,
          piercingDmg,
          true
        );

        enemyHpRef.current = resPiercing.finalHp;
        enemyShieldRef.current = resPiercing.finalShield;

        setEnemyHp(enemyHpRef.current);
        setEnemyShield(enemyShieldRef.current);

        setTotalDamageDealt(prev => prev + combinedDmg);
        addFloatingText(
          `-${combinedDmg}${jackpotSymbol === 'DAGGER' ? ' 🔥' : ''}`,
          jackpotSymbol === 'DAGGER' ? 'crit' : 'damage',
          'enemy'
        );
        addLog(
          `你發動猛烈進攻，造成 ${combinedDmg} 點傷害！${
            piercingDmg > 0 ? `(含 ${piercingDmg} 穿透)` : ''
          }`,
          'hero'
        );
      }

      // 3. Shield Gain
      if (totalShield > 0) {
        SFX.shield();
        heroShieldRef.current += totalShield;
        setHeroShield(heroShieldRef.current);
        addFloatingText(`+${totalShield} 🛡️`, 'shield', 'hero');
        addLog(`你舉盾獲得了 ${totalShield} 點壁障！`, 'hero');
      }

      // 4. Gold Loot
      if (totalCoins > 0) {
        SFX.coin();
        goldRef.current += totalCoins;
        setGold(goldRef.current);
        addFloatingText(`+${totalCoins} 🪙`, 'gold', 'hero');
        addLog(`搜刮獲得了 ${totalCoins} 枚金幣！`, 'gold');
      }

      // 5. Heal & Lifesteal
      const fullHeal = totalHeal + lifesteal;
      if (fullHeal > 0) {
        SFX.heal();
        heroHpRef.current = Math.min(heroMaxHpRef.current, heroHpRef.current + fullHeal);
        setHeroHp(heroHpRef.current);
        addFloatingText(`+${fullHeal} HP`, 'heal', 'hero');
        addLog(`靈藥與吸血回復了 ${fullHeal} 點生命值！`, 'hero');
      }

      // 6. Poison
      if (totalPoison > 0) {
        SFX.poison();
        enemyPoisonRef.current += totalPoison;
        setEnemyPoison(enemyPoisonRef.current);
        addFloatingText(`+${totalPoison} ☠️`, 'poison', 'enemy');
        addLog(`給敵人附加了 ${totalPoison} 層劇毒！`, 'hero');
      }

      // 7. Skull Self-damage
      if (selfDmg > 0) {
        SFX.skull();
        setHeroHit(true);
        setTimeout(() => setHeroHit(false), 350);

        heroHpRef.current = Math.max(0, heroHpRef.current - selfDmg);
        setHeroHp(heroHpRef.current);
        addFloatingText(`-${selfDmg} 💀`, 'skull', 'hero');
        addLog(`💀 骷髏詛咒反噬！自身受到 ${selfDmg} 點自殘傷害！`, 'hazard');

        if (heroHpRef.current <= 0) {
          setTimeout(() => {
            SFX.defeat();
            setShowGameOver(true);
            setIsVictoryEnd(false);
          }, 600);
        }
      }

      // Check if enemy died
      if (enemyHpRef.current <= 0) {
        setTimeout(() => handleEnemyDefeat(), 500);
        return;
      }

      // Transition to enemy turn after 700ms
      turnStateRef.current = 'ENEMY_TURN';
      setTurnState('ENEMY_TURN');
      setTimeout(() => {
        executeEnemyTurn();
      }, 700);
    },
    [addFloatingText, addLog, unlockAchievement, handleEnemyDefeat, executeEnemyTurn]
  );

  // Stop single reel - deterministic and rock solid
  const handleStopReel = useCallback(
    (reelIndex: number, symbol: SymbolId) => {
      if (!spinningRef.current[reelIndex]) return;

      spinningRef.current[reelIndex] = false;
      resultsRef.current[reelIndex] = symbol;

      setSpinning([...spinningRef.current]);
      setResults([...resultsRef.current]);

      // Check if all 3 reels are stopped now!
      const allStopped =
        spinningRef.current.every(s => !s) && resultsRef.current.every(r => r !== null);

      if (allStopped) {
        const finalSymbols = [...resultsRef.current] as SymbolId[];
        turnStateRef.current = 'RESOLVING';
        setTurnState('RESOLVING');

        setTimeout(() => {
          executeTurnResolution(finalSymbols);
        }, 350);
      }
    },
    [executeTurnResolution]
  );

  // Stop all reels sequentially
  const handleStopAll = useCallback(() => {
    const unstoppedIndices = spinningRef.current
      .map((isSpinning, idx) => (isSpinning ? idx : -1))
      .filter(idx => idx !== -1);

    unstoppedIndices.forEach((reelIdx, i) => {
      setTimeout(() => {
        if (spinningRef.current[reelIdx]) {
          const strip = reelStrips[reelIdx];
          const randomSym = strip[Math.floor(Math.random() * strip.length)];
          handleStopReel(reelIdx, randomSym);
          SFX.stopReel(reelIdx);
        }
      }, i * 160);
    });
  }, [reelStrips, handleStopReel]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showShop || showInspector || showRules || showGameOver || showAchievements) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (turnStateRef.current === 'IDLE' && heroHpRef.current > 0 && enemyHpRef.current > 0) {
          handleStartSpin();
        } else if (turnStateRef.current === 'SPINNING') {
          const firstSpinIdx = spinningRef.current.findIndex(Boolean);
          if (firstSpinIdx !== -1) {
            const strip = reelStrips[firstSpinIdx];
            const sym = strip[Math.floor(Math.random() * strip.length)];
            handleStopReel(firstSpinIdx, sym);
            SFX.stopReel(firstSpinIdx);
          }
        }
      } else if (e.key === '1' && spinningRef.current[0]) {
        const strip = reelStrips[0];
        handleStopReel(0, strip[Math.floor(Math.random() * strip.length)]);
        SFX.stopReel(0);
      } else if (e.key === '2' && spinningRef.current[1]) {
        const strip = reelStrips[1];
        handleStopReel(1, strip[Math.floor(Math.random() * strip.length)]);
        SFX.stopReel(1);
      } else if (e.key === '3' && spinningRef.current[2]) {
        const strip = reelStrips[2];
        handleStopReel(2, strip[Math.floor(Math.random() * strip.length)]);
        SFX.stopReel(2);
      } else if (e.key === 'r' || e.key === 'R') {
        setShowInspector(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        const muted = SFX.toggleMute();
        setSoundMuted(muted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showShop,
    showInspector,
    showRules,
    showGameOver,
    showAchievements,
    handleStartSpin,
    handleStopReel,
    reelStrips
  ]);

  // Shop actions
  const handleBuySymbol = (reelIndex: number, symbolId: SymbolId, cost: number) => {
    if (gold < cost) return;
    const nextGold = gold - cost;
    goldRef.current = nextGold;
    setGold(nextGold);

    setReelStrips(prev => {
      const next = [...prev];
      next[reelIndex] = [...next[reelIndex], symbolId];
      return next;
    });
    SFX.buy();
    const sym = SYMBOLS_CATALOG[symbolId];
    addLog(`🎪 黑市收購：【${sym.nameZh}】已植入滾輪 ${reelIndex + 1}！`, 'gold');
  };

  const handleRemoveSkull = (reelIndex: number, cost: number) => {
    if (gold < cost) return;
    const strip = reelStrips[reelIndex];
    const skullIdx = strip.indexOf('SKULL');
    if (skullIdx === -1) return;

    const nextGold = gold - cost;
    goldRef.current = nextGold;
    setGold(nextGold);

    setReelStrips(prev => {
      const next = [...prev];
      const newStrip = [...next[reelIndex]];
      newStrip.splice(skullIdx, 1);
      next[reelIndex] = newStrip;
      return next;
    });
    SFX.buy();
    unlockAchievement('curse_cleanser');
    addLog(`✨ 淨化儀式：成功剔除滾輪 ${reelIndex + 1} 的骷髏詛咒！`, 'combo');
  };

  const handleBuyRelic = (relic: Relic) => {
    if (gold < relic.cost) return;
    const nextGold = gold - relic.cost;
    goldRef.current = nextGold;
    setGold(nextGold);

    const nextRelics = [...relics, relic];
    relicsRef.current = nextRelics;
    setRelics(nextRelics);

    SFX.buy();
    addLog(`🏆 獲得傳奇遺物：【${relic.name}】！`, 'combo');
  };

  const handleCampfireHeal = (cost: number, healAmt: number) => {
    if (gold < cost || heroHp >= heroMaxHp) return;
    const nextGold = gold - cost;
    goldRef.current = nextGold;
    setGold(nextGold);

    const nextHp = Math.min(heroMaxHp, heroHp + healAmt);
    heroHpRef.current = nextHp;
    setHeroHp(nextHp);

    SFX.heal();
    addLog(`🔥 篝火休憩回復了 ${healAmt} 點生命值！`, 'hero');
  };

  const handleProceedNextFloor = () => {
    setShowShop(false);
    const nextFloor = floor + 1;
    floorRef.current = nextFloor;
    setFloor(nextFloor);
    initBattle(nextFloor);
  };

  const handleRestart = () => {
    setShowGameOver(false);
    setShowShop(false);
    floorRef.current = 1;
    setFloor(1);
    goldRef.current = 15;
    setGold(15);
    betRef.current = 1;
    setBet(1);
    heroHpRef.current = 35;
    setHeroHp(35);
    heroMaxHpRef.current = 35;
    setHeroMaxHp(35);
    heroShieldRef.current = 0;
    setHeroShield(0);
    heroPoisonRef.current = 0;
    setHeroPoison(0);
    relicsRef.current = [];
    setRelics([]);
    setReelStrips(INITIAL_REEL_STRIPS);
    setJackpotCount(0);
    setTotalDamageDealt(0);
    turnStateRef.current = 'IDLE';
    setTurnState('IDLE');
    setCombatLogs([
      {
        id: 'restart-1',
        text: '⚔️ 冒險重新啟程！祝你好運，地城掠奪者！',
        type: 'system',
        timestamp: '00:00'
      }
    ]);
    initBattle(1);
  };

  const handleContinueEndless = () => {
    setShowGameOver(false);
    const nextFloor = floor + 1;
    floorRef.current = nextFloor;
    setFloor(nextFloor);
    initBattle(nextFloor);
  };

  const toggleSound = () => {
    const isMuted = SFX.toggleMute();
    setSoundMuted(isMuted);
  };

  const toggleCrt = () => {
    setCrtFilter(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col justify-between relative selection:bg-amber-500 selection:text-neutral-950">
      {/* Isolated CRT Scanlines Overlay Div */}
      {crtFilter && (
        <div
          className="fixed inset-0 pointer-events-none z-50 crt-scanlines"
          aria-hidden="true"
        />
      )}

      {/* Achievement Unlock Popup Toast */}
      {unlockedToast && (
        <div className="fixed top-16 right-4 z-50 bg-neutral-900 border-2 border-amber-400 p-3 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2.5 animate-bounce">
          <span className="text-2xl">{unlockedToast.icon}</span>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              🏆 成就解鎖！
            </div>
            <div className="text-xs font-bold text-neutral-100">
              {unlockedToast.title}
            </div>
            <div className="text-[11px] text-neutral-400">
              {unlockedToast.description}
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur px-3 sm:px-6 py-2 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🗡️</span>
          <h1 className="font-bold text-xs sm:text-sm tracking-wide text-neutral-100 flex items-center gap-1.5">
            <span>SLOTS & DAGGERS</span>
            <span className="text-[10px] text-amber-400 font-mono hidden sm:inline-block">
              RETRO CRAWL
            </span>
          </h1>
        </div>

        {/* Status / Currency display */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-1 text-neutral-300">
            <span className="text-neutral-400 text-xs">層數:</span>
            <span className="font-bold text-amber-400 tabular-nums">
              F.{floor}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-amber-400">🪙</span>
            <span className="font-bold text-amber-300 tabular-nums">
              {gold}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowAchievements(true)}
            title="查看已解鎖成就與徽章"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>🏆</span>
            <span className="hidden md:inline">成就</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInspector(true)}
            title="檢視目前三組滾輪的符號清單 (快捷鍵 R)"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>📜</span>
            <span className="hidden md:inline">輪盤池</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRules(true)}
            title="查看目押煞停與三連擊規則"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>📖</span>
            <span className="hidden md:inline">規則</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={soundMuted ? '取消靜音' : '靜音'}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer transition-colors"
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>

          <button
            type="button"
            onClick={toggleCrt}
            title={crtFilter ? '關閉 CRT 復古濾鏡 (恢復純黑背景)' : '開啟 CRT 復古掃描線濾鏡'}
            className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors border ${
              crtFilter
                ? 'bg-amber-600 text-neutral-950 font-bold border-amber-400'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
            }`}
          >
            📺
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 max-w-xl w-full mx-auto p-2.5 sm:p-3 flex flex-col justify-start">
        {/* Jackpot Floating Announcement Banner */}
        {jackpotBanner && (
          <div className="mb-2 py-1.5 px-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-neutral-950 font-black text-xs sm:text-sm text-center rounded-xl shadow-lg border border-yellow-300 animate-bounce">
            {jackpotBanner}
          </div>
        )}

        {/* 1. Character Cards Arena */}
        <BattleArena
          heroHp={heroHp}
          heroMaxHp={heroMaxHp}
          heroShield={heroShield}
          heroPoison={heroPoison}
          heroHit={heroHit}
          enemyName={enemyTemplate.name}
          enemyAvatar={enemyTemplate.avatar}
          enemyHp={enemyHp}
          enemyMaxHp={enemyMaxHp}
          enemyShield={enemyShield}
          enemyPoison={enemyPoison}
          enemyHit={enemyHit}
          enemyIntent={enemyIntent}
          relics={relics}
          floatingTexts={floatingTexts}
        />

        {/* 2. Slot Machine Reel Console */}
        <SlotMachine
          reelStrips={reelStrips}
          spinning={spinning}
          results={results}
          onStartSpin={handleStartSpin}
          onStopReel={handleStopReel}
          onStopAll={handleStopAll}
          canSpin={turnState === 'IDLE' && heroHp > 0 && enemyHp > 0}
          hasCloverRelic={hasCloverRelic}
          highlightJackpot={!!jackpotBanner}
          currentBet={bet}
          onSetBet={newBet => {
            betRef.current = newBet;
            setBet(newBet);
          }}
          playerGold={gold}
        />

        {/* 3. Combat Log Box */}
        <div className="mt-2.5 bg-neutral-950/80 rounded-xl p-2 sm:p-2.5 border border-neutral-800 flex flex-col h-24">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-800/80 text-[10px] text-neutral-500 font-mono">
            <span>戰況即時紀錄 (COMBAT LOG)</span>
            <span className="text-amber-400/90">
              狀態: {turnState === 'IDLE' ? '待命拉桿' : turnState === 'SPINNING' ? '輪盤轉動中' : '結算中'}
            </span>
          </div>

          <div
            ref={logBoxRef}
            className="flex-1 overflow-y-auto space-y-0.5 text-[11px] leading-relaxed pr-1 no-scrollbar"
          >
            {combatLogs.map(log => (
              <div
                key={log.id}
                className={`flex items-start gap-1.5 ${
                  log.type === 'hero'
                    ? 'text-sky-300'
                    : log.type === 'enemy'
                    ? 'text-rose-300'
                    : log.type === 'combo'
                    ? 'text-amber-300 font-semibold'
                    : log.type === 'gold'
                    ? 'text-yellow-400 font-medium'
                    : log.type === 'hazard'
                    ? 'text-purple-300 font-semibold'
                    : 'text-neutral-400'
                }`}
              >
                <span className="text-[9px] text-neutral-600 font-mono shrink-0 select-none">
                  [{log.timestamp}]
                </span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center py-1 text-[10px] text-neutral-600 border-t border-neutral-900">
        Slots & Daggers · 目押判定 · 三連大獎 · 輪盤構築 Roguelike
      </footer>

      {/* Modals */}
      {showShop && (
        <ShopModal
          gold={gold}
          floor={floor}
          heroHp={heroHp}
          heroMaxHp={heroMaxHp}
          reelStrips={reelStrips}
          ownedRelics={relics}
          onBuySymbol={handleBuySymbol}
          onRemoveSkull={handleRemoveSkull}
          onBuyRelic={handleBuyRelic}
          onCampfireHeal={handleCampfireHeal}
          onProceedNextFloor={handleProceedNextFloor}
        />
      )}

      {showInspector && (
        <ReelInspectorModal
          reelStrips={reelStrips}
          onClose={() => setShowInspector(false)}
        />
      )}

      {showRules && (
        <RuleGuideModal onClose={() => setShowRules(false)} />
      )}

      {showAchievements && (
        <AchievementModal
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showGameOver && (
        <GameOverModal
          isWin={isVictoryEnd}
          floor={floor}
          gold={gold}
          jackpotCount={jackpotCount}
          totalDamageDealt={totalDamageDealt}
          achievements={achievements}
          onRestart={handleRestart}
          onContinueEndless={isVictoryEnd ? handleContinueEndless : undefined}
        />
      )}
    </div>
  );
}
