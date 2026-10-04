import { Guide, Sentinel, SoothingMethod, GuidePersonalityTag, PersonalityTag } from '../types';

export interface SoothingOption {
  id: string;
  styleTag: string; // e.g. '强势风格', '温柔抚慰', '精神体共鸣', '体表亲昵', '果断速控'
  text: string; // Heroine's spoken line / action
  desc: string; // Tactical description / effect note
  guideStyle: GuidePersonalityTag;
}

export interface SoothingStageData {
  stage: 1 | 2 | 3;
  stageName: string;
  stageDesc: string;
  sentinelPoseDesc: string;
  options: SoothingOption[];
}

export interface SoothingReactionResult {
  actionChosen: SoothingOption;
  sentinelSpokenText: string;
  sentinelActionDesc: string;
  sentimentScore: 'high' | 'normal' | 'reluctant';
  affectionBonus: number;
  trustBonus: number;
}

export interface SoothingEndingChoice {
  id: 'leave' | 'rest' | 'dine';
  title: string;
  spokenLine: string;
  desc: string;
  affectionBonus: number;
  trustBonus: number;
  triggerEvent: string;
}

/**
 * AI Interface Reservation (预留的大模型接入参数与 Prompt 构建函数)
 * 未来接入真实 Gemini / LLM API 时，可直接调用此函数获取结构化上下文
 */
export interface AiSoothingPromptParams {
  guide: {
    name: string;
    rank: string;
    personality: GuidePersonalityTag;
    spiritBeastName?: string;
    spiritBeastForm?: string;
  };
  sentinel: {
    name: string;
    code: string;
    race: string;
    personality: PersonalityTag;
    riotRate: number;
    spiritBeastName: string;
    spiritBeastForm: string;
    isDislikedSpecies?: boolean;
    affinity: number;
    trust: number;
  };
  method: SoothingMethod;
  stage: 1 | 2 | 3;
  stageContext: string;
  playerChosenOption?: string;
}

export function buildAiSoothingPrompt(params: AiSoothingPromptParams): string {
  return `
[星际兽世视觉小说·向导安抚情境]
【向导信息】姓名: ${params.guide.name}, 等级: ${params.guide.rank}, 性格: ${params.guide.personality}, 精神体: ${params.guide.spiritBeastName || '小雪团'}(${params.guide.spiritBeastForm || '光翼琉璃蝶'})
【哨兵信息】姓名: ${params.sentinel.name}[${params.sentinel.code}], 种族: ${params.sentinel.race}, 性格: ${params.sentinel.personality}, 暴动阈值: ${params.sentinel.riotRate}%, 精神体: ${params.sentinel.spiritBeastName}(${params.sentinel.spiritBeastForm})
【当前安抚方式】${params.method}
【当前安抚阶段】第${params.stage}阶段: ${params.stageContext}
${params.playerChosenOption ? `【玩家(向导)选择的台词与行动】${params.playerChosenOption}` : ''}
请以符合哨兵【${params.sentinel.personality}】性格人设与半兽化生理本能的方式，生成其生动台词与动作细节（包含兽耳、兽尾、呼吸、眼神变化）。
`.trim();
}

/**
 * Stage 1: Opening Preparation Options
 * Dynamically generated based on Guide Personality + Sentinel Personality + Soothing Method
 */
