import { Guide, Sentinel, Appointment, FriendRequest, Moment, TrendTopic, NarrationLog, GroupChat } from '../types';

export const INITIAL_GUIDE: Guide = {
  name: '安黎',
  age: 21,
  rank: 'S级',
  title: '稀有精神海纯愈者',
  height: '167cm',
  weight: '48kg',
  hairColor: '银白微卷长发',
  eyeColor: '琉璃淡紫瞳',
  temperament: '神圣悲悯中蕴含清冷威仪，令人本能想要俯首臣服',
  beastFeatures: '微尖的晶莹向导耳廓、白皙光洁的后颈腺体与微隐的淡紫向导神纹',
  guidePersonality: '温柔',
  abilityMastery: {
    mentalSoothing: true,
    physicalComfort: true,
    pheromoneSoothing: true,
    contractResonance: true
  },
  spiritBeast: {
    name: '小雪团',
    form: '光翼琉璃蝶幼态',
    type: '治愈灵能型',
    mindscape: '阳光明媚的星际紫藤庭院，漂浮着永不凋零的花瓣与微光灵泉',
    status: '稳定'
  },
  mentalPower: 95,
  maxMentalPower: 100,
  isFatigued: false,
  fatigueLevel: '饱满',
  reputation: 98,
  completedSessions: 12,
  maxContracts: 5,
  skills: [
    { name: '深渊精神潜航', level: 'MAX', desc: '可无视哨兵暴动屏障直接切入其潜意识深渊，温和净化畸变污染。' },
    { name: '微风信息素抚慰', level: 'LV.5', desc: '散发草木甘冽向导素，令焦躁狂暴的雄性在十秒内进入放松状态。' },
    { name: '命定契约共鸣', level: 'MAX', desc: '同生共死强绑定，大幅激发契约哨兵的自愈潜力与双向战斗加成。' },
    { name: '精神屏障构筑', level: 'LV.4', desc: '阻隔狂暴精神污染，保护自身不受任何雄性反噬。' }
  ]
};

