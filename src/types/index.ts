export type TimeOfDay = '上午' | '下午';

export type SoothingMethod = '精神疏导' | '物理安抚' | '信息素安抚' | '契约共鸣';

export type PersonalityTag = '开朗' | '阴湿' | '暴躁' | '忠犬' | '傲娇' | '高冷';

export type GuidePersonalityTag = '温柔' | '强势' | '腹黑' | '清冷' | '活泼';

export interface GuideSpiritBeast {
  name: string;
  form: string; // e.g. '光翼琉璃蝶', '九尾银狐幼崽'
  type: string; // e.g. '治愈灵能型', '全域共鸣型'
  mindscape: string; // 精神域景象（自由文本）
  status: '稳定' | '疲惫' | '过载';
}

export interface Guide {
  name: string;
  age?: number;
  rank: string; // 'S级' | 'A级' | 'B级' 或 'S级高级向导'
  title: string;
  // Appearance & Physical Features
  height?: string;
  weight?: string;
  hairColor?: string;
  eyeColor?: string;
  temperament?: string; // 气质描述
  beastFeatures?: string; // 兽化/向导特征（如：微尖的耳廓、光洁的背脊）
  guidePersonality: GuidePersonalityTag; // 性格标签（影响安抚对话选项与哨兵反应）
  // Abilities & Mastery
  abilityMastery?: {
    mentalSoothing: boolean; // 精神疏导
    physicalComfort: boolean; // 物理安抚
    pheromoneSoothing: boolean; // 信息素安抚
    contractResonance: boolean; // 契约共鸣
  };
  // Spirit Beast
  spiritBeast?: GuideSpiritBeast;
  // Numeric Stats (read-only in customizer)
  mentalPower: number; // 0 - 100
  maxMentalPower: number;
  isFatigued: boolean;
  fatigueLevel: '饱满' | '良好' | '轻度疲劳' | '精神透支';
  reputation: number;
  completedSessions: number;
  maxContracts: number; // 5
  skills: {
    name: string;
    level: string;
    desc: string;
  }[];
}

export interface SpiritBeast {
  name: string;
  form: string; // e.g. '白化极地雪狼'
  type: string; // '强攻兽型' | '剧毒潜行' | '拟态织网' | '重装战域' | '高空猎手'
  mood: string; // '焦躁撕咬' | '盘踞戒备' | '瑟缩发抖' | '安适共鸣' | '濒临狂暴'
  status: '稳定' | '躁动' | '兽化边缘' | '狂暴' | '沉睡';
  isDislikedSpecies?: boolean; // e.g. 蜘蛛等易被向导忌避的节肢类
  mindscape?: string; // 精神域景象
}

export interface Sentinel {
  id: string;
  name: string;
  code: string;
  age: number;
  race: string; // '雪狼种' | '黑曼巴蛇种' | '阴影织网蛛' | '黄金狂狮' | '苍蓝游隼' | etc.
  rank: string; // 'SS级' | 'S级' | 'A+级'
  military: string;
  avatarText: string;
  spiritBeast: SpiritBeast;
  riotRate: number; // 0 - 100 (暴动指数)
  contracted: boolean; // 是否已结契 (同生共死)
  contractPledge?: string;
  contractMark?: string; // 契约印记位置
  // 追求期数值 (契约后不再显示这些数值)
  affinity: number; // 好感度 0 - 100
  trust: number; // 信任度 0 - 100
  possessiveness: number; // 独占欲 0 - 100
  dislikedSpirit: boolean; // 是否拥有易被向导排斥的精神体
  appearance: string; // 外貌与兽化特征
  physicalStats: {
    speed: string;
    strength: string;
    endurance: string;
    pheromones: string;
  };
  notes: string; // 向导私密备忘录
  
  // v2 迭代拓展字段
  personality: PersonalityTag; // 核心性格标签：开朗/阴湿/暴躁/忠犬/傲娇/高冷
  height?: string;
  weight?: string;
  hairColor?: string;
  eyeColor?: string;
  beastFeatures?: string; // 兽化特征
  aura?: string; // 气质
  compatibility?: number; // 匹配度 0 - 100
  background?: string; // 背景故事
  isAcquainted?: boolean; // 是否已认识（新导入哨兵默认为 false，必须在后台完成一次疏导后方可解锁私信与社交）
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'postponed' | 'expired';

export interface Appointment {
  id: string;
  sentinelId: string;
  day: number;
  timeSlot: TimeOfDay;
  status: AppointmentStatus;
  isEmergency: boolean; // 紧急暴动插队
  method: SoothingMethod;
  reason: string;
  cancelReason?: string;
}

export interface SoothingReport {
  id: string;
  sentinelId: string;
  sentinelName: string;
  method: SoothingMethod;
  riotBefore: number;
  riotAfter: number;
  mentalConsumed: number;
  stardate: string;
  details: string;
  affinityDelta?: number;
  trustDelta?: number;
  possessivenessDelta?: number;
  isContractResonance: boolean;
  dialogueHistory?: {
    speaker: string;
    text: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'guide' | 'sentinel' | 'system';
  senderName?: string;
  text: string;
  time: string;
  fileAttachment?: {
    name: string;
    size: string;
    type: 'report' | 'dossier' | 'data';
  };
}

export interface FriendRequest {
  id: string;
  sentinelId: string;
  verifyMsg: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
}

export interface MomentComment {
  id: string;
  author: string;
  authorId?: string;
  isGuide?: boolean;
  replyTo?: string; // 互相回复：回复某人的名字
  text: string;
  time: string;
}

export interface Moment {
  id: string;
  authorId: string;
  author: string;
  avatarText: string;
  time: string;
  content: string;
  isContracted?: boolean;
  visibility: 'public' | 'contracted_only' | 'friends_only';
  likes: number;
  likedByGuide: boolean;
  comments: MomentComment[];
  beastPhotoDesc?: string;
}

export interface TrendTopic {
  id: string;
  tag: '爆' | '热' | '新' | '警' | '荐';
  title: string;
  heat: string;
  summary: string;
  relatedSentinelId?: string;
  postsCount: number;
}

export interface NarrationLog {
  id: string;
  stardate: string;
  category: '疏导' | '社交' | '契约' | '紧急' | '随笔' | '世界动态';
  text: string;
  relatedSentinelId?: string;
  relatedSentinelName?: string;
}

export interface GroupChat {
  id: string;
  name: string;
  type: 'fleet' | 'association' | 'gossip' | 'squad';
  desc: string;
  unreadCount: number;
  membersCount: number;
  messages: ChatMessage[];
}

export interface GameSaveData {
  saveSlotId: string;
  saveName: string;
  lastUpdated: string;
  guide: Guide;
  stardateYear: number;
  stardateDay: number;
  timeOfDay: TimeOfDay;
  dayCycleCount: number;
  sentinels: Sentinel[];
  appointments: Appointment[];
  friendRequests: FriendRequest[];
  friends: string[];
  chats: Record<string, ChatMessage[]>;
  moments: Moment[];
  trends: TrendTopic[];
  narrations: NarrationLog[];
  reports: SoothingReport[];
}
