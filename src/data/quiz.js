const TOTAL_QUESTIONS = 10
const QUESTIONS_PER_DIMENSION = 2

const DIMENSIONS = {
  knowledge_basic: "knowledge_basic",
  transmission: "transmission",
  symptom_action: "symptom_action",
  prevention: "prevention",
  treatment_misunderstanding: "treatment_misunderstanding"
}

const questions = [
  {
    id: "q1",
    question: "结核病的病原体是？",
    options: [
      { key: "A", text: "流感病毒" },
      { key: "B", text: "真菌" },
      { key: "C", text: "结核分枝杆菌" },
      { key: "D", text: "寄生虫" }
    ],
    correctAnswer: "C",
    analysis: "结核病主要由结核分枝杆菌引起，它不是普通感冒那类病毒性疾病。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q2",
    question: "结核病最常见累及人体的哪个部位？",
    options: [
      { key: "A", text: "肺部" },
      { key: "B", text: "指甲" },
      { key: "C", text: "头发" },
      { key: "D", text: "牙齿表面" }
    ],
    correctAnswer: "A",
    analysis: "结核病可以累及多个部位，但最常见、也最需要防传播的是肺结核。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q3",
    question: "关于谁可能患结核病，哪种说法更准确？",
    options: [
      { key: "A", text: "只有老人会得" },
      { key: "B", text: "只有体质差的人才会得" },
      { key: "C", text: "只有冬天才会得" },
      { key: "D", text: "任何年龄都有可能患病" }
    ],
    correctAnswer: "D",
    analysis: "结核病并不只盯着某一类人，儿童、青年、成年人、老年人都可能患病。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q4",
    question: "卡介苗的主要作用更接近下面哪一项？",
    options: [
      { key: "A", text: "保证一辈子都不会得结核病" },
      { key: "B", text: "降低儿童重症结核病风险" },
      { key: "C", text: "治疗已经确诊的活动性肺结核" },
      { key: "D", text: "预防所有呼吸道疾病" }
    ],
    correctAnswer: "B",
    analysis: "卡介苗不是绝对防护罩，但能帮助降低儿童发生重症结核病的风险。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q5",
    question: "下面关于结核病的说法，哪项更科学？",
    options: [
      { key: "A", text: "结核病一旦得了就没办法治疗" },
      { key: "B", text: "不发烧就一定不是结核病" },
      { key: "C", text: "结核病可防可治，关键在早发现和规范处理" },
      { key: "D", text: "得了结核病就完全不能继续生活和学习" }
    ],
    correctAnswer: "C",
    analysis: "结核病并不是“无药可救”，核心在及时识别、规范检查和按方案治疗。",
    category: "总体认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q6",
    question: "下面哪种情况更像“潜伏结核感染”的特点？",
    options: [
      { key: "A", text: "暂时没有症状，也不会把病传给别人" },
      { key: "B", text: "一咳嗽就一定会传染给所有人" },
      { key: "C", text: "一定会马上发展成活动性肺结核" },
      { key: "D", text: "只要潜伏感染，就永远不用再管" }
    ],
    correctAnswer: "A",
    analysis: "潜伏结核感染不是活动性肺结核，通常没有症状，也不会像活动性肺结核那样传播。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q7",
    question: "结核感染检测结果阳性后，下一步更合理的是？",
    options: [
      { key: "A", text: "说明一定是活动性肺结核，不用再查" },
      { key: "B", text: "进一步做胸片、痰检等判断是不是活动性结核" },
      { key: "C", text: "只靠网上搜索自己判断" },
      { key: "D", text: "先拖着，等症状很重再说" }
    ],
    correctAnswer: "B",
    analysis: "检测阳性说明身体可能接触过结核菌，但是否是活动性结核，还要继续做正规检查。",
    category: "检测认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q8",
    question: "打过卡介苗后，下面哪种理解更准确？",
    options: [
      { key: "A", text: "以后就肯定不会得结核病" },
      { key: "B", text: "以后做任何结核检查都没有意义" },
      { key: "C", text: "只要打过卡介苗，就不用关心结核知识了" },
      { key: "D", text: "仍可能得结核病，必要时照样需要规范检测和评估" }
    ],
    correctAnswer: "D",
    analysis: "卡介苗不是终身免疫盾牌，打过也不等于以后完全不用防、也不用查。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q9",
    question: "肺结核最主要通过哪种方式传播？",
    options: [
      { key: "A", text: "空气中的飞沫传播" },
      { key: "B", text: "握手传播" },
      { key: "C", text: "共用筷子一定传播" },
      { key: "D", text: "皮肤接触传播" }
    ],
    correctAnswer: "A",
    analysis: "肺结核传播的重点在飞沫和空气环境，不是简单摸一下就会传。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q10",
    question: "下面哪种接触方式通常不是肺结核的主要传播方式？",
    options: [
      { key: "A", text: "和患者在通风差的房间里久待" },
      { key: "B", text: "患者咳嗽时近距离吸入飞沫" },
      { key: "C", text: "和患者握手或短暂碰到桌面" },
      { key: "D", text: "与持续咳嗽者在封闭车厢里长时间同处" }
    ],
    correctAnswer: "C",
    analysis: "肺结核传播重点不是日常握手接触，而是飞沫、空气和环境通风情况。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q11",
    question: "以下哪种环境更容易增加肺结核传播风险？",
    options: [
      { key: "A", text: "通风差、多人停留时间长的室内" },
      { key: "B", text: "空旷室外并且停留很短" },
      { key: "C", text: "隔着手机视频聊天" },
      { key: "D", text: "路过操场时打个招呼" }
    ],
    correctAnswer: "A",
    analysis: "环境越密闭、通风越差、接触越久，传播风险就越值得警惕。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q12",
    question: "下面哪类情况更可能把结核菌传播给别人？",
    options: [
      { key: "A", text: "已经完成规范治疗、无咳嗽的人" },
      { key: "B", text: "只有潜伏感染、没有症状的人" },
      { key: "C", text: "只是看过结核科宣传栏的人" },
      { key: "D", text: "患有活动性肺结核且持续咳嗽的人" }
    ],
    correctAnswer: "D",
    analysis: "真正需要防传播的是活动性肺结核，尤其是有咳嗽、咳痰等症状的人。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q13",
    question: "关于肺结核传播风险，哪种理解更科学？",
    options: [
      { key: "A", text: "只要见过患者，就一定会发病" },
      { key: "B", text: "风险与飞沫、环境通风和接触时间有关" },
      { key: "C", text: "穿同一颜色的衣服更危险" },
      { key: "D", text: "只要在同一栋楼里就一定传播" }
    ],
    correctAnswer: "B",
    analysis: "传播不是“见到就中招”，而是和具体接触场景、空气流通情况密切相关。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q14",
    question: "以下哪种场景更需要重视肺结核传播风险？",
    options: [
      { key: "A", text: "在空旷广场上短暂停留" },
      { key: "B", text: "隔着玻璃打招呼" },
      { key: "C", text: "短暂路过开窗通风的走廊" },
      { key: "D", text: "在封闭网吧里与持续咳嗽者相邻坐很久" }
    ],
    correctAnswer: "D",
    analysis: "人多、空气不流通、停留时间又长的环境，更值得提高警惕。",
    category: "风险场景",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q15",
    question: "有人说“和肺结核患者一起吃饭一定会被传染”，更准确的说法是？",
    options: [
      { key: "A", text: "重点风险还是飞沫和环境，不是单纯一起吃饭就必然传播" },
      { key: "B", text: "只要共用一张桌子就一定会发病" },
      { key: "C", text: "只要年轻就不会被传染" },
      { key: "D", text: "只要戴帽子就不会传" }
    ],
    correctAnswer: "A",
    analysis: "要抓真正重点：飞沫传播、通风情况和接触时间，而不是被一些夸张说法带偏。",
    category: "常见误区",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q16",
    question: "肺结核患者咳嗽、打喷嚏或大声说话时，病菌更可能出现在哪里？",
    options: [
      { key: "A", text: "手机电量里" },
      { key: "B", text: "衣服颜色里" },
      { key: "C", text: "空气中的飞沫里" },
      { key: "D", text: "饮用水味道里" }
    ],
    correctAnswer: "C",
    analysis: "病菌会随着飞沫进入空气，这就是为什么密闭环境尤其要重视通风和防护。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q17",
    question: "如果一个人咳嗽、咳痰超过多久，需要警惕肺结核？",
    options: [
      { key: "A", text: "1天" },
      { key: "B", text: "3天" },
      { key: "C", text: "2周" },
      { key: "D", text: "2个月" }
    ],
    correctAnswer: "C",
    analysis: "“咳嗽、咳痰超过2周”是一个很重要的提醒信号，别一直拖。",
    category: "症状识别",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q18",
    question: "下面哪组表现更像肺结核的常见症状？",
    options: [
      { key: "A", text: "咳嗽、咳痰、低热、盗汗" },
      { key: "B", text: "耳鸣、打嗝、牙疼" },
      { key: "C", text: "腿抽筋、流鼻血、眼痒" },
      { key: "D", text: "只会突然发胖" }
    ],
    correctAnswer: "A",
    analysis: "常见症状往往不是单独一个点，而是咳嗽、咳痰、低热、盗汗、乏力等组合出现。",
    category: "常见症状",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q19",
    question: "收到“你与活动性肺结核患者有过密切接触”的通知后，更合适的做法是？",
    options: [
      { key: "A", text: "只要没不舒服，就完全不用管" },
      { key: "B", text: "按要求尽快做结核相关检测和评估" },
      { key: "C", text: "先在网上自己猜，不用联系机构" },
      { key: "D", text: "把通知删掉，当没看到" }
    ],
    correctAnswer: "B",
    analysis: "是否已经感染，不能只靠感觉判断。接到暴露提醒后，及时检测和评估更靠谱。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q20",
    question: "如果咳嗽伴有咳血、胸痛、消瘦等情况，更合适的做法是？",
    options: [
      { key: "A", text: "先继续扛一段时间" },
      { key: "B", text: "只靠止咳药压一压" },
      { key: "C", text: "等特别严重再去看" },
      { key: "D", text: "尽快去正规医疗机构检查排查" }
    ],
    correctAnswer: "D",
    analysis: "出现这些组合信号时，不适合再观望，及时检查才是更负责任的选择。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q21",
    question: "怀疑自己可能得了肺结核时，下面哪种做法更合适？",
    options: [
      { key: "A", text: "长期自己乱买药吃" },
      { key: "B", text: "完全不告诉任何人" },
      { key: "C", text: "及时到正规医疗机构检查，不长期自行乱用药" },
      { key: "D", text: "只在网上看帖子，不做任何行动" }
    ],
    correctAnswer: "C",
    analysis: "最怕的不是“知道得少”，而是明明可疑却一直自己瞎处理。正规检查比乱猜更重要。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q22",
    question: "室友连续咳嗽咳痰两三周，还伴有低热，你更建议他？",
    options: [
      { key: "A", text: "尽快去正规机构检查，不要一直拖" },
      { key: "B", text: "先靠热水和意志力扛着" },
      { key: "C", text: "只要年轻就不用查" },
      { key: "D", text: "先参加完密闭聚会再说" }
    ],
    correctAnswer: "A",
    analysis: "面对持续可疑症状，最值得做的是尽快检查，而不是继续“再等等看”。",
    category: "行动判断",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q23",
    question: "某人结核感染检测阳性，但暂时没明显症状，下面哪种做法更合理？",
    options: [
      { key: "A", text: "说明肯定是活动性肺结核，直接自己吃药" },
      { key: "B", text: "反正没症状，永远不用再评估" },
      { key: "C", text: "把结果藏起来，不告诉任何医务人员" },
      { key: "D", text: "配合进一步评估，判断是潜伏感染还是活动性结核" }
    ],
    correctAnswer: "D",
    analysis: "有些人检测阳性但并不是活动性结核，这时关键是进一步规范评估，而不是自己下结论。",
    category: "检测后行动",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q24",
    question: "如果家人被确诊为活动性肺结核，下面哪种做法更合适？",
    options: [
      { key: "A", text: "只要自己没症状，就永远不用检查" },
      { key: "B", text: "按要求配合接触者筛查和后续评估" },
      { key: "C", text: "完全不告诉任何共同居住者" },
      { key: "D", text: "自己先随便吃几天药顶着" }
    ],
    correctAnswer: "B",
    analysis: "密切接触者处理很关键，规范筛查既是对自己负责，也是对家人负责。",
    category: "接触者处理",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q25",
    question: "以下哪种做法有助于降低肺结核传播风险？",
    options: [
      { key: "A", text: "长时间紧闭门窗" },
      { key: "B", text: "保持室内空气流通" },
      { key: "C", text: "咳嗽时不遮挡口鼻" },
      { key: "D", text: "有明显症状也继续参加密闭聚会" }
    ],
    correctAnswer: "B",
    analysis: "通风是最基础也最实用的防护动作之一，尤其是多人室内环境。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q26",
    question: "咳嗽、打喷嚏时，更推荐怎样做？",
    options: [
      { key: "A", text: "朝着别人方向尽量避开自己" },
      { key: "B", text: "什么都不用做" },
      { key: "C", text: "只要戴帽子就行" },
      { key: "D", text: "用纸巾或手肘遮挡口鼻" }
    ],
    correctAnswer: "D",
    analysis: "咳嗽礼仪不是小题大做，遮挡口鼻能减少飞沫扩散，是很重要的基础预防动作。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q27",
    question: "在宿舍、教室这类多人室内环境中，更值得坚持的习惯是？",
    options: [
      { key: "A", text: "定时开窗通风，减少长时间闷在密闭空间里" },
      { key: "B", text: "为了省事长期不开窗" },
      { key: "C", text: "有人咳嗽也完全不在意" },
      { key: "D", text: "只在闻到异味时才考虑通风" }
    ],
    correctAnswer: "A",
    analysis: "多人共处空间里，通风习惯越稳定，越有利于降低飞沫在空气中累积的风险。",
    category: "场景预防",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q28",
    question: "与疑似肺结核患者一起到医院就诊时，更合适的做法是？",
    options: [
      { key: "A", text: "一路上都不用管，越近越好" },
      { key: "B", text: "在封闭车里把窗户全关死" },
      { key: "C", text: "佩戴合适口罩、注意通风并尽量减少密闭环境久待" },
      { key: "D", text: "咳嗽时朝走廊里随便喷" }
    ],
    correctAnswer: "C",
    analysis: "陪诊场景下，口罩、防飞沫和环境通风这些动作都很实用。",
    category: "场景预防",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q29",
    question: "下面哪类人更应该重视结核相关筛查和健康管理？",
    options: [
      { key: "A", text: "与活动性肺结核患者密切接触的人" },
      { key: "B", text: "完全没有任何暴露史的人" },
      { key: "C", text: "只在电视里听说过结核的人" },
      { key: "D", text: "每天都待在空旷户外的人" }
    ],
    correctAnswer: "A",
    analysis: "密切接触者是重点关注对象，及时筛查比“等有症状再说”更稳妥。",
    category: "重点人群",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q30",
    question: "下面哪种说法更符合“预防活动性结核”的思路？",
    options: [
      { key: "A", text: "只要现在没发病，就永远不用管" },
      { key: "B", text: "只靠多喝热水就够了" },
      { key: "C", text: "医生建议处理潜伏感染时，也是在预防以后发病" },
      { key: "D", text: "预防只靠运气，不靠行动" }
    ],
    correctAnswer: "C",
    analysis: "预防不只是戴口罩和开窗，针对潜伏感染的规范处理，本身也是预防未来发病。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q31",
    question: "关于不同场景的传播风险，哪种理解更准确？",
    options: [
      { key: "A", text: "通风差的室内久待，通常比短暂停留在户外更值得警惕" },
      { key: "B", text: "只要在户外，就一定不会有任何风险" },
      { key: "C", text: "只要年轻，进密闭空间也没关系" },
      { key: "D", text: "传播风险和环境完全无关" }
    ],
    correctAnswer: "A",
    analysis: "防结核不能只看“有没有见过患者”，还得看环境是不是密闭、通风是不是差、停留是不是久。",
    category: "风险场景",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q32",
    question: "如果自己持续咳嗽又需要和别人共处一室，更合适的做法是？",
    options: [
      { key: "A", text: "装作没事，继续在密闭空间久待" },
      { key: "B", text: "咳嗽时朝大家方向喷" },
      { key: "C", text: "尽量做好遮挡、保持通风，并尽快就医评估" },
      { key: "D", text: "只要不发烧，就完全不用做任何处理" }
    ],
    correctAnswer: "C",
    analysis: "真正有效的预防动作，是把自我防护、环境管理和及时就医结合起来。",
    category: "综合预防",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q33",
    question: "关于肺结核治疗，哪种做法更正确？",
    options: [
      { key: "A", text: "想起来才吃一次药" },
      { key: "B", text: "按医生要求规范、全程、按时治疗" },
      { key: "C", text: "只靠食补和偏方" },
      { key: "D", text: "完全凭感觉决定治疗方案" }
    ],
    correctAnswer: "B",
    analysis: "结核病治疗最怕“三天打鱼两天晒网”，按方案完整治疗才靠谱。",
    category: "规范治疗",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q34",
    question: "症状刚减轻一点时，下面哪种想法最需要纠正？",
    options: [
      { key: "A", text: "继续按医嘱治疗" },
      { key: "B", text: "按时复查也很重要" },
      { key: "C", text: "感觉好些了，就可以自己把药停了" },
      { key: "D", text: "有问题及时联系医生" }
    ],
    correctAnswer: "C",
    analysis: "症状缓解不等于已经治好，擅自停药是治疗中的高频误区。",
    category: "常见误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q35",
    question: "治疗中经常漏服、断断续续吃药，最可能带来什么问题？",
    options: [
      { key: "A", text: "影响疗效，还可能增加耐药风险" },
      { key: "B", text: "只会让人更想吃饭" },
      { key: "C", text: "完全没影响" },
      { key: "D", text: "会让病菌自动消失" }
    ],
    correctAnswer: "A",
    analysis: "不规律治疗不只是“拖慢一点”，还可能让后续治疗更麻烦，甚至增加耐药风险。",
    category: "治疗误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q36",
    question: "治疗期间如果出现黄疸、持续呕吐等明显异常情况，更合适的做法是？",
    options: [
      { key: "A", text: "完全不管，硬扛过去" },
      { key: "B", text: "自己在家偷偷换药" },
      { key: "C", text: "直接把药全停了，再也不看医生" },
      { key: "D", text: "尽快联系医生或回医院评估" }
    ],
    correctAnswer: "D",
    analysis: "有明显不适或副作用时，关键不是自己乱改方案，而是及时让医生评估。",
    category: "治疗管理",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q37",
    question: "关于治疗过程中的复查，哪种说法更科学？",
    options: [
      { key: "A", text: "只要吃药就行，复查完全没意义" },
      { key: "B", text: "按时复查也是规范治疗的一部分" },
      { key: "C", text: "等完全停药后再说" },
      { key: "D", text: "复查只适合老年人" }
    ],
    correctAnswer: "B",
    analysis: "治疗不是“拿了药就结束”，按时复查同样属于治疗过程的一部分。",
    category: "规范治疗",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q38",
    question: "下面哪种说法属于常见误区？",
    options: [
      { key: "A", text: "只靠偏方、食补就能把肺结核治好" },
      { key: "B", text: "结核病应规范治疗" },
      { key: "C", text: "出现副作用要及时和医生沟通" },
      { key: "D", text: "治疗期间不能随意停药" }
    ],
    correctAnswer: "A",
    analysis: "偏方和食补不能替代规范治疗，把希望全押在这些方法上，很容易耽误病情。",
    category: "常见误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q39",
    question: "如果抗结核治疗期间发现尿液颜色发橘红，下面哪种做法更稳妥？",
    options: [
      { key: "A", text: "立刻自己把药全停掉" },
      { key: "B", text: "只听网友说法，不问医生" },
      { key: "C", text: "先查看医嘱说明，必要时咨询医生，不要擅自停药" },
      { key: "D", text: "完全不用关注任何用药反应" }
    ],
    correctAnswer: "C",
    analysis: "治疗中的一些现象可能与药物有关，遇到不确定情况应先看医嘱、及时咨询，而不是自己乱停药。",
    category: "治疗管理",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q40",
    question: "关于潜伏结核感染的处理，哪种说法更准确？",
    options: [
      { key: "A", text: "只要现在没症状，就永远不用再评估" },
      { key: "B", text: "潜伏感染一定会马上变成活动性肺结核" },
      { key: "C", text: "潜伏感染会像活动性肺结核一样到处传播" },
      { key: "D", text: "医生建议时，规范处理潜伏感染也有助于预防以后发病" }
    ],
    correctAnswer: "D",
    analysis: "潜伏感染虽然不是活动性肺结核，但规范处理它，本身也是减少今后发病风险的重要步骤。",
    category: "治疗误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  }
]

export const quiz = {
  version: "1.3.0",
  totalQuestions: TOTAL_QUESTIONS,
  questionsPerDimension: QUESTIONS_PER_DIMENSION,
  dimensions: Object.values(DIMENSIONS),
  questions
}

export default quiz