export function generateStage1Options(
  guide: Guide, 
  sentinel: Sentinel, 
  method: SoothingMethod
): SoothingOption[] {
  const guidePers = guide.guidePersonality || '温柔';
  const sentinelPers = sentinel.personality;
  const spiritName = sentinel.spiritBeast?.name || '精神体';
  const guideSpiritName = guide.spiritBeast?.name || '小雪团';

  const options: SoothingOption[] = [];

  // Option A: Primary Personality Driven
  if (guidePers === '强势') {
    options.push({
      id: 'opt_1_dominant',
      styleTag: '【强势掌控】霸权命令',
      guideStyle: '强势',
      text: sentinelPers === '高冷' || sentinelPers === '暴躁'
        ? `“躺下，摘掉战术目镜。不要让我说第二遍。”`
        : `“收起你那些爪子，放松背脊，现在由我全权接管你的神智。”`,
      desc: '以S级神圣威压直接击溃其戒备本能，建立向导主导权。'
    });
  } else if (guidePers === '温柔') {
    options.push({
      id: 'opt_1_gentle',
      styleTag: '【温柔体恤】暖意抚慰',
      guideStyle: '温柔',
      text: sentinelPers === '阴湿'
        ? `“别害怕，把手给我。无论你的精神海深处有什么，我都不会推开你。”`
        : `“辛苦了，这一路战斗很痛苦吧？闭上眼睛，把你的精神海全部交给我。”`,
      desc: '以如丝绵密的治愈包容感消除其濒临崩溃的恐惧。'
    });
  } else if (guidePers === '腹黑') {
    options.push({
      id: 'opt_1_scheming',
      styleTag: '【腹黑戏谑】拿捏弱点',
      guideStyle: '腹黑',
      text: sentinelPers === '傲娇'
        ? `“嘴上说不需要向导，耳朵抖得这么厉害？既然进了我的安抚舱，可就由不得你了。”`
        : `“让我看看，前线赫赫有名的猛兽，在向导素面前到底能撑几秒呢？”`,
      desc: '言语调弄直戳软肋，令哨兵心跳过载、无力反抗。'
    });
  } else if (guidePers === '清冷') {
    options.push({
      id: 'opt_1_aloof',
      styleTag: '【清冷高效】神圣肃穆',
      guideStyle: '清冷',
      text: `“平躺在神经耦合床上，深呼吸三次。整个过程保持安静，痛就抓紧手环。”`,
      desc: '冷静自持、专业决绝，不带有余温度却具备极致的安全感。'
    });
  } else {
    // 活泼
    options.push({
      id: 'opt_1_lively',
      styleTag: '【灵动活泼】缓解紧张',
      guideStyle: '活泼',
      text: `“放轻松放轻松！我又不会吃了你~ 来，先冲你家向导笑一个，放松神经核！”`,
      desc: '用灵巧诙谐的笑容驱散舱内紧绷压抑的杀伐血气。'
    });
  }

  // Option B: Complementary Approach
  if (guidePers !== '温柔') {
    options.push({
      id: 'opt_1_gentle_alt',
      styleTag: '【温声引导】卸下防备',
      guideStyle: '温柔',
      text: `“放轻松，把紧绷的兽化特征收一收……把你的神经海交给我，我在这里。”`,
      desc: '切换柔和语调，让哨兵潜意识放下抵触与战备应激。'
    });
  } else {
    options.push({
      id: 'opt_1_firm_alt',
      styleTag: '【坚决威严】不容置疑',
      guideStyle: '强势',
      text: `“不要抗拒我的精神触手。越是强撑，神经逆流只会伤及你自己。”`,
      desc: '展露向导不可动摇的医者威仪，强行止住其精神紊乱。'
    });
  }

  // Option C: Spirit Beast / Method Specific Option
  if (method === '精神疏导') {
    options.push({
      id: 'opt_1_spirit_call',
      styleTag: '【精神体唤醒】双核引流',
      guideStyle: '温柔',
      text: `“先召唤出你的精神体【${spiritName}】，让我和它先行触碰沟通，梳理表层乱流。”`,
      desc: `释放向导精神体【${guideSpiritName}】与对方异兽先行建立安适嗅探。`
    });
  } else if (method === '物理安抚') {
    options.push({
      id: 'opt_1_physical_prep',
      styleTag: '【触体预检】抚摩后颈',
      guideStyle: '温柔',
      text: `“转过身去，先让我碰一下你后颈滚烫的信息素腺体，测定过载热度。”`,
      desc: '直接进行肌肤层面的体表初探，指尖微触即激起雄性战栗。'
    });
  } else if (method === '信息素安抚') {
    options.push({
      id: 'opt_1_pheromone_prep',
      styleTag: '【气味共鸣】释放向导素',
      guideStyle: '清冷',
      text: `“解开你的作战服领口，嗅闻我掌心的冷香，慢慢中和血液里的焦躁。”`,
      desc: '弥漫清冽向导素雾气，令其嗅觉受体瞬间苏醒沉沦。'
    });
  } else {
    // 契约共鸣
    options.push({
      id: 'opt_1_contract_prep',
      styleTag: '【印记同频】灵魂启誓',
      guideStyle: '强势',
      text: `“看着我，激活心口的同生共死契约印记。两具灵魂，本该同频。”`,
      desc: '催动契约金紫神纹，心跳共振瞬间消弭一切隔阂。'
    });
  }

  return options;
}

