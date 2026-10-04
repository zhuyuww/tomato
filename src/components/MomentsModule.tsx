import React, { useState } from 'react';
import { Moment, Guide, Sentinel } from '../types';
import { Heart, MessageSquare, Plus, Share2, Sparkles, Globe, Lock, Shield, Reply } from 'lucide-react';

interface MomentsModuleProps {
  moments: Moment[];
  guide: Guide;
  sentinels: Sentinel[];
  onLikeMoment: (momentId: string) => void;
  onAddComment: (momentId: string, commentText: string, replyToAuthor?: string) => void;
  onCreateMoment: (content: string, visibility: 'public' | 'contracted_only' | 'friends_only') => void;
}

export const MomentsModule: React.FC<MomentsModuleProps> = ({
  moments,
  guide,
  sentinels,
  onLikeMoment,
  onAddComment,
  onCreateMoment
}) => {
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'contracted_only' | 'friends_only'>('public');
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});
  const [replyingToMap, setReplyingToMap] = useState<Record<string, string | null>>({});

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    onCreateMoment(postContent, visibility);
    setPostContent('');
    setIsPosting(false);
  };

  const handleCommentSubmit = (momentId: string) => {
    const text = commentInputMap[momentId];
    if (!text || !text.trim()) return;
    const replyTarget = replyingToMap[momentId] || undefined;
    onAddComment(momentId, text.trim(), replyTarget);
    setCommentInputMap(prev => ({ ...prev, [momentId]: '' }));
    setReplyingToMap(prev => ({ ...prev, [momentId]: null }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-3xl mx-auto w-full">
      {/* Header with Post Creator Button */}
      <div className="flex justify-between items-center pb-2 border-b border-cyan-500/20">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>星网动态圈 · 光脑朋友圈</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            汇聚前线哨兵与向导公馆的日常互动，支持哨兵之间多角雄竞互评
          </p>
        </div>

        <button
          onClick={() => setIsPosting(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>发表新动态</span>
        </button>
      </div>

      {/* Guide Posting Modal */}
      {isPosting && (
        <form
          onSubmit={handlePostSubmit}
          className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>记录向导日常动态（发布后将触发哨兵多角互动评论）</span>
          </div>

          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="分享今日精神海波澜、诊疗随想或向导温室里的花草……"
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
          />

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">可见范围:</span>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none"
              >
                <option value="public">全星网公开</option>
                <option value="friends_only">仅通讯录好友可见</option>
                <option value="contracted_only">仅命定契约哨兵可见</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:bg-slate-700"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
              >
                发布并观察回响
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Moments List */}
      <div className="space-y-4">
        {moments.map(m => (
          <div
            key={m.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs"
          >
            {/* Post Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                  m.isContracted
                    ? 'border-purple-400 bg-purple-950 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'border-cyan-400/40 bg-slate-800 text-cyan-300'
                }`}>
                  {m.avatarText}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{m.author}</span>
                    {m.isContracted && (
                      <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1 rounded border border-purple-500/40">
                        契约哨兵
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                </div>
              </div>

              {m.visibility === 'contracted_only' ? (
                <span className="text-[10px] text-purple-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 契约专属
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> 公开
                </span>
              )}
            </div>

            {/* Post Body */}
            <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
              {m.content}
            </p>

            {m.beastPhotoDesc && (
              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-cyan-300 italic">
                📷 {m.beastPhotoDesc}
              </div>
            )}

            {/* Action Bar (Like, Comment count) */}
            <div className="flex items-center gap-4 pt-1 text-slate-400 border-t border-slate-800/60">
              <button
                onClick={() => onLikeMoment(m.id)}
                className={`flex items-center gap-1.5 transition cursor-pointer ${
                  m.likedByGuide ? 'text-pink-400 font-bold' : 'hover:text-pink-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${m.likedByGuide ? 'fill-pink-500 text-pink-500' : ''}`} />
                <span>赞 ({m.likes})</span>
              </button>

              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>评论 ({m.comments.length})</span>
              </div>
            </div>

            {/* Comments List (with Cross-Character Inter-Replies support) */}
            {m.comments.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800/80 space-y-2">
                {m.comments.map(c => {
                  return (
                    <div key={c.id} className="text-[11px] leading-relaxed flex justify-between items-start group">
                      <div className="flex-1">
                        <span className={`font-semibold ${c.isGuide ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}>
                          {c.author}
                        </span>
                        {c.replyTo && (
                          <span className="text-slate-400 mx-1">
                            回复 <span className="text-indigo-300 font-medium">@{c.replyTo}</span>:
                          </span>
                        )}
                        {!c.replyTo && <span className="text-slate-400">: </span>}
                        <span className="text-slate-300">{c.text}</span>
                        <span className="text-[9px] text-slate-500 ml-2 font-mono">{c.time}</span>
                      </div>

                      <button
                        onClick={() => {
                          setReplyingToMap(prev => ({ ...prev, [m.id]: c.author }));
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-cyan-400 hover:underline px-1 shrink-0 transition-opacity flex items-center gap-0.5"
                        title={`回复 ${c.author}`}
                      >
                        <Reply className="w-3 h-3" />
                        <span>回复</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Comment Input */}
            <div className="space-y-1">
              {replyingToMap[m.id] && (
                <div className="flex items-center justify-between text-[10px] text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                  <span>正在回复 @{replyingToMap[m.id]}</span>
                  <button
                    onClick={() => setReplyingToMap(prev => ({ ...prev, [m.id]: null }))}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInputMap[m.id] || ''}
                  onChange={(e) => setCommentInputMap(prev => ({ ...prev, [m.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(m.id)}
                  placeholder={replyingToMap[m.id] ? `回复 @${replyingToMap[m.id]}……` : "发表评论互动……"}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleCommentSubmit(m.id)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition cursor-pointer font-medium"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
