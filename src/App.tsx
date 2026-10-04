import React, { useState, useEffect } from 'react';
import { 
  Guide, 
  Sentinel, 
  Appointment, 
  FriendRequest, 
  Moment, 
  TrendTopic, 
  NarrationLog, 
  GroupChat, 
  ChatMessage, 
  SoothingMethod, 
  SoothingReport, 
  TimeOfDay 
} from './types';
import { 
  INITIAL_GUIDE, 
  INITIAL_SENTINELS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_FRIEND_REQUESTS, 
  INITIAL_MOMENTS, 
  INITIAL_TRENDS, 
  INITIAL_NARRATIONS, 
  INITIAL_GROUP_CHATS 
} from './data/initialData';
import { HeaderHUD } from './components/HeaderHUD';
import { NavigationDock, NavTabId } from './components/NavigationDock';
import { NarratorSidebar } from './components/NarratorSidebar';
import { ClinicModule } from './components/ClinicModule';
import { SentinelDossiers } from './components/SentinelDossiers';
import { ChatModule } from './components/ChatModule';
import { MomentsModule } from './components/MomentsModule';
import { TrendsModule } from './components/TrendsModule';
import { RelationNetwork } from './components/RelationNetwork';
import { GuideProfileModal } from './components/GuideProfileModal';
import { GuideEditModal } from './components/GuideEditModal';
import { SettingsAndSaves } from './components/SettingsAndSaves';
import { SoothingModal } from './components/SoothingModal';
import { SoothingReportModal } from './components/SoothingReportModal';
import { generateSentinelReply } from './utils/dialogueEngine';
import { generateMomentInteractions, generatePeriodicSentinelMoment } from './utils/momentsEngine';