/**
 * Stage 1 Sentinel Reaction Generation
 */
export function getStage1Reaction(sentinel: Sentinel, chosenOption: SoothingOption): {
  spokenText: string;
  actionDesc: string;
} {
  const p = sentinel.personality;

  if (p === '高冷') {
    if (chosenOption.guideStyle === '强势') {
      return {
        spokenText: `“……明白。有劳向导。我绝不会让狂暴本能冒犯到您。”`,
        actionDesc: `他冷峻的下颌线微微绷紧，沉默地闭上狭长双眸，顺从地仰躺在安抚床上，唯有指关节因为克制剧痛而略显发白。`
      };
    } else {
      return {
        spokenText: `“多谢……狂暴声潮一直在颅骨内叫嚣，请随意切入我的精神域。”`,
        actionDesc: `他冷漠的神色微微软化了一瞬，喉结轻微滑动，狼狈地避开你清澈专注的视线。`
      };
    }
  }

  if (p === '暴躁') {
    if (chosenOption.guideStyle === '强势') {
      return {
        spokenText: `“啧……！别命令我！……不过，看在是你的份上，老子躺下就是了！”`,
        actionDesc: `他喉底溢出一声压抑的低吼，狼耳警戒地向后压平，虽然嘴上骂骂咧咧，身体却极为老实地重重倒进被褥里，偏过头粗重喘息。`
      };
    } else {
      return {
        spokenText: `“离我这么近……你就不怕我狂暴失控撕碎了你吗？！……该死，别用这种眼神看着我……”`,
        actionDesc: `他浑身肌肉紧绷如铁石，利爪死死扣住床沿几乎掐出裂痕，最终在你的注视下狼狈闭眼，尖耳微微泛红。`
      };
    }
  }

  if (p === '阴湿') {
    if (sentinel.dislikedSpirit) {
      return {
        spokenText: `“向导大人……我、我的精神体很丑陋、多足且危险……如果您觉得恶心，请务必提前告诉我……”`,
        actionDesc: `他单薄的胸膛剧烈起伏，苍白的十指死死绞着病服衣角，眼尾泛着湿润的潮红，像是一只随时准备被抛弃却又卑微渴求施舍的流浪兽。`
      };
    } else {
      return {
        spokenText: `“呵呵……被向导用这种命令的眼神注视着，真是让人脊椎发麻呢。请尽情……对我做任何想做的事吧。”`,
        actionDesc: `金丝眼镜后狭长幽暗的蛇瞳微眯，他顺从地褪去手套，苍白的指尖试探性地虚悬在你的裙摆边缘，呼吸带毒般滚烫。`
      };
    }
  }

  if (p === '傲娇') {
    return {
      spokenText: `“哼！本少爷可不是因为扛不住狂暴才来的，是军部那些老顽固死活要我挂号！喂……你动作轻一点，弄疼我了本少爷可不轻饶！”`,
      actionDesc: `他高傲地昂着下巴别开视线，耳尖通红，羽翼/尾巴却不自觉地在床沿轻轻摆动，泄露出内心极度的紧张与期待。`
    };
  }

  if (p === '忠犬') {
    return {
      spokenText: `“安黎，我的神明。雷霆的一切任凭您处置。只要您的指尖落下，我的生命与战骨便尽数归于您。”`,
      actionDesc: `庞大的金狮种身躯单膝跪俯于床侧，虔诚而温驯地将额头贴向你的手掌，甚至主动拉开领口敞开毫无防备的后颈。`
    };
  }

  // 开朗
  return {
    spokenText: `“好耶！终于排到安黎向导的诊室啦！金毛这几天想你想得尾巴都快摇脱臼了，您尽管下手，我皮糙肉厚绝不怕疼！”`,
    actionDesc: `他眉飞色舞地笑着翻身躺好，毛茸茸的金色犬耳欢快地扑棱两下，满眼炽热信任地望着你。`
  };
}

