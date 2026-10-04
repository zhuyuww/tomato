import React from 'react';
import { SoothingReport } from '../types';
import { FileCheck, Sparkles, HeartHandshake, ArrowDownRight, Award } from 'lucide-react';

interface SoothingReportModalProps {
  report: SoothingReport;
  onClose: () => void;
}

export const SoothingReportModal: React.FC<SoothingReportModalProps> = ({
  report,
  onClose
}) => {
  const riotDiff = report.riotBefore - report.riotAfter;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/60 w-full max-w-md rounded-2xl p-6 relative shadow-2xl space-y-4 holo-glow">
        {/* Certificate Style Header */}
        <div className="text-center pb-3 border-b border-slate-800">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100 tracking-wider">
            帝国向导医疗中心 · 疏导归档回执
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{report.stardate} · 电子防伪序列 #{report.id.slice(-6)}</p>
        </div>

        {/* Data Matrix */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">安抚对象</span>
            <span className="font-bold text-slate-200">{report.sentinelName}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">介入方式</span>
            <span className="font-bold text-cyan-400">{report.method}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">暴动指数净化</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400 line-through">{report.riotBefore}%</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-emerald-400 font-bold">{report.riotAfter}%</strong>
              <span className="text-[10px] text-emerald-500">(-{riotDiff}%)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">向导精神力损耗</span>
            <span className="font-mono text-cyan-300 font-bold">-{report.mentalConsumed} pts</span>
          </div>
        </div>

        {/* Relationship Delta (if not contracted) */}
        {!report.isContractResonance && (
          <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs flex justify-around text-slate-300">
            <span>好感度 <strong className="text-pink-400">+{report.affinityDelta}</strong></span>
            <span>信任度 <strong className="text-cyan-400">+{report.trustDelta}</strong></span>
            <span>独占欲 <strong className="text-purple-400">+{report.possessivenessDelta}</strong></span>
          </div>
        )}

        {report.isContractResonance && (
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/50 text-xs text-purple-200 text-center font-medium">
            ⚜ 触发【命定契约共鸣】· 双向生命强绑定净化
          </div>
        )}

        {/* Narrative immersion text */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
          "{report.details}"
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
        >
          确认签署并录入光脑日志
        </button>
      </div>
    </div>
  );
};