export default function App() {
  // Save Slot State
  const [saveSlot, setSaveSlot] = useState<string>('slot_default');
  const [saveSlotsList, setSaveSlotsList] = useState<{ id: string; name: string; lastUpdated: string }[]>([
    { id: 'slot_default', name: '安黎 · 首席向导一号档', lastUpdated: '刚刚' },
    { id: 'slot_alpha', name: '平行推演 · 探索备用档', lastUpdated: '昨日' }
  ]);

  // Current Navigation Tab (Default to clinic)
  const [currentTab, setCurrentTab] = useState<NavTabId>('clinic');

  // Right persistent narrator sidebar open state
  const [isNarratorOpen, setIsNarratorOpen] = useState<boolean>(true);

  // Guide Customization Modal state
  const [isGuideEditModalOpen, setIsGuideEditModalOpen] = useState<boolean>(false);

  // Core Game State
  const [guide, setGuide] = useState<Guide>(INITIAL_GUIDE);
  const [stardateYear, setStardateYear] = useState<number>(327);
  const [stardateDay, setStardateDay] = useState<number>(14);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('上午');
  const [dayCycleCount, setDayCycleCount] = useState<number>(1);

  const [sentinels, setSentinels] = useState<Sentinel[]>(INITIAL_SENTINELS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(INITIAL_FRIEND_REQUESTS);
  const [friends, setFriends] = useState<string[]>(['s_001', 's_002', 's_004', 's_006']);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({
    s_001: [],
    s_002: [],
    s_004: [],
    s_006: []
  });
  const [groupChats, setGroupChats] = useState<GroupChat[]>(INITIAL_GROUP_CHATS);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [trends, setTrends] = useState<TrendTopic[]>(INITIAL_TRENDS);
  const [narrations, setNarrations] = useState<NarrationLog[]>(INITIAL_NARRATIONS);

  // Modal Triggers
  const [activeSoothingApt, setActiveSoothingApt] = useState<Appointment | null>(null);
  const [soothingReport, setSoothingReport] = useState<SoothingReport | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto toast timer
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add auto-narrator log
  const addNarration = (
    category: '疏导' | '社交' | '契约' | '紧急' | '随笔' | '世界动态',
    text: string,
    relatedSentinelId?: string,
    relatedSentinelName?: string
  ) => {
    const newLog: NarrationLog = {
      id: `nar_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      stardate: `星历 ${stardateYear}.04.${stardateDay} ${timeOfDay}`,
      category,
      text,
      relatedSentinelId,
      relatedSentinelName
    };
    setNarrations(prev => [newLog, ...prev]);
  };

  // --- Load Slot from localStorage on mount & on saveSlot change ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`optic_brain_save_${saveSlot}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.guide) setGuide(data.guide);
        if (data.stardateYear) setStardateYear(data.stardateYear);
        if (data.stardateDay) setStardateDay(data.stardateDay);
        if (data.timeOfDay) setTimeOfDay(data.timeOfDay);
        if (data.dayCycleCount) setDayCycleCount(data.dayCycleCount);
        if (data.sentinels) setSentinels(data.sentinels);
        if (data.appointments) setAppointments(data.appointments);
        if (data.friendRequests) setFriendRequests(data.friendRequests);
        if (data.friends) setFriends(data.friends);
        if (data.chats) setChats(data.chats);
        if (data.groupChats) setGroupChats(data.groupChats);
        if (data.moments) setMoments(data.moments);
        if (data.trends) setTrends(data.trends);
        if (data.narrations) setNarrations(data.narrations);
      }
    } catch {
      console.warn('Load save error, using default memory state');
    }
  }, [saveSlot]);

  // --- Auto-persist current slot on state change ---
  useEffect(() => {
    const payload = {
      saveSlotId: saveSlot,
      saveName: saveSlotsList.find(s => s.id === saveSlot)?.name || '未命名档案',
      lastUpdated: new Date().toLocaleTimeString(),
      guide,
      stardateYear,
      stardateDay,
      timeOfDay,
      dayCycleCount,
      sentinels,
      appointments,
      friendRequests,
      friends,
      chats,
      groupChats,
      moments,
      trends,
      narrations
    };
    localStorage.setItem(`optic_brain_save_${saveSlot}`, JSON.stringify(payload));
  }, [guide, stardateYear, stardateDay, timeOfDay, dayCycleCount, sentinels, appointments, friendRequests, friends, chats, groupChats, moments, trends, narrations, saveSlot, saveSlotsList]);

  // --- Advance Time Mechanism (with Appointment Expiration & Penalty Engine) ---
  const handleAdvanceTime = () => {
    let nextTimeSlot: TimeOfDay = timeOfDay === '上午' ? '下午' : '上午';
    let nextDay = stardateDay;
    let nextCycle = dayCycleCount;

    if (nextTimeSlot === '上午') {
      nextDay += 1;
      nextCycle += 1;
    }

    // 1. Evaluate Appointment Expiration Rules (Strict Priority Check):
    // Rule 1: Appointment day is in the past (< nextDay) -> EXPIRED.
    // Rule 2: Appointment day is today, and slot has passed (e.g. appointment is 上午, new slot is 下午) -> EXPIRED.
    // Rule 3: Today's slot yet to arrive or future days -> RETAIN in pending/confirmed.
    const newlyExpiredApts: { apt: Appointment; sentinel?: Sentinel }[] = [];

    const updatedAppointments = appointments.map(a => {
      // Completed, cancelled, or already expired appointments are historical and don't re-expire
      if (a.status === 'completed' || a.status === 'cancelled' || a.status === 'expired') {
        return a;
      }

      const isPastDay = a.day < nextDay;
      const isPastSlotToday = a.day === nextDay && a.timeSlot === '上午' && nextTimeSlot === '下午';

      if (isPastDay || isPastSlotToday) {
        const s = sentinels.find(sent => sent.id === a.sentinelId);
        newlyExpiredApts.push({ apt: a, sentinel: s });
        return {
          ...a,
          status: 'expired' as const,
          reason: `【已过期】预约时段为第${a.day}日[${a.timeSlot}]。向导时序已推进至第${nextDay}日[${nextTimeSlot}]，错过时效已自动失效归档。`
        };
      }

      // If an appointment was postponed because quota was used in the previous slot,
      // and its scheduled time is the new slot, rollover to pending
      if (a.status === 'postponed' && a.day === nextDay && a.timeSlot === nextTimeSlot) {
        return {
          ...a,
          status: 'pending' as const,
          reason: '【顺延候诊】前序时段名额已满，现已顺延至当前时段候诊队列。'
        };
      }

      return a;
    });

    // 2. Sentinels riot progression & penalty for expired appointments
    const expiredSentinelIds = new Set(newlyExpiredApts.map(e => e.apt.sentinelId));

    const updatedSentinels = sentinels.map(s => {
      let riotInc = 0;
      let affinityDrop = 0;
      let trustDrop = 0;

      // Normal background cosmic radiation increase for non-contracted
      if (!s.contracted && s.riotRate < 100) {
        riotInc += Math.floor(Math.random() * 5) + 3;
      }

      // Expiration penalty: +8 riotRate, -4 affinity/trust
      if (expiredSentinelIds.has(s.id)) {
        riotInc += Math.floor(Math.random() * 4) + 6; // +6 ~ +9 points
        if (!s.contracted) {
          affinityDrop = 4;
          trustDrop = 4;
        }
      }

      if (riotInc > 0 || affinityDrop > 0) {
        return {
          ...s,
          riotRate: Math.min(100, s.riotRate + riotInc),
          affinity: Math.max(0, s.affinity - affinityDrop),
          trust: Math.max(0, s.trust - trustDrop)
        };
      }

      return s;
    });

    // 3. Write Narration Log for each expired appointment
    newlyExpiredApts.forEach(({ apt, sentinel }) => {
      if (sentinel) {
        addNarration(
          '疏导',
          `【预约过期】星历 ${stardateYear}.04.${nextDay} [${nextTimeSlot}]，你错过了【${sentinel.name}】在第${apt.day}日[${apt.timeSlot}]的安抚预约。对方未能得到向导素调理，狂暴值加剧上升，好感与信任微幅受挫。`,
          sentinel.id,
          sentinel.name
        );
      }
    });

    // 4. Generate complaint Moments from one of the expired sentinels if any
    let generatedComplaintMoment: Moment | null = null;
    if (newlyExpiredApts.length > 0) {
      const primary = newlyExpiredApts[0];
      if (primary.sentinel) {
        const s = primary.sentinel;
        generatedComplaintMoment = {
          id: `m_exp_${Date.now()}`,
          authorId: s.id,
          author: s.name,
          avatarText: s.avatarText || s.name[0],
          time: '刚刚',
          content: s.personality === '开朗'
            ? `呜呜呜……今天安抚预约错过了，没能见到向导大人……头痛越来越厉害了，明天一定要更早去排队！[垂头丧气的金毛犬.jpg]`
            : s.personality === '阴湿'
            ? `……在诊室门外守候了一整个时段，终究还是没能被叫到号呢。果然，像我这样肮脏的存在，被遗忘也是理所当然的吧。`
            : s.personality === '傲娇'
            ? `哼！居然让本少爷白白等了一个时段！向导就了不起吗？！……该死，精神海又在绞痛了……绝对不是因为想念某人的信息素！`
            : s.personality === '暴躁'
            ? `操！狂暴杂音快把耳膜撕裂了！错过就错过，老子去前线杀变异种发泄去！[捏爆的军用营养剂罐.jpg]`
            : s.personality === '忠犬'
            ? `虽然今日未能获得安黎向导的梳理，但雷霆定会以意志克制狂暴。只要向导安好，属下别无所求。`
            : `……时段已过，预约失效。暴动值攀升至${Math.min(100, s.riotRate + 8)}%。必须进行封闭静默自控。`,
          visibility: 'friends_only',
          likes: 0,
          likedByGuide: false,
          comments: []
        };
      }
    }

    // 5. Guide mental recovery
    setGuide(prev => ({
      ...prev,
      mentalPower: Math.min(prev.maxMentalPower, prev.mentalPower + 18),
      isFatigued: false,
      fatigueLevel: '饱满'
    }));

    // 6. Generate fresh Sentinel social Moments in the feed!
    const periodicMoment = generatePeriodicSentinelMoment(nextDay, nextTimeSlot, updatedSentinels);
    const momentsToAdd: Moment[] = [];
    if (generatedComplaintMoment) momentsToAdd.push(generatedComplaintMoment);
    if (periodicMoment) momentsToAdd.push(periodicMoment);

    if (momentsToAdd.length > 0) {
      setMoments(prev => [...momentsToAdd, ...prev]);
    }

    setAppointments(updatedAppointments);
    setSentinels(updatedSentinels);
    setTimeOfDay(nextTimeSlot);
    setStardateDay(nextDay);
    setDayCycleCount(nextCycle);

    addNarration(
      '世界动态', 
      `【时序跃迁】星网时序切换至星历 ${stardateYear}.04.${nextDay}【${nextTimeSlot}时段】。${
        newlyExpiredApts.length > 0 ? `检测到有 ${newlyExpiredApts.length} 项历史预约错过时效已自动过期归档。` : ''
      }`
    );
    triggerToast(
      newlyExpiredApts.length > 0
        ? `时序已推进！有 ${newlyExpiredApts.length} 项预约过期归档`
        : `时序已推进至星历 ${stardateYear}.04.${nextDay} [${nextTimeSlot}]`
    );
  };

  // --- Delete Expired / Archive Appointment ---
  const handleDeleteAppointment = (aptId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== aptId));
    triggerToast('已清除该项预约记录');
  };

  // --- Meditation Rest ---
  const handleRest = () => {
    setGuide(prev => ({
      ...prev,
      mentalPower: prev.maxMentalPower,
      isFatigued: false,
      fatigueLevel: '饱满'
    }));
    addNarration('随笔', `你在向导温室中闭目冥想。草木清香洗涤了连日接诊的疲惫，S级精神海再次满溢充盈。`);
    triggerToast('精神力已全额充盈！');
    setIsProfileModalOpen(false);
  };

  // --- Soothing Execution Engine (with Galgame VN choices & consequences & 1-quota limit) ---
  const handleExecuteSoothing = (
    method: SoothingMethod, 
    actionChosen: string, 
    sentinelReactionText: string, 
    shouldSendFriendRequest: boolean,
    endingChoiceId?: 'leave' | 'rest' | 'dine',
    endingNarratorSummary?: string,
    fullDialogueHistory?: { speaker: string; text: string }[]
  ) => {
    if (!activeSoothingApt) return;
    const targetSentinel = sentinels.find(s => s.id === activeSoothingApt.sentinelId);
    if (!targetSentinel) return;

    let riotReduction = 35;
    let mentalCost = 25;
    let affinityGain = 12;
    let trustGain = 10;
    let possessiveGain = 8;
    let reportDesc = '';

    // Guide Rank Modifier: S-Rank has higher mastery and less fatigue
    const isSRank = guide.rank.includes('S');
    if (isSRank) {
      riotReduction += 6;
      mentalCost = Math.max(8, mentalCost - 4);
    }

    if (method === '精神疏导') {
      riotReduction = 42;
      mentalCost = 28;
      affinityGain = 14;
      trustGain = 16;
      possessiveGain = 6;
      reportDesc = `你执行了【${actionChosen}】。S级精神触手探入${targetSentinel.name}那片狂暴割裂的精神海。潜意识深渊的畸变残渣被如泉水般的向导力彻底濯洗，精神体【${targetSentinel.spiritBeast.name}】发出眷恋低吟，伏于足边。`;
    } else if (method === '物理安抚') {
      riotReduction = 26;
      mentalCost = 15;
      affinityGain = 18;
      trustGain = 10;
      possessiveGain = 20; // Physical contact spikes possessiveness!
      reportDesc = `你执行了【${actionChosen}】。隔着微敞的作战制服，你轻柔抚摸过${targetSentinel.name}滚烫的兽耳与半兽化特征。狂暴的体温与剧烈的信息素交织战栗，他紧绷的肌肉逐渐融化在你的指尖下。`;
    } else if (method === '信息素安抚') {
      riotReduction = 38;
      mentalCost = 24;
      affinityGain = 16;
      trustGain = 14;
      possessiveGain = 15;
      reportDesc = `你执行了【${actionChosen}】。高纯度草木向导素通过神经端口直接注入。尖锐的战栗与极致沉溺的安抚快感让${targetSentinel.name}瞳孔紧缩，喉间溢出沉重而难以自抑的喘息。`;
    } else if (method === '契约共鸣') {
      riotReduction = 60;
      mentalCost = 12;
      reportDesc = `你执行了【${actionChosen}】。同生共死灵魂印记爆发璀璨共振。你与${targetSentinel.name}的脉搏与呼吸完全同调，两片精神图景浑然交融，狂暴与兽化在灵魂法则下刹那消弭。`;
    }

    // Impact of Stage 3 Ending Choice:
    if (endingChoiceId === 'rest') {
      affinityGain += 15;
      trustGain += 12;
      possessiveGain += 5;
    } else if (endingChoiceId === 'dine') {
      affinityGain += 25;
      trustGain += 20;
      possessiveGain += 10;
    } else if (endingChoiceId === 'leave') {
      affinityGain += 5;
      trustGain += 5;
    }

    const wasUnacquainted = targetSentinel.isAcquainted === false;

    // Update Sentinel stats
    const updatedSentinels = sentinels.map(s => {
      if (s.id === targetSentinel.id) {
        return {
          ...s,
          isAcquainted: true, // UNLOCKED: Now acquainted after soothing!
          riotRate: Math.max(0, s.riotRate - riotReduction),
          affinity: s.contracted ? s.affinity : Math.min(100, s.affinity + affinityGain),
          trust: s.contracted ? s.trust : Math.min(100, s.trust + trustGain),
          possessiveness: s.contracted ? s.possessiveness : Math.min(100, s.possessiveness + possessiveGain),
          spiritBeast: {
            ...s.spiritBeast,
            mood: '舒缓温驯',
            status: '稳定' as const
          }
        };
      }
      return s;
    });

    // Update Guide stats
    const newMentalPower = Math.max(5, guide.mentalPower - mentalCost);
    const updatedGuide: Guide = {
      ...guide,
      mentalPower: newMentalPower,
      isFatigued: newMentalPower < 35,
      fatigueLevel: newMentalPower < 35 ? '轻度疲劳' : '饱满',
      reputation: guide.reputation + 2,
      completedSessions: guide.completedSessions + 1
    };

    // Update Appointments with 1-quota rule:
    const currentAptId = activeSoothingApt.id;
    const sameSlotOthers = appointments.filter(
      a => a.id !== currentAptId &&
           a.day === activeSoothingApt.day &&
           a.timeSlot === activeSoothingApt.timeSlot &&
           (a.status === 'pending' || a.status === 'confirmed')
    );

    const postponedNames = sameSlotOthers.map(a => {
      const s = sentinels.find(sent => sent.id === a.sentinelId);
      return s?.name || '排队哨兵';
    });

    setAppointments(prev => prev.map(a => {
      if (a.id === currentAptId) {
        return { ...a, status: 'completed' as const };
      }
      if (
        a.day === activeSoothingApt.day &&
        a.timeSlot === activeSoothingApt.timeSlot &&
        (a.status === 'pending' || a.status === 'confirmed')
      ) {
        return {
          ...a,
          status: 'postponed' as const,
          reason: `因向导今日[${activeSoothingApt.timeSlot}]接诊名额已达上限（1/1 已由【${targetSentinel.name}】使用），顺延至下一时段候诊。`
        };
      }
      return a;
    }));

    setSentinels(updatedSentinels);
    setGuide(updatedGuide);

    // If sentinel was unacquainted or triggered friend request
    if ((wasUnacquainted || shouldSendFriendRequest) && !friends.includes(targetSentinel.id) && !friendRequests.some(r => r.sentinelId === targetSentinel.id)) {
      const newReq: FriendRequest = {
        id: `fr_${Date.now()}`,
        sentinelId: targetSentinel.id,
        verifyMsg: targetSentinel.personality === '开朗'
          ? `向导大人！刚才初次安抚太舒服啦！请务必加个好友，以后我随叫随到，好吃的都给您送来！`
          : targetSentinel.personality === '阴湿'
          ? `……刚才疏导时的触碰……好想一直记住。能让我留在您的通讯列表里吗？绝不打扰您……`
          : targetSentinel.personality === '暴躁'
          ? `疏导效果还算合格。加个好友，以后发疯了直接找你，免得被其他野兽插队。`
          : targetSentinel.personality === '傲娇'
          ? `喂，初次疏导表现不错。本少爷特许你把光脑通讯码存下，不准给别人！`
          : targetSentinel.personality === '忠犬'
          ? `安黎向导，感谢初次圣洁救赎，近卫哨兵申请建立终生神经通讯链路。`
          : `安黎向导，初次疏导感受极好，申请建立日常神经联络信道。`,
        time: `星历 ${stardateYear}.04.${stardateDay} 刚刚`,
        status: 'pending'
      };
      setFriendRequests(prev => [newReq, ...prev]);
      addNarration('社交', `【社交解锁】完成初次疏导！哨兵【${targetSentinel.name}】（${targetSentinel.personality}）状态变更为【已认识】，通过光脑向您发送了好友申请！`, targetSentinel.id, targetSentinel.name);
    }

    // Generate Dynamic Social Moments Based on Stage 3 Ending Choice
    if (endingChoiceId === 'rest') {
      const restMoment: Moment = {
        id: `m_rest_${Date.now()}`,
        authorId: targetSentinel.id,
        author: targetSentinel.name,
        avatarText: targetSentinel.avatarText || targetSentinel.name[0],
        time: '刚刚',
        content: targetSentinel.personality === '开朗'
          ? `安抚结束后向导大人准许我在公馆侧榻休息了一觉！满屋子都是甜甜的向导素……感觉整只大金毛都被彻底治愈了！[公馆软榻与向导素香薰.jpg]`
          : targetSentinel.personality === '阴湿'
          ? `……在她的寝厅侧卧睡了四十分钟。原本以为会被嫌恶地推开……醒来时身上多了一条薄毯。神明啊，请别让我从这片温柔中醒来。`
          : targetSentinel.personality === '傲娇'
          ? `咳……只是因为精神海刚恢复有点困，勉为其难在某人的公馆躺了一会儿，别瞎想！[公馆休息舱全景.jpg]`
          : targetSentinel.personality === '暴躁'
          ? `打完仗能在向导身边安稳闭眼睡一觉……狂暴杂音全没了。谁敢打扰这间公馆，老子咬碎他的喉咙。`
          : `在安黎向导的诊所侧榻修整片刻。空气澄澈，精神海已完全恢复平静。向导大人恩泽深重。`,
        visibility: 'friends_only',
        likes: 1,
        likedByGuide: true,
        comments: [
          {
            id: `c_${Date.now()}_1`,
            author: guide.name,
            isGuide: true,
            text: '睡醒了就好好休息，下次狂暴提前来找我。',
            time: '刚刚'
          }
        ]
      };
      setMoments(prev => [restMoment, ...prev]);
    } else if (endingChoiceId === 'dine') {
      const otherSentinel = sentinels.find(s => s.id !== targetSentinel.id && s.isAcquainted);
      const dineMoment: Moment = {
        id: `m_dine_${Date.now()}`,
        authorId: targetSentinel.id,
        author: targetSentinel.name,
        avatarText: targetSentinel.avatarText || targetSentinel.name[0],
        time: '刚刚',
        content: `疏导结束后有幸同安黎向导在公馆食堂共进便饭。她喜欢的星际浆果我已经全部记下了。[双人餐桌与星际甜果.jpg]`,
        visibility: 'public',
        likes: 2,
        likedByGuide: true,
        comments: [
          {
            id: `c_${Date.now()}_1`,
            author: guide.name,
            isGuide: true,
            text: '食堂的星际浆果味道确实不错。',
            time: '刚刚'
          },
          ...(otherSentinel ? [{
            id: `c_${Date.now()}_2`,
            author: otherSentinel.name,
            authorId: otherSentinel.id,
            isGuide: false,
            text: otherSentinel.personality === '傲娇'
              ? `喂！凭什么你这家伙能和向导一起吃饭？！本少爷都没去过！`
              : otherSentinel.personality === '阴湿'
              ? `……呵呵，某人尾巴翘得未免太高了呢。不过是吃个便饭而已。`
              : otherSentinel.personality === '暴躁'
              ? `……老子不服！下一次前线模拟对抗，老子绝对要咬碎你的机甲！`
              : `……看来下一次疏导，我也该向安黎向导提出用餐申请了。`,
            time: '刚刚'
          }] : [])
        ]
      };
      setMoments(prev => [dineMoment, ...prev]);
    }

    // Generate Report
    const report: SoothingReport = {
      id: `rep_${Date.now()}`,
      sentinelId: targetSentinel.id,
      sentinelName: targetSentinel.name,
      method,
      riotBefore: targetSentinel.riotRate,
      riotAfter: Math.max(0, targetSentinel.riotRate - riotReduction),
      mentalConsumed: mentalCost,
      stardate: `星历 ${stardateYear}.04.${stardateDay} ${timeOfDay}`,
      details: `${reportDesc}\n\n哨兵现场回馈：“${sentinelReactionText}”\n\n【诊毕安排决策】${
        endingChoiceId === 'rest' 
          ? '向导体贴让其在公馆侧榻休息片刻，好感度大幅飙升。' 
          : endingChoiceId === 'dine' 
          ? '向导邀请其一同共进便饭，要塞军团萌发雄竞关注。' 
          : '恪守公事公办准则，哨兵敬礼辞行。'
      }`,
      affinityDelta: targetSentinel.contracted ? undefined : affinityGain,
      trustDelta: targetSentinel.contracted ? undefined : trustGain,
      possessivenessDelta: targetSentinel.contracted ? undefined : possessiveGain,
      isContractResonance: method === '契约共鸣',
      dialogueHistory: fullDialogueHistory && fullDialogueHistory.length > 0 
        ? fullDialogueHistory 
        : [
            { speaker: `${guide.name} (向导)`, text: `执行${method}：${actionChosen}` },
            { speaker: targetSentinel.name, text: sentinelReactionText }
          ]
    };

    setSoothingReport(report);
    setActiveSoothingApt(null);

    // Narration for log
    if (endingNarratorSummary) {
      addNarration('疏导', endingNarratorSummary, targetSentinel.id, targetSentinel.name);
    } else {
      addNarration(
        '疏导', 
        `【疏导完成】为【${targetSentinel.name}】执行了${method}。狂暴值自 ${report.riotBefore}% 降至 ${report.riotAfter}%。消耗精神力 ${mentalCost}%。${postponedNames.length > 0 ? `同一时段排队的【${postponedNames.join('、')}】已自动顺延至下一时段。` : ''}`, 
        targetSentinel.id, 
        targetSentinel.name
      );
    }
    triggerToast(`【${targetSentinel.name}】疏导已完成，狂暴指数大幅下降！`);
  };

  // --- Cancellation Engine ---
  const handleCancelAppointment = (aptId: string, reason: string, isDislikeBeast: boolean = false) => {
    const apt = appointments.find(a => a.id === aptId);
    if (!apt) return;
    const targetSentinel = sentinels.find(s => s.id === apt.sentinelId);

    setAppointments(prev => prev.map(a => {
      if (a.id === aptId) {
        return {
          ...a,
          status: 'cancelled' as const,
          cancelReason: reason
        };
      }
      return a;
    }));

    if (isDislikeBeast && targetSentinel) {
      // Dislike beast penalty
      setSentinels(prev => prev.map(s => {
        if (s.id === targetSentinel.id && !s.contracted) {
          return {
            ...s,
            affinity: Math.max(0, s.affinity - 15),
            trust: Math.max(0, s.trust - 12),
            spiritBeast: {
              ...s.spiritBeast,
              mood: '瑟缩抑郁'
            }
          };
        }
        return s;
      }));

      addNarration(
        '疏导', 
        `【退单反馈】你退订了【${targetSentinel.name}】的预约。因忌避其精神体兽态，${targetSentinel.name}深受打击，好感度 -15，信任度 -12。其精神体陷入瑟缩与自卑。`, 
        targetSentinel.id, 
        targetSentinel.name
      );
      triggerToast(`已退订【${targetSentinel.name}】的预约（兽型忌避）`);
    } else {
      addNarration(
        '疏导', 
        `【预约撤销】因客观原因撤销了【${targetSentinel?.name || '哨兵'}】的预约：“${reason}”。`, 
        targetSentinel?.id, 
        targetSentinel?.name
      );
      triggerToast('预约已成功撤销');
    }
  };

  // --- Confirm Appointment ---
  const handleConfirmAppointment = (aptId: string) => {
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'confirmed' as const } : a));
    triggerToast('已确认排期！');
  };

  // --- Create Manual Appointment ---
  const handleCreateAppointment = (sentinelId: string, timeSlot: TimeOfDay, method: SoothingMethod, isEmergency: boolean) => {
    const sentinel = sentinels.find(s => s.id === sentinelId);
    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      sentinelId,
      day: stardateDay,
      timeSlot,
      status: 'pending',
      isEmergency,
      method,
      reason: isEmergency 
        ? '【特级狂暴插队】神经传感器告警，前线紧急调令接入向导公馆！' 
        : '哨兵提交特约申请，期待高阶向导素深层调理。'
    };

    setAppointments(prev => [newApt, ...prev]);
    addNarration('疏导', `新登记了【${sentinel?.name}】在第${stardateDay}日[${timeSlot}]的疏导预约。`, sentinelId, sentinel?.name);
    triggerToast(`已登记【${sentinel?.name}】的预约`);
  };

  // --- Guide Customization Handler ---
  const handleUpdateGuide = (updatedGuide: Guide) => {
    setGuide(updatedGuide);
    addNarration(
      '世界动态', 
      `【向导神格定制】你重新配置了向导档案：性格标签为【${updatedGuide.guidePersonality || '温柔'}】，评级【${updatedGuide.rank}】，精神体【${updatedGuide.spiritBeast?.name || '小雪团'}】（${updatedGuide.spiritBeast?.form || '光翼琉璃蝶'}）。后续安抚互动将全面适配你的向导风格！`
    );
    triggerToast('向导档案已成功更新保存！');
  };

  // --- Import / Create New Sentinel (Supports Single or Batch Array) ---
  const handleCreateOrImportSentinel = (newSentinelOrList: Sentinel | Sentinel[]) => {
    const list = Array.isArray(newSentinelOrList) ? newSentinelOrList : [newSentinelOrList];
    if (list.length === 0) return;

    // Explicitly guarantee isAcquainted is false! Cannot enter private chat directly!
    const unacquaintedList: Sentinel[] = list.map(s => ({
      ...s,
      isAcquainted: false
    }));

    setSentinels(prev => [...unacquaintedList, ...prev]);

    // Automatically add pending appointments for each in today's slot
    const newApts: Appointment[] = unacquaintedList.map((s, idx) => ({
      id: `apt_${Date.now()}_${idx}`,
      sentinelId: s.id,
      day: stardateDay,
      timeSlot: timeOfDay,
      status: 'pending',
      isEmergency: s.riotRate >= 85,
      method: '精神疏导',
      reason: `【新档案排期】哨兵【${s.name}】（${s.race}，${s.personality}，状态: 未认识）排入候诊队列。`
    }));
    setAppointments(prev => [...newApts, ...prev]);

    if (unacquaintedList.length === 1) {
      const single = unacquaintedList[0];
      addNarration(
        '世界动态', 
        `【档案录入】帝国光脑中枢成功接入新哨兵【${single.name}】（编号: ${single.code}，${single.race}，性格: ${single.personality}）的全套档案。当前为【未认识】状态，只能在预约后台排队，完成初次疏导后方可解锁私信通讯。`, 
        single.id, 
        single.name
      );
      triggerToast(`新哨兵【${single.name}】已建档并进入预约排班（未认识状态）！`);
    } else {
      const names = unacquaintedList.map(s => s.name).join('、');
      addNarration(
        '世界动态', 
        `【批量档案录入】帝国光脑成功批量接入 ${unacquaintedList.length} 位哨兵（${names}）的档案。当前全员为【未认识】状态，已排入预约后台候诊队列。完成初次疏导后方可解锁私信通讯。`
      );
      triggerToast(`成功批量导入 ${unacquaintedList.length} 位哨兵档案并排入候诊队列！`);
    }
  };

  // --- Bond Life Contract ---
  const handleContractSentinel = (sentinelId: string) => {
    const target = sentinels.find(s => s.id === sentinelId);
    if (!target) return;

    const contractedCount = sentinels.filter(s => s.contracted).length;
    if (contractedCount >= guide.maxContracts) {
      alert(`契约名额已满（上限 ${guide.maxContracts} 位）！`);
      return;
    }

    if (target.affinity < 80 || target.trust < 70) {
      alert(`缔结条件未满足！\n好感度需 ≥ 80 (当前 ${target.affinity})\n信任度需 ≥ 70 (当前 ${target.trust})`);
      return;
    }

    setSentinels(prev => prev.map(s => {
      if (s.id === sentinelId) {
        return {
          ...s,
          contracted: true,
          contractPledge: `以兽血与生命为誓，终生守望向导${guide.name}。同生共死，永不背弃。`,
          contractMark: '左胸心室处凝成金紫向导图腾',
          spiritBeast: {
            ...s.spiritBeast,
            mood: '安适共鸣',
            status: '稳定' as const
          }
        };
      }
      return s;
    }));

    addNarration('契约', `【命定同生共死誓约】在精神海的圣殿中，你与【${target.name}】完成了灵魂链接。两具生命自此同频绑定，同生同殒。他胸口的契约印记闪烁着夺目的辉光。`, target.id, target.name);
    triggerToast(`与【${target.name}】成功缔结同生共死契约！`);
  };

  // --- Smart Chat Message Send (Intent Parser & Personality-Driven Dialogue Engine) ---
  const handleSendMessage = (receiverId: string, text: string) => {
    const targetSentinel = sentinels.find(s => s.id === receiverId);
    if (!targetSentinel) return;

    const userMsg: ChatMessage = {
      id: `cm_${Date.now()}`,
      sender: 'guide',
      text,
      time: '刚刚'
    };

    const currentChat = chats[receiverId] || [];
    setChats(prev => ({
      ...prev,
      [receiverId]: [...currentChat, userMsg]
    }));

    // Generate intelligent dynamic contextual response using dialogueEngine
    setTimeout(async () => {
      const response = await generateSentinelReply(targetSentinel, text, currentChat, guide, timeOfDay);

      // Multi-message burst (simulating realistic human typing delays: 600ms, 1300ms, 2000ms)
      response.messages.forEach((msgText, idx) => {
        setTimeout(() => {
          const botMsg: ChatMessage = {
            id: `bm_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            sender: 'sentinel',
            senderName: targetSentinel.name,
            text: msgText,
            time: '刚刚'
          };

          setChats(prev => ({
            ...prev,
            [receiverId]: [...(prev[receiverId] || []), botMsg]
          }));
        }, (idx + 1) * 650);
      });
    }, 450);
  };

  // Group message send
  const handleSendGroupMessage = (groupId: string, text: string) => {
    const userMsg: ChatMessage = {
      id: `gcm_${Date.now()}`,
      sender: 'guide',
      senderName: `${guide.name} (向导)`,
      text,
      time: '刚刚'
    };

    setGroupChats(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          messages: [...g.messages, userMsg]
        };
      }
      return g;
    }));
  };

  // Friend Request Accept
  const handleAcceptFriendRequest = (req: FriendRequest) => {
    setFriends(prev => [...prev, req.sentinelId]);
    setFriendRequests(prev => prev.filter(r => r.id !== req.id));
    setChats(prev => ({ ...prev, [req.sentinelId]: [] })); // starts clean & empty
    const sentinel = sentinels.find(s => s.id === req.sentinelId);
    addNarration('社交', `你同意了【${sentinel?.name || '哨兵'}】的好友申请。通讯加密信道已建立。`, sentinel?.id, sentinel?.name);
    triggerToast(`已添加【${sentinel?.name}】为通讯好友`);
  };

  // Friend Request Reject
  const handleRejectFriendRequest = (reqId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== reqId));
    triggerToast('已忽略好友申请');
  };

  // Moments Actions with Cross-Character Banter Simulation
  const handleLikeMoment = (momentId: string) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        const nextLiked = !m.likedByGuide;
        return {
          ...m,
          likedByGuide: nextLiked,
          likes: nextLiked ? m.likes + 1 : m.likes - 1
        };
      }
      return m;
    }));
  };

  const handleAddComment = (momentId: string, commentText: string, replyToAuthor?: string) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      author: `${guide.name}向导`,
      isGuide: true,
      replyTo: replyToAuthor,
      text: commentText,
      time: '刚刚'
    };

    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        return {
          ...m,
          comments: [...m.comments, newComment]
        };
      }
      return m;
    }));

    addNarration('社交', `你在朋友圈发表了评论${replyToAuthor ? `回复 @${replyToAuthor}` : ''}：“${commentText}”`);
  };

  const handleCreateMoment = (content: string, visibility: 'public' | 'contracted_only' | 'friends_only') => {
    const newMomentId = `m_${Date.now()}`;
    const newMoment: Moment = {
      id: newMomentId,
      authorId: 'guide',
      author: `${guide.name} (S级向导)`,
      avatarText: guide.name[0],
      time: '刚刚',
      content,
      visibility,
      likes: 1,
      likedByGuide: true,
      comments: []
    };

    setMoments(prev => [newMoment, ...prev]);
    addNarration('社交', `你发表了新动态：“${content.slice(0, 30)}……”`);
    triggerToast('动态已发布！正在接收哨兵群体的回响与互动……');

    // Simulate multi-character reactions and cross-character banter using momentsEngine!
    setTimeout(() => {
      const interaction = generateMomentInteractions(content, guide, sentinels);

      setMoments(prev => prev.map(m => {
        if (m.id === newMomentId) {
          return {
            ...m,
            likes: m.likes + interaction.likesGain,
            comments: interaction.comments
          };
        }
        return m;
      }));

      addNarration('社交', `雷恩、塞拉斯、洛文与修尔等哨兵在你的动态评论区爆发了修罗场言语交锋！`);
    }, 1000);
  };

  // Trends Actions
  const handlePublishTrendPost = (title: string, content: string, isAnonymous: boolean) => {
    const newTrend: TrendTopic = {
      id: `t_${Date.now()}`,
      tag: '新',
      title,
      heat: '85万',
      summary: content,
      postsCount: 120
    };

    setTrends(prev => [newTrend, ...prev]);
    setGuide(prev => ({ ...prev, reputation: prev.reputation + 4 }));
    addNarration('社交', `你以【${isAnonymous ? '匿名向导ID' : guide.name}】在星网全域发帖《${title}》，引发全网热议。声望 +4。`);
    triggerToast('全域发帖成功，向导声望提升！');
  };

  // Save Slots Management
  const handleSwitchSlot = (slotId: string) => {
    setSaveSlot(slotId);
    triggerToast(`已切换至档案槽：${slotId}`);
  };

  const handleCreateSlot = (slotName: string) => {
    const newId = `slot_${Date.now()}`;
    const newSlot = { id: newId, name: slotName, lastUpdated: '刚刚' };
    setSaveSlotsList(prev => [...prev, newSlot]);
    setSaveSlot(newId);
    triggerToast(`已创建并载入新档案：${slotName}`);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSaveSlotsList(prev => prev.filter(s => s.id !== slotId));
    localStorage.removeItem(`optic_brain_save_${slotId}`);
    if (saveSlot === slotId) {
      setSaveSlot('slot_default');
    }
    triggerToast('已删除指定档案');
  };

  const handleExportJson = () => {
    const payload = {
      guide,
      stardateYear,
      stardateDay,
      timeOfDay,
      dayCycleCount,
      sentinels,
      appointments,
      friendRequests,
      friends,
      chats,
      groupChats,
      moments,
      trends,
      narrations
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optic_brain_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('光脑完整档案已成功导出为 JSON 文件！');
  };

  const handleImportJson = (data: any) => {
    if (data.guide) setGuide(data.guide);
    if (data.stardateYear) setStardateYear(data.stardateYear);
    if (data.stardateDay) setStardateDay(data.stardateDay);
    if (data.timeOfDay) setTimeOfDay(data.timeOfDay);
    if (data.dayCycleCount) setDayCycleCount(data.dayCycleCount);
    if (data.sentinels) setSentinels(data.sentinels);
    if (data.appointments) setAppointments(data.appointments);
    if (data.friendRequests) setFriendRequests(data.friendRequests);
    if (data.friends) setFriends(data.friends);
    if (data.chats) setChats(data.chats);
    if (data.groupChats) setGroupChats(data.groupChats);
    if (data.moments) setMoments(data.moments);
    if (data.trends) setTrends(data.trends);
    if (data.narrations) setNarrations(data.narrations);
    triggerToast('档案已成功导入并还原！');
  };

  const handleResetFactory = () => {
    if (window.confirm('确认重置当前光脑档案回默认初始状态吗？此操作无法撤销。')) {
      localStorage.removeItem(`optic_brain_save_${saveSlot}`);
      setGuide(INITIAL_GUIDE);
      setStardateYear(327);
      setStardateDay(14);
      setTimeOfDay('上午');
      setDayCycleCount(1);
      setSentinels(INITIAL_SENTINELS);
      setAppointments(INITIAL_APPOINTMENTS);
      setFriendRequests(INITIAL_FRIEND_REQUESTS);
      setFriends(['s_001', 's_002', 's_004', 's_006']);
      setChats({ s_001: [], s_002: [], s_004: [], s_006: [] });
      setMoments(INITIAL_MOMENTS);
      setTrends(INITIAL_TRENDS);
      setNarrations(INITIAL_NARRATIONS);
      setGroupChats(INITIAL_GROUP_CHATS);
      triggerToast('已重置为初始预设！');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* Sci-Fi Scanline overlay */}
      <div className="scanline fixed inset-0 z-40 pointer-events-none" />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-cyan-950/90 border border-cyan-400 text-cyan-200 px-4 py-2 rounded-xl text-xs shadow-2xl flex items-center gap-2 holo-glow animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Holographic HUD */}
      <HeaderHUD
        guide={guide}
        stardateYear={stardateYear}
        stardateDay={stardateDay}
        timeOfDay={timeOfDay}
        contractCount={sentinels.filter(s => s.contracted).length}
        sentinels={sentinels}
        onAdvanceTime={handleAdvanceTime}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRest={handleRest}
      />

      {/* Main Viewport Content + Persistent Right Narrator Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Main View Content */}
        <main className="flex-1 flex overflow-hidden relative">
          {currentTab === 'clinic' && (
            <ClinicModule
              appointments={appointments}
              sentinels={sentinels}
              guide={guide}
              stardateDay={stardateDay}
              timeOfDay={timeOfDay}
              onOpenSoothing={(apt) => setActiveSoothingApt(apt)}
              onCancelAppointment={handleCancelAppointment}
              onConfirmAppointment={handleConfirmAppointment}
              onCreateAppointment={handleCreateAppointment}
              onViewSentinel={(_sentinelId) => {
                setCurrentTab('sentinels');
              }}
            />
          )}

          {currentTab === 'sentinels' && (
            <SentinelDossiers
              sentinels={sentinels}
              guide={guide}
              onOpenChat={(sentinelId) => {
                const target = sentinels.find(s => s.id === sentinelId);
                if (target && target.isAcquainted === false) {
                  triggerToast(`尚未在现实中结识【${target.name}】，需在预约后台完成一次疏导！`);
                  return;
                }
                if (!friends.includes(sentinelId)) {
                  setFriends(prev => [...prev, sentinelId]);
                }
                setCurrentTab('chat');
              }}
              onQuickAppointment={(sentinelId) => {
                handleCreateAppointment(sentinelId, timeOfDay, '精神疏导', false);
                setCurrentTab('clinic');
              }}
              onContractSentinel={handleContractSentinel}
              onCreateOrImportSentinel={handleCreateOrImportSentinel}
            />
          )}

          {currentTab === 'chat' && (
            <ChatModule
              sentinels={sentinels}
              friends={friends}
              friendRequests={friendRequests}
              chats={chats}
              groupChats={groupChats}
              guide={guide}
              onSendMessage={handleSendMessage}
              onSendGroupMessage={handleSendGroupMessage}
              onAcceptFriendRequest={handleAcceptFriendRequest}
              onRejectFriendRequest={handleRejectFriendRequest}
              onQuickAppointment={(sentinelId) => {
                handleCreateAppointment(sentinelId, timeOfDay, '精神疏导', false);
                setCurrentTab('clinic');
              }}
            />
          )}

          {currentTab === 'moments' && (
            <MomentsModule
              moments={moments}
              guide={guide}
              sentinels={sentinels}
              onLikeMoment={handleLikeMoment}
              onAddComment={handleAddComment}
              onCreateMoment={handleCreateMoment}
            />
          )}

          {currentTab === 'trends' && (
            <TrendsModule
              trends={trends}
              guide={guide}
              onPublishPost={handlePublishTrendPost}
              onViewSentinelByTrend={(_sentinelId) => {
                setCurrentTab('sentinels');
              }}
            />
          )}

          {currentTab === 'relations' && (
            <RelationNetwork
              sentinels={sentinels}
              guide={guide}
              onContractSentinel={handleContractSentinel}
              onOpenChat={(sentinelId) => {
                if (!friends.includes(sentinelId)) {
                  setFriends(prev => [...prev, sentinelId]);
                }
                setCurrentTab('chat');
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsAndSaves
              currentSlot={saveSlot}
              availableSlots={saveSlotsList}
              guide={guide}
              onOpenEditGuide={() => setIsGuideEditModalOpen(true)}
              onSwitchSlot={handleSwitchSlot}
              onCreateSlot={handleCreateSlot}
              onDeleteSlot={handleDeleteSlot}
              onExportJson={handleExportJson}
              onImportJson={handleImportJson}
              onResetFactory={handleResetFactory}
            />
          )}
        </main>

        {/* Persistent Right Narrator & World Event Sidebar */}
        <NarratorSidebar
          narrations={narrations}
          guide={guide}
          isOpen={isNarratorOpen}
          onToggle={() => setIsNarratorOpen(!isNarratorOpen)}
          onAddManualLog={(category, text) => addNarration(category, text)}
          onViewSentinel={(_sentinelId) => {
            setCurrentTab('sentinels');
          }}
        />
      </div>

      {/* Bottom Navigation Dock (Retains the 7 primary functional modules) */}
      <NavigationDock
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingAppointmentsCount={appointments.filter(a => a.status === 'pending').length}
        unreadChatsCount={0}
        friendRequestsCount={friendRequests.length}
        criticalRiotsCount={sentinels.filter(s => s.riotRate >= 80).length}
      />

      {/* Guide Profile Modal */}
      {isProfileModalOpen && (
        <GuideProfileModal
          guide={guide}
          contractCount={sentinels.filter(s => s.contracted).length}
          onClose={() => setIsProfileModalOpen(false)}
          onRest={handleRest}
          onOpenEdit={() => {
            setIsProfileModalOpen(false);
            setIsGuideEditModalOpen(true);
          }}
        />
      )}

      {/* Guide Customization Modal (Heroine Customizer) */}
      {isGuideEditModalOpen && (
        <GuideEditModal
          guide={guide}
          contractCount={sentinels.filter(s => s.contracted).length}
          onSave={handleUpdateGuide}
          onClose={() => setIsGuideEditModalOpen(false)}
        />
      )}

      {/* Interactive VN Soothing Modal */}
      {activeSoothingApt && (
        <SoothingModal
          appointment={activeSoothingApt}
          sentinel={sentinels.find(s => s.id === activeSoothingApt.sentinelId)!}
          guide={guide}
          onClose={() => setActiveSoothingApt(null)}
          onExecute={handleExecuteSoothing}
        />
      )}

      {/* Post-Soothing Report Modal */}
      {soothingReport && (
        <SoothingReportModal
          report={soothingReport}
          onClose={() => setSoothingReport(null)}
        />
      )}
    </div>
  );
}