/**
 * Stage 2: Deep Soothing Intervention Options
 * Mid-soothing scenario where mental sea fluctuates or resists
 */
export function generateStage2Options(
  guide: Guide, 
  sentinel: Sentinel, 
  method: SoothingMethod
): SoothingOption[] {
  const guideSpiritName = guide.spiritBeast?.name || '小雪团';

  return [
    {
      id: 'opt_2_pheromone',
      styleTag: '【高纯注入】指尖覆按后颈·强效向导素',
      guideStyle: '强势',
      text: `“按住他的双肩将其压向怀中，掌心覆住发烫腺体，强力注入清冷向导素。”`,
      desc: '消耗较多精神力，但能以雷霆之势撕裂黑色风暴，令其陷入深层沉沦战栗。'
    },
    {
      id: 'opt_2_spirit',
      styleTag: '【精神体共鸣】潜入精神图景·温柔抚平',
      guideStyle: '温柔',
      text: `“释放精神体【${guideSpiritName}】，轻落在其精神图景的核心裂隙处，挥洒治愈磷光。”`,
      desc: '以双精神体深度互动温柔濯洗，修复神经海裂痕，极大增进信任度。'
    },
    {
      id: 'opt_2_whisper',
      styleTag: '【温软耳语】倾身低抚·言语动作抚慰',
      guideStyle: '温柔',
      text: `“凑近他发烫的耳廓轻抚其敏锐绒毛，温声道：‘我在这里，看着我，不要怕。’”`,
      desc: '近距离体温与气息交融，以向导独有的安宁抚平野兽暴动狂躁。'
    }
  ];
}

/**
 * Stage 2 Sentinel Reaction Generation
 */