export const INITIAL_SENTINELS: Sentinel[] = [
  {
    id: 's_001',
    name: '雷恩 (Leon)',
    code: 'NW-902',
    age: 27,
    race: '雪狼种',
    rank: 'S级',
    military: '第一军团·尖刀突击长',
    avatarText: '狼',
    personality: '暴躁',
    height: '188cm',
    weight: '82kg',
    hairColor: '银白短发',
    eyeColor: '冷灰瞳孔',
    beastFeatures: '毛茸茸的白狼耳，蓬松雪狼尾',
    aura: '冷酷严谨中带着强压抑的隐忍野性',
    compatibility: 91,
    background: '第一军团最年轻的尖刀先锋长，多次以重伤代价阻断畸变兽潮。内心抗拒普通向导的格式化清洗，只对安黎展现温存。',
    spiritBeast: {
      name: '霜牙',
      form: '白化极地雪狼',
      type: '强攻兽型',
      mood: '焦躁撕咬中',
      status: '躁动',
      isDislikedSpecies: false,
      mindscape: '暴风雪肆虐的极北冰原，残破的冰川岩石'
    },
    riotRate: 85,
    contracted: false,
    isAcquainted: true,
    affinity: 66,
    trust: 60,
    possessiveness: 78,
    dislikedSpirit: false,
    appearance: '银白利落短发，左额有一道战役浅疤，身形高大挺拔，作战制服常年扣至最顶端，银灰眸光冷冽。',
    physicalStats: {
      speed: 'SS (音速冲刺)',
      strength: 'S+ (撕裂重甲)',
      endurance: 'S (极地耐寒)',
      pheromones: '冷冽松针与风雪味'
    },
    notes: '剿灭边境S级畸变种巢穴后精神海受创。表面寡言克制、凶猛暴躁，但精神体雪狼极度渴望向导抚摸耳根。'
  },
  {
    id: 's_002',
    name: '塞拉斯 (Silas)',
    code: 'SN-043',
    age: 29,
    race: '黑曼巴蛇种',
    rank: 'SS级',
    military: '军情总局·战略首席顾问',
    avatarText: '蛇',
    personality: '阴湿',
    height: '186cm',
    weight: '75kg',
    hairColor: '微卷墨黑长发',
    eyeColor: '暗金狭长蛇瞳',
    beastFeatures: '隐约浮现的细密墨鳞与冰冷蛇尾虚影',
    aura: '优雅斯文、阴鸷算计、步步为营',
    compatibility: 88,
    background: '身居军情总局要职，执掌整个星系的情报脉络。极擅心理战与信息压制，私下对安黎有近乎病态的观察欲。',
    spiritBeast: {
      name: '暗影',
      form: '环斑黑曼巴蟒',
      type: '剧毒潜行',
      mood: '盘踞戒备',
      status: '躁动',
      isDislikedSpecies: false,
      mindscape: '幽暗沼泽深潭，盘根错节的湿润藤蔓'
    },
    riotRate: 74,
    contracted: false,
    isAcquainted: true,
    affinity: 52,
    trust: 44,
    possessiveness: 89,
    dislikedSpirit: false,
    appearance: '微卷黑发垂至颈后，单片金丝链条眼镜，笑意莫测温和，常穿暗纹长风衣，修长手指戴有抑制指环。',
    physicalStats: {
      speed: 'S (瞬步残影)',
      strength: 'S (绞杀锁骨)',
      endurance: 'SS (耐毒耐蚀)',
      pheromones: '冷沉龙涎香与暗毒苦杏仁'
    },
    notes: '老谋深算，擅长心计。对普通向导抱有防备，但对安黎有极强的探究欲与偏执独占欲。'
  },
  {
    id: 's_003',
    name: '洛文 (Lowen)',
    code: 'SD-119',
    age: 22,
    race: '阴影织网蛛',
    rank: 'A+级',
    military: '先遣特勤营·暗夜斥候长',
    avatarText: '蛛',
    personality: '阴湿',
    height: '176cm',
    weight: '63kg',
    hairColor: '凌乱浅灰发',
    eyeColor: '淡紫重瞳水汽盈盈',
    beastFeatures: '背后可展露幽紫晶状蛛足虚影，指尖生丝',
    aura: '敏感自卑、小心翼翼、易受惊吓',
    compatibility: 94,
    background: '战功赫赫的暗夜斥候，但因精神体是节肢捕鸟蛛，从小受尽排挤与嫌恶。连续被多名向导拒之门外，精神海濒临自毁。',
    spiritBeast: {
      name: '络新',
      form: '暗紫八目捕鸟蛛',
      type: '拟态织网',
      mood: '瑟缩发抖',
      status: '狂暴',
      isDislikedSpecies: true,
      mindscape: '阴湿废墟中破损不堪的银色巨网，四周满是碎石'
    },
    riotRate: 92,
    contracted: false,
    isAcquainted: false,
    affinity: 74,
    trust: 68,
    possessiveness: 55,
    dislikedSpirit: true,
    appearance: '凌乱灰发，睫毛纤长，背部隐现幽紫蛛足骨节虚影。眼神警惕又卑微，指尖缠绕微细的神经抑制丝。',
    physicalStats: {
      speed: 'S+ (无声壁行)',
      strength: 'A (穿刺毒牙)',
      endurance: 'A+ (绝食潜伏)',
      pheromones: '潮湿夜雾与清甜花露'
    },
    notes: '因精神体是节肢节形，屡次被向导临时退单。精神海即将崩溃，深陷被遗弃的自卑，极其渴望向导的接纳。'
  },
  {
    id: 's_004',
    name: '修尔 (Shure)',
    code: 'GD-007',
    age: 28,
    race: '黄金狂狮',
    rank: 'S级',
    military: '帝国近卫总队·铁血总教官',
    avatarText: '狮',
    personality: '忠犬',
    height: '192cm',
    weight: '90kg',
    hairColor: '金棕野性蓬松卷发',
    eyeColor: '琥珀金金曜瞳',
    beastFeatures: '威严金狮耳，有力长尾，胸肌厚实坚硬',
    aura: '霸道悍勇、对女主极度忠顺黏人、对外凶狠残暴',
    compatibility: 99,
    background: '帝国近卫总队长，女主角的第一位同生共死契约哨兵。视安黎为生命唯一信仰，将所有温柔与臣服尽数奉上。',
    spiritBeast: {
      name: '雷霆',
      form: '重鬃狂暴战狮',
      type: '重装战域',
      mood: '安适共鸣',
      status: '稳定',
      isDislikedSpecies: false,
      mindscape: '阳光普照的辽阔金色大草原，微风拂动草浪'
    },
    riotRate: 22,
    contracted: true,
    isAcquainted: true,
    contractPledge: '以狮王之血与生命为誓，终生捍卫吾之向导。你的呼吸即为我的律令。',
    contractMark: '左胸心口处印刻淡金向导精神烙印',
    affinity: 100,
    trust: 100,
    possessiveness: 96,
    dislikedSpirit: false,
    appearance: '金棕野性短发，狮耳微耸，胸膛宽阔坚实，作战服敞开领口，眼底有压抑的野兽霸道与专注。',
    physicalStats: {
      speed: 'S (音爆冲锋)',
      strength: 'SS+ (崩山重击)',
      endurance: 'SS (狂战不竭)',
      pheromones: '烈阳炙烤的干草与狂野琥珀香'
    },
    notes: '女主的第一位契约哨兵。命同生共死。在向导面前宛若温驯大猫，但在任何试图接近女主的雄性面前会瞬间亮出利爪。'
  },
  {
    id: 's_005',
    name: '艾尔维斯 (Elvis)',
    code: 'EL-305',
    age: 25,
    race: '苍蓝游隼',
    rank: 'S级',
    military: '深空星舰巡弋联队·空中王牌',
    avatarText: '隼',
    personality: '傲娇',
    height: '182cm',
    weight: '72kg',
    hairColor: '浅金微翘短发',
    eyeColor: '湛蓝如天空的鹰瞳',
    beastFeatures: '双臂可化苍蓝翼羽，游隼尾羽饰品',
    aura: '傲气凌人、口嫌体正直、自尊心极高',
    compatibility: 89,
    background: '星际空战王牌飞行员，自诩天空主宰。表面上嫌弃向导中心制度繁琐，却偷偷给安黎光脑发申请，嘴硬心软。',
    spiritBeast: {
      name: '裂空',
      form: '苍蓝极速游隼',
      type: '高空猎手',
      mood: '烦躁振翅',
      status: '躁动',
      isDislikedSpecies: false,
      mindscape: '万米高空平流层，穿透云海的刺目阳光'
    },
    riotRate: 79,
    contracted: false,
    isAcquainted: false,
    affinity: 58,
    trust: 52,
    possessiveness: 70,
    dislikedSpirit: false,
    appearance: '浅金微翘发丝，湛蓝如洗的锐利鹰瞳，右肩装饰游隼尾羽，身姿轻盈矫健，嘴角总噙着一丝傲气。',
    physicalStats: {
      speed: 'SSS (跨音速俯冲)',
      strength: 'A+ (高空鹰爪扣击)',
      endurance: 'S (平流层巡航)',
      pheromones: '高空气流与冰冽薄荷'
    },
    notes: '自尊心极高的天空霸主。嘴硬却格外在乎排期与梳理羽毛。'
  },
  {
    id: 's_006',
    name: '柯林 (Colin)',
    code: 'GD-208',
    age: 23,
    race: '金毛猎犬种',
    rank: 'A+级',
    military: '战地重装搜救旅·第一小队长',
    avatarText: '犬',
    personality: '开朗',
    height: '185cm',
    weight: '79kg',
    hairColor: '暖金蓬松短发',
    eyeColor: '澄澈琥珀棕圆眼',
    beastFeatures: '耷拉温软的金犬耳，摇得飞快的毛茸犬尾',
    aura: '阳光直率、热情似火、毫无心机的大男孩',
    compatibility: 93,
    background: '战地搜救前线的中坚力量，性格极为阳光开朗，深得前线战士喜爱。每次从废墟出来都眼巴巴想见安黎，安抚后会立刻摇尾巴加好友！',
    spiritBeast: {
      name: '阿金',
      form: '巨型黄金战犬',
      type: '强攻兽型',
      mood: '期待哼唧',
      status: '躁动',
      isDislikedSpecies: false,
      mindscape: '开满雏菊的向阳草坡，温暖如春'
    },
    riotRate: 76,
    contracted: false,
    isAcquainted: true,
    affinity: 72,
    trust: 70,
    possessiveness: 62,
    dislikedSpirit: false,
    appearance: '暖金蓬松卷发，笑起来露出一对可爱小虎牙，犬耳精神抖擞地立着，制服总是沾着战地泥痕却神采奕奕。',
    physicalStats: {
      speed: 'S (越野突进)',
      strength: 'S (崩岩咬合)',
      endurance: 'SS (超长搜救)',
      pheromones: '晒过阳光的麦香与甘甜焦糖'
    },
    notes: '毫无防备心的忠犬系大男孩。安抚过后总是忍不住摇尾巴，是极少数能让紧张气氛瞬间破冰的阳光存在。'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    sentinelId: 's_001',
    day: 14,
    timeSlot: '上午',
    status: 'pending',
    isEmergency: true,
    method: '精神疏导',
    reason: '第一军团前线急报：雷恩长官暴动指数突破85%警戒线，精神海已出现碎裂征兆，急需S级高阶向导压制！'
  },
  {
    id: 'apt_4', // 同一时段（上午）支持多个哨兵排队申请！
    sentinelId: 's_006',
    day: 14,
    timeSlot: '上午',
    status: 'pending',
    isEmergency: false,
    method: '物理安抚',
    reason: '柯林搜救队长刚从黑渊掩埋区拖回3名负伤队员，感官严重过载，恳请上午加塞安抚！'
  },
  {
    id: 'apt_2',
    sentinelId: 's_003',
    day: 14,
    timeSlot: '下午',
    status: 'pending',
    isEmergency: false,
    method: '物理安抚',
    reason: '洛文斥候长已连续排队42天。因其精神体为节肢蛛形，前序向导皆在诊室门前退单。精神体出现哀鸣自残。'
  },
  {
    id: 'apt_3',
    sentinelId: 's_005',
    day: 14,
    timeSlot: '下午', // 下午同样排队多个
    status: 'pending',
    isEmergency: false,
    method: '信息素安抚',
    reason: '深空巡航歼灭任务刚结束，游隼精神体无法降落。请求向导素远距离气味引导疏导。'
  }
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'fr_1',
    sentinelId: 's_002',
    verifyMsg: '向导阁下，听说您今早在调配委员会驳回了对高危哨兵强制脑抑制的提案。我想我们有些共同理念值得深谈。',
    time: '星历 327.04.14 07:45',
    status: 'pending'
  },
  {
    id: 'fr_2',
    sentinelId: 's_005',
    verifyMsg: '喂，安黎向导。别听协会那帮老头胡扯，我的精神海很稳定，只需要你帮我梳理一下羽毛就行……',
    time: '星历 327.04.14 08:10',
    status: 'pending'
  }
];

