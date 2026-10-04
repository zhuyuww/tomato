import React, { useState } from 'react';
import { NarrationLog, Guide } from '../types';
import { ScrollText, Plus, BookOpen, Clock, Tag, Search, Filter } from 'lucide-react';

interface NarratorChronicleProps {
  narrations: NarrationLog[];
  guide: Guide;
  onAddManualLog: (category: '疏导' | '社交' | '契约' | '紧急' | '随笔', text: string) => void;
  onViewSentinel?: (sentinelId: string) => void;
}

export const NarratorChronicle: React.FC<NarratorChronicleProps> = ({
  narrations,
  guide,
  onAddManualLog,
  onViewSentinel
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingDiary, setIsAddingDiary] = useState(false);
  const [diaryCategory, setDiaryCategory] = useState<'疏导' | '社交' | '契约' | '紧急' | '随笔'>('随笔');
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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <span>日常历程 · 旁白日志编年史</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            以小说旁白视角，全息记录向导公馆内每一次安抚、邂逅与命脉羁绊
          </p>
        </div>

        <button
          onClick={() => setIsAddingDiary(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>书写向导日记/随笔</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: '全部纪实' },
          { id: '疏导', label: '疏导诊疗' },
          { id: '社交', label: '星网社交' },
          { id: '契约', label: '命定契约' },
          { id: '紧急', label: '狂暴急警' },
          { id: '随笔', label: '私人手记' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-bold'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Manual Diary Modal */}
      {isAddingDiary && (
        <form
          onSubmit={handleDiarySubmit}
          className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-3"
        >
          <div className="flex justify-between items-center text-xs font-bold text-cyan-300">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> 撰写向导私人随笔备忘
            </span>
            <button
              type="button"
              onClick={() => setIsAddingDiary(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">分类标签:</span>
            <select
              value={diaryCategory}
              onChange={(e) => setDiaryCategory(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none"
            >
              <option value="随笔">私人手记</option>
              <option value="疏导">疏导心得</option>
              <option value="社交">人际备忘</option>
              <option value="契约">契约思绪</option>
              <option value="紧急">危机纪要</option>
            </select>
          </div>

          <textarea
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            placeholder="记录下你此刻的精神海波澜、对某位哨兵的微妙触动，或诊疗室里的低语……"
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            required
          />

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsAddingDiary(false)}
              className="px-3 py-1 bg-slate-800 text-slate-400 rounded hover:bg-slate-700"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold"
            >
              保存至编年史
            </button>
          </div>
        </form>
      )}

      {/* Timeline Feed */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800/80">
        {filteredNarrations.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            当前分类下暂无旁白纪实
          </div>
        ) : (
          filteredNarrations.map(log => {
            const categoryBadgeColor = 
              log.category === '契约' ? 'border-purple-500/50 bg-purple-950 text-purple-300' :
              log.category === '紧急' ? 'border-red-500/50 bg-red-950 text-red-300' :
              log.category === '疏导' ? 'border-cyan-500/50 bg-cyan-950 text-cyan-300' :
              log.category === '社交' ? 'border-pink-500/50 bg-pink-950 text-pink-300' :
              'border-slate-700 bg-slate-800 text-slate-300';

            return (
              <div key={log.id} className="relative pl-9 text-xs space-y-1.5 group">
                {/* Glowing Dot on timeline */}
                <div className="absolute left-3.5 top-2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_10px_rgba(0,243,255,0.8)] -translate-x-1/2 group-hover:scale-125 transition-transform" />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-500" />
                    {log.stardate}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-medium ${categoryBadgeColor}`}>
                    {log.category}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 text-slate-200 leading-relaxed font-sans text-xs group-hover:border-cyan-500/40 transition-colors">
                  {log.text}

                  {log.relatedSentinelId && onViewSentinel && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 text-right">
                      <button
                        onClick={() => onViewSentinel(log.relatedSentinelId!)}
                        className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        » 查看关联哨兵【{log.relatedSentinelName || '档案'}】
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
  );
};
