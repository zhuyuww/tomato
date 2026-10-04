import React, { useState } from 'react';
import { Appointment, Sentinel, SoothingMethod, Guide } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Activity, 
  Zap, 
  CheckCircle2, 
  X, 
  Brain, 
  MessageSquare,
  UserCheck,
  ChevronRight,
  Flame,
  Volume2,
  Coffee,
  Bed,
  LogOut,
  Sliders,
  Send
} from 'lucide-react';
import {
  SoothingOption,
  SoothingEndingChoice,
  generateStage1Options,
  getStage1Reaction,
  generateStage2Options,
  getStage2Reaction,
  getStage3EndingOptions,
  getStage3EndingReaction
} from '../utils/soothingEngine';

interface SoothingModalProps {
  appointment: Appointment;
  sentinel: Sentinel;
  guide: Guide;
  onClose: () => void;
  onExecute: (
    method: SoothingMethod, 
    actionChosen: string, 
    sentinelReactionText: string, 
    shouldSendFriendRequest: boolean,
    endingChoiceId?: 'leave' | 'rest' | 'dine',
    endingNarratorSummary?: string,
    fullDialogueHistory?: { speaker: string; text: string }[]
  ) => void;
}

export const SoothingModal: React.FC<SoothingModalProps> = ({
  appointment,
  sentinel,
  guide,
  onClose,
  onExecute
}) => {
  // Step: 'choose_method' | 'galgame_vn'
  const [modalMode, setModalMode] = useState<'choose_method' | 'galgame_vn'>('galgame_vn');

  const [selectedMethod, setSelectedMethod] = useState<SoothingMethod>(
    sentinel.contracted ? '契约共鸣' : appointment.method || '精神疏导'
  );

  // Galgame VN Stage Tracker (1: 开场准备, 2: 深度安抚, 3: 诊毕后续)
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [stageSubstep, setStageSubstep] = useState<'selecting' | 'reacted'>('selecting');

  // History tracking for dialog log
  const [dialogueHistory, setDialogueHistory] = useState<{ speaker: string; text: string; actionDesc?: string }[]>([]);

  // Stage 1 Choices & State
  const stage1Options = generateStage1Options(guide, sentinel, selectedMethod);
  const [stage1Chosen, setStage1Chosen] = useState<SoothingOption | null>(null);
  const [stage1Reaction, setStage1Reaction] = useState<{ spokenText: string; actionDesc: string } | null>(null);

  // Stage 2 Choices & State
  const stage2Options = generateStage2Options(guide, sentinel, selectedMethod);
  const [stage2Chosen, setStage2Chosen] = useState<SoothingOption | null>(null);
  const [stage2Reaction, setStage2Reaction] = useState<{ spokenText: string; actionDesc: string } | null>(null);

  // Stage 3 Ending Choices & State
  const stage3EndingOptions = getStage3EndingOptions();
  const [stage3Chosen, setStage3Chosen] = useState<SoothingEndingChoice | null>(null);
  const [stage3Reaction, setStage3Reaction] = useState<{ spokenText: string; actionDesc: string; narratorSummary: string } | null>(null);

  const methodsList: {
    id: SoothingMethod;
    name: string;
    icon: any;
    color: string;
    riotReduction: string;
    mentalCost: number;
    description: string;
    effectNotes: string;
    requiresContract?: boolean;
  }[] = [
    {
      id: '精神疏导',
      name: '精神域潜航深度梳理',
      icon: Brain,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40',
      riotReduction: '-35% ~ -45%',
      mentalCost: 28,
      description: '向导释放S级精神触手切入哨兵精神海深渊，像清泉冲刷畸变污染与黑色风暴。',
      effectNotes: '大幅度降低暴动指数，平衡精神阈值，提升极高信任与好感。'
    },
    {
      id: '物理安抚',
      name: '体表触碰与兽化腺体爱抚',
      icon: Heart,
      color: 'text-pink-400 border-pink-500/40 bg-pink-950/20 hover:bg-pink-950/40',
      riotReduction: '-20% ~ -30%',
      mentalCost: 15,
      description: '用温软掌心抚摸其兽耳基部、后颈腺体或贴抚精神体毛皮，以体表弱信息素安抚。',
      effectNotes: '精神消耗低，极大激发哨兵生理依赖与独占欲，兽化特征显著收拢。'
    },
    {
      id: '信息素安抚',
      name: '高纯度向导素神经注入',
      icon: Zap,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40',
      riotReduction: '-30% ~ -40%',
      mentalCost: 24,
      description: '注入浓郁的高阶清冷向导素，直接阻断哨兵神经痛感。带来尖锐战栗与沉溺感。',
      effectNotes: '迅速压制暴动，伴随强烈生理依恋与向导素戒断反应。'
    },
    {
      id: '契约共鸣',
      name: '同生共死·灵魂同频共鸣',
      icon: Sparkles,
      color: 'text-purple-300 border-purple-500/60 bg-purple-950/30 hover:bg-purple-950/50',
      riotReduction: '-55% ~ -70%',
      mentalCost: 12,
      description: '仅限契约哨兵触发。两颗灵魂共振，生命本源双向奔赴，无需繁琐操作即可瞬间化解重度精神狂潮。',
      effectNotes: '神迹级治愈，几乎不产生精神疲劳，印记闪烁强韧生命之光。',
      requiresContract: true
    }
  ];

  // Stage 1 Select Action Handler
  const handleSelectStage1 = (option: SoothingOption) => {
    setStage1Chosen(option);
    const react = getStage1Reaction(sentinel, option);
    setStage1Reaction(react);
    setStageSubstep('reacted');

    setDialogueHistory(prev => [
      ...prev,
      { speaker: `${guide.name} (向导)`, text: option.text },
      { speaker: sentinel.name, text: react.spokenText, actionDesc: react.actionDesc }
    ]);
  };

  // Next Stage from Stage 1 to Stage 2
  const handleProceedToStage2 = () => {
    setCurrentStage(2);
    setStageSubstep('selecting');
  };

  // Stage 2 Select Action Handler
  const handleSelectStage2 = (option: SoothingOption) => {
    setStage2Chosen(option);
    const react = getStage2Reaction(sentinel, option);
    setStage2Reaction(react);
    setStageSubstep('reacted');

    setDialogueHistory(prev => [
      ...prev,
      { speaker: `${guide.name} (向导)`, text: option.text },
      { speaker: sentinel.name, text: react.spokenText, actionDesc: react.actionDesc }
    ]);
  };

  // Next Stage from Stage 2 to Stage 3
  const handleProceedToStage3 = () => {
    setCurrentStage(3);
    setStageSubstep('selecting');
  };

  // Stage 3 Ending Choice Handler
  const handleSelectStage3 = (choice: SoothingEndingChoice) => {
    setStage3Chosen(choice);
    const react = getStage3EndingReaction(sentinel, choice);
    setStage3Reaction(react);
    setStageSubstep('reacted');

    setDialogueHistory(prev => [
      ...prev,
      { speaker: `${guide.name} (向导)`, text: choice.spokenLine },
      { speaker: sentinel.name, text: react.spokenText, actionDesc: react.actionDesc }
    ]);
  };

  // Finalize Soothing Session
  const handleFinalSubmit = () => {
    const actionSummary = `[${stage1Chosen?.styleTag || '初探'}] + [${stage2Chosen?.styleTag || '深渊干预'}] + [${stage3Chosen?.title || '完成'}]`;
    const fullReaction = `${stage2Reaction?.spokenText || ''} ${stage3Reaction?.spokenText || ''}`.trim();
    const shouldAddFriend = sentinel.affinity >= 55 || stage3Chosen?.id !== 'leave';

    onExecute(
      selectedMethod,
      actionSummary,
      fullReaction,
      shouldAddFriend,
      stage3Chosen?.id || 'leave',
      stage3Reaction?.narratorSummary,
      dialogueHistory.map(d => ({ speaker: d.speaker, text: d.text }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/98 border border-cyan-400/60 w-full max-w-3xl rounded-2xl p-4 sm:p-6 relative shadow-2xl holo-glow flex flex-col max-h-[95vh] overflow-hidden my-auto">
        {/* Top Header */}
        <div className="flex justify-between items-start pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]">
              {sentinel.avatarText}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-100 text-sm">{sentinel.name}</span>
                <span className="text-[10px] text-cyan-400 font-mono">[{sentinel.code}]</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  {sentinel.race}
                </span>
                <span className="text-[10px] bg-pink-950/70 text-pink-300 border border-pink-500/30 px-1.5 py-0.5 rounded font-bold">
                  性格: {sentinel.personality}
                </span>
                <span className="text-[10px] bg-red-950/70 text-red-300 border border-red-500/40 px-1.5 py-0.5 rounded font-mono">
                  暴动阈值: {sentinel.riotRate}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                主治向导：<strong className="text-cyan-300">{guide.name}</strong> ({guide.rank} · <span className="text-pink-300">【{guide.guidePersonality || '温柔'}】型</span>)
                {guide.spiritBeast && <span> · 精神体: 【{guide.spiritBeast.name}】</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMode(modalMode === 'choose_method' ? 'galgame_vn' : 'choose_method')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>{modalMode === 'choose_method' ? '返回互动' : '调换方式'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode A: Method Switching */}
        {modalMode === 'choose_method' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <h3 className="text-xs font-bold text-cyan-300">选择拟实施的神圣安抚方式：</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methodsList.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                const disabled = m.requiresContract && !sentinel.contracted;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (!disabled) {
                        setSelectedMethod(m.id);
                        setModalMode('galgame_vn');
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-950/40 border-slate-800'
                        : isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.25)]'
                        : m.color
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs flex items-center gap-1.5 text-slate-100">
                          <Icon className="w-4 h-4" />
                          <span>{m.name}</span>
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-cyan-500 text-slate-950 px-2 py-0.2 rounded font-bold">
                            已选定
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        {m.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                      <span className="text-red-400 font-mono font-semibold">狂暴消退: {m.riotReduction}</span>
                      <span className="text-cyan-400 font-mono">向导耗能: -{m.mentalCost}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalMode('galgame_vn')}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                进入全息安抚视觉小说交互
              </button>
            </div>
          </div>
        )}

        {/* Mode B: Visual Novel Galgame Interactive Mode */}
        {modalMode === 'galgame_vn' && (
          <div className="flex-1 flex flex-col overflow-hidden py-3 space-y-3">
            {/* Galgame Stage Progress Breadcrumb */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-400 text-[11px]">安抚进程：</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 font-mono text-[11px]">
                <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 transition ${
                  currentStage === 1 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                    : currentStage > 1 
                    ? 'text-emerald-400' 
                    : 'text-slate-600'
                }`}>
                  {currentStage > 1 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <span>1. 开场准备</span>
                </span>

                <ChevronRight className="w-3 h-3 text-slate-600" />

                <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 transition ${
                  currentStage === 2 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                    : currentStage > 2 
                    ? 'text-emerald-400' 
                    : 'text-slate-600'
                }`}>
                  {currentStage > 2 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <span>2. 深度安抚</span>
                </span>

                <ChevronRight className="w-3 h-3 text-slate-600" />

                <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 transition ${
                  currentStage === 3 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                    : 'text-slate-600'
                }`}>
                  <span>3. 诊毕后续</span>
                </span>
              </div>
            </div>

            {/* Galgame Scene Presentation Box */}
            <div className="flex-1 bg-gradient-to-b from-slate-950 via-slate-950/90 to-purple-950/30 rounded-2xl border border-cyan-500/30 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto relative shadow-inner space-y-4 min-h-[220px]">
              {/* Atmosphere ambient tag */}
              <div className="flex justify-between items-center text-[10px] text-cyan-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>舱内向导素浓度: 88.4% · 心跳监测: 92 bpm · 神经阻抗: 下降中</span>
                </span>
                <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30 text-purple-300">
                  当前模式: {selectedMethod}
                </span>
              </div>

              {/* Character Dialogue & Action Presentation (Visual Novel Style) */}
              <div className="space-y-3.5 my-auto">
                {/* Stage 1 Display */}
                {currentStage === 1 && (
                  <div className="space-y-3 animate-fadeIn">
                    {!stage1Chosen ? (
                      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400">【哨兵状态 · 候诊反应】</span>
                          <span className="text-[11px] text-slate-400 font-mono">{sentinel.name} [{sentinel.race}]</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic text-[11px]">
                          *他跨入全息安抚舱，暴动值在临界线{sentinel.riotRate}%剧烈震荡。战甲下的肌肉紧绷，半兽化特征（{sentinel.beastFeatures || '兽耳与利爪'}）因神经剧痛而本能防备，猩红与野性在眸中闪烁。*
                        </p>
                        <p className="text-cyan-300 text-xs font-semibold pt-1">
                          👉 请选择向导（女主）的开场台词与指令（匹配向导【{guide.guidePersonality || '温柔'}】性格与哨兵人设）：
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Guide's Spoken Choice */}
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1">
                          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span>{guide.name} (向导 · {stage1Chosen.styleTag})</span>
                          </div>
                          <p className="text-slate-100 font-medium pl-3 border-l-2 border-cyan-400 text-xs sm:text-sm">
                            {stage1Chosen.text}
                          </p>
                        </div>

                        {/* Sentinel's Reaction */}
                        {stage1Reaction && (
                          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs space-y-2">
                            <div className="font-bold text-purple-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-400" />
                              <span>{sentinel.name} ({sentinel.personality})</span>
                            </div>
                            <p className="text-slate-100 text-xs sm:text-sm font-semibold pl-3 border-l-2 border-purple-400">
                              {stage1Reaction.spokenText}
                            </p>
                            <p className="text-[11px] text-purple-200/80 italic pl-3 leading-relaxed">
                              *{stage1Reaction.actionDesc}*
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Stage 2 Display */}
                {currentStage === 2 && (
                  <div className="space-y-3 animate-fadeIn">
                    {!stage2Chosen ? (
                      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-400">【深渊异动 · 精神海震颤】</span>
                          <span className="text-[11px] text-slate-400 font-mono">第 2 阶段 · 突破防御</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic text-[11px]">
                          *随着安抚深入，哨兵潜意识深处的黑色畸变裂痕产生剧烈反抗。他发出痛苦的粗重喘息，精神体在识海剧烈翻腾，紧绷的兽化腺体滚烫发热。*
                        </p>
                        <p className="text-cyan-300 text-xs font-semibold pt-1">
                          👉 请选择向导的深度安抚干预行动：
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1">
                          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span>{guide.name} (向导 · {stage2Chosen.styleTag})</span>
                          </div>
                          <p className="text-slate-100 font-medium pl-3 border-l-2 border-cyan-400 text-xs sm:text-sm">
                            {stage2Chosen.text}
                          </p>
                        </div>

                        {stage2Reaction && (
                          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs space-y-2">
                            <div className="font-bold text-purple-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-400" />
                              <span>{sentinel.name} ({sentinel.personality})</span>
                            </div>
                            <p className="text-slate-100 text-xs sm:text-sm font-semibold pl-3 border-l-2 border-purple-400">
                              {stage2Reaction.spokenText}
                            </p>
                            <p className="text-[11px] text-purple-200/80 italic pl-3 leading-relaxed">
                              *{stage2Reaction.actionDesc}*
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Stage 3 Display */}
                {currentStage === 3 && (
                  <div className="space-y-3 animate-fadeIn">
                    {!stage3Chosen ? (
                      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">【疏导收尾 · 阈值平稳】</span>
                          <span className="text-[11px] text-slate-400 font-mono">第 3 阶段 · 后续安排</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic text-[11px]">
                          *狂暴风暴彻底平息，哨兵狂暴指数骤降至安全阈值以下。他浑身被你的向导素浸透，神智恢复澄澈，眼底的杀意化作深重的信赖与依恋，正默默等待向导的指示。*
                        </p>
                        <p className="text-cyan-300 text-xs font-semibold pt-1">
                          👉 请选择本次安抚结束后的安排（不同选项直接决定好感度、留宿剧情或雄竞事件）：
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1">
                          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span>{guide.name} (向导决策)</span>
                          </div>
                          <p className="text-slate-100 font-medium pl-3 border-l-2 border-cyan-400 text-xs sm:text-sm">
                            {stage3Chosen.spokenLine}
                          </p>
                        </div>

                        {stage3Reaction && (
                          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2">
                            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>{sentinel.name} (回馈反应)</span>
                            </div>
                            <p className="text-slate-100 text-xs sm:text-sm font-semibold pl-3 border-l-2 border-emerald-400">
                              {stage3Reaction.spokenText}
                            </p>
                            <p className="text-[11px] text-emerald-200/80 italic pl-3 leading-relaxed">
                              *{stage3Reaction.actionDesc}*
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step Navigation Button inside dialogue box if reacted */}
              {stageSubstep === 'reacted' && (
                <div className="pt-2 flex justify-end">
                  {currentStage === 1 && (
                    <button
                      onClick={handleProceedToStage2}
                      className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>进入深渊安抚干预 (阶段二)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {currentStage === 2 && (
                    <button
                      onClick={handleProceedToStage3}
                      className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>进入诊毕后续安排 (阶段三)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {currentStage === 3 && (
                    <button
                      onClick={handleFinalSubmit}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>结算安抚成效 · 录入医疗档案</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Options Tray (Active when stageSubstep is 'selecting') */}
            {stageSubstep === 'selecting' && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold px-1">
                  <span>向导对话选项 (点击立即触发视觉小说反馈)：</span>
                  <span className="text-cyan-400">共 {currentStage === 1 ? stage1Options.length : currentStage === 2 ? stage2Options.length : stage3EndingOptions.length} 个分支</span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {/* Stage 1 Options */}
                  {currentStage === 1 && stage1Options.map((opt, idx) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectStage1(opt)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-xs transition cursor-pointer group shadow-sm flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono flex items-center justify-center text-[10px] shrink-0 mt-0.5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold text-slate-100 group-hover:text-cyan-300 flex items-center gap-2">
                          <span>{opt.styleTag}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded font-normal">
                            {opt.guideStyle}风格
                          </span>
                        </div>
                        <div className="text-cyan-200 text-xs font-medium">
                          {opt.text}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Stage 2 Options */}
                  {currentStage === 2 && stage2Options.map((opt, idx) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectStage2(opt)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-purple-500/30 hover:border-purple-400 text-xs transition cursor-pointer group shadow-sm flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-mono flex items-center justify-center text-[10px] shrink-0 mt-0.5 group-hover:bg-purple-500 group-hover:text-slate-950 transition">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold text-slate-100 group-hover:text-purple-300">
                          {opt.styleTag}
                        </div>
                        <div className="text-purple-200 text-xs font-medium">
                          {opt.text}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Stage 3 Ending Options */}
                  {currentStage === 3 && stage3EndingOptions.map((opt, idx) => {
                    const iconMap = {
                      leave: LogOut,
                      rest: Bed,
                      dine: Coffee
                    };
                    const Icon = iconMap[opt.id];

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectStage3(opt)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer group shadow-sm flex items-start gap-2.5 ${
                          opt.id === 'leave'
                            ? 'bg-slate-950/80 hover:bg-slate-900 border-slate-700 hover:border-slate-500'
                            : opt.id === 'rest'
                            ? 'bg-slate-950/80 hover:bg-slate-900 border-amber-500/40 hover:border-amber-400'
                            : 'bg-slate-950/80 hover:bg-slate-900 border-pink-500/40 hover:border-pink-400'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-100 group-hover:text-cyan-300">
                              {opt.title}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400">
                              好感+{opt.affectionBonus} · 信任+{opt.trustBonus}
                            </span>
                          </div>
                          <div className="text-slate-200 text-xs font-medium">
                            {opt.spokenLine}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