export const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'm_1',
    authorId: 's_004',
    author: '修尔 (Shure)',
    avatarText: '狮',
    time: '25分钟前',
    content: '清晨的安抚室走廊，有些没规矩的家伙信息素溢散得像发情的野兽。奉劝某位蛇类顾问收敛点，安黎是我的契约向导，不是你们投机取巧的目标。',
    isContracted: true,
    visibility: 'public',
    likes: 38,
    likedByGuide: false,
    comments: [
      { id: 'mc_1', author: '副官莫里斯', text: '教官，训练场的沙袋都被你打爆三个了……', time: '20分钟前' },
      { id: 'mc_2', author: '塞拉斯 (Silas)', authorId: 's_002', text: '狂狮未免太焦躁了。同生共死契约固然令人敬畏，但向导阁下有权接纳至多五名守护者。', time: '12分钟前' },
      { id: 'mc_3', author: '修尔 (Shure)', authorId: 's_004', replyTo: '塞拉斯 (Silas)', text: '塞拉斯，你再敢用阴冷的信息素靠近她半步，我把你的蛇尾剁下来泡酒。', time: '8分钟前' }
    ]
  },
  {
    id: 'm_2',
    authorId: 'guide_assoc',
    author: '帝国向导权益管理局·官方',
    avatarText: '盾',
    time: '2小时前',
    content: '【星域通告】鉴于近期黑渊变异种潮汐爆发，重申《向导神圣法案》第7条：严禁哨兵强迫向导疏导。向导拥有无条件根据个人相性（包括精神体形态）拒绝预约之豁免权。',
    visibility: 'public',
    likes: 412,
    likedByGuide: true,
    comments: [
      { id: 'mc_4', author: '艾尔维斯 (Elvis)', authorId: 's_005', text: '有些懦弱向导连鸟类的振翅声都吓得尖叫，根本配不上顶级猛禽。', time: '1小时前' },
      { id: 'mc_5', author: '柯林 (Colin)', authorId: 's_006', replyTo: '艾尔维斯 (Elvis)', text: '艾尔维斯你别这么说嘛，安黎向导人特别好，昨天还摸阿金的头了！', time: '45分钟前' },
      { id: 'mc_6', author: '艾尔维斯 (Elvis)', authorId: 's_005', replyTo: '柯林 (Colin)', text: '蠢狗闭嘴，谁准你叫她名字这么亲热的！', time: '30分钟前' }
    ]
  },
  {
    id: 'm_3',
    authorId: 's_001',
    author: '雷恩 (Leon)',
    avatarText: '狼',
    time: '4小时前',
    content: '极北防线积雪三尺。任务达成。霜牙在狂风里守了一整夜，它说它闻到了南边温室里的花香。',
    visibility: 'public',
    likes: 89,
    likedByGuide: false,
    beastPhotoDesc: '[雪地中白狼昂首凝望极光全息缩略图]',
    comments: [
      { id: 'mc_7', author: '塞拉斯 (Silas)', authorId: 's_002', text: '雷恩突击长真是诗情画意，暴动值都飙到85%了，还有心思在这闻花香？', time: '3小时前' },
      { id: 'mc_8', author: '雷恩 (Leon)', authorId: 's_001', replyTo: '塞拉斯 (Silas)', text: '管好你自己的情报局。', time: '2小时前' }
    ]
  }
];

