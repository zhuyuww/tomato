import { Moment, MomentComment, Sentinel, Guide } from '../types';

/**
 * Keywords and sentiment categorization for Guide's Moments
 */
export function analyzeMomentSentiment(text: string): {
  type: 'tired' | 'sweet' | 'scenery' | 'beast' | 'battle' | 'daily';
  keywords: string[];
} {
  const lower = text.toLowerCase();
  if (lower.includes('累') || lower.includes('透支') || lower.includes('疲惫') || lower.includes('头疼') || lower.includes('休息') || lower.includes('虚弱')) {
    return { type: 'tired', keywords: ['透支', '休息'] };
  }
  if (lower.includes('甜') || lower.includes('糖') || lower.includes('营养剂') || lower.includes('馋') || lower.includes('好吃') || lower.includes('点心')) {
    return { type: 'sweet', keywords: ['甜', '营养剂'] };
  }
  if (lower.includes('摸') || lower.includes('揉') || lower.includes('毛') || lower.includes('耳朵') || lower.includes('尾巴') || lower.includes('精神体')) {
    return { type: 'beast', keywords: ['精神体', '摸毛'] };
  }
  if (lower.includes('花') || lower.includes('草') || lower.includes('阳光') || lower.includes('温室') || lower.includes('雪') || lower.includes('星空') || lower.includes('风景')) {
    return { type: 'scenery', keywords: ['温室', '风景'] };
  }
  if (lower.includes('战') || lower.includes('前线') || lower.includes('怪') || lower.includes('畸变') || lower.includes('安全') || lower.includes('巡防')) {
    return { type: 'battle', keywords: ['前线', '防务'] };
  }
  return { type: 'daily', keywords: ['日常'] };
}

/**
 * Generates an organic, rich thread of Sentinel comments AND Sentinel-to-Sentinel cross-replies!
 */
