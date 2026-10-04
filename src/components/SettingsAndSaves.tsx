import React, { useState } from 'react';
import { GameSaveData, Guide } from '../types';
import { WORLDVIEW_CODEX } from '../data/initialData';
import { Sliders, Download, Upload, Trash2, Plus, BookOpen, RefreshCw, CheckCircle2, User, Edit3, Heart, Brain, Sparkles } from 'lucide-react';

interface SettingsAndSavesProps {
  currentSlot: string;
  availableSlots: { id: string; name: string; lastUpdated: string }[];
  guide?: Guide;
  onOpenEditGuide?: () => void;
  onSwitchSlot: (slotId: string) => void;
  onCreateSlot: (slotName: string) => void;
  onDeleteSlot: (slotId: string) => void;
  onExportJson: () => void;
  onImportJson: (jsonData: string) => void;
  onResetFactory: () => void;
}

export const SettingsAndSaves: React.FC<SettingsAndSavesProps> = ({
  currentSlot,
  availableSlots,
  guide,
  onOpenEditGuide,
  onSwitchSlot,
  onCreateSlot,
  onDeleteSlot,
  onExportJson,
  onImportJson,
  onResetFactory
}) => {
  const [activeTab, setActiveTab] = useState<'saves' | 'codex' | 'about'>('saves');
  const [newSlotName, setNewSlotName] = useState('');
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotName.trim()) return;
    onCreateSlot(newSlotName.trim());
    setNewSlotName('');
    setIsCreatingSlot(false);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    onImportJson(importText.trim());
    setImportText('');
    setIsImporting(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>光脑系统设置 · 档案调度与帝国法典</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            管理本地向导独立存档节点，查阅星际兽世向导常识百科
          </p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('saves')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              activeTab === 'saves' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
            }`}
          >
            多存档中枢
          </button>
          <button
            onClick={() => setActiveTab('codex')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              activeTab === 'codex' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
            }`}
          >
            世界观词典
          </button>
        </div>
      </div>

      {/* Tab: Multi-Save System */}
      {activeTab === 'saves' && (
        <div className="space-y-4">
          {/* Guide Customization Card (Heroine Profile) */}
          {guide && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-cyan-200 font-bold text-lg shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                  {guide.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-100 text-sm">{guide.name}</span>
                    <span className="text-[10px] bg-purple-950 text-purple-200 px-2 py-0.5 rounded border border-purple-500/50 font-semibold">
                      {guide.rank}
                    </span>
                    <span className="text-[10px] bg-pink-950/60 text-pink-300 px-2 py-0.5 rounded border border-pink-500/40 font-semibold flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-pink-400" />
                      <span>【{guide.guidePersonality || '温柔'}】型向导</span>
                    </span>
                  </div>
                  <p className="text-xs text-cyan-400/90 mt-0.5">
                    {guide.title} · 精神体: 【{guide.spiritBeast?.name || '小雪团'}】({guide.spiritBeast?.form || '光翼琉璃蝶'})
                  </p>
                </div>
              </div>

              {onOpenEditGuide && (
                <button
                  onClick={onOpenEditGuide}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>【编辑向导档案】</span>
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cyan-300">本地向导档案槽位 ({availableSlots.length})</h3>
            <button
              onClick={() => setIsCreatingSlot(true)}
              className="px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/40 text-cyan-200 rounded text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建独立向导档案</span>
            </button>
          </div>

          {/* New Slot Creation Inline */}
          {isCreatingSlot && (
            <form onSubmit={handleCreateSubmit} className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 flex gap-2">
              <input
                type="text"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                placeholder="输入新档案名称，如：安黎·二周目测试"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                required
              />
              <button
                type="button"
                onClick={() => setIsCreatingSlot(false)}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
              >
                确认创建
              </button>
            </form>
          )}

          {/* Available Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableSlots.map(slot => {
              const isCurrent = slot.id === currentSlot;

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-100 text-sm">{slot.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-cyan-900 text-cyan-200 px-2 py-0.2 rounded border border-cyan-500/40 font-semibold">
                          当前载入
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                      更新：{slot.lastUpdated}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                    {!isCurrent && (
                      <button
                        onClick={() => onSwitchSlot(slot.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition cursor-pointer"
                      >
                        载入此档
                      </button>
                    )}

                    {availableSlots.length > 1 && (
                      <button
                        onClick={() => onDeleteSlot(slot.id)}
                        className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded text-xs border border-red-500/30 transition cursor-pointer"
                        title="删除该档案"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Import / Export / Factory Reset */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 pt-4 text-xs">
            <div className="font-bold text-slate-200">数据备份与格式化工具</div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onExportJson}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>导出当前向导档案 (JSON)</span>
              </button>

              <button
                onClick={() => setIsImporting(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>导入外置存档 (JSON)</span>
              </button>

              <button
                onClick={onResetFactory}
                className="px-4 py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer ml-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>重置为初始预设</span>
              </button>
            </div>
          </div>

          {/* Import JSON Modal */}
          {isImporting && (
            <form onSubmit={handleImportSubmit} className="p-4 rounded-xl bg-slate-900 border border-purple-500/40 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-purple-300">
                <span>粘贴 JSON 存档文本进行还原</span>
                <button type="button" onClick={() => setIsImporting(false)} className="text-slate-400">✕</button>
              </div>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="粘贴由导出工具生成的完整 JSON 字符串……"
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-400 resize-none"
                required
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsImporting(false)}
                  className="px-3 py-1 bg-slate-800 text-slate-400 rounded hover:bg-slate-700"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-semibold"
                >
                  解析并载入
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab: Worldview Codex */}
      {activeTab === 'codex' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {WORLDVIEW_CODEX.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs"
              >
                <h4 className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.title}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs pl-5">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