export const INITIAL_TRENDS: TrendTopic[] = [
  {
    id: 't_1',
    tag: '爆',
    title: 'S级向导安黎接手狂暴高危序列，推行无痛温柔疏导法',
    heat: '394万',
    summary: '相较于主流向导协会推行的粗暴精神镇定，安黎向导以神迹般的包容海治愈多名前线功勋哨兵，引发星网热烈拥护。',
    postsCount: 14200
  },
  {
    id: 't_2',
    tag: '热',
    title: '第一军团先锋雷恩暴动指数破临界，命悬一线',
    heat: '271万',
    summary: '军方紧急调用高阶安抚通道，传闻多名向导因承受不住S级狼种反噬而退出，安黎向导光脑预约已被列为最高优先级。',
    relatedSentinelId: 's_001',
    postsCount: 8900
  },
  {
    id: 't_3',
    tag: '警',
    title: '黑渊三号裂隙畸形种暴增，哨兵战损与精神崩溃率上浮22%',
    heat: '198万',
    summary: '帝国雄雌比已达100:1.3，高级向导紧缺问题再次成为军部最高决议议题。',
    postsCount: 6540
  },
  {
    id: 't_4',
    tag: '新',
    title: '节肢类精神体哨兵生存现状调查：常年被拒遭致自毁悲剧',
    heat: '124万',
    summary: '蜘蛛、蜈蚣等异形精神体在向导群体中受嫌恶率达94%，专家呼吁建立异形精神体专用安抚仓。',
    relatedSentinelId: 's_003',
    postsCount: 4320
  }
];

