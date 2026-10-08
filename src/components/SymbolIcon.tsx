import React from 'react';
import { SymbolId } from '../types/game';

interface SymbolIconProps {
  id: SymbolId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const SymbolIcon: React.FC<SymbolIconProps> = ({
  id,
  size = 'md',
  animated = true,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const dim = sizeMap[size];

  switch (id) {
    case 'DAGGER':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)] ${
              animated ? 'animate-blade-sway' : ''
            }`}
          >
            {/* Blade */}
            <path
              d="M34 14L28 8L16 20L18 22L12 28L14 30L20 24L22 26L34 14Z"
              fill="url(#daggerGrad)"
            />
            {/* Blade Tip & Edge */}
            <path
              d="M38 10L32 4L26 10L32 16L38 10Z"
              fill="#FCA5A5"
            />
            {/* Crossguard */}
            <rect
              x="12"
              y="26"
              width="14"
              height="4"
              rx="1.5"
              transform="rotate(45 12 26)"
              fill="#B91C1C"
            />
            {/* Pommel & Hilt */}
            <rect
              x="8"
              y="32"
              width="8"
              height="3.5"
              rx="1"
              transform="rotate(45 8 32)"
              fill="#7F1D1D"
            />
            <circle cx="7" cy="41" r="3" fill="#FBBF24" />
            {/* Glint effect */}
            {animated && (
              <line
                x1="22"
                y1="14"
                x2="32"
                y2="8"
                stroke="#FFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}
            <defs>
              <linearGradient id="daggerGrad" x1="16" y1="8" x2="34" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F87171" />
                <stop offset="0.5" stopColor="#EF4444" />
                <stop offset="1" stopColor="#991B1B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'SHIELD':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_4px_rgba(59,130,246,0.6)] ${
              animated ? 'animate-shield-pulse' : ''
            }`}
          >
            {/* Outer Rim */}
            <path
              d="M24 4L38 9V22C38 32 24 43 24 43C24 43 10 32 10 22V9L24 4Z"
              fill="url(#shieldBorder)"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            {/* Inner Plate */}
            <path
              d="M24 8L34 12V21C34 29 24 38 24 38C24 38 14 29 14 21V12L24 8Z"
              fill="url(#shieldCore)"
            />
            {/* Golden Boss Emblem */}
            <path
              d="M24 16L27 22H33L28 26L30 32L24 28L18 32L20 26L15 22H21L24 16Z"
              fill="#FBBF24"
            />
            <defs>
              <linearGradient id="shieldBorder" x1="10" y1="4" x2="38" y2="43" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#1E3A8A" />
              </linearGradient>
              <linearGradient id="shieldCore" x1="14" y1="8" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'COIN':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_5px_rgba(234,179,8,0.7)] ${
              animated ? 'animate-coin-spin' : ''
            }`}
          >
            {/* Outer Coin Rim */}
            <circle cx="24" cy="24" r="19" fill="#B45309" stroke="#FDE047" strokeWidth="2" />
            <circle cx="24" cy="24" r="16" fill="url(#goldCoinGrad)" />
            <circle cx="24" cy="24" r="13" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Embossed Crown or Star */}
            <path
              d="M24 14L26.5 20.5H33.5L28 24.5L30 31L24 27L18 31L20 24.5L14.5 20.5H21.5L24 14Z"
              fill="#FFFBEB"
              filter="drop-shadow(0 1px 1px rgba(0,0,0,0.4))"
            />
            <defs>
              <linearGradient id="goldCoinGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="0.5" stopColor="#EAB308" />
                <stop offset="1" stopColor="#CA8A04" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'POTION':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_5px_rgba(16,185,129,0.6)] ${
              animated ? 'animate-potion-slosh' : ''
            }`}
          >
            {/* Cork Stopper */}
            <rect x="20" y="4" width="8" height="5" rx="1.5" fill="#D97706" />
            {/* Neck Ring */}
            <rect x="18" y="9" width="12" height="3" rx="1" fill="#A7F3D0" />
            {/* Flask Glass Body */}
            <path
              d="M21 12H27V18L36 33C38 36 36 41 32 41H16C12 41 10 36 12 33L21 18V12Z"
              fill="#064E3B"
              stroke="#6EE7B7"
              strokeWidth="2"
            />
            {/* Liquid Fill */}
            <path
              d="M14 34L19 25H29L34 34C36 37 34 39 31 39H17C14 39 12 37 14 34Z"
              fill="url(#potionGrad)"
            />
            {/* Animated Bubbles */}
            {animated && (
              <>
                <circle cx="20" cy="35" r="1.8" fill="#A7F3D0" className="animate-bubble-rise-1" />
                <circle cx="28" cy="33" r="1.4" fill="#A7F3D0" className="animate-bubble-rise-2" />
                <circle cx="24" cy="30" r="1.6" fill="#ECFDF5" className="animate-bubble-rise-3" />
              </>
            )}
            <defs>
              <linearGradient id="potionGrad" x1="12" y1="25" x2="36" y2="41" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399" />
                <stop offset="0.7" stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'POISON':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_5px_rgba(168,85,247,0.6)] ${
              animated ? 'animate-potion-slosh' : ''
            }`}
          >
            {/* Skull Stopper */}
            <rect x="19" y="5" width="10" height="4" rx="1.5" fill="#581C87" />
            {/* Flask Body */}
            <circle cx="24" cy="27" r="15" fill="#2E1065" stroke="#C084FC" strokeWidth="2" />
            {/* Sloshing Poison Liquid */}
            <path
              d="M10 27C10 35 16 41 24 41C32 41 38 35 38 27C34 29 28 26 24 28C20 30 14 26 10 27Z"
              fill="url(#poisonGrad)"
            />
            {/* Skull mark on vial */}
            <circle cx="21" cy="22" r="1.8" fill="#E9D5FF" />
            <circle cx="27" cy="22" r="1.8" fill="#E9D5FF" />
            <path d="M22 28H26" stroke="#E9D5FF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Fuming bubbles */}
            {animated && (
              <>
                <circle cx="22" cy="18" r="1.5" fill="#E9D5FF" className="animate-bubble-rise-1" />
                <circle cx="27" cy="14" r="1.2" fill="#D8B4FE" className="animate-bubble-rise-2" />
              </>
            )}
            <defs>
              <linearGradient id="poisonGrad" x1="10" y1="26" x2="38" y2="41" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C084FC" />
                <stop offset="0.6" stopColor="#A855F7" />
                <stop offset="1" stopColor="#7E22CE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'SKULL':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_5px_rgba(239,68,68,0.5)] ${
              animated ? 'animate-skull-wobble' : ''
            }`}
          >
            {/* Skull Cranius */}
            <path
              d="M12 20C12 12.5 17.5 7 24 7C30.5 7 36 12.5 36 20C36 25 33 28 32 30V36H16V30C15 28 12 25 12 20Z"
              fill="url(#skullBoneGrad)"
              stroke="#64748B"
              strokeWidth="2"
            />
            {/* Cursed Glowing Eye Sockets */}
            <ellipse cx="18" cy="19" rx="3.5" ry="4.5" fill="#0F172A" />
            <ellipse cx="30" cy="19" rx="3.5" ry="4.5" fill="#0F172A" />
            {/* Glowing red pupils */}
            {animated ? (
              <>
                <circle cx="18" cy="19" r="1.8" fill="#EF4444" className="animate-ping" />
                <circle cx="30" cy="19" r="1.8" fill="#EF4444" className="animate-ping" />
              </>
            ) : (
              <>
                <circle cx="18" cy="19" r="1.8" fill="#EF4444" />
                <circle cx="30" cy="19" r="1.8" fill="#EF4444" />
              </>
            )}
            {/* Nose Cavity */}
            <polygon points="24,24 22,27 26,27" fill="#1E293B" />
            {/* Teeth */}
            <rect x="18" y="32" width="2" height="4" fill="#334155" />
            <rect x="23" y="32" width="2" height="4" fill="#334155" />
            <rect x="28" y="32" width="2" height="4" fill="#334155" />
            <defs>
              <linearGradient id="skullBoneGrad" x1="12" y1="7" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F1F5F9" />
                <stop offset="0.7" stopColor="#CBD5E1" />
                <stop offset="1" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'LIGHTNING':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_6px_rgba(56,189,248,0.8)] ${
              animated ? 'animate-lightning-flicker' : ''
            }`}
          >
            {/* Electric Aura */}
            <circle cx="24" cy="24" r="18" fill="rgba(56,189,248,0.15)" />
            {/* Lightning Bolt */}
            <path
              d="M27 4L11 25H23L19 44L37 21H24L27 4Z"
              fill="url(#lightningGrad)"
              stroke="#E0F2FE"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="lightningGrad" x1="11" y1="4" x2="37" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="0.4" stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'BLOOD':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_6px_rgba(244,63,94,0.7)] ${
              animated ? 'animate-blood-pulse' : ''
            }`}
          >
            {/* Blood Droplet */}
            <path
              d="M24 5C24 5 36 20 36 29C36 36 30.6 42 24 42C17.4 42 12 36 12 29C12 20 24 5 24 5Z"
              fill="url(#bloodGrad)"
              stroke="#FDA4AF"
              strokeWidth="1.5"
            />
            {/* Shimmer Specular */}
            <path
              d="M19 24C17 27 17 31 19 34"
              stroke="#FFE4E6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="bloodGrad" x1="12" y1="5" x2="36" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB7185" />
                <stop offset="0.5" stopColor="#E11D48" />
                <stop offset="1" stopColor="#881337" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'BOMB':
      return (
        <div className={`relative flex items-center justify-center ${dim} ${className}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className={`w-full h-full filter drop-shadow-[0_2px_5px_rgba(251,146,60,0.7)] ${
              animated ? 'animate-bomb-bounce' : ''
            }`}
          >
            {/* Fuse */}
            <path
              d="M28 14C32 10 36 12 37 8"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Spark at fuse tip */}
            {animated && (
              <circle
                cx="37"
                cy="8"
                r="3"
                fill="#EF4444"
                className="animate-ping"
              />
            )}
            <circle cx="37" cy="8" r="2" fill="#FBBF24" />
            {/* Bomb Neck */}
            <rect x="23" y="13" width="8" height="4" rx="1.5" fill="#4B5563" />
            {/* Bomb Cannonball Body */}
            <circle cx="23" cy="28" r="14" fill="url(#bombGrad)" stroke="#6B7280" strokeWidth="1.5" />
            {/* Specular Highlight */}
            <ellipse cx="18" cy="22" rx="3.5" ry="2" fill="#9CA3AF" />
            <defs>
              <linearGradient id="bombGrad" x1="9" y1="14" x2="37" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#374151" />
                <stop offset="0.6" stopColor="#1F2937" />
                <stop offset="1" stopColor="#111827" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    default:
      return <span className="text-2xl">❓</span>;
  }
};
