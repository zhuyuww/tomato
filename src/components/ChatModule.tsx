import React, { useState } from 'react';
import { Sentinel, ChatMessage, FriendRequest, GroupChat, Guide } from '../types';
import { 
  Send, 
  UserCheck, 
  UserX, 
  MessageCircle, 
  Users, 
  Hash, 
  FileText, 
  Sparkles, 
  Lock, 
  CalendarPlus,
  ShieldAlert
} from 'lucide-react';

interface ChatModuleProps {
  sentinels: Sentinel[];
  friends: string[];
  friendRequests: FriendRequest[];
  chats: Record<string, ChatMessage[]>;
  groupChats: GroupChat[];
  guide: Guide;
  onSendMessage: (receiverId: string, text: string) => void;
  onSendGroupMessage: (groupId: string, text: string) => void;
  onAcceptFriendRequest: (req: FriendRequest) => void;
  onRejectFriendRequest: (reqId: string) => void;
  onQuickAppointment: (sentinelId: string) => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({
  sentinels,
  friends,
  friendRequests,
  chats,
  groupChats,
  guide,
  onSendMessage,
  onSendGroupMessage,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  onQuickAppointment
}) => {
  const [chatType, setChatType] = useState<'direct' | 'group' | 'requests'>('direct');
  
  // Only acquainted sentinels can appear in private chat
  const eligibleFriends = friends.filter(fid => {
    const s = sentinels.find(sent => sent.id === fid);
    return s && s.isAcquainted !== false;
  });

  const [activePartnerId, setActivePartnerId] = useState<string>(eligibleFriends[0] || 's_001');
  const [activeGroupId, setActiveGroupId] = useState<string>(groupChats[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const currentPartner = sentinels.find(s => s.id === activePartnerId);
  const currentGroup = groupChats.find(g => g.id === activeGroupId);

  const activeMessages = chatType === 'direct' 
    ? (chats[activePartnerId] || []) 
    : (currentGroup?.messages || []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (chatType === 'direct' && currentPartner) {
      onSendMessage(activePartnerId, inputText);
    } else if (chatType === 'group' && currentGroup) {
      onSendGroupMessage(activeGroupId, inputText);
    }
    setInputText('');
  };

  const presetQuickReplies = [
    '【状态巡检】你当前的精神海波动处于哪个区间？可有狂暴征兆？',
    '若感到神经刺痛，立刻提交急诊插队申请，不要硬撑。',
    '把你的精神体放出来吧，我想抚摸一下它的耳朵。',
    '刚才的疏导效果如何？若有不适请务必第一时间告诉我。',
    '修尔总教官今天在走廊布下了领地威慑，你们注意保持距离。',
    '今天辛苦了，谢谢你一直以来在前线保护星系。'
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 md:p-6 gap-4">
      {/* Left Sidebar: Tabs & Conversation List */}
      <div className="w-full md:w-80 flex flex-col bg-slate-950/70 rounded-xl border border-cyan-500/20 overflow-hidden shrink-0">
        {/* Navigation Switch between Direct, Groups, and Requests */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1 text-xs">
          <button
            onClick={() => setChatType('direct')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              chatType === 'direct'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>私信好友 ({eligibleFriends.length})</span>
          </button>

          <button
            onClick={() => setChatType('group')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              chatType === 'group'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>群聊频道 ({groupChats.length})</span>
          </button>

          <button
            onClick={() => setChatType('requests')}
            className={`relative py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
              chatType === 'requests'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>申请</span>
            {friendRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {chatType === 'direct' && (
            eligibleFriends.map(fid => {
              const sentinel = sentinels.find(s => s.id === fid);
              if (!sentinel) return null;
              const isSelected = activePartnerId === fid;
              const userChats = chats[fid] || [];
              const lastMsg = userChats[userChats.length - 1];

              return (
                <div
                  key={fid}
                  onClick={() => setActivePartnerId(fid)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-cyan-950/60 border-l-4 border-cyan-400' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border ${
                    sentinel.contracted
                      ? 'border-purple-400 bg-purple-950 text-purple-200'
                      : 'border-cyan-400/40 bg-slate-800 text-cyan-300'
                  }`}>
                    {sentinel.avatarText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs truncate flex items-center gap-1">
                        {sentinel.name}
                        <span className="text-[9px] font-normal text-indigo-300 bg-indigo-950 px-1 rounded">
                          {sentinel.personality}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{lastMsg?.time || '今日'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : <span className="text-slate-600 italic">信道建立，会话从空白开始</span>}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {chatType === 'group' && (
            groupChats.map(g => {
              const isSelected = activeGroupId === g.id;
              const lastMsg = g.messages[g.messages.length - 1];

              return (
                <div
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-cyan-950/60 border-l-4 border-cyan-400' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs truncate">{g.name}</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">{g.membersCount}人</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lastMsg ? `${lastMsg.senderName || '队员'}: ${lastMsg.text}` : g.desc}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {chatType === 'requests' && (
            <div className="p-3 space-y-3">
              {friendRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  暂无待处理的好友申请
                </div>
              ) : (
                friendRequests.map(req => {
                  const sender = sentinels.find(s => s.id === req.sentinelId);
                  return (
                    <div key={req.id} className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-cyan-300">{sender?.name || '未知哨兵'}</span>
                          {sender?.personality && (
                            <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1 rounded border border-indigo-500/40">
                              {sender.personality}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{req.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic bg-black/40 p-2 rounded border border-slate-800">
                        "{req.verifyMsg}"
                      </p>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => onRejectFriendRequest(req.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-[11px] transition cursor-pointer"
                        >
                          婉拒
                        </button>
                        <button
                          onClick={() => onAcceptFriendRequest(req)}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded text-[11px] transition cursor-pointer"
                        >
                          通过申请
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center & Right: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-950/70 rounded-xl border border-cyan-500/20 overflow-hidden">
        {/* Chat Window Header */}
        <div className="h-14 px-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {chatType === 'direct' && currentPartner ? (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                  currentPartner.contracted ? 'border-purple-400 bg-purple-950 text-purple-200' : 'border-cyan-400/40 bg-slate-800 text-cyan-300'
                }`}>
                  {currentPartner.avatarText}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">{currentPartner.name}</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40">
                      {currentPartner.race} · {currentPartner.rank}
                    </span>
                    <span className="text-[10px] text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/40 font-medium">
                      人设: {currentPartner.personality}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    暴动阈值: <strong className="text-amber-400 font-mono">{currentPartner.riotRate}%</strong>
                  </span>
                </div>
              </>
            ) : chatType === 'group' && currentGroup ? (
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm text-slate-200">{currentGroup.name}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">好友申请审批界面</span>
            )}
          </div>

          {chatType === 'direct' && currentPartner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuickAppointment(currentPartner.id)}
                className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>下发特约预约</span>
              </button>
            </div>
          )}
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
              <Lock className="w-8 h-8 text-cyan-500/40" />
              <span>量子加密双向信道已就绪</span>
              <span className="text-slate-600 text-[11px]">聊天从空白开始，可点击下方预设指令或自由输入交流。</span>
            </div>
          ) : (
            activeMessages.map(msg => {
              const isMe = msg.sender === 'guide';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2.5`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {msg.senderName ? msg.senderName[0] : (currentPartner?.avatarText || '哨')}
                    </div>
                  )}

                  <div className="space-y-1 max-w-[75%]">
                    {!isMe && msg.senderName && (
                      <span className="text-[10px] text-slate-400 pl-1">{msg.senderName}</span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`text-[9px] text-slate-500 ${isMe ? 'text-right pr-1' : 'pl-1'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Dialogue Options & Input Bar */}
        {chatType !== 'requests' && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
            {/* Quick preset pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {presetQuickReplies.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(activePartnerId, p)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg whitespace-nowrap border border-slate-800 transition cursor-pointer text-[11px]"
                >
                  {p.length > 18 ? p.slice(0, 18) + '…' : p}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入神经信道指令或自由言语……"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSend}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>发送</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