export function generateMomentInteractions(
  momentContent: string,
  guide: Guide,
  sentinels: Sentinel[]
): { likesGain: number; comments: MomentComment[] } {
  const sentiment = analyzeMomentSentiment(momentContent);
  const comments: MomentComment[] = [];

  // Pick characters if available
  const leon = sentinels.find(s => s.id === 's_001') || sentinels[0]; // 暴躁 (雪狼)
  const silas = sentinels.find(s => s.id === 's_002') || sentinels[1]; // 阴湿 (黑曼巴蛇)
  const lowen = sentinels.find(s => s.id === 's_003') || sentinels[2]; // 弱势/忠犬 (工蜂/蛛)
  const shure = sentinels.find(s => s.id === 's_004') || sentinels[3]; // 傲娇/狂狮
  const elvis = sentinels.find(s => s.id === 's_005') || sentinels[4]; // 高冷/游隼
  const colin = sentinels.find(s => s.id === 's_006'); // 开朗/金毛

  const now = '刚刚';

  if (sentiment.type === 'tired' || sentiment.type === 'sweet') {
    // Scene 1: Sweet tooth / exhaustion (Matches the exact PRD showcase!)
    // 1. Lowen offers sweet honey
    comments.push({
      id: `mc_${Date.now()}_1`,
      author: lowen ? lowen.name : '洛文 (Lowen)',
      authorId: lowen?.id,
      text: '向导大人！我马上给您送去金冠特级高纯蜂糖！请务必好好休息，千万不要勉强精神海！',
      time: '1分钟前'
    });

    // 2. Silas replies to Lowen mocking the honey
    comments.push({
      id: `mc_${Date.now()}_2`,
      author: silas ? silas.name : '塞拉斯 (Silas)',
      authorId: silas?.id,
      replyTo: lowen ? lowen.name : '洛文 (Lowen)',
      text: `@${lowen ? lowen.name : '洛文'} 低等蜜糖也能拿来献丑？你的工蜂脑子果然装不下高维纯净配方。我已经让近卫送去顶级恒温草木冷萃液了。`,
      time: '刚刚'
    });

    // 3. Leon replies to Silas telling him to shut up or fight
    comments.push({
      id: `mc_${Date.now()}_3`,
      author: leon ? leon.name : '雷恩 (Leon)',
      authorId: leon?.id,
      replyTo: silas ? silas.name : '塞拉斯 (Silas)',
      text: `@${silas ? silas.name : '塞拉斯'} 阴阳怪气什么？想死就出来决斗，别在向导动态底下吐蛇信子。安黎，老子去温室后山给你摘野星莓，等我。`,
      time: '刚刚'
    });

    // 4. Shure chimes in with tsundere pride
    comments.push({
      id: `mc_${Date.now()}_4`,
      author: shure ? shure.name : '修尔 (Shure)',
      authorId: shure?.id,
      text: '……本少爷可没特意带顶级星核果，只是巡航路过顺手扔在公馆门卫室了而已。爱吃不吃。',
      time: '刚刚'
    });

    if (colin) {
      comments.push({
        id: `mc_${Date.now()}_5`,
        author: colin.name,
        authorId: colin.id,
        text: '向导大人累了的话，阿金随时可以当最厚最软的靠垫！阿金刚才一直在扒拉通讯屏想飞奔过去！汪汪！',
        time: '刚刚'
      });
    }
  } else if (sentiment.type === 'beast') {
    // Scene 2: Touched spirit beast ears / fur
    comments.push({
      id: `mc_${Date.now()}_1`,
      author: leon ? leon.name : '雷恩 (Leon)',
      authorId: leon?.id,
      text: '……把你的手从别家野兽的毛上拿开！雪狼的耳根随便你怎么揉，听到没有？！',
      time: '1分钟前'
    });

    comments.push({
      id: `mc_${Date.now()}_2`,
      author: silas ? silas.name : '塞拉斯 (Silas)',
      authorId: silas?.id,
      replyTo: leon ? leon.name : '雷恩 (Leon)',
      text: `@${leon ? leon.name : '雷恩'} 粗野的犬科只懂得狂吠。向导阁下分明更欣赏冰冷顺滑的暗影蛇鳞……对吧，向导大人？`,
      time: '刚刚'
    });

    comments.push({
      id: `mc_${Date.now()}_3`,
      author: shure ? shure.name : '修尔 (Shure)',
      authorId: shure?.id,
      text: '黄金狮的鬃毛才是全星系公认手感第一。下次疏导，特许你把脸埋在颈毛里十分钟。',
      time: '刚刚'
    });

    if (elvis) {
      comments.push({
        id: `mc_${Date.now()}_4`,
        author: elvis.name,
        authorId: elvis.id,
        replyTo: shure ? shure.name : '修尔 (Shure)',
        text: `@${shure ? shure.name : '修尔'} 掉毛的野兽就别自我感觉良好了。裂空的高空翎羽毫无杂质，最适合向导指尖。`,
        time: '刚刚'
      });
    }
  } else if (sentiment.type === 'scenery') {
    // Scene 3: Scenery / Greenhouse flowers
    comments.push({
      id: `mc_${Date.now()}_1`,
      author: lowen ? lowen.name : '洛文 (Lowen)',
      authorId: lowen?.id,
      text: '向导大人的温室真漂亮……像梦里的花海一样。能远远看一眼照片，我今天巡逻就很有力量了！',
      time: '1分钟前'
    });

    comments.push({
      id: `mc_${Date.now()}_2`,
      author: shure ? shure.name : '修尔 (Shure)',
      authorId: shure?.id,
      text: '公馆防御工事已升级为S级电磁矩阵。在温室赏花时不必担心外界任何骚动，有我守着。',
      time: '刚刚'
    });

    comments.push({
      id: `mc_${Date.now()}_3`,
      author: silas ? silas.name : '塞拉斯 (Silas)',
      authorId: silas?.id,
      replyTo: shure ? shure.name : '修尔 (Shure)',
      text: `@${shure ? shure.name : '修尔'} 笨重的铁栏杆只懂得破坏美感。幽静的花丛最适合让无声的暗影驻足守候呢。`,
      time: '刚刚'
    });

    if (leon) {
      comments.push({
        id: `mc_${Date.now()}_4`,
        author: leon.name,
        authorId: leon.id,
        replyTo: silas ? silas.name : '塞拉斯 (Silas)',
        text: `@${silas ? silas.name : '塞拉斯'} 别让我闻到你在花坛附近留下的蛇信子味，抓到直接拧断。`,
        time: '刚刚'
      });
    }
  } else {
    // Scene 4: Daily generic / battle
    comments.push({
      id: `mc_${Date.now()}_1`,
      author: leon ? leon.name : '雷恩 (Leon)',
      authorId: leon?.id,
      text: '看到动态了。前线战报一切稳定，别分心，顾好公馆里的防辐射恒温。',
      time: '1分钟前'
    });

    comments.push({
      id: `mc_${Date.now()}_2`,
      author: lowen ? lowen.name : '洛文 (Lowen)',
      authorId: lowen?.id,
      text: '向导大人发动态了！给您点赞！我会一直守护您的！',
      time: '刚刚'
    });

    comments.push({
      id: `mc_${Date.now()}_3`,
      author: silas ? silas.name : '塞拉斯 (Silas)',
      authorId: silas?.id,
      text: '只要能看见您的字迹，心核的阴暗燥热便得到了最大的抚慰……',
      time: '刚刚'
    });

    if (shure) {
      comments.push({
        id: `mc_${Date.now()}_4`,
        author: shure.name,
        authorId: shure.id,
        text: '哼，既然这么有精神发动态，那明天的排班可不准随意鸽掉本少爷！',
        time: '刚刚'
      });
    }
  }

  return {
    likesGain: Math.floor(Math.random() * 4) + 5,
    comments
  };
}

