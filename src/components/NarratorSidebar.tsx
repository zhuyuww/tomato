import React, { useState } from 'react';
import { NarrationLog, Guide } from '../types';
import { 
  ScrollText, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Globe2, 
  Activity, 
  X,
  Filter
} from 'lucide-react';

interface NarratorSidebarProps {
  narrations: NarrationLog[];
  guide: Guide;
  isOpen: boolean;
  onToggle: () => void;
  onAddManualLog: (category: '疏导' | '社交' | '契约' | '紧急' | '随笔' | '世界动态', text: string) => void;
  onViewSentinel?: (sentinelId: string) => void;
}

export const NarratorSidebar: React.FC<NarratorSidebarProps> = ({
  narrations,
  guide,
  isOpen,
  onToggle,
  onAddManualLog,
  onViewSentinel
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingDiary, setIsAddingDiary] = useState(false);
  const [diaryCategory, setDiaryCategory] = useState<'疏导' | '社交' | '契约' | '紧急' | '随笔' | '世界动态'>('随笔');
  const [diaryContent, setDiaryContent] = useState('');

  const filteredNarrations = narrations.filter(n => {
    if (filterCategory === 'all') return true;
    return n.category === filterCategory;
  });

  const handleDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryContent.trim()) return;
    onAddManualLog(diaryCategory, diaryContent.trim());
    setDiaryContent('');
    setIsAddingDiary(false);
  };

  return (
    <aside 
      className={`h-full border-l border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex flex-col z-30 transition-all duration-300 relative select-none shrink-0 ${
        isOpen ? 'w-80 md:w-88' : 'w-10'
      }`}
    >
      {/* Toggle button on the sidebar border */}
      <button
        onClick={onToggle}
        className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-12 bg-cyan-950/90 border border-cyan-400/50 rounded-l-lg text-cyan-300 flex items-center justify-center hover:bg-cyan-900 shadow-md cursor-pointer z-40 transition-colors"
        title={isOpen ? '收起旁白侧边栏' : '展开旁白与世界动态'}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* When Collapsed: Vertical Strip */}
      {!isOpen && (
        <div 
          onClick={onToggle}
          className="flex-1 flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-slate-900/50 transition-colors gap-3"
          title="点击展开旁白与世界动态"
        >
          <ScrollText className="w-4 h-4 text-cyan-400" />
          <div className="text-[11px] font-bold text-slate-300 tracking-widest [writing-mode:vertical-lr] flex items-center gap-2">
            <span>旁白历程 · 世界动态</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1 py-0.5 rounded border border-cyan-500/40">
            {narrations.length}
          </span>
        </div>
      )}

      {/* When Expanded: Full Timeline Content */}
      {isOpen && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-cyan-500/20 bg-slate-900/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-xs tracking-wide">
                历程旁白 · 全域动态流
              </h3>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40">
                实时
              </span>
            </div>

            <button
              onClick={() => setIsAddingDiary(true)}
              className="p-1 rounded hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
              title="写向导随笔"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-slate-800/80 text-[10px] shrink-0">
            {[
              { id: 'all', label: '全部' },
              { id: '疏导', label: '疏导' },
              { id: '社交', label: '社交' },
              { id: '契约', label: '契约' },
              { id: '紧急', label: '急警' },
              { id: '随笔', label: '随笔' },
              { id: '世界动态', label: '世界' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2 py-0.5 rounded whitespace-nowrap transition cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-400/50'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Add Diary Inline Form */}
          {isAddingDiary && (
            <form onSubmit={handleDiarySubmit} className="p-3 bg-slate-900 border-b border-cyan-500/30 space-y-2 text-xs shrink-0">
              <div className="flex justify-between items-center text-cyan-300 font-semibold text-[11px]">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> 记录向导随笔
                </span>
                <button type="button" onClick={() => setIsAddingDiary(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">分类:</span>
                <select
                  value={diaryCategory}
                  onChange={(e) => setDiaryCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 text-[10px] focus:outline-none"
                >
                  <option value="随笔">私人随笔</option>
                  <option value="疏导">疏导感想</option>
                  <option value="社交">人际备忘</option>
                  <option value="世界动态">世界传闻</option>
                </select>
              </div>

              <textarea
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="记录此时此刻的心境、对某位哨兵的微妙触动……"
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                required
              />

              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingDiary(false)}
                  className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-medium"
                >
                  写入
                </button>
              </div>
            </form>
          )}

          {/* Timeline Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 relative before:absolute before:inset-0 before:left-4.5 before:w-0.5 before:bg-slate-800">
            {filteredNarrations.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-[11px]">
                暂无对应条目
              </div>
            ) : (
              filteredNarrations.map(log => {
                const isWorldEvent = log.category === '世界动态';
                const isEmergency = log.category === '紧急';
                const isContract = log.category === '契约';
                const isSoothing = log.category === '疏导';

                const badgeColor = 
                  isEmergency ? 'border-red-500/50 bg-red-950 text-red-300' :
                  isContract ? 'border-purple-500/50 bg-purple-950 text-purple-300' :
                  isWorldEvent ? 'border-amber-500/50 bg-amber-950 text-amber-300' :
                  isSoothing ? 'border-cyan-500/50 bg-cyan-950 text-cyan-300' :
                  'border-slate-700 bg-slate-800 text-slate-300';

                return (
                  <div key={log.id} className="relative pl-7 text-[11px] space-y-1 group">
                    {/* Glowing Node */}
                    <div className={`absolute left-4.5 top-1.5 w-2 h-2 rounded-full -translate-x-1/2 transition-transform group-hover:scale-125 ${
                      isEmergency ? 'bg-red-400 shadow-[0_0_8px_#ff3366]' :
                      isContract ? 'bg-purple-400 shadow-[0_0_8px_#a855f7]' :
                      isWorldEvent ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' :
                      'bg-cyan-400 shadow-[0_0_8px_#00f3ff]'
                    }`} />

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-cyan-500" />
                        {log.stardate}
                      </span>
                      <span className={`px-1 py-0.1 rounded border font-medium text-[9px] ${badgeColor}`}>
                        {log.category}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/90 text-slate-200 leading-relaxed group-hover:border-cyan-500/40 transition-colors">
                      {log.text}
                      {log.relatedSentinelId && onViewSentinel && (
                        <div className="mt-1 pt-1 border-t border-slate-800/60 text-right">
                          <button
                            onClick={() => onViewSentinel(log.relatedSentinelId!)}
                            className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                          >
                            » 档案【{log.relatedSentinelName || '哨兵'}】
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
