import React from 'react';
import { Guide, TimeOfDay, Sentinel } from '../types';
import { Sparkles, Shield, HeartHandshake, AlertTriangle, FastForward, User, Moon } from 'lucide-react';

interface HeaderHUDProps {
  guide: Guide;
  stardateYear: number;
  stardateDay: number;
  timeOfDay: TimeOfDay;
  contractCount: number;
  sentinels: Sentinel[];
  onAdvanceTime: () => void;
  onOpenProfile: () => void;
  onRest: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  guide,
  stardateYear,
  stardateDay,
  timeOfDay,
  contractCount,
  sentinels,
  onAdvanceTime,
  onOpenProfile,
  onRest
}) => {
  // Check if any sentinel is in danger riot
  const criticalSentinels = sentinels.filter(s => s.riotRate >= 80);

  return (
    <header className="h-16 px-4 md:px-6 bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/25 flex items-center justify-between z-30 shrink-0 select-none relative shadow-lg">
      {/* Left: Guide Profile Lockup */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="relative group cursor-pointer focus:outline-none"
          title="点击查看女主向导面板与天赋"
        >
          <div className="w-11 h-11 rounded-full border-2 border-cyan-400 bg-cyan-950/80 flex items-center justify-center font-bold text-cyan-300 text-base shadow-[0_0_15px_rgba(0,243,255,0.4)] group-hover:scale-105 transition-transform duration-200">
            {guide.name[0]}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-600 text-[10px] px-1 rounded-full text-white font-mono border border-purple-300 shadow">
            S
          </div>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span 
              onClick={onOpenProfile}
              className="font-bold text-slate-100 tracking-wide text-sm cursor-pointer hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              {guide.name}
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline" />
            </span>
            <span className="text-[11px] bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 font-medium">
              {guide.rank}
            </span>
            {guide.isFatigued ? (
              <span className="text-[10px] bg-red-950/90 text-red-300 px-1.5 py-0.5 rounded border border-red-500 animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" /> 精神疲劳
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                精神充沛
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>精神力:</span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden inline-block border border-slate-700">
                <div 
                  className={`h-full transition-all duration-300 ${guide.mentalPower < 30 ? 'bg-red-500' : guide.mentalPower < 60 ? 'bg-amber-400' : 'bg-cyan-400'}`} 
                  style={{ width: `${(guide.mentalPower / guide.maxMentalPower) * 100}%` }}
                />
              </div>
              <span className="font-mono text-cyan-300 font-semibold">{guide.mentalPower}</span>
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            <div className="hidden sm:flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>声望: <strong className="text-amber-300 font-mono">{guide.reputation}</strong></span>
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            <div className="flex items-center gap-1">
              <HeartHandshake className="w-3 h-3 text-purple-400" />
              <span>命定契约: <strong className="text-purple-300 font-mono">{contractCount}/{guide.maxContracts}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Critical Riot Warning Ticker if any */}
      {criticalSentinels.length > 0 && (
        <div className="hidden lg:flex items-center gap-2 bg-red-950/60 border border-red-500/50 px-3 py-1 rounded-full text-xs text-red-200 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>前线暴动警报: {criticalSentinels.map(s => s.name).join('、')} 濒临狂暴临界！</span>
        </div>
      )}

      {/* Right: Stardate & Time Jump Trigger */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Rest button to restore mental energy */}
        <button
          onClick={onRest}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
          title="在休息室浅眠，恢复精神力"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>冥想休整</span>
        </button>

        <div className="text-right">
          <div className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">
            星历 {stardateYear}.04.{stardateDay}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
            <span>时段:</span>
            <span className="text-amber-400 font-bold bg-amber-950/60 px-1 rounded border border-amber-600/40">
              {timeOfDay}
            </span>
          </div>
        </div>

        <button
          onClick={onAdvanceTime}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-600/80 to-purple-600/80 hover:from-cyan-500 hover:to-purple-500 active:scale-95 border border-cyan-400/60 rounded-lg text-xs text-white font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,243,255,0.3)] transition-all cursor-pointer"
          title="推进时段（上午转下午，下午进入次日）"
        >
          <span className="hidden sm:inline">推进时段</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
