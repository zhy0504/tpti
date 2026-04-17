const TOTAL_QUESTIONS = 12

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
      { key: "A", text: "病毒" },
      { key: "B", text: "真菌" },
      { key: "C", text: "结核分枝杆菌" },
      { key: "D", text: "寄生虫" }
    ],
    correctAnswer: "C",
    analysis: "这题的关键点很基础：结核病主要由结核分枝杆菌引起，不是普通病毒性感冒那一类。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q2",
    question: "肺结核主要通过哪种方式传播？",
    options: [
      { key: "A", text: "握手传播" },
      { key: "B", text: "空气飞沫传播" },
      { key: "C", text: "一起吃饭必然传播" },
      { key: "D", text: "皮肤接触传播" }
    ],
    correctAnswer: "B",
    analysis: "这类题最容易混淆，但重点就一句：肺结核主要通过咳嗽、打喷嚏、大声说话产生的飞沫传播。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q3",
    question: "如果一个人咳嗽、咳痰超过多久，需要警惕肺结核？",
    options: [
      { key: "A", text: "1天" },
      { key: "B", text: "3天" },
      { key: "C", text: "2周" },
      { key: "D", text: "2个月" }
    ],
    correctAnswer: "C",
    analysis: "这个时间点要记牢：咳嗽、咳痰超过2周，就是肺结核需要重点警惕的信号之一。",
    category: "症状识别",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q4",
    question: "下面哪项更像肺结核的常见症状？",
    options: [
      { key: "A", text: "咳嗽、咳痰、低热、盗汗" },
      { key: "B", text: "牙疼、流鼻血、耳鸣" },
      { key: "C", text: "眼痒、打嗝、腿抽筋" },
      { key: "D", text: "只会突然发胖" }
    ],
    correctAnswer: "A",
    analysis: "别只盯着发烧，咳嗽、咳痰、低热、盗汗、乏力、消瘦这些都属于常见表现。",
    category: "常见症状",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q5",
    question: "以下哪种做法有助于预防结核病传播？",
    options: [
      { key: "A", text: "长时间紧闭门窗" },
      { key: "B", text: "保持室内通风" },
      { key: "C", text: "咳嗽时不遮挡口鼻" },
      { key: "D", text: "有症状也不就医" }
    ],
    correctAnswer: "B",
    analysis: "这题属于防护基础分：保持空气流通能降低传播风险，所以通风真的很重要。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q6",
    question: "怀疑自己得了肺结核，比较合适的做法是？",
    options: [
      { key: "A", text: "先拖一拖，看会不会自己好" },
      { key: "B", text: "自己随便买药吃" },
      { key: "C", text: "及时到正规医疗机构检查" },
      { key: "D", text: "完全不告诉任何人" }
    ],
    correctAnswer: "C",
    analysis: "真正靠谱的做法不是硬拖，而是出现可疑症状后及时去正规医疗机构检查。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q7",
    question: "卡介苗的主要作用是？",
    options: [
      { key: "A", text: "让人永远不会得结核病" },
      { key: "B", text: "降低儿童重症结核病风险" },
      { key: "C", text: "治疗活动性肺结核" },
      { key: "D", text: "预防所有呼吸道疾病" }
    ],
    correctAnswer: "B",
    analysis: "卡介苗不是“打了就绝对不会得”，但它能降低儿童重症结核病风险，这点要分清。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q8",
    question: "关于肺结核治疗，正确的是？",
    options: [
      { key: "A", text: "症状一缓解就可以停药" },
      { key: "B", text: "必须按医生要求规范治疗" },
      { key: "C", text: "想吃就吃，不想吃就停" },
      { key: "D", text: "只靠食补就能治好" }
    ],
    correctAnswer: "B",
    analysis: "治疗最怕“感觉好了就停”，正确做法是规范、全程、按时服药，不能自己说停就停。",
    category: "规范治疗",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q9",
    question: "以下哪种说法是误区？",
    options: [
      { key: "A", text: "结核病是可以防治的" },
      { key: "B", text: "出现可疑症状应及时就医" },
      { key: "C", text: "只有老年人才会得结核病" },
      { key: "D", text: "规范治疗很重要" }
    ],
    correctAnswer: "C",
    analysis: "这个误区很常见：不是只有老年人才会得结核病，任何年龄段都有可能患病。",
    category: "常见误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q10",
    question: "肺结核患者咳嗽、打喷嚏时，更推荐怎么做？",
    options: [
      { key: "A", text: "面向别人尽情输出" },
      { key: "B", text: "用纸巾或手肘遮挡口鼻" },
      { key: "C", text: "什么都不用做" },
      { key: "D", text: "只要戴帽子就行" }
    ],
    correctAnswer: "B",
    analysis: "别小看这个细节，咳嗽礼仪真的有用，遮挡口鼻能减少飞沫传播。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q11",
    question: "如果室友或同学持续咳嗽咳痰两周以上，更合适的做法是？",
    options: [
      { key: "A", text: "嘲笑他太虚了" },
      { key: "B", text: "完全不管" },
      { key: "C", text: "建议他尽快去正规机构检查" },
      { key: "D", text: "让他自己硬扛" }
    ],
    correctAnswer: "C",
    analysis: "这题考的不是冷知识，而是行动判断：发现可疑症状时，及时提醒就医才是更负责的做法。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q12",
    question: "下面关于结核病的说法，哪项正确？",
    options: [
      { key: "A", text: "结核病无法预防，也无法治疗" },
      { key: "B", text: "只要不发烧就一定不是结核病" },
      { key: "C", text: "规范防治和及时发现很关键" },
      { key: "D", text: "得了结核病就完全没办法上学和生活" }
    ],
    correctAnswer: "C",
    analysis: "总结版重点就是这句：结核病可防可治，关键在及时发现、规范治疗和科学管理。",
    category: "总体认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q13",
    question: "结核病更常见累及人体的哪个部位？",
    options: [
      { key: "A", text: "肺部" },
      { key: "B", text: "指甲" },
      { key: "C", text: "头发" },
      { key: "D", text: "牙齿表面" }
    ],
    correctAnswer: "A",
    analysis: "结核病可以发生在多个部位，但最常见的是肺结核，所以很多防控知识都围绕肺部传播展开。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q14",
    question: "关于结核病，哪种说法更准确？",
    options: [
      { key: "A", text: "只要年轻就不会得" },
      { key: "B", text: "任何年龄都可能患病" },
      { key: "C", text: "只在冬天出现" },
      { key: "D", text: "只会传给家人" }
    ],
    correctAnswer: "B",
    analysis: "结核病并不挑年龄，儿童、青年、成年人、老年人都可能患病，不能因为年轻就掉以轻心。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q15",
    question: "结核病防治中更值得记住的一句话是？",
    options: [
      { key: "A", text: "靠感觉判断就够了" },
      { key: "B", text: "早发现、早检查、规范治疗" },
      { key: "C", text: "能拖就先拖着" },
      { key: "D", text: "只有症状很重才处理" }
    ],
    correctAnswer: "B",
    analysis: "结核病防治的关键不是拖，而是尽早识别风险信号并尽快接受规范处理。",
    category: "基础认知",
    dimension: DIMENSIONS.knowledge_basic
  },
  {
    id: "q16",
    question: "肺结核患者在咳嗽、打喷嚏或大声说话时，更可能把病菌带到哪里？",
    options: [
      { key: "A", text: "空气中的飞沫里" },
      { key: "B", text: "手机电量里" },
      { key: "C", text: "衣服颜色里" },
      { key: "D", text: "饮用水味道里" }
    ],
    correctAnswer: "A",
    analysis: "这题强调的是传播载体：病菌会随飞沫进入空气，所以密闭、通风差的环境风险更高。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q17",
    question: "以下哪种场景更需要重视肺结核传播风险？",
    options: [
      { key: "A", text: "短暂路过空旷操场" },
      { key: "B", text: "在通风差的室内长时间接触咳嗽者" },
      { key: "C", text: "隔着屏幕聊天" },
      { key: "D", text: "看一眼别人的课本" }
    ],
    correctAnswer: "B",
    analysis: "风险判断要看环境和接触时间：密闭、通风差、接触久，更容易增加传播机会。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q18",
    question: "下面哪种说法更符合结核病传播特点？",
    options: [
      { key: "A", text: "摸一下桌子就一定会被传染" },
      { key: "B", text: "只要同班就一定会被传染" },
      { key: "C", text: "主要与飞沫传播和接触环境有关" },
      { key: "D", text: "见过患者就肯定发病" }
    ],
    correctAnswer: "C",
    analysis: "传播风险不是简单的“接触一下就必中”，而是与飞沫、环境通风和接触情境密切相关。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q19",
    question: "关于肺结核传播，下面哪种理解更科学？",
    options: [
      { key: "A", text: "飞沫传播是需要重点防范的方式" },
      { key: "B", text: "吃同一份零食一定会传播" },
      { key: "C", text: "穿同色衣服会传播" },
      { key: "D", text: "发朋友圈会传播" }
    ],
    correctAnswer: "A",
    analysis: "科学认知传播方式，才能把注意力放在真正有用的预防动作上，例如通风和咳嗽礼仪。",
    category: "传播途径",
    dimension: DIMENSIONS.transmission
  },
  {
    id: "q20",
    question: "出现持续咳嗽、咳痰、低热等情况时，比较合适的第一反应是？",
    options: [
      { key: "A", text: "继续熬一熬" },
      { key: "B", text: "及时留意并尽快检查" },
      { key: "C", text: "只在网上搜，不做行动" },
      { key: "D", text: "完全不当回事" }
    ],
    correctAnswer: "B",
    analysis: "症状识别的价值在于推动行动，发现持续可疑症状后，应尽快去正规机构检查，而不是一直拖。",
    category: "症状识别",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q21",
    question: "下面哪种情况更值得尽快去正规医疗机构排查肺结核？",
    options: [
      { key: "A", text: "偶尔打一个哈欠" },
      { key: "B", text: "持续咳嗽咳痰并伴有低热盗汗" },
      { key: "C", text: "今天不想起床" },
      { key: "D", text: "喝水慢一点" }
    ],
    correctAnswer: "B",
    analysis: "持续症状加上低热、盗汗等组合，更值得提高警惕，及时就医比反复猜更靠谱。",
    category: "症状识别",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q22",
    question: "朋友连续咳嗽咳痰两周以上，还说“再等等看”，你更推荐？",
    options: [
      { key: "A", text: "陪他一起拖着" },
      { key: "B", text: "建议他尽快去正规机构检查" },
      { key: "C", text: "让他只喝热水就好" },
      { key: "D", text: "完全不用提醒" }
    ],
    correctAnswer: "B",
    analysis: "这类题核心在行动建议：面对持续可疑症状，最重要的是尽快检查，而不是继续观望。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q23",
    question: "怀疑自己可能患肺结核时，以下哪种做法更不推荐？",
    options: [
      { key: "A", text: "及时到正规医疗机构检查" },
      { key: "B", text: "根据症状自行长期乱用药" },
      { key: "C", text: "关注症状变化并尽快就医" },
      { key: "D", text: "配合医生检查" }
    ],
    correctAnswer: "B",
    analysis: "自行乱用药可能掩盖问题、延误诊断，怀疑患病时应优先去正规机构接受专业评估。",
    category: "就医行为",
    dimension: DIMENSIONS.symptom_action
  },
  {
    id: "q24",
    question: "在教室、宿舍等场所，哪种做法更有助于降低结核病传播风险？",
    options: [
      { key: "A", text: "长期不通风" },
      { key: "B", text: "适当开窗通风" },
      { key: "C", text: "把症状都藏着" },
      { key: "D", text: "咳嗽时对着别人" }
    ],
    correctAnswer: "B",
    analysis: "预防动作里最容易做到的一项就是通风，尤其在人群聚集和停留较久的室内环境中更重要。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q25",
    question: "哪种习惯更符合预防结核病传播的要求？",
    options: [
      { key: "A", text: "咳嗽时随意朝空气中喷" },
      { key: "B", text: "咳嗽时用纸巾或手肘遮挡口鼻" },
      { key: "C", text: "有症状时继续密闭聚会" },
      { key: "D", text: "出现症状也不检查" }
    ],
    correctAnswer: "B",
    analysis: "咳嗽礼仪不是小事，它能减少飞沫向周围扩散，是很重要的基础预防动作。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q26",
    question: "下列哪项更属于结核病预防中的有效做法？",
    options: [
      { key: "A", text: "有明显症状还强行参加密闭聚会" },
      { key: "B", text: "保持通风并尽早就医排查" },
      { key: "C", text: "把咳嗽礼仪当作多余步骤" },
      { key: "D", text: "觉得年轻就不用防护" }
    ],
    correctAnswer: "B",
    analysis: "预防并不是单一动作，通风、遮挡口鼻、及时就医，这些配合起来才更有效。",
    category: "预防方法",
    dimension: DIMENSIONS.prevention
  },
  {
    id: "q27",
    question: "关于肺结核用药，哪种态度更正确？",
    options: [
      { key: "A", text: "症状轻了就擅自停药" },
      { key: "B", text: "按医生要求规范完成治疗" },
      { key: "C", text: "想起来才吃一次" },
      { key: "D", text: "只靠偏方就够了" }
    ],
    correctAnswer: "B",
    analysis: "规范治疗最怕三天打鱼两天晒网，按医嘱完成全程治疗，才是对自己负责的做法。",
    category: "规范治疗",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q28",
    question: "下面哪种想法更像结核病治疗误区？",
    options: [
      { key: "A", text: "治疗要遵医嘱坚持完成" },
      { key: "B", text: "感觉好点就可以自己停药" },
      { key: "C", text: "出现问题要及时复诊" },
      { key: "D", text: "规范治疗很重要" }
    ],
    correctAnswer: "B",
    analysis: "感觉好转不等于已经治好，擅自停药是典型误区，可能影响后续治疗效果。",
    category: "常见误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q29",
    question: "关于结核病治疗，哪种说法更科学？",
    options: [
      { key: "A", text: "治疗全靠运气，不用复查" },
      { key: "B", text: "规范治疗和按时复查都很重要" },
      { key: "C", text: "只要食补，不必用药" },
      { key: "D", text: "停药时间自己决定" }
    ],
    correctAnswer: "B",
    analysis: "治疗不只是吃药，还包括按时复查、听从医生安排，不能自己随意改方案。",
    category: "规范治疗",
    dimension: DIMENSIONS.treatment_misunderstanding
  },
  {
    id: "q30",
    question: "以下哪种观念需要及时纠正？",
    options: [
      { key: "A", text: "结核病可防可治" },
      { key: "B", text: "有症状应尽快检查" },
      { key: "C", text: "症状减轻后就可以自行停药" },
      { key: "D", text: "规范治疗很关键" }
    ],
    correctAnswer: "C",
    analysis: "不少人把“症状减轻”误当成“已经痊愈”，这正是治疗中的高频误区之一。",
    category: "常见误区",
    dimension: DIMENSIONS.treatment_misunderstanding
  }
]

export const quiz = {
  version: "1.1.0",
  totalQuestions: TOTAL_QUESTIONS,
  dimensions: Object.values(DIMENSIONS),
  questions
}

export default quiz