export const INITIAL_NARRATIONS: NarrationLog[] = [
  {
    id: 'n_init_1',
    stardate: '星历 327.04.14 上午',
    category: '随笔',
    text: '清晨的向导公馆笼罩在淡金色的星辉中。你整理好了精神触手，终端光脑亮起，新的预约申请已堆叠在待办列表中。'
  },
  {
    id: 'n_init_2',
    stardate: '星历 327.04.14 上午',
    category: '契约',
    text: '修尔在走廊外巡弋了一圈，他的狂狮精神体将一枚刚猎获的星光晶石衔放在你的门垫前，随后在门缝处留下一声低沉温驯的呼噜。'
  },
  {
    id: 'n_init_3',
    stardate: '星历 327.04.14 上午',
    category: '世界动态',
    text: '【星域战报】极北冰原哨站遭遇第三波变异雪怪袭击，雷恩率第一尖刀队完成清剿，但狂暴辐射指数骤升。'
  }
];

export const INITIAL_GROUP_CHATS: GroupChat[] = [
  {
    id: 'g_fleet_1',
    name: '第一军团·前线战术协同群',
    type: 'fleet',
    desc: '军团内部加密信道，用于战况播报与后勤安抚报备',
    unreadCount: 2,
    membersCount: 128,
    messages: [
      {
        id: 'gm_1',
        sender: 'sentinel',
        senderName: '副官柯林',
        text: '雷恩长官的机甲刚停在机库，舱门打开时驾驶室里全是狂暴血腥味。长官强撑着不肯注射电击镇静剂。',
        time: '08:15'
      },
      {
        id: 'gm_2',
        sender: 'sentinel',
        senderName: '近卫队员B',
        text: '幸好安黎向导今天的值班终端在线！只要安黎向导同意接单，头儿就有救了！',
        time: '08:16'
      }
    ]
  },
  {
    id: 'g_assoc',
    name: '向导保护协会·特级理事频道',
    type: 'association',
    desc: '官方通报与安全协定公文流转',
    unreadCount: 0,
    membersCount: 45,
    messages: [
      {
        id: 'gm_3',
        sender: 'system',
        text: '【协会警示】近期暴动潮凶猛，请各S级向导严格把控每日疏导节奏，禁止超负荷透支。',
        time: '07:00'
      }
    ]
  },
  {
    id: 'g_gossip',
    name: '星网秘密八卦站·哨兵狂热分流',
    type: 'gossip',
    desc: '匿名匿名匿名！禁止暴露长官真实编号！',
    unreadCount: 4,
    membersCount: 890,
    messages: [
      {
        id: 'gm_4',
        sender: 'sentinel',
        senderName: '匿名夜行翼',
        text: '兄弟们，听说近卫营总教官修尔已经跟那位神级向导绑定了？！真的假的？！',
        time: '08:20'
      },
      {
        id: 'gm_5',
        sender: 'sentinel',
        senderName: '匿名小野猫',
        text: '千真万确！那天在军部门口，狮王身上的精神印记金灿灿的，闪瞎了一帮单身汉的钛合金狗眼！',
        time: '08:22'
      },
      {
        id: 'gm_6',
        sender: 'sentinel',
        senderName: '匿名眼镜蛇',
        text: '呵，绑定一个又如何？向导法案写得清清楚楚，高级向导至多可接纳五名守护者。剩下的四个名额，各凭本事。',
        time: '08:25'
      }
    ]
  }
];

