import React from 'react';
import { 
  CalendarClock, 
  FolderArchive, 
  MessageSquare, 
  Globe, 
  Flame, 
  Share2, 
  Sliders 
} from 'lucide-react';

export type NavTabId = 'clinic' | 'sentinels' | 'chat' | 'moments' | 'trends' | 'relations' | 'settings';

interface NavigationDockProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  pendingAppointmentsCount: number;
  unreadChatsCount: number;
  friendRequestsCount: number;
  criticalRiotsCount: number;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  currentTab,
  onSelectTab,
  pendingAppointmentsCount,
  unreadChatsCount,
  friendRequestsCount,
  criticalRiotsCount
}) => {
  const navItems = [
    {
      id: 'clinic' as NavTabId,
      label: '预约后台',
      icon: CalendarClock,
      badge: pendingAppointmentsCount + criticalRiotsCount,
      badgeColor: criticalRiotsCount > 0 ? 'bg-red-600' : 'bg-cyan-600'
    },
    {
      id: 'sentinels' as NavTabId,
      label: '哨兵档案',
      icon: FolderArchive,
      badge: 0
    },
    {
      id: 'chat' as NavTabId,
      label: '通讯聊天',
      icon: MessageSquare,
      badge: unreadChatsCount + friendRequestsCount,
      badgeColor: 'bg-indigo-600'
    },
    {
      id: 'moments' as NavTabId,
      label: '朋友圈',
      icon: Globe,
      badge: 0
    },
    {
      id: 'trends' as NavTabId,
      label: '星网热搜',
      icon: Flame,
      badge: 0
    },
    {
      id: 'relations' as NavTabId,
      label: '羁绊星网',
      icon: Share2,
      badge: 0
    },
    {
      id: 'settings' as NavTabId,
      label: '光脑中枢',
      icon: Sliders,
      badge: 0
    }
  ];

  return (
    <nav className="h-16 px-2 bg-slate-950/90 backdrop-blur-md border-t border-cyan-500/25 flex items-center justify-around z-30 shrink-0 select-none overflow-x-auto">
      <div className="flex items-center justify-around w-full max-w-4xl mx-auto gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative group cursor-pointer ${
                isActive
                  ? 'text-cyan-300 font-semibold bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-cyan-400' : 'group-hover:scale-105'}`} />
                {item.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 text-[9px] font-mono font-bold text-white rounded-full flex items-center justify-center border border-black/40 shadow-sm animate-pulse ${item.badgeColor || 'bg-cyan-600'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-6 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f3ff]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
