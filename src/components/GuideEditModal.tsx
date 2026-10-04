import React, { useState } from 'react';
import { Guide, GuidePersonalityTag } from '../types';
import { 
  Sparkles, 
  X, 
  Check, 
  User, 
  Sliders, 
  Brain, 
  Zap, 
  ShieldCheck, 
  Heart,
  Palette,
  Eye,
  Activity
} from 'lucide-react';

interface GuideEditModalProps {
  guide: Guide;
  contractCount: number;
  onSave: (updatedGuide: Guide) => void;
  onClose: () => void;
}

export const GuideEditModal: React.FC<GuideEditModalProps> = ({
  guide,
  contractCount,
  onSave,
  onClose
}) => {
  // Form State
  const [name, setName] = useState(guide.name || '安黎');
  const [age, setAge] = useState<number>(guide.age || 21);
  const [title, setTitle] = useState(guide.title || '稀有精神海纯愈者');
  const [rank, setRank] = useState(guide.rank || 'S级');
  const [guidePersonality, setGuidePersonality] = useState<GuidePersonalityTag>(guide.guidePersonality || '温柔');

  // Appearance
  const [height, setHeight] = useState(guide.height || '167cm');
  const [weight, setWeight] = useState(guide.weight || '48kg');
  const [hairColor, setHairColor] = useState(guide.hairColor || '银白微卷长发');
  const [eyeColor, setEyeColor] = useState(guide.eyeColor || '琉璃淡紫瞳');
  const [temperament, setTemperament] = useState(guide.temperament || '神圣悲悯中蕴含清冷威仪，令人本能想要俯首臣服');
  const [beastFeatures, setBeastFeatures] = useState(guide.beastFeatures || '微尖的晶莹向导耳廓、白皙光洁的后颈腺体与微隐的淡紫向导神纹');

  // Ability mastery
  const [abilityMastery, setAbilityMastery] = useState({
    mentalSoothing: guide.abilityMastery?.mentalSoothing ?? true,
    physicalComfort: guide.abilityMastery?.physicalComfort ?? true,
    pheromoneSoothing: guide.abilityMastery?.pheromoneSoothing ?? true,
    contractResonance: guide.abilityMastery?.contractResonance ?? true
  });

  // Spirit Beast
  const [spiritName, setSpiritName] = useState(guide.spiritBeast?.name || '小雪团');
  const [spiritForm, setSpiritForm] = useState(guide.spiritBeast?.form || '光翼琉璃蝶幼态');
  const [spiritType, setSpiritType] = useState(guide.spiritBeast?.type || '治愈灵能型');
  const [spiritMindscape, setSpiritMindscape] = useState(guide.spiritBeast?.mindscape || '阳光明媚的星际紫藤庭院，漂浮着永不凋零的花瓣与微光灵泉');
  const [spiritStatus, setSpiritStatus] = useState<'稳定' | '疲惫' | '过载'>(guide.spiritBeast?.status || '稳定');

  const [activeSection, setActiveSection] = useState<'basic' | 'appearance' | 'personality' | 'abilities' | 'spirit' | 'stats'>('basic');

  const personalityDescriptions: Record<GuidePersonalityTag, string> = {
    温柔: '以包容与体谅为主，轻柔宽抚哨兵的痛苦，安抚选项偏向治愈安慰，哨兵放下戒心速度快。',
    强势: '掌控欲强、居高临下，以绝对神圣威压命令哨兵臣服，安抚选项充满主宰感，极大震慑狂暴哨兵。',
    腹黑: '言语试探、玩味调侃，喜欢拿捏哨兵的心思与弱点，安抚选项富有戏剧性反转，令哨兵抓狂又沉迷。',
    清冷: '公事公办、疏离高效，不轻易流露多余感情，安抚选项简明扼要，让哨兵疯狂想要打破你的冷漠。',
    活泼: '灵动可爱、轻松跳脱，以俏皮幽默化解紧张与杀气，安抚选项欢快自然，缓解病房压抑氛围。'
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Guide = {
      ...guide,
      name: name.trim() || '安黎',
      age: Number(age) || 21,
      title: title.trim() || '稀有精神海纯愈者',
      rank,
      guidePersonality,
      height: height.trim(),
      weight: weight.trim(),
      hairColor: hairColor.trim(),
      eyeColor: eyeColor.trim(),
      temperament: temperament.trim(),
      beastFeatures: beastFeatures.trim(),
      abilityMastery,
      spiritBeast: {
        name: spiritName.trim() || '小雪团',
        form: spiritForm.trim() || '光翼琉璃蝶幼态',
        type: spiritType.trim() || '治愈灵能型',
        mindscape: spiritMindscape.trim() || '阳光明媚的星际紫藤庭院',
        status: spiritStatus
      }
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-400/60 w-full max-w-2xl rounded-2xl p-5 md:p-6 shadow-2xl holo-glow flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>编辑向导档案 · 女主神格定制</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                  Customization Matrix
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                向导性格、精神力等级与精神体状态将深度映射至安抚互动与剧情分支
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto py-2.5 border-b border-slate-800 text-xs no-scrollbar">
          {[
            { id: 'basic', label: '1. 基础信息', icon: User },
            { id: 'appearance', label: '2. 外貌特征', icon: Eye },
            { id: 'personality', label: '3. 性格与神格', icon: Heart },
            { id: 'abilities', label: '4. 能力技能', icon: Zap },
            { id: 'spirit', label: '5. 精神体与图景', icon: Brain },
            { id: 'stats', label: '6. 只读面板', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer font-medium ${
                  isActive 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {/* Section 1: Basic Info */}
          {activeSection === 'basic' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">向导姓名 (Name)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                    placeholder="如：安黎"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">年龄 (Age)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={18}
                    max={60}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">帝国授予称号 (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="如：稀有精神海纯愈者 / 圣洁之光 / 首席抚慰导师"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">精神力等级 (Mental Rank)</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { val: 'S级', label: 'S级（神格天花板 · 绝不反噬）', color: 'border-cyan-500/50 text-cyan-300' },
                    { val: 'A级', label: 'A级（精锐向导 · 高度亲和）', color: 'border-purple-500/50 text-purple-300' },
                    { val: 'B级', label: 'B级（标准向导 · 基础安抚）', color: 'border-slate-600 text-slate-300' }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setRank(item.val)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        rank === item.val
                          ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                          : 'bg-slate-950/60 hover:bg-slate-800 ' + item.color
                      }`}
                    >
                      <div className="font-bold">{item.val}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Appearance & Physical Features */}
          {activeSection === 'appearance' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1">身高</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="167cm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">体重</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="48kg"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">发色</label>
                  <input
                    type="text"
                    value={hairColor}
                    onChange={(e) => setHairColor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="银白微卷长发"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">瞳色</label>
                  <input
                    type="text"
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="琉璃淡紫瞳"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">气质与仪态描述 (Temperament)</label>
                <textarea
                  value={temperament}
                  onChange={(e) => setTemperament(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  placeholder="如：神圣悲悯中蕴含清冷威仪，令人本能想要俯首臣服"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">兽化/向导生理特征 (Beast / Guide Features)</label>
                <textarea
                  value={beastFeatures}
                  onChange={(e) => setBeastFeatures(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  placeholder="如：微尖的晶莹向导耳廓、白皙光洁的背脊与向导神纹"
                />
              </div>
            </div>
          )}

          {/* Section 3: Personality Tag */}
          {activeSection === 'personality' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-cyan-200">
                <p className="font-semibold mb-1">💡 性格标签直接决定女主在安抚弹窗中的台词风向！</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  选择不同的性格，在面对高冷、暴躁、阴湿、傲娇哨兵时，系统会生成截然不同的选项，哨兵的心理反应与回馈动作亦会完全不同。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['温柔', '强势', '腹黑', '清冷', '活泼'] as GuidePersonalityTag[]).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setGuidePersonality(tag)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      guidePersonality === tag
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-sm ${guidePersonality === tag ? 'text-cyan-300' : 'text-slate-200'}`}>
                        【{tag}】型向导
                      </span>
                      {guidePersonality === tag && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/40">
                          当前启用
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {personalityDescriptions[tag]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Abilities & Skills */}
          {activeSection === 'abilities' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-slate-400 text-xs">
                勾选向导掌握的四项核心神圣安抚技能（解锁后可在预约后台与安抚交互中施展）：
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'mentalSoothing' as const,
                    title: '1. 精神疏导 (深渊潜航与精神海濯洗)',
                    desc: '释放S级精神触手切入哨兵潜意识深处，柔和冲刷畸变裂纹，压制重度暴动。'
                  },
                  {
                    key: 'physicalComfort' as const,
                    title: '2. 物理安抚 (触抚兽化特征与腺体)',
                    desc: '抚摸敏感兽耳、揉捏蓬松兽尾、掌心覆贴发烫后颈腺体，激发雄性生理依恋。'
                  },
                  {
                    key: 'pheromoneSoothing' as const,
                    title: '3. 信息素安抚 (高纯度向导素神经注入)',
                    desc: '散发甘冽草木清冷向导素，直接阻断神经痛感，产生尖锐解脱与依恋感。'
                  },
                  {
                    key: 'contractResonance' as const,
                    title: '4. 契约共鸣 (同生共死·灵魂同频共振)',
                    desc: '神迹级双向灵魂相融，瞬间化解重度精神狂潮，仅限已缔结契约的哨兵触发。'
                  }
                ].map(item => (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      abilityMastery[item.key]
                        ? 'bg-slate-950 border-cyan-500/50 text-slate-200'
                        : 'bg-slate-950/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={abilityMastery[item.key]}
                      onChange={(e) => setAbilityMastery(prev => ({
                        ...prev,
                        [item.key]: e.target.checked
                      }))}
                      className="mt-1 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-100">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Spirit Beast & Mindscape */}
          {activeSection === 'spirit' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">精神体名称</label>
                  <input
                    type="text"
                    value={spiritName}
                    onChange={(e) => setSpiritName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="小雪团"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">形态物种</label>
                  <input
                    type="text"
                    value={spiritForm}
                    onChange={(e) => setSpiritForm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="光翼琉璃蝶幼态 / 九尾银狐幼崽"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">功能类型</label>
                  <input
                    type="text"
                    value={spiritType}
                    onChange={(e) => setSpiritType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="治愈灵能型 / 全域共鸣型"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">精神域景象 (Mindscape - 自由文本)</label>
                <textarea
                  value={spiritMindscape}
                  onChange={(e) => setSpiritMindscape(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  placeholder="如：阳光明媚的星际紫藤庭院，漂浮着永不凋零的花瓣与微光灵泉"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">精神体当前状态</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['稳定', '疲惫', '过载'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSpiritStatus(st)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        spiritStatus === st
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Read-only Numerical Panel */}
          {activeSection === 'stats' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 text-xs">
                💡 本面板为女主只读动态数值，随着游戏推进（接单疏导、缔结契约、发朋友圈、休息）由游戏内核实时自动更新：
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">当前精神力存量</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                    {guide.mentalPower} / {guide.maxMentalPower}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {guide.isFatigued ? '⚠️ 处于疲劳期，建议回寝殿休息' : '✨ 精神力饱满，接诊状态极佳'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">帝国全域向导声誉</div>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                    {guide.reputation} pts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    声誉越高，更多高阶SS级哨兵将慕名前来挂号
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">累计疏导救赎次数</div>
                  <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                    {guide.completedSessions} 次
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    每次疏导成功将自动生成向导医疗备案报告
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">同生共死契约伴侣</div>
                  <div className="text-xl font-bold font-mono text-purple-300 mt-1">
                    {contractCount} / {guide.maxContracts}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    灵魂共振绑定，不可背离的终生羁绊
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存向导档案配置</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