export const WORLDVIEW_CODEX = [
  {
    title: '哨兵 (Sentinel)',
    content: '拥有超越常人的感官与超强战斗力的战士，负责在黑渊与星际前线清剿畸变种与变异种。感官极度敏锐，但长期战斗会导致精神海污染杂质堆积，引发狂暴、兽化、直至精神核碎裂自毁。'
  },
  {
    title: '向导 (Guide)',
    content: '拥有澄澈精神力与安抚信息素的治愈者。能通过精神触手抚平哨兵精神海的风暴，阻断兽化狂暴。在星际兽世中雄雌比极度悬殊（约100:1），向导身份尊崇无比，受到全星际最高规格法律保护。'
  },
  {
    title: '精神体 (Spirit Beast)',
    content: '哨兵与向导精神图景的具象化形态。其性格与种族直接映射主人内心的潜意识。如雪狼、巨蟒、狂狮、游隼等。部分向导对特定精神体（如节肢类蜘蛛、爬行类毒虫）存在本能排斥，这在向导法规中享有绝对拒收豁免权。'
  },
  {
    title: '同生共死契约 (Life-Binding Contract)',
    content: '高级向导与哨兵之间的终极命脉绑定。女主最多可缔结5位契约哨兵。契约一旦生成，两人生命同频、同生同死、生理强依赖，触发独一无二的“契约共鸣”神效。契约后好感与占有等世俗数值不再显现，直接进入灵魂共生。'
  },
  {
    title: '四大疏导机制',
    content: '1. 精神疏导：向导精神潜入哨兵精神海深层洗涤，清扫污染；\n2. 物理安抚：通过肌肤触碰（摸兽耳、尾巴基部、腺体）释放体表向导素；\n3. 信息素安抚：高浓度向导素注射，带来战栗快感与高效平息；\n4. 契约共鸣：契约哨兵专属，以灵魂共振瞬间化解狂暴。'
  },
  {
    title: '性格标签与AI反应机制',
    content: '哨兵具备开朗、阴湿、暴躁、忠犬、傲娇、高冷等鲜明性格标签。性格直接决定其在疏导舱中的言行反应、是否主动申请好友、私信交流风格以及在星网朋友圈评论区与其他哨兵的雄竞互掐。'
  }
];