export function getStage2Reaction(sentinel: Sentinel, chosenOption: SoothingOption): {
  spokenText: string;
  actionDesc: string;
} {
  const p = sentinel.personality;

  if (p === '阴湿') {
    if (chosenOption.id === 'opt_2_pheromone') {
      return {
        spokenText: `“哈啊……！太浓郁了……向导素渗入骨髓的滋味，果然比最烈的毒药还要让人上瘾……再给我多一点……求您……”`,
        actionDesc: `他因直冲颅顶的战栗而仰起脆弱脖颈，冰凉纤细的手指死死攥住向导的衣角，蛇尾不受控地无声缠上了向导的脚踝，眼角泪光闪烁。`
      };
    } else if (chosenOption.id === 'opt_2_spirit') {
      return {
        spokenText: `“您的精神体……居然没有嫌弃我的精神海……络新在发抖，它在为您哭泣……”`,
        actionDesc: `黑色阴湿的精神域裂隙中，原本狰狞的多足巨影蜷缩成温顺的形态，小心翼翼地用丝囊蹭向向导的灵兽，生怕惊扰了这一刻神圣的安适。`
      };
    } else {
      return {
        spokenText: `“在耳边这样说话……您是在故意折磨我吗……安黎向导，您知道雄性在狂暴边缘被这样抚摸会有多贪婪吗……”`,
        actionDesc: `他眼瞳泛起深邃暗芒，整个人几乎将脸埋入向导的颈窝，呼吸滚烫湿润，贪婪嗅闻每一丝属于你的气息。`
      };
    }
  }

  if (p === '傲娇') {
    if (chosenOption.id === 'opt_2_pheromone') {
      return {
        spokenText: `“唔……！你、你往哪按呢！……头不疼了是没错，但……但这种感觉太奇怪了，快住手啊混蛋！”`,
        actionDesc: `他浑身触电般轻颤，嘴上拼命抗议，身子却像被抽空了骨头一般瘫软，羽翼紧紧将向导半掩在怀里不肯放手。`
      };
    } else {
      return {
        spokenText: `“哼……算你有两把刷子……裂空的羽毛确实顺畅多了……喂，别摸我尾巴，那里很敏感的！”`,
        actionDesc: `他别过脸咬着唇瓣，耳根红得像要滴血，羽冠彻底垂伏顺滑，任由向导纤柔的手指一下下梳理着紊乱的神经线。`
      };
    }
  }

  if (p === '暴躁') {
    return {
      spokenText: `“呃啊……！呼……呼……狂暴的绞痛全停了……该死，别用这种怜悯的眼神看着我……雪狼想把最软的肚皮露给你揉，这太丢人了……！”`,
      actionDesc: `凶戾暴烈的獠牙彻底收拢，原本紧绷的白狼耳无力地耷拉下来，庞大的狼躯彻底卸去戒备，用毛茸茸的头颅拼命蹭着向导的掌心发出委屈的呜咽。`
    };
  }

  if (p === '忠犬') {
    return {
      spokenText: `“吾爱……只要你的指尖拂过，我的血肉、精神与灵魂便全盘臣服。为您战死是我唯一的归宿，但为您活着……更是至高无上的恩赐。”`,
      actionDesc: `金狮眼眶微热，巨大的兽爪小心翼翼地收起每一颗尖甲，生怕划破向导柔嫩的皮肤，喉咙里发出滚雷般绵长的舒服呼噜声。`
    };
  }

  if (p === '高冷') {
    return {
      spokenText: `“……难以置信的澄澈度。所有的神经剧痛在刹那间冰消瓦解。安黎向导，多谢……此恩，我定用命来报。”`,
      actionDesc: `常年清冷如高山冰雪的面庞泛起几分虚弱的潮红，他极力压抑着喉间溢出的轻哼，清冷面具破裂，眼底翻涌着深邃而隐忍的情愫。`
    };
  }

  // 开朗
  return {
    spokenText: `“哇啊啊——太爽快啦！感觉脑子里的电线短路全被向导大人修好了！阿金舒服得尾巴停不下来啦！”`,
    actionDesc: `他像一只大金毛犬一样开心地抱住向导的手臂蹭个不停，金色的犬耳欢快地扑棱打滚，整个安抚舱被愉悦阳光的气氛填满。`
  };
}

/**
 * Stage 3: Ending Options (Exact 3 choices as specified by PRD)
 */
export function getStage3EndingOptions(): SoothingEndingChoice[] {
  return [
    {
      id: 'leave',
      title: '1. 直接让他离开 (恪守边界 · 保持距离)',
      spokenLine: `“你的暴动值已经恢复稳定阈值，本次疏导圆满结束，你可以离开了。”`,
      desc: '公事公办保持向导神圣距离，耗时短，好感与信任平稳增长(+5)，无额外留宿剧情。',
      affectionBonus: 5,
      trustBonus: 5,
      triggerEvent: 'standard_depart'
    },
    {
      id: 'rest',
      title: '2. 让他歇一下 (体贴关切 · 留宿休整)',
      spokenLine: `“精神海刚平复，先在旁边的休息舱躺着睡一会儿吧，等你完全恢复再走。”`,
      desc: '温柔体恤，大幅提升好感(+15)与信任(+12)，触发哨兵在向导公馆熟睡休息、发朋友圈感谢等专属事件！',
      affectionBonus: 15,
      trustBonus: 12,
      triggerEvent: 'rest_in_salon'
    },
    {
      id: 'dine',
      title: '3. 聊聊/去吃个饭 (深度破冰 · 触发雄竞)',
      spokenLine: `“安抚消耗了不少体力，要不要一起去公馆食堂吃个便饭再走？”`,
      desc: '极大幅提升好感(+25)与信任(+20)，触发共进晚餐/约会剧情，可能引起其他哨兵关注与“雄竞吃醋”事件！',
      affectionBonus: 25,
      trustBonus: 20,
      triggerEvent: 'dine_together'
    }
  ];
}