/**
 * Generates fresh Sentinel Moments when time advances (上午 -> 下午 -> 次日上午)
 */
export function generatePeriodicSentinelMoment(
  stardateDay: number,
  timeOfDay: string,
  sentinels: Sentinel[]
): Moment | null {
  const candidates = [
    {
      authorId: 's_001',
      author: '雷恩 (Leon)',
      avatarText: '狼',
      content: `零下40度极地战线清剿完毕。斩杀高危变异种14头。雪狼身上全是冰茬，但某些人给的向导素信标一直温热着心口。`,
      beastPhotoDesc: '雪地上一只雄壮的白化极地雪狼甩动带霜的长毛，远处是倒下的巨大畸变种残骸。',
      comments: [
        {
          id: `pc_${Date.now()}_1`,
          author: '塞拉斯 (Silas)',
          text: '某些野兽在前线发动态显摆蛮力，殊不知向导阁下最讨厌血腥气。',
          time: '刚刚'
        },
        {
          id: `pc_${Date.now()}_2`,
          author: '雷恩 (Leon)',
          replyTo: '塞拉斯 (Silas)',
          text: '@塞拉斯 你懂个屁，老子冲洗干净了才回营房。',
          time: '刚刚'
        }
      ]
    },
    {
      authorId: 's_004',
      author: '修尔 (Shure)',
      avatarText: '狮',
      content: `近卫团今日例行巡检。第23至27哨所防御等级拉升至最高。某些闲杂哨兵不要借故在公馆大道两公里内徘徊，见一个轰一个。`,
      beastPhotoDesc: '重装战甲肩膀上立着一头威严冷傲的金毛狂狮，雷霆环绕，背景是戒备森严的向导驻地。',
      comments: [
        {
          id: `pc_${Date.now()}_3`,
          author: '柯林 (Colin)',
          text: '总教官好凶呜呜，搜救队路过打水也不行嘛！阿金都被吓得缩回精神域了！',
          time: '刚刚'
        },
        {
          id: `pc_${Date.now()}_4`,
          author: '修尔 (Shure)',
          replyTo: '柯林 (Colin)',
          text: '@柯林 执行军令，少废话！',
          time: '刚刚'
        }
      ]
    },
    {
      authorId: 's_002',
      author: '塞拉斯 (Silas)',
      avatarText: '蛇',
      content: `深夜的情报密室。毒液已提纯完毕，暗影的鳞片在月光下泛着幽光。向导公馆今夜的草木香似乎比往日更清浅……失眠。`,
      beastPhotoDesc: '暗夜书架顶端盘踞着一条黑金微光的巨型黑曼巴蛇，蛇信微吐，眼神幽邃。',
      comments: [
        {
          id: `pc_${Date.now()}_5`,
          author: '洛文 (Lowen)',
          text: '塞拉斯长官如果睡不着可以饮用清心露……不要总用阴冷的信息素扫视公馆……',
          time: '刚刚'
        },
        {
          id: `pc_${Date.now()}_6`,
          author: '塞拉斯 (Silas)',
          replyTo: '洛文 (Lowen)',
          text: '@洛文 管好你自己的蛛丝，小工蜂。',
          time: '刚刚'
        }
      ]
    },
    {
      authorId: 's_005',
      author: '艾尔维斯 (Elvis)',
      avatarText: '隼',
      content: `对流层上空两万米音速巡猎归来。平流层极光很美，可惜地面的野兽一辈子也见不到。某些人的排班要是再不轮到我，本少爷直接战机迫降草坪。`,
      beastPhotoDesc: '战机透明座舱外，一只苍蓝羽翼神骏的游隼在万米极光云海中穿云展翅。',
      comments: [
        {
          id: `pc_${Date.now()}_7`,
          author: '雷恩 (Leon)',
          text: '你迫降一个试试？防空炮第一时间把你轰成秃毛鸟。',
          time: '刚刚'
        },
        {
          id: `pc_${Date.now()}_8`,
          author: '艾尔维斯 (Elvis)',
          replyTo: '雷恩 (Leon)',
          text: '@雷恩 走着瞧，笨狼。',
          time: '刚刚'
        }
      ]
    },
    {
      authorId: 's_006',
      author: '柯林 (Colin)',
      avatarText: '犬',
      content: `今天废墟搜救立功啦！救出了三只被困在岩缝里的小雪兔！阿金一直眼巴巴看着兔兔，向导大人喜欢小兔子吗？下次抱来给您！`,
      beastPhotoDesc: '阳光泥地上，一只高大蓬松的大金毛犬咧嘴傻笑，爪子小心翼翼护着怀里三只瑟瑟发抖的雪白长耳兔。',
      comments: [
        {
          id: `pc_${Date.now()}_9`,
          author: '洛文 (Lowen)',
          text: '柯林队员真厉害！兔子很可爱，向导大人一定会喜欢的！',
          time: '刚刚'
        }
      ]
    }
  ];

  // Pick one randomly
  const template = candidates[Math.floor(Math.random() * candidates.length)];
  const matchingSentinel = sentinels.find(s => s.id === template.authorId);

  return {
    id: `m_periodic_${Date.now()}`,
    authorId: template.authorId,
    author: matchingSentinel ? `${matchingSentinel.name}` : template.author,
    avatarText: matchingSentinel ? matchingSentinel.avatarText : template.avatarText,
    time: `星历 4072.04.${stardateDay} ${timeOfDay}`,
    content: template.content,
    isContracted: matchingSentinel?.contracted,
    visibility: 'public',
    likes: Math.floor(Math.random() * 8) + 6,
    likedByGuide: false,
    comments: template.comments,
    beastPhotoDesc: template.beastPhotoDesc
  };
}
