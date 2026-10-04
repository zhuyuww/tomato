import React, { useState } from 'react';
import { Sentinel, Guide, PersonalityTag } from '../types';
import { 
  Shield, 
  HeartHandshake, 
  MessageSquare, 
  CalendarPlus, 
  Sparkles, 
  Search, 
  UserCheck, 
  AlertOctagon,
  Flame,
  Award,
  BookOpen,
  Plus,
  Upload,
  Copy,
  Check,
  FileCode,
  Lock
} from 'lucide-react';

interface SentinelDossiersProps {
  sentinels: Sentinel[];
  guide: Guide;
  onOpenChat: (sentinelId: string) => void;
  onQuickAppointment: (sentinelId: string) => void;
  onContractSentinel: (sentinelId: string) => void;
  onCreateOrImportSentinel: (newSentinel: Sentinel | Sentinel[]) => void;
}

export const SentinelDossiers: React.FC<SentinelDossiersProps> = ({
  sentinels,
  guide,
  onOpenChat,
  onQuickAppointment,
  onContractSentinel,
  onCreateOrImportSentinel
}) => {
  const [selectedSentinelId, setSelectedSentinelId] = useState<string>(sentinels[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'appearance' | 'spirit' | 'stats' | 'contract' | 'notes'>('overview');

  // Creation / Import Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'form' | 'json'>('form');
  const [previewImportList, setPreviewImportList] = useState<Sentinel[] | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    age: 24,
    rank: 'S级',
    military: '第三军团·机动突击旅',
    race: '蓝闪蝶种',
    personality: '傲娇' as PersonalityTag,
    height: '182cm',
    weight: '73kg',
    hairColor: '曜石黑短发',
    eyeColor: '荧蓝重瞳',
    beastFeatures: '微光幽蓝蝶翼纹络',
    aura: '冷艳高傲，孤僻偏执',
    compatibility: 92,
    riotRate: 82,
    spiritName: '幻蝶',
    spiritForm: '幽蓝织梦幻蝶',
    spiritType: '拟态织网',
    spiritMood: '焦躁振翅',
    spiritStatus: '躁动' as const,
    mindscape: '倒悬的水晶丛林，迷蒙的极光夜空',
    speed: 'S+ (幻影突击)',
    strength: 'A+ (重力压制)',
    endurance: 'S (长效隐匿)',
    pheromones: '冰冷幽夜昙花香',
    background: '出身于星际贵族却厌恶繁琐礼教，独自加入突击旅剿灭畸变种。精神海濒临崩塌，渴望被向导彻底接纳。',
    notes: '自尊心极高，对触碰其蝶翼极为敏感，需使用温和精神触手引导。'
  });

  // JSON Import Field
  const [jsonInput, setJsonInput] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const filteredSentinels = sentinels.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.race.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.personality && s.personality.includes(searchQuery))
  );

  const currentSentinel = sentinels.find(s => s.id === selectedSentinelId) || sentinels[0];

  const sampleJsonTemplate = JSON.stringify([
    {
      name: "赫尔墨斯 (Hermes)",
      code: "HM-772",
      age: 26,
      race: "黑曜猎豹种",
      rank: "S级",
      military: "战术侦搜旅·幽灵突击队",
      avatarText: "豹",
      personality: "高冷",
      height: "186cm",
      weight: "78kg",
      hairColor: "深墨黑碎发",
      eyeColor: "金琥珀猫眼瞳",
      beastFeatures: "修长黑豹尾，肌肉匀称紧实",
      aura: "如暗夜潜行的冷酷杀手，沉默寡言",
      compatibility: 94,
      riotRate: 86,
      spiritBeast: {
        name: "夜影",
        form: "黑曜暗影潜行猎豹",
        type: "强攻兽型",
        mood: "伏地戒备",
        status: "躁动",
        isDislikedSpecies: false,
        mindscape: "暴雨倾盆的黑色死寂巨木森林"
      },
      physicalStats: {
        speed: "SSS",
        strength: "S+",
        endurance: "S",
        pheromones: "雨后冷杉与黑咖啡苦香"
      },
      background: "在孤星要塞血战归还，极度克制，唯独在向导素面前会显露脆弱。"
    },
    {
      name: "洛温 (Lowen)",
      code: "LW-501",
      age: 24,
      race: "金狮种",
      rank: "SS级",
      military: "近卫亲卫军·统领",
      avatarText: "狮",
      personality: "忠犬",
      height: "192cm",
      weight: "88kg",
      hairColor: "耀眼纯金卷发",
      eyeColor: "熔金竖瞳",
      beastFeatures: "威严金色狮耳与蓬松狮尾",
      aura: "如太阳般浩荡灼热，对向导毫无保留的绝对臣服",
      compatibility: 96,
      riotRate: 88,
      spiritBeast: {
        name: "烈阳",
        form: "炽炎重铠黄金狮",
        type: "重装战域",
        mood: "安适等待",
        status: "躁动",
        mindscape: "烈火燃烧的古战域废墟"
      },
      background: "皇族近卫军统领，曾发誓只愿做安黎向导一人之利刃战矛。"
    }
  ], null, 2);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleJsonTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSentinel: Sentinel = {
      id: `s_${Date.now()}`,
      name: formData.name.trim(),
      code: formData.code.trim() || `NX-${Math.floor(Math.random() * 899 + 100)}`,
      age: formData.age || 25,
      race: formData.race.trim() || '变异兽种',
      rank: formData.rank || 'S级',
      military: formData.military.trim() || '帝国前线防卫旅',
      avatarText: formData.name.trim().charAt(0),
      personality: formData.personality,
      height: formData.height,
      weight: formData.weight,
      hairColor: formData.hairColor,
      eyeColor: formData.eyeColor,
      beastFeatures: formData.beastFeatures,
      aura: formData.aura,
      compatibility: formData.compatibility,
      background: formData.background,
      spiritBeast: {
        name: formData.spiritName.trim() || '幻灵',
        form: formData.spiritForm.trim() || '全息异兽',
        type: formData.spiritType,
        mood: formData.spiritMood,
        status: formData.spiritStatus,
        mindscape: formData.mindscape,
        isDislikedSpecies: formData.spiritForm.includes('蛛') || formData.spiritForm.includes('虫')
      },
      riotRate: Number(formData.riotRate) || 75,
      contracted: false,
      affinity: 50,
      trust: 45,
      possessiveness: 60,
      dislikedSpirit: formData.spiritForm.includes('蛛') || formData.race.includes('蛛'),
      appearance: `${formData.height}，${formData.weight}，${formData.hairColor}，${formData.eyeColor}。${formData.beastFeatures}。气质：${formData.aura}。`,
      physicalStats: {
        speed: formData.speed,
        strength: formData.strength,
        endurance: formData.endurance,
        pheromones: formData.pheromones
      },
      notes: formData.notes,
      isAcquainted: false
    };

    onCreateOrImportSentinel(newSentinel);
    setSelectedSentinelId(newSentinel.id);
    setIsCreateModalOpen(false);
  };

  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    try {
      const rawParsed = JSON.parse(jsonInput.trim());
      let itemsToProcess: any[] = [];

      if (Array.isArray(rawParsed)) {
        itemsToProcess = rawParsed;
      } else if (rawParsed && typeof rawParsed === 'object') {
        if (Array.isArray(rawParsed.sentinels)) {
          itemsToProcess = rawParsed.sentinels;
        } else if (Array.isArray(rawParsed.list)) {
          itemsToProcess = rawParsed.list;
        } else if (Array.isArray(rawParsed.data)) {
          itemsToProcess = rawParsed.data;
        } else {
          itemsToProcess = [rawParsed];
        }
      } else {
        throw new Error('JSON 解析结果既不是对象也不是数组，无法提取哨兵数据。');
      }

      if (itemsToProcess.length === 0) {
        throw new Error('未检测到任何哨兵档案数据，请确保数组非空！');
      }

      // Map and validate each sentinel
      const parsedSentinels: Sentinel[] = itemsToProcess.map((parsed, idx) => {
        if (!parsed || typeof parsed !== 'object') {
          throw new Error(`第 ${idx + 1} 项数据格式错误：不是合法的 JSON 对象！`);
        }

        const sentinelName = (parsed.name || '').trim();
        if (!sentinelName) {
          throw new Error(`第 ${idx + 1} 个哨兵对象缺少必填的 "name" (姓名) 字段！系统已终止导入，避免生成无名数据。`);
        }

        const validPersonality: PersonalityTag = 
          ['开朗', '阴湿', '暴躁', '忠犬', '傲娇', '高冷'].includes(parsed.personality)
            ? parsed.personality
            : '高冷';

        return {
          id: `s_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`,
          name: sentinelName,
          code: parsed.code || `X-${Math.floor(Math.random() * 899 + 100)}`,
          age: Number(parsed.age) || 25,
          race: parsed.race || '近卫战兽种',
          rank: parsed.rank || 'S级',
          military: parsed.military || '近卫要塞防御军',
          avatarText: (parsed.avatarText || sentinelName || '哨')[0],
          personality: validPersonality,
          height: parsed.height || '185cm',
          weight: parsed.weight || '80kg',
          hairColor: parsed.hairColor || '短发',
          eyeColor: parsed.eyeColor || '深眸',
          beastFeatures: parsed.beastFeatures || '半兽化特征',
          aura: parsed.aura || '冷峻威严',
          compatibility: Number(parsed.compatibility) || 88,
          background: parsed.background || '前线战役归航，神经海急需高阶向导素深层调理。',
          spiritBeast: {
            name: parsed.spiritBeast?.name || `${sentinelName}的灵兽`,
            form: parsed.spiritBeast?.form || '强攻战兽形态',
            type: parsed.spiritBeast?.type || '强攻兽型',
            mood: parsed.spiritBeast?.mood || '戒备巡视',
            status: parsed.spiritBeast?.status || '躁动',
            isDislikedSpecies: Boolean(parsed.spiritBeast?.isDislikedSpecies || parsed.spiritBeast?.form?.includes('蛛')),
            mindscape: parsed.spiritBeast?.mindscape || '暴风雨与暗礁交织的混沌海域'
          },
          riotRate: Number(parsed.riotRate) || 82,
          contracted: Boolean(parsed.contracted),
          contractPledge: parsed.contractPledge,
          contractMark: parsed.contractMark,
          affinity: Number(parsed.affinity) || 50,
          trust: Number(parsed.trust) || 45,
          possessiveness: Number(parsed.possessiveness) || 65,
          dislikedSpirit: Boolean(parsed.dislikedSpirit || parsed.spiritBeast?.form?.includes('蛛')),
          appearance: parsed.appearance || `${parsed.height || ''} ${parsed.beastFeatures || ''} ${parsed.aura || ''}`.trim(),
          physicalStats: parsed.physicalStats || {
            speed: 'S',
            strength: 'S',
            endurance: 'S',
            pheromones: '清冽冷木香'
          },
          notes: parsed.notes || '新导入哨兵档案，需安排初次接触诊断。',
          isAcquainted: false // 关键锁定：导入的哨兵默认未认识，只能进排期后台，不能进私信！
        };
      });

      // Show preview confirmation modal before saving!
      setPreviewImportList(parsedSentinels);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'JSON 解析失败，请检查语法格式！或点击“复制标准模板”参考格式。');
    }
  };

  const handleConfirmImport = () => {
    if (!previewImportList || previewImportList.length === 0) return;

    onCreateOrImportSentinel(previewImportList);
    setSelectedSentinelId(previewImportList[0].id);
    setPreviewImportList(null);
    setJsonInput('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 md:p-6 gap-4">
      {/* Left Column: Sentinel List Sidebar */}
      <div className="w-full md:w-80 flex flex-col bg-slate-950/60 rounded-xl border border-cyan-500/20 overflow-hidden shrink-0">
        {/* Search header & Create Button */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-cyan-300">哨兵档案库 ({sentinels.length})</span>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-2.5 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>导入/创建哨兵</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="检索姓名、兽型、性格(开朗/阴湿/傲娇)……"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Sentinel items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredSentinels.map(s => {
            const isSelected = s.id === currentSentinel?.id;
            const isHighRiot = s.riotRate >= 80;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSentinelId(s.id)}
                className={`p-3 flex items-center justify-between cursor-pointer transition ${
                  isSelected
                    ? 'bg-cyan-950/60 border-l-4 border-cyan-400'
                    : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border ${
                    s.contracted
                      ? 'border-purple-400 bg-purple-950/80 text-purple-200'
                      : 'border-cyan-500/30 bg-slate-800 text-cyan-300'
                  }`}>
                    {s.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-200 text-xs">{s.name}</span>
                      <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1 rounded border border-indigo-500/40">
                        {s.personality}
                      </span>
                      {s.isAcquainted === false && (
                        <span className="text-[9px] bg-amber-950 text-amber-300 px-1 rounded border border-amber-500/40">
                          未结识
                        </span>
                      )}
                      {s.contracted && (
                        <span className="text-[9px] bg-purple-900 text-purple-200 px-1 rounded">契约</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {s.race} · <span className="font-mono text-cyan-400">{s.rank}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-mono font-bold ${isHighRiot ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    {s.riotRate}%
                  </div>
                  <div className="text-[9px] text-slate-500">暴动指数</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detailed Sentinel Dossier View */}
      {currentSentinel && (
        <div className="flex-1 flex flex-col bg-slate-950/60 rounded-xl border border-cyan-500/20 overflow-hidden">
          {/* Header Card */}
          <div className="p-4 md:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900/90 to-cyan-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 ${
                currentSentinel.contracted
                  ? 'border-purple-400 bg-purple-950 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'border-cyan-400/50 bg-slate-800 text-cyan-300'
              }`}>
                {currentSentinel.avatarText}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-100">{currentSentinel.name}</h2>
                  <span className="text-xs font-mono text-slate-400">[{currentSentinel.code}]</span>
                  <span className="text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                    {currentSentinel.rank}
                  </span>
                  <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 font-semibold">
                    性格: {currentSentinel.personality}
                  </span>
                  {currentSentinel.contracted ? (
                    <span className="text-xs bg-purple-950 text-purple-200 px-2 py-0.5 rounded border border-purple-500 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> 同生共死契约哨兵
                    </span>
                  ) : currentSentinel.isAcquainted === false ? (
                    <span className="text-xs bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-500/50 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 未结识 (待后台接诊疏导)
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded">
                      追求期守护者
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                  <span>种族: <strong className="text-cyan-300">{currentSentinel.race}</strong></span>
                  <span>年龄: <strong className="text-slate-300">{currentSentinel.age}岁</strong></span>
                  <span>所属: <strong className="text-slate-300">{currentSentinel.military}</strong></span>
                  {currentSentinel.compatibility && (
                    <span>匹配度: <strong className="text-emerald-400">{currentSentinel.compatibility}%</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {currentSentinel.isAcquainted === false ? (
                <button
                  disabled
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-500 flex items-center gap-1.5 cursor-not-allowed opacity-70"
                  title="尚未在现实中认识该哨兵。需在预约后台同意并完成一次疏导后方可解锁私信通讯。"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>未结识 (需先疏导)</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenChat(currentSentinel.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>发起通讯</span>
                </button>
              )}

              <button
                onClick={() => onQuickAppointment(currentSentinel.id)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>安排疏导</span>
              </button>

              {!currentSentinel.contracted && (
                <button
                  onClick={() => onContractSentinel(currentSentinel.id)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                  title="好感≥80且信任≥70即可缔结契约"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>缔结契约</span>
                </button>
              )}
            </div>
          </div>

          {/* Dossier Tabs */}
          <div className="flex border-b border-slate-800 px-4 gap-4 text-xs font-medium overflow-x-auto">
            {[
              { id: 'overview', label: '档案概览' },
              { id: 'appearance', label: '外貌兽化' },
              { id: 'spirit', label: '精神体' },
              { id: 'stats', label: '身体机能' },
              { id: 'contract', label: '契约与羁绊' },
              { id: 'notes', label: '向导笔记' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-2.5 relative whitespace-nowrap transition cursor-pointer ${
                  activeTab === t.id
                    ? 'text-cyan-300 font-bold border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 text-xs space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <h3 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" /> 精神海现状与性格
                    </h3>
                    <div className="space-y-1 text-slate-300">
                      <div>狂暴指数: <strong className="font-mono text-amber-400">{currentSentinel.riotRate}%</strong></div>
                      <div>核心人设标签: <span className="text-indigo-300 font-bold bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-500/40">{currentSentinel.personality}</span></div>
                      <div>精神体形态: <strong className="text-purple-300">{currentSentinel.spiritBeast.form}</strong></div>
                      <div>精神域状态: <span className="text-emerald-400">{currentSentinel.spiritBeast.status}</span> ({currentSentinel.spiritBeast.mood})</div>
                      {currentSentinel.dislikedSpirit && (
                        <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded border border-amber-500/30">
                          ⚠️ <strong>特征预警：</strong>属于节肢蛛形类精神体，在向导协会受拒率较高，极度渴求温柔包容的向导素抚慰。
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <h3 className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-purple-400" /> 契约关系状态
                    </h3>
                    {currentSentinel.contracted ? (
                      <div className="space-y-1.5 text-purple-200">
                        <div className="font-semibold text-emerald-400">✓ 已结契 · 同生共死命脉绑定</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                          "{currentSentinel.contractPledge}"
                        </p>
                        <div className="text-[11px] text-purple-300">
                          印记位置：{currentSentinel.contractMark}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-slate-300">
                        <div className="text-slate-400">追求期情感波长（未绑定）：</div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span>好感度: <strong className="text-pink-400">{currentSentinel.affinity}/100</strong></span>
                            <span>信任度: <strong className="text-cyan-400">{currentSentinel.trust}/100</strong></span>
                            <span>独占欲: <strong className="text-purple-400">{currentSentinel.possessiveness}/100</strong></span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                            <div className="bg-pink-500 h-full" style={{ width: `${currentSentinel.affinity}%` }} />
                            <div className="bg-cyan-500 h-full" style={{ width: `${currentSentinel.trust}%` }} />
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          * 达到 好感≥80、信任≥70 后即可正式激活同生共死契约。
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Background Story */}
                {currentSentinel.background && (
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <h3 className="font-bold text-cyan-300 text-xs">背景生平与履历</h3>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {currentSentinel.background}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 leading-relaxed text-slate-300">
                <h3 className="font-bold text-cyan-300 text-xs">外表相貌与半兽化特征描写</h3>
                <p className="text-xs">{currentSentinel.appearance}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 text-[11px] border-t border-slate-800">
                  <div>身高: <span className="text-slate-200">{currentSentinel.height || '未知'}</span></div>
                  <div>体重: <span className="text-slate-200">{currentSentinel.weight || '未知'}</span></div>
                  <div>发色: <span className="text-slate-200">{currentSentinel.hairColor || '未知'}</span></div>
                  <div>瞳色: <span className="text-slate-200">{currentSentinel.eyeColor || '未知'}</span></div>
                </div>
                {currentSentinel.beastFeatures && (
                  <div className="pt-2 text-[11px] text-slate-300">
                    <strong className="text-amber-300">兽化特征：</strong>{currentSentinel.beastFeatures}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'spirit' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 leading-relaxed">
                <h3 className="font-bold text-purple-300 text-xs flex items-center justify-between">
                  <span>精神体全息模型 · {currentSentinel.spiritBeast.name}</span>
                  <span className="text-slate-400 font-normal">类型: {currentSentinel.spiritBeast.type}</span>
                </h3>
                <p className="text-slate-300 text-xs">
                  形态为【{currentSentinel.spiritBeast.form}】。目前精神海中的精神体表现为：<strong className="text-amber-300">{currentSentinel.spiritBeast.mood}</strong>。
                </p>
                {currentSentinel.spiritBeast.mindscape && (
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-cyan-400">精神图景景象：</strong>{currentSentinel.spiritBeast.mindscape}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">机动移速</span>
                  <span className="text-sm font-bold text-cyan-300">{currentSentinel.physicalStats.speed}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">肉体打击力量</span>
                  <span className="text-sm font-bold text-amber-300">{currentSentinel.physicalStats.strength}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">抗畸变耐力</span>
                  <span className="text-sm font-bold text-emerald-300">{currentSentinel.physicalStats.endurance}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">原发信息素</span>
                  <span className="text-sm font-bold text-purple-300">{currentSentinel.physicalStats.pheromones}</span>
                </div>
              </div>
            )}

            {activeTab === 'contract' && (
              <div className="space-y-4">
                {currentSentinel.contracted ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/60 space-y-3">
                    <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span>同生共死契约缔结报告</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      "{currentSentinel.contractPledge}"
                    </p>
                    <div className="pt-2 border-t border-purple-800/40 text-[11px] text-slate-300 space-y-1">
                      <div>契约效果：生命强绑定、生理强依赖、安抚时自动触发【契约共鸣】。</div>
                      <div>追求期数值机制：好感度/信任度/独占欲等世俗考核已永久隐藏并升华为永恒羁绊。</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-200">契约缔结评估（当前未结契）</div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-black/30 border border-slate-800">
                        <span>当前好感度: <strong className="text-pink-400">{currentSentinel.affinity}</strong> / 80</span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/30 border border-slate-800">
                        <span>当前信任度: <strong className="text-cyan-400">{currentSentinel.trust}</strong> / 70</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onContractSentinel(currentSentinel.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      申请触发同生共死结契仪式
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h3 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> 向导私人诊疗备忘录
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-black/30 p-3 rounded-lg border border-slate-800">
                  "{currentSentinel.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE & IMPORT SENTINEL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-400/50 w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm">
                  定制或导入新哨兵档案
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Mode switch: Form or JSON */}
            <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs gap-1">
              <button
                type="button"
                onClick={() => setCreateMode('form')}
                className={`flex-1 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                  createMode === 'form' ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-bold' : 'text-slate-400'
                }`}
              >
                表单模式全套定制
              </button>
              <button
                type="button"
                onClick={() => setCreateMode('json')}
                className={`flex-1 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                  createMode === 'json' ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-bold' : 'text-slate-400'
                }`}
              >
                JSON 批量/文件导入
              </button>
            </div>

            {/* Mode 1: Form-Based Creation */}
            {createMode === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Basic info row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">哨兵姓名 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例：陆羽 (Lu Yu)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">军方识别编号</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="例：LY-801"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">军衔 / 等级</label>
                    <select
                      value={formData.rank}
                      onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="SS级">SS级 (星系至强)</option>
                      <option value="S级">S级 (高阶先锋)</option>
                      <option value="A+级">A+级 (精锐突击)</option>
                      <option value="A级">A级 (常规军官)</option>
                    </select>
                  </div>
                </div>

                {/* Personality & Race row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-amber-300 font-bold block mb-1">核心性格标签 * (决定互动反应)</label>
                    <select
                      value={formData.personality}
                      onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value as PersonalityTag }))}
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2 text-amber-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="开朗">开朗 (阳光直率，安抚后主动加好友)</option>
                      <option value="阴湿">阴湿 (自卑敏感，暗自观察，渴望被爱)</option>
                      <option value="暴躁">暴躁 (狂野隐忍，嘴硬易怒但易化解)</option>
                      <option value="忠犬">忠犬 (绝对忠诚，温驯黏人，狂热奉献)</option>
                      <option value="傲娇">傲娇 (口嫌体正直，自尊极强，别扭脸红)</option>
                      <option value="高冷">高冷 (沉默寡言，克制内敛，深情不露)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">兽型归属 (种族) *</label>
                    <input
                      type="text"
                      value={formData.race}
                      onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value }))}
                      placeholder="例：蓝闪蝶种 / 猎豹种 / 苍狼种"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">所属军团部队</label>
                    <input
                      type="text"
                      value={formData.military}
                      onChange={(e) => setFormData(prev => ({ ...prev, military: e.target.value }))}
                      placeholder="例：第三军团·机动突击旅"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Spirit Beast info */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="font-bold text-purple-300">精神体模型配置</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400 block mb-0.5">精神体昵称</span>
                      <input
                        type="text"
                        value={formData.spiritName}
                        onChange={(e) => setFormData(prev => ({ ...prev, spiritName: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">精神体具体形态</span>
                      <input
                        type="text"
                        value={formData.spiritForm}
                        onChange={(e) => setFormData(prev => ({ ...prev, spiritForm: e.target.value }))}
                        placeholder="例：幽蓝织梦幻蝶 / 暗夜猎豹"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">精神域景象</span>
                      <input
                        type="text"
                        value={formData.mindscape}
                        onChange={(e) => setFormData(prev => ({ ...prev, mindscape: e.target.value }))}
                        placeholder="例：倒悬的水晶巨林"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 block mb-0.5">身高</span>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">发色</span>
                    <input
                      type="text"
                      value={formData.hairColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, hairColor: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">瞳色</span>
                    <input
                      type="text"
                      value={formData.eyeColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, eyeColor: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">初始暴动阈值 (%)</span>
                    <input
                      type="number"
                      value={formData.riotRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, riotRate: Number(e.target.value) }))}
                      min={0}
                      max={100}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                    />
                  </div>
                </div>

                {/* Beast Features & Aura */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block mb-0.5">半兽化特征</span>
                    <input
                      type="text"
                      value={formData.beastFeatures}
                      onChange={(e) => setFormData(prev => ({ ...prev, beastFeatures: e.target.value }))}
                      placeholder="例：微光幽蓝蝶翼纹络、半透骨节"
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">气质与体貌</span>
                    <input
                      type="text"
                      value={formData.aura}
                      onChange={(e) => setFormData(prev => ({ ...prev, aura: e.target.value }))}
                      placeholder="例：冷艳高傲，孤僻偏执"
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                    />
                  </div>
                </div>

                {/* Background Story & Notes */}
                <div>
                  <span className="text-slate-400 block mb-0.5">生平背景与向导私密备忘</span>
                  <textarea
                    value={formData.background}
                    onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                    rows={2}
                    placeholder="填写角色的经历、对向导的执念或作战过往……"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg font-bold shadow-md cursor-pointer"
                  >
                    生成档案并录入排班
                  </button>
                </div>
              </form>
            )}

            {/* Mode 2: JSON-Based Batch/Custom Import */}
            {createMode === 'json' && (
              <form onSubmit={handleJsonSubmit} className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">粘贴符合格式的哨兵档案 JSON 数据（单对象或数组均可）：</span>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-cyan-300 flex items-center gap-1 cursor-pointer transition"
                  >
                    {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplate ? '已复制标准批量模板！' : '复制标准JSON模板'}</span>
                  </button>
                </div>

                {jsonError && (
                  <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2 shadow-inner">
                    <span className="text-red-400 font-bold shrink-0">⚠️ 格式错误：</span>
                    <span className="leading-relaxed">{jsonError}</span>
                  </div>
                )}

                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    if (jsonError) setJsonError(null);
                  }}
                  placeholder="在此粘贴包含 name, race, personality (开朗/阴湿/暴躁/忠犬/傲娇/高冷), spiritBeast 等字段的 JSON 数组 [...] 或单个对象……"
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-cyan-400"
                  required
                />

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setJsonError(null);
                    }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg font-bold shadow-md cursor-pointer"
                  >
                    解析并预览档案
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Preview Confirmation Modal (Multi-Dossier Import Preview) */}
      {previewImportList && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-400/80 w-full max-w-2xl rounded-2xl p-5 md:p-6 shadow-2xl holo-glow flex flex-col max-h-[92vh] overflow-hidden my-auto space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>哨兵档案批量导入预览确认</span>
                  <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                    已成功识别 {previewImportList.length} 位
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  请核实即将录入帝国光脑数据库的哨兵名单与人设属性
                </p>
              </div>

              <button
                onClick={() => setPreviewImportList(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Crucial status reminder */}
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">⚠️ 社交关系锁定提醒：</span>
              <div>
                根据世界观设定，所有新导入哨兵初始状态统一为【<strong>未认识</strong>】。导入后他们将<strong>仅出现在“预约排期后台”的候诊队列中</strong>，绝不会直接空降私信好友列表。向导在排期后台完成初次疏导安抚后，方可解锁私信与光脑社交！
              </div>
            </div>

            {/* List of Sentinels to be imported */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-72">
              {previewImportList.map((sentinel, idx) => (
                <div
                  key={sentinel.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/30 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                      {sentinel.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-100 text-sm">{sentinel.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">[{sentinel.code}]</span>
                        <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-semibold">
                          {sentinel.rank}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                          {sentinel.race}
                        </span>
                        <span className="text-[10px] bg-pink-950/80 text-pink-300 border border-pink-500/30 px-1.5 py-0.2 rounded font-bold">
                          性格: {sentinel.personality}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                        <span>精神体: <strong className="text-slate-300">{sentinel.spiritBeast.name}</strong> ({sentinel.spiritBeast.form})</span>
                        <span>暴动阈值: <strong className="text-red-400">{sentinel.riotRate}%</strong></span>
                        <span className="text-slate-500">特征: {sentinel.beastFeatures || '兽化特征'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-slate-900 border border-slate-700 text-amber-300 px-2 py-1 rounded shrink-0">
                    状态: 未认识
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewImportList(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs transition cursor-pointer"
              >
                返回修改 JSON
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>确认导入并建档入库 ({previewImportList.length} 位)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