/**
 * Stage 3 Sentinel Reaction based on Ending Choice
 */
export function getStage3EndingReaction(
  sentinel: Sentinel, 
  choice: SoothingEndingChoice
): { spokenText: string; actionDesc: string; narratorSummary: string } {
  const p = sentinel.personality;

  if (choice.id === 'leave') {
    return {
      spokenText: p === '傲娇'
        ? `“走就走！哼，本少爷回去还要训练呢……谢、谢谢你的疏导就是了！”`
        : p === '阴湿'
        ? `“……遵命。多谢向导阁下的施舍，我这就离开……绝不脏了您的寝室。”`
        : `“是。遵从向导医嘱，我先行告退。第一前线随时等候您的差遣。”`,
      actionDesc: `他迅速整理好战术军装，向你郑重行了一个军礼，但眼中隐隐有一丝未能多停留的遗憾与失落。`,
      narratorSummary: `【疏导圆满】你保持了高级向导的标准边界，哨兵【${sentinel.name}】状态回稳后郑重辞行，返回军部驻地。`
    };
  }

  if (choice.id === 'rest') {
    return {
      spokenText: p === '开朗'
        ? `“好耶！谢谢向导！那我就不客气啦，在您这里睡一觉肯定能做个甜甜的美梦！”`
        : p === '暴躁'
        ? `“……算你体贴。老子确实浑身没力气……就睡半小时，别吵我。”`
        : p === '阴湿'
        ? `“让我……睡在您的房间侧卧吗？……这难道不是梦吗……我真的可以留下来吗？”`
        : `“多谢向导关怀。能在此处静养，是属下莫大的荣幸。”`,
      actionDesc: `他卸下沉重的防弹战甲与佩刀，小心翼翼地侧卧在向导寝厅的软榻上。空气中弥漫的向导素让他紧绷已久的神经彻底松懈，很快便发出了安稳均匀的微鼾。`,
      narratorSummary: `【温存留宿】你留下了虚弱的【${sentinel.name}】在公馆侧榻休息。他闻着你的向导素安稳入眠，眼角紧绷的杀气尽数化为温驯。`
    };
  }

  // choice.id === 'dine'
  return {
    spokenText: p === '傲娇'
      ? `“吃、吃饭？！你……你这是在约我吗？！……咳，既然你诚心诚意邀请，本少爷就勉为其难陪你吃一顿好了！”`
      : p === '忠犬'
      ? `“能与安黎同桌共餐……属下万死不辞！公馆后厨有最新采摘的甜果，请务必让我为您切好剥皮！”`
      : p === '阴湿'
      ? `“一起吃饭……？被其他人看到的话，他们会嫉妒得发狂的吧……呵呵，真想看看他们嫉恨扭曲的嘴脸呢。”`
      : p === '暴躁'
      ? `“吃饭？正好老子饿得前胸贴后背了！走，军部食堂谁敢抢你的餐位，老子一爪子拍碎他的盘子！”`
      : `“同您共进便饭？这是我的荣幸。请允许我为您引路。”`,
    actionDesc: `他眼中的灰暗一扫而空，眸光亮得惊人，立刻利落地替你拉开舱门，高大的身躯亦步亦趋护在你的身侧，满脸都是掩饰不住的自豪与依恋。`,
    narratorSummary: `【共进晚餐与雄竞萌芽】你与【${sentinel.name}】并肩步入公馆餐厅。两人有说有笑的亲密神态引来要塞多名军团哨兵的暗中注视与议论，空气中弥漫着淡淡的醋意！`
  };
}
