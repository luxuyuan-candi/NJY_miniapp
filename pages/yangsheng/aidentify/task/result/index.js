const constitutionDescriptions = {
  '平和质 (A型)': {
    title: '平和质',
    summary:
      '体态匀称，精力充沛，面色红润，适应力较强，常见不适较少。',
    traits: ['精力好', '睡眠佳', '情绪稳定', '适应力强']
  },
  '气虚质 (B型)': {
    title: '气虚质',
    summary:
      '容易疲乏气短，声音低弱，抵抗力偏弱，活动后易出虚汗。',
    traits: ['易疲劳', '气短', '易感冒', '出虚汗']
  },
  '阳虚质 (C型)': {
    title: '阳虚质',
    summary:
      '畏寒怕冷，手脚发凉，耐寒能力弱，喜温热，受凉后易不适。',
    traits: ['怕冷', '手脚凉', '喜温热', '受凉不适']
  },
  '阴虚质 (D型)': {
    title: '阴虚质',
    summary:
      '口干咽燥，手足心热，皮肤口唇偏干，易出现虚火表现。',
    traits: ['口干', '手足心热', '皮肤偏干', '易上火']
  },
  '痰湿质 (E型)': {
    title: '痰湿质',
    summary:
      '体态偏胖或腹部松软，胸闷困重，口黏痰多，易困倦。',
    traits: ['困重', '口黏', '痰多', '易发胖']
  },
  '湿热质 (F型)': {
    title: '湿热质',
    summary:
      '面部油腻易生痘，口苦口黏，大便黏滞，小便偏黄。',
    traits: ['油腻', '口苦', '痘多', '便黏']
  },
  '血瘀质 (G型)': {
    title: '血瘀质',
    summary:
      '面色晦暗、口唇偏暗，皮肤易瘀斑，疼痛多呈刺痛或固定。',
    traits: ['面色晦暗', '易瘀斑', '口唇偏暗', '刺痛']
  },
  '气郁质 (H型)': {
    title: '气郁质',
    summary:
      '情绪低落或紧张，容易叹气，胸胁胀满，咽部异物感。',
    traits: ['情绪波动', '易叹气', '胸胁胀', '咽部异物感']
  },
  '特禀质 (I型)': {
    title: '特禀质',
    summary:
      '过敏体质倾向，易出现鼻炎、皮疹或其他过敏反应。',
    traits: ['易过敏', '鼻敏感', '皮疹', '环境敏感']
  }
}

const getDescription = (type) =>
  constitutionDescriptions[type] || {
    title: type,
    summary: '暂无描述',
    traits: []
  }

Page({
  data: {
    result: null,
    description: null
  },

  onLoad() {
    const result = wx.getStorageSync('taskAResult')
    if (!result) {
      wx.showToast({
        title: '暂无结果，请先完成问卷',
        icon: 'none'
      })
      return
    }

    const description = getDescription(result.top.type)
    this.setData({ result, description })
  },

  goToYaoShanBao() {
    wx.navigateTo({
      url: '/pages/yangsheng/yaoshanbao/index'
    })
  }
})
