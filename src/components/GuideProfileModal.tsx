import React from 'react';
import { Guide } from '../types';
import { 
  Sparkles, 
  Shield, 
  Award, 
  HeartHandshake, 
  Zap, 
  Brain, 
  Moon, 
  X, 
  Check, 
  Edit3,
  Heart,
  Palette
} from 'lucide-react';

interface GuideProfileModalProps {
  guide: Guide;
  contractCount: number;
  onClose: () => void;
  onRest: () => void;
  onOpenEdit?: () => void;
}

export const GuideProfileModal: React.FC<GuideProfileModalProps> = ({
  guide,
  contractCount,
  onClose,
  onRest,
  onOpenEdit
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-400/60 w-full max-w-lg rounded-2xl p-5 md:p-6 relative shadow-2xl space-y-4 holo-glow flex flex-col max-h-[92vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(0,243,255,0.4)]">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-cyan-300 font-bold text-xl">
                {guide.name[0]}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-100">{guide.name}</h2>
                <span className="text-xs bg-purple-950 text-purple-200 px-2 py-0.5 rounded border border-purple-500 font-semibold">
                  {guide.rank}
                </span>
                <span className="text-xs bg-pink-950/70 text-pink-300 px-2 py-0.5 rounded border border-pink-500/40 font-semibold flex items-center gap-1">
                  <Heart className="w-3 h-3 text-pink-400" />
                  <span>【{guide.guidePersonality || '温柔'}】型</span>
                </span>
              </div>
              <p className="text-xs text-cyan-400 mt-0.5">{guide.title} · {guide.age || 21}岁</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEdit && (
              <button
                onClick={onOpenEdit}
                className="px-3 py-1.5 bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/50 text-cyan-200 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>编辑向导档案</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Core Attributes Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">精神力储备</span>
            <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
              {guide.mentalPower} / {guide.maxMentalPower}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">今日状态</span>
            <div className={`text-base font-bold mt-0.5 ${guide.isFatigued ? 'text-red-400' : 'text-emerald-400'}`}>
              {guide.isFatigued ? '轻度疲劳' : '精神充沛'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">全域声望</span>
            <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
              {guide.reputation} pts
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">契约哨兵</span>
            <div className="text-base font-bold font-mono text-purple-300 mt-0.5">
              {contractCount} / {guide.maxContracts}
            </div>
          </div>
        </div>

        {/* Heroine Appearance Card */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>外貌与向导特征</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {guide.height || '167cm'} / {guide.weight || '48kg'} · {guide.hairColor || '银发'} · {guide.eyeColor || '紫瞳'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 leading-relaxed">
            <span className="text-slate-400">气质：</span>{guide.temperament || '神圣悲悯中蕴含清冷威仪'}
          </div>
          {guide.beastFeatures && (
            <div className="text-[11px] text-purple-300/90 leading-relaxed bg-purple-950/20 p-2 rounded-lg border border-purple-500/20">
              <span className="text-purple-400 font-semibold">兽化/向导生理特征：</span>
              {guide.beastFeatures}
            </div>
          )}
        </div>

        {/* Spirit Beast Card */}
        {guide.spiritBeast && (
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>向导精神体 · 【{guide.spiritBeast.name}】</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-medium">
                形态: {guide.spiritBeast.form} · 状态: {guide.spiritBeast.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed">
              <span className="text-slate-400">精神图景：</span>{guide.spiritBeast.mindscape}
            </div>
          </div>
        )}

        {/* S-Rank Guide Traits */}
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5">
          <h3 className="font-bold text-purple-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" /> {guide.rank} 神格向导法则
          </h3>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            你拥有星际极为罕有的精神海纯愈资质。在面对任何SS/S级狂暴哨兵时<strong>绝无反噬与失败可能</strong>，仅消耗自身精神力。
          </p>
        </div>

        {/* Guide Skill Tree */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> 向导天赋与神圣技能树
          </h3>
          <div className="space-y-1.5">
            {guide.skills.map((skill, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Rest Recovery Action */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-800">
          <button
            onClick={onRest}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>向导温室深层冥想（全额充盈精神力）</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            关闭面板
          </button>
        </div>
      </div>
    </div>
  );
};
