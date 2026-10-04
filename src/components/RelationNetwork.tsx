import React, { useState } from 'react';
import { Sentinel, Guide } from '../types';
import { 
  HeartHandshake, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Heart,
  MessageCircle,
  X
} from 'lucide-react';

interface RelationNetworkProps {
  sentinels: Sentinel[];
  guide: Guide;
  onContractSentinel: (sentinelId: string) => void;
  onOpenChat: (sentinelId: string) => void;
}

export const RelationNetwork: React.FC<RelationNetworkProps> = ({
  sentinels,
  guide,
  onOpenChat
}) => {
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);

  // Per v2 requirements: ONLY contracted sentinels are shown in the star-web connection!
  const contractedList = sentinels.filter(s => s.contracted);

  // Check for high possessiveness jealousy if multiple contracted sentinels exist
  const isShurabaTriggered = contractedList.filter(s => s.possessiveness >= 75).length >= 2;

  const selectedSentinel = contractedList.find(s => s.id === selectedSentinelId);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-purple-400" />
            <span>向导羁绊星网 · 命定契约中枢</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            仅展示已达成【同生共死强绑定】的命定誓约哨兵（至多 5 位）
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg">
            同生共死契约席位: <strong className="text-purple-300 font-mono">{contractedList.length} / {guide.maxContracts}</strong>
          </span>
        </div>
      </div>

      {/* Shuraba Warning Banner among contracted partners */}
      {isShurabaTriggered && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/70 via-purple-950/40 to-slate-900 border border-red-500/50 shadow-lg flex items-start gap-3 text-xs holo-danger-glow animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-red-300 flex items-center gap-2">
              <span>⚠️ 契约者修罗场独占磁场激化！</span>
              <span className="text-[10px] bg-red-900 px-1.5 py-0.2 rounded text-white">命定伴侣意识交锋</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              检测到当前已契约的哨兵中有多位独占欲极强（<strong>{contractedList.map(s => s.name).join('、')}</strong>）。生命共振频段互相排斥，公馆内的向导素气味引发了强烈的领地独占警报。
            </p>
          </div>
        </div>
      )}

      {/* Visual Star-Web Network (ONLY Contracted Sentinels) */}
      <div className="relative p-6 rounded-2xl bg-slate-950/90 border border-purple-500/30 overflow-hidden min-h-[440px] flex items-center justify-center shadow-[inset_0_0_50px_rgba(168,85,247,0.1)]">
        {/* Dynamic Deep Space Starfield & Orbit Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-[300px] h-[300px] rounded-full border border-purple-500/50 border-dashed animate-spin duration-[60000ms]" />
          <div className="w-[440px] h-[440px] rounded-full border border-cyan-400/30 border-dashed animate-spin duration-[90000ms] reverse" />
        </div>

        {/* SVG Glowing Light Threads Linking Center Guide to Each Contracted Sentinel */}
        {contractedList.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="contractGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff007f" stopOpacity="0.8" />
              </linearGradient>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {contractedList.map((_, idx) => {
              const angle = (idx / contractedList.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 150;
              // Center coordinates in percentage or relative
              // SVG viewBox is dynamic, let's use 50% 50%
              return (
                <line
                  key={`line_${idx}`}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${Math.cos(angle) * radius}px)`}
                  y2={`calc(50% + ${Math.sin(angle) * radius}px)`}
                  stroke="url(#contractGlow)"
                  strokeWidth="3"
                  filter="url(#laserGlow)"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        )}

        {/* Center: Guide Core Node */}
        <div className="z-10 flex flex-col items-center group cursor-pointer">
          <div className="w-22 h-22 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_35px_rgba(168,85,247,0.8)]">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-cyan-300 font-bold border border-cyan-400/40">
              <span className="text-xl tracking-wider">{guide.name}</span>
              <span className="text-[9px] text-purple-300 font-mono">契约原核</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-purple-200 mt-2 bg-slate-900/90 px-3 py-0.5 rounded-full border border-purple-500/40 shadow-sm">
            同生共死核心 · S级向导
          </span>
        </div>

        {/* Orbiting Contracted Sentinels ONLY */}
        {contractedList.length === 0 ? (
          <div className="absolute bottom-8 flex flex-col items-center text-center space-y-1.5 pointer-events-none px-4">
            <div className="w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center text-purple-400/60 animate-pulse">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-xs text-purple-300 font-medium tracking-wide">
              尚未缔结同生共死契约……等待宿命之光连结
            </p>
            <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
              向导可与至多 5 位哨兵缔结同生共死的最高法则誓约。需在日常疏导中将其好感度提升至 80、信任度达到 70 后，前往哨兵档案库中开启命定仪式。
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {contractedList.map((sentinel, idx) => {
              const angle = (idx / contractedList.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 150; // px from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={sentinel.id}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute pointer-events-auto"
                >
                  <div
                    onClick={() => setSelectedSentinelId(sentinel.id)}
                    className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300 hover:scale-115 active:scale-95 shadow-xl border-2 border-purple-400 bg-purple-950/90 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.8)]"
                    title={`${sentinel.name} (${sentinel.race}) - 已命定同生共死契约`}
                  >
                    <span className="text-lg">{sentinel.avatarText}</span>
                    <span className="text-[8px] font-mono leading-none mt-0.5 text-purple-300">
                      同生共死
                    </span>
                  </div>
                  <div className="text-[10px] text-center font-semibold text-slate-200 mt-1.5 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded-full border border-purple-500/50 shadow">
                    {sentinel.name.split(' ')[0]} ({sentinel.personality})
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contracted Sentinels Cards List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>命定契约者名录（生命强绑定 · 狂暴彻底平息）</span>
        </h3>

        {contractedList.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400 leading-relaxed">
            暂无已结契哨兵。当前尚无哨兵获得同生共死印记。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractedList.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border border-purple-500/50 space-y-2 text-xs holo-purple-glow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-950 border border-purple-400 text-purple-200 flex items-center justify-center font-bold text-base">
                      {s.avatarText}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <span>{s.name}</span>
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/40 px-1 rounded">
                          {s.personality}
                        </span>
                      </div>
                      <div className="text-[11px] text-purple-300">{s.race} · {s.rank}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded border border-purple-400">
                    同生共死契约生效中
                  </span>
                </div>

                <p className="text-slate-300 text-xs italic bg-black/40 p-2.5 rounded-lg border border-purple-900/50 leading-relaxed">
                  "{s.contractPledge}"
                </p>

                <div className="pt-1 flex justify-between items-center text-[11px] text-slate-400">
                  <span>狂暴值: <strong className="text-emerald-400 font-mono">{s.riotRate}%</strong></span>
                  <button
                    onClick={() => onOpenChat(s.id)}
                    className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>发信密语通讯 »</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Contracted Sentinel Detail Modal */}
      {selectedSentinel && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-400/50 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-300 text-sm">{selectedSentinel.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">[{selectedSentinel.code}]</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded">
                  性格: {selectedSentinel.personality}
                </span>
              </div>
              <button
                onClick={() => setSelectedSentinelId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1.5">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>同生共死生命纽带状态</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  生命波长已完全与向导共振。当向导遭遇危险或精神海受损时，该哨兵将以生命之力自动承担反噬。狂暴指数由向导永久护持。
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">灵魂誓约誓词:</span>
                <p className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-purple-200 italic">
                  "{selectedSentinel.contractPledge}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">印记铭刻处: </span>
                  <span className="text-slate-200">{selectedSentinel.contractMark}</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">精神体共鸣: </span>
                  <span className="text-slate-200">{selectedSentinel.spiritBeast.form} (极度温驯)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  onOpenChat(selectedSentinel.id);
                  setSelectedSentinelId(null);
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 hover:from-purple-500 hover:to-cyan-500 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>进入私密神经信道</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
