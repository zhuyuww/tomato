import React, { useState } from 'react';
import { Appointment, Sentinel, Guide, SoothingMethod, TimeOfDay } from '../types';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Plus, 
  FastForward, 
  Info,
  Trash2,
  AlertOctagon
} from 'lucide-react';

interface ClinicModuleProps {
  appointments: Appointment[];
  sentinels: Sentinel[];
  guide: Guide;
  stardateDay: number;
  timeOfDay: TimeOfDay;
  onOpenSoothing: (apt: Appointment) => void;
  onCancelAppointment: (aptId: string, reason: string, isDislikeBeast?: boolean) => void;
  onConfirmAppointment: (aptId: string) => void;
  onCreateAppointment: (sentinelId: string, timeSlot: TimeOfDay, method: SoothingMethod, isEmergency: boolean) => void;
  onViewSentinel: (sentinelId: string) => void;
  onDeleteAppointment?: (aptId: string) => void;
}

export const ClinicModule: React.FC<ClinicModuleProps> = ({
  appointments,
  sentinels,
  guide,
  stardateDay,
  timeOfDay,
  onOpenSoothing,
  onCancelAppointment,
  onConfirmAppointment,
  onCreateAppointment,
  onViewSentinel,
  onDeleteAppointment
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'confirmed' | 'postponed' | 'completed' | 'emergency' | 'critical' | 'expired'>('all');
  const [slotFilter, setSlotFilter] = useState<'all' | '上午' | '下午'>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedSentinelForNew, setSelectedSentinelForNew] = useState(sentinels[0]?.id || '');
  const [newTimeSlot, setNewTimeSlot] = useState<TimeOfDay>(timeOfDay);
  const [newMethod, setNewMethod] = useState<SoothingMethod>('精神疏导');
  const [newIsEmergency, setNewIsEmergency] = useState(false);

  // Rejection/Cancellation reason modal state
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);

  // Check if current slot's 1-session quota has been exhausted
  const isCurrentSlotQuotaUsed = appointments.some(
    a => a.day === stardateDay && a.timeSlot === timeOfDay && a.status === 'completed'
  );

  // Expired appointments count
  const expiredAppointmentsCount = appointments.filter(a => a.status === 'expired').length;

  // Filter appointments: default views MUST filter out expired appointments!
  const filteredAppointments = appointments.filter(apt => {
    const sentinel = sentinels.find(s => s.id === apt.sentinelId);
    if (!sentinel) return false;

    if (slotFilter !== 'all' && apt.timeSlot !== slotFilter) return false;

    // When viewing expired tab, strictly show expired
    if (filterTab === 'expired') {
      return apt.status === 'expired';
    }

    // Default 'all', 'pending', 'confirmed' views MUST NEVER include expired appointments!
    if (apt.status === 'expired') return false;

    if (filterTab === 'pending') return apt.status === 'pending';
    if (filterTab === 'confirmed') return apt.status === 'confirmed';
    if (filterTab === 'postponed') return apt.status === 'postponed';
    if (filterTab === 'completed') return apt.status === 'completed';
    if (filterTab === 'emergency') return apt.isEmergency;
    if (filterTab === 'critical') return sentinel.riotRate >= 80;
    return apt.status !== 'cancelled';
  });

  const todayAppointments = appointments.filter(a => a.day === stardateDay && a.status !== 'cancelled' && a.status !== 'expired');
  const criticalSentinelsCount = sentinels.filter(s => s.riotRate >= 80).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSentinelForNew) return;
    onCreateAppointment(selectedSentinelForNew, newTimeSlot, newMethod, newIsEmergency);
    setIsNewModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 space-y-4">
      {/* Top Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">今日排班队列 (同一时段多位并发)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-cyan-300">
              {todayAppointments.length} <span className="text-xs font-normal">位报名</span>
            </span>
            <span className="text-[10px] text-slate-400">候诊排队中</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-red-500/30 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">前线极度暴动预警</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-red-400">
              {criticalSentinelsCount} <span className="text-xs font-normal">名</span>
            </span>
            <span className="text-[10px] text-red-400/80">暴动阈值 &gt; 80%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-purple-500/20 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">已缔结命定契约</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-purple-300">
              {sentinels.filter(s => s.contracted).length} / {guide.maxContracts}
            </span>
            <span className="text-[10px] text-purple-400/80">同生共死强绑定</span>
          </div>
        </div>

        {/* Updated card: REMOVED "S级绝对无失败" text */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">向导精神海状态</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-emerald-300">
              {guide.mentalPower}%
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              {guide.fatigueLevel} · 纯澈润泽
            </span>
          </div>
        </div>
      </div>

      {/* Quota Indicator Banner: Explicit Rule Enforcement */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
        isCurrentSlotQuotaUsed 
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
          : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
            isCurrentSlotQuotaUsed 
              ? 'bg-amber-900/60 border-amber-400/50 text-amber-300' 
              : 'bg-cyan-900/60 border-cyan-400/50 text-cyan-300'
          }`}>
            {isCurrentSlotQuotaUsed ? '1/1' : '0/1'}
          </div>
          <div>
            <div className="font-bold text-xs flex items-center gap-2 flex-wrap">
              <span>当前时段【星历第{stardateDay}日 {timeOfDay}】疏导名额调度：</span>
              {isCurrentSlotQuotaUsed ? (
                <span className="text-[10px] bg-amber-900/90 text-amber-200 px-2 py-0.5 rounded-full font-bold border border-amber-500/50">
                  本时段接诊名额已耗尽 (1/1)
                </span>
              ) : (
                <span className="text-[10px] bg-cyan-900/90 text-cyan-200 px-2 py-0.5 rounded-full font-bold border border-cyan-500/50">
                  接诊席位空闲 (0/1 可用)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300/80 mt-0.5 leading-relaxed">
              {isCurrentSlotQuotaUsed 
                ? '向导本时段仅限接诊1名哨兵（已完成）。同一时段其他排队哨兵已自动进入【顺延】状态。如需接诊下一位，可点击顶部【推进时序】。' 
                : '向导每个时段（上午/下午）拥有1个疏导名额。同一时段支持多位哨兵排队，请在下方选择1位接入安抚舱。若暂不接诊亦可直接推进时间。'}
            </p>
          </div>
        </div>

        {isCurrentSlotQuotaUsed && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-lg border border-amber-500/40 shrink-0">
            <FastForward className="w-3.5 h-3.5" />
            <span>推进时序后顺延接诊</span>
          </div>
        )}
      </div>

      {/* Action Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Status tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: '全部' },
              { id: 'pending', label: '待处理' },
              { id: 'confirmed', label: '已排期' },
              { id: 'postponed', label: '已顺延' },
              { id: 'completed', label: '已安抚' },
              { id: 'emergency', label: '紧急插队' },
              { id: 'critical', label: '暴动边缘' },
              { id: 'expired', label: `已过期 (${expiredAppointmentsCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                  filterTab === tab.id
                    ? tab.id === 'expired'
                      ? 'bg-red-950/80 text-red-300 border border-red-500/50 font-bold'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-semibold'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Slot Filter */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSlotFilter('all')}
              className={`px-2 py-1 rounded transition cursor-pointer text-[11px] ${
                slotFilter === 'all' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              全部时段
            </button>
            <button
              onClick={() => setSlotFilter('上午')}
              className={`px-2 py-1 rounded transition cursor-pointer text-[11px] ${
                slotFilter === '上午' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              仅上午
            </button>
            <button
              onClick={() => setSlotFilter('下午')}
              className={`px-2 py-1 rounded transition cursor-pointer text-[11px] ${
                slotFilter === '下午' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              仅下午
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-3.5 py-1.5 bg-cyan-600/80 hover:bg-cyan-500 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,243,255,0.25)] transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>登记特需预约</span>
        </button>
      </div>

      {/* Appointments List - Multiple per slot supported */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredAppointments.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
            <Calendar className="w-8 h-8 text-slate-600" />
            <span>当前筛选条件下暂无安抚预约</span>
          </div>
        ) : (
          filteredAppointments.map(apt => {
            const sentinel = sentinels.find(s => s.id === apt.sentinelId);
            if (!sentinel) return null;
            const isHighRiot = sentinel.riotRate >= 80;

            const isThisSlotApt = apt.day === stardateDay && apt.timeSlot === timeOfDay;
            const isSlotQuotaExhaustedForApt = isThisSlotApt && isCurrentSlotQuotaUsed && apt.status !== 'completed';
            const isExpired = apt.status === 'expired';

            return (
              <div
                key={apt.id}
                className={`p-4 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col lg:flex-row justify-between gap-4 ${
                  isExpired
                    ? 'border-slate-800 bg-slate-950/70 opacity-60 grayscale-[35%]'
                    : isHighRiot
                    ? 'border-red-500/50 bg-red-950/20 holo-danger-glow'
                    : apt.status === 'completed'
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : apt.status === 'postponed' || isSlotQuotaExhaustedForApt
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : apt.status === 'cancelled'
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-60'
                    : 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/30'
                }`}
              >
                {/* Expired Tag */}
                {isExpired && (
                  <div className="absolute top-0 right-0 bg-slate-800/90 text-slate-300 border-b border-l border-slate-700 text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-bl flex items-center gap-1 shadow-sm">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                    <span>【已过期 · 错过时效】</span>
                  </div>
                )}

                {/* Emergency Tag */}
                {!isExpired && apt.isEmergency && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-bl">
                    S级狂暴战备插队
                  </div>
                )}

                {/* Left Info Column */}
                <div className="flex gap-3.5">
                  <div
                    onClick={() => onViewSentinel(sentinel.id)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 cursor-pointer border transition-transform hover:scale-105 ${
                      sentinel.contracted
                        ? 'border-purple-400 bg-purple-950/80 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'border-cyan-400/40 bg-slate-800 text-cyan-300'
                    }`}
                    title="点击查看哨兵详细档案"
                  >
                    {sentinel.avatarText}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        onClick={() => onViewSentinel(sentinel.id)}
                        className="font-bold text-slate-100 hover:text-cyan-300 cursor-pointer text-sm"
                      >
                        {sentinel.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">[{sentinel.code}]</span>
                      <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700">
                        {sentinel.rank}
                      </span>
                      {sentinel.personality && (
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/40 font-medium">
                          性格: {sentinel.personality}
                        </span>
                      )}
                      <span className="text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded">
                        {sentinel.military}
                      </span>
                      {sentinel.isAcquainted === false && (
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-medium">
                          初次接诊 · 未结识
                        </span>
                      )}
                      {sentinel.contracted && (
                        <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/40 font-semibold">
                          同生共死契约绑定
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-4 flex-wrap">
                      <span>
                        兽型: <strong className="text-slate-100">{sentinel.spiritBeast.form}</strong> ({sentinel.spiritBeast.type})
                      </span>
                      <span className="flex items-center gap-1">
                        狂暴指数:
                        <strong className={`font-mono ${isHighRiot ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400'}`}>
                          {sentinel.riotRate}%
                        </strong>
                      </span>
                    </div>

                    {/* Objective Reason Description */}
                    <p className="text-xs text-slate-300/90 bg-black/30 px-2.5 py-1.5 rounded border border-slate-800/80 italic leading-relaxed">
                      "{apt.reason}"
                    </p>

                    {apt.cancelReason && (
                      <div className="text-[11px] text-red-300 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded">
                        <strong className="text-red-400">退订记录：</strong>{apt.cancelReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex lg:flex-col justify-end items-end gap-2 shrink-0 pt-2 lg:pt-0">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>第{apt.day}日 · <strong className="text-cyan-300 font-bold">{apt.timeSlot}时段</strong></span>
                  </div>

                  {/* Actions according to status and quota rule */}
                  {isExpired && (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className="text-xs text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 font-semibold flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                        <span>【已过期】错过时效未接诊</span>
                      </span>
                      {onDeleteAppointment && (
                        <button
                          onClick={() => onDeleteAppointment(apt.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-red-950/80 hover:text-red-300 border border-slate-700 text-slate-400 text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                          title="从档案中清除此条过期记录"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>删除记录</span>
                        </button>
                      )}
                    </div>
                  )}

                  {apt.status === 'completed' && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>疏导完成 · 狂暴平息</span>
                    </div>
                  )}

                  {apt.status === 'cancelled' && (
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>已撤销该预约</span>
                    </div>
                  )}

                  {!isExpired && (apt.status === 'postponed' || isSlotQuotaExhaustedForApt) && apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span className="text-[11px] bg-amber-950/70 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>本时段名额已满 · 自动顺延候诊</span>
                      </span>
                      <button
                        onClick={() => setCancelModalApt(apt)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-300 text-xs rounded transition cursor-pointer"
                      >
                        退单
                      </button>
                    </div>
                  )}

                  {!isExpired && apt.status === 'pending' && !isSlotQuotaExhaustedForApt && (
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <button
                        onClick={() => onOpenSoothing(apt)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>接入安抚舱</span>
                      </button>

                      <button
                        onClick={() => onConfirmAppointment(apt.id)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition cursor-pointer"
                      >
                        确认排期
                      </button>

                      <button
                        onClick={() => setCancelModalApt(apt)}
                        className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs rounded-lg transition cursor-pointer"
                      >
                        取消/退单
                      </button>
                    </div>
                  )}

                  {!isExpired && apt.status === 'confirmed' && !isSlotQuotaExhaustedForApt && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenSoothing(apt)}
                        className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>开始安抚互动</span>
                      </button>
                      <button
                        onClick={() => setCancelModalApt(apt)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition cursor-pointer"
                      >
                        改期/取消
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cancellation / Rejection Reasons Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-red-400 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>撤销哨兵疏导预约 · 理由备案</span>
              </h3>
              <button
                onClick={() => setCancelModalApt(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              向导享有神圣自主接诊权。请选择撤销或驳回此项预约的原因（将记录于星际向导医疗日志与对方光脑）：
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onCancelAppointment(cancelModalApt.id, '哨兵突发前线防御战备紧急调令，客观冲突取消。', false);
                  setCancelModalApt(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs transition cursor-pointer"
              >
                <div className="font-bold text-slate-200">1. 客观紧急军情任务冲突</div>
                <div className="text-[11px] text-slate-400 mt-0.5">哨兵因被调遣至第一前线临时取消，不影响个人好感。</div>
              </button>

              <button
                onClick={() => {
                  onCancelAppointment(cancelModalApt.id, '向导当前精神状态疲倦，依照向导保护法第12条暂行休整。', false);
                  setCancelModalApt(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs transition cursor-pointer"
              >
                <div className="font-bold text-slate-200">2. 向导身体疲劳，自主休整</div>
                <div className="text-[11px] text-slate-400 mt-0.5">合法休止诊疗，哨兵表示体谅与关切。</div>
              </button>

              <button
                onClick={() => {
                  onCancelAppointment(cancelModalApt.id, '因对该哨兵精神体兽态（如蛛形多足类）存在主观心理不适而退订。', true);
                  setCancelModalApt(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/40 text-xs transition cursor-pointer text-red-200"
              >
                <div className="font-bold flex items-center gap-1.5 text-red-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>3. 主观忌避：抗拒其精神体形态（如蜘蛛等节肢类）</span>
                </div>
                <div className="text-[11px] text-red-400/80 mt-0.5">
                  特殊理由：向导对特定精神体（如多足节肢或冷血爬行）感到生理性抗拒。哨兵好感度将受创并产生自卑心理。
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Appointment Registration Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-slate-900 border border-cyan-500/50 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>登记哨兵特需预约</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">选择哨兵档案</label>
                <select
                  value={selectedSentinelForNew}
                  onChange={(e) => setSelectedSentinelForNew(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {sentinels.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.race}, {s.rank}, 性格:{s.personality}, 狂暴度:{s.riotRate}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">预约时段</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value as TimeOfDay)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="上午">上午时段</option>
                    <option value="下午">下午时段</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">拟定安抚方式</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as SoothingMethod)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="精神疏导">精神疏导 (深层濯洗)</option>
                    <option value="物理安抚">物理安抚 (触抚兽化特征)</option>
                    <option value="信息素安抚">信息素安抚 (高阶向导素)</option>
                    <option value="契约共鸣">契约共鸣 (需已缔结)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="emergencyCheck"
                  checked={newIsEmergency}
                  onChange={(e) => setNewIsEmergency(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="emergencyCheck" className="text-slate-300 flex items-center gap-1 cursor-pointer">
                  <span>标记为紧急插队</span>
                  <span className="text-[10px] text-red-400 font-mono">(暴动指数临界优先候诊)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                确认登记入列
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
