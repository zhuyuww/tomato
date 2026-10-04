import React, { useState } from 'react';
import { TrendTopic, Guide } from '../types';
import { Flame, Video, MessageSquare, Plus, Send, Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface TrendsModuleProps {
  trends: TrendTopic[];
  guide: Guide;
  onPublishPost: (title: string, content: string, isAnonymous: boolean) => void;
  onViewSentinelByTrend?: (sentinelId: string) => void;
}

export const TrendsModule: React.FC<TrendsModuleProps> = ({
  trends,
  guide,
  onPublishPost,
  onViewSentinelByTrend
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'videos' | 'posts'>('trends');
  const [isPostingModal, setIsPostingModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Short video simulation cards
  const videoFeeds = [
    {
      id: 'v_1',
      title: '【前线直击】第一军团S级雪狼在极寒荒原斩杀变异种全息记录',
      author: '帝国军事观察台',
      views: '482万',
      duration: '01:24',
      tag: '战地实录',
      desc: '白化极地雪狼在风暴中撕碎畸形种头颅，战毕后出现短暂精神海濒临狂暴，幸得后方紧急调配向导素。'
    },
    {
      id: 'v_2',
      title: '【学术前沿】为什么向导素对节肢类精神体具有特殊安抚频段？',
      author: '星际向导与精神体生物学研究院',
      views: '196万',
      duration: '04:12',
      tag: '学术科普',
      desc: '深入剖析蜘蛛、蜈蚣等异形精神体在面临向导素抚弄时的独特共鸣机制，呼吁消除群体歧视。'
    },
    {
      id: 'v_3',
      title: '【帝国晨报】高级向导安黎推行温和疏导法，狂暴哨兵零反噬奇迹！',
      author: '首都星卫视',
      views: '715万',
      duration: '02:50',
      tag: '热点专访',
      desc: '多位功勋哨兵受访时盛赞安黎向导的澄澈精神海，称其为“坠落黑暗深渊时唯一的黎明”。'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onPublishPost(newTitle, newContent, isAnonymous);
    setNewTitle('');
    setNewContent('');
    setIsPostingModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Top Banner & Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-cyan-500/20">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>星网热搜中枢 · 全球舆情视窗</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            实时监测帝国全星系前线战报、狂暴警戒与向导社会讨论
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                activeTab === 'trends' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              热搜榜单
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                activeTab === 'videos' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              全息短视频
            </button>
          </div>

          <button
            onClick={() => setIsPostingModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-bold text-xs rounded-lg shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>发帖发声</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'trends' && (
        <div className="space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/70">
            {trends.map((item, idx) => {
              const rankColor = idx === 0 
                ? 'text-red-400' 
                : idx === 1 
                ? 'text-amber-400' 
                : idx === 2 
                ? 'text-yellow-400' 
                : 'text-slate-500';

              const tagBg = item.tag === '爆'
                ? 'bg-red-950 text-red-300 border-red-500/50'
                : item.tag === '警'
                ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                : 'bg-amber-950 text-amber-300 border-amber-500/40';

              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-900/40 transition flex items-start gap-4 text-xs"
                >
                  <div className={`font-mono font-bold text-lg w-6 text-center ${rankColor}`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${tagBg}`}>
                        {item.tag}
                      </span>
                      <span className="font-bold text-slate-100 text-sm hover:text-cyan-300 cursor-pointer">
                        {item.title}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                      <span>星网热度指数：<strong className="text-amber-400 font-mono">{item.heat}</strong></span>
                      <span>讨论帖数：<strong className="text-slate-400 font-mono">{item.postsCount}</strong></span>
                      {item.relatedSentinelId && onViewSentinelByTrend && (
                        <button
                          onClick={() => onViewSentinelByTrend(item.relatedSentinelId!)}
                          className="text-cyan-400 hover:underline cursor-pointer"
                        >
                          » 穿透查看当事哨兵档案
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Video feeds */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoFeeds.map(v => (
            <div
              key={v.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-32 rounded-lg bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                  <Video className="w-10 h-10 text-cyan-400/80 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] text-slate-300 rounded font-mono">
                    {v.duration}
                  </div>
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-cyan-900/80 border border-cyan-500/40 text-[10px] text-cyan-200 rounded">
                    {v.tag}
                  </div>
                </div>

                <h3 className="font-bold text-slate-200 text-xs leading-snug line-clamp-2">
                  {v.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {v.desc}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>来源: {v.author}</span>
                <span>播放: {v.views}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guide Posting Modal */}
      {isPostingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-cyan-400/50 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>星网全域公共发帖</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPostingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">帖子标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：关于哨兵精神体接纳度与温柔安抚的倡议……"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">正文阐述</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="畅言你的理念。发帖将引发星网讨论热潮，并提升向导声望值。"
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="anonCheck" className="text-slate-300 text-xs">
                  使用【匿名星际向导ID】发布（隐藏实名）
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPostingModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-semibold rounded-lg text-xs shadow-md"
              >
                公开发送
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
