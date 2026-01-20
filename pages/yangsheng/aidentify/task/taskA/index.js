const questionnaire = require('./questionnaire')

const isOptionalQuestion = (text) =>
  text.includes('(女性)') || text.includes('(男性)')

const stripQuestionNumber = (text) =>
  text.replace(/^\(\d+\)\s*/, '').trim()

const stripOptionPrefix = (text) => {
  const index = text.indexOf('：')
  if (index === -1) {
    return text.trim()
  }
  return text.slice(index + 1).trim()
}

const buildTypesAndQuestions = () => {
  const questions = []
  const types = questionnaire.map((type) => {
    const typeQuestions = type.questions.map((question, index) => {
      const id = `${type.code}-${index + 1}`
      const optional = isOptionalQuestion(question.text)
      const options = question.options.map((option) => ({
        ...option,
        text: stripOptionPrefix(option.label)
      }))
      const item = {
        ...question,
        id,
        optional,
        displayText: stripQuestionNumber(question.text),
        displayOptions: options
      }
      questions.push(item)
      return item
    })

    return {
      ...type,
      questions: typeQuestions
    }
  })

  return { types, questions }
}

const calcCounts = (questions, answers) => {
  let requiredCount = 0
  let answeredRequiredCount = 0
  let answeredTotalCount = 0

  questions.forEach((question) => {
    const answered = answers[question.id] != null
    if (answered) {
      answeredTotalCount += 1
    }
    if (!question.optional) {
      requiredCount += 1
      if (answered) {
        answeredRequiredCount += 1
      }
    }
  })

  return { requiredCount, answeredRequiredCount, answeredTotalCount }
}

const calcTypeScore = (type, answers) => {
  const result = type.questions.reduce(
    (acc, question) => {
      const value = answers[question.id]
      if (value == null) {
        return acc
      }
      const score = question.reverse ? 6 - value : value
      return {
        raw: acc.raw + score,
        total: acc.total + 1
      }
    },
    { raw: 0, total: 0 }
  )

  const total = result.total || 1
  const standard = ((result.raw - total) / (total * 4)) * 100

  return {
    code: type.code,
    name: type.name,
    type: type.type,
    raw: result.raw,
    standard: Number(standard.toFixed(2))
  }
}

Page({
  data: {
    types: [],
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    answers: {},
    answeredRequiredCount: 0,
    answeredTotalCount: 0,
    requiredCount: 0,
    totalCount: 0,
    result: null
  },

  onLoad() {
    const { types, questions } = buildTypesAndQuestions()
    const counts = calcCounts(questions, {})
    this.setData({
      types,
      questions,
      totalCount: questions.length,
      requiredCount: counts.requiredCount,
      answeredRequiredCount: counts.answeredRequiredCount,
      answeredTotalCount: counts.answeredTotalCount,
      currentQuestion: questions[0] || null
    })
  },

  onAnswerChange(e) {
    const { qid } = e.currentTarget.dataset
    const value = Number(e.detail.value)
    const answers = { ...this.data.answers, [qid]: value }
    const counts = calcCounts(this.data.questions, answers)

    this.setData({
      answers,
      answeredRequiredCount: counts.answeredRequiredCount,
      answeredTotalCount: counts.answeredTotalCount
    })
  },

  prevQuestion() {
    const { currentIndex, questions } = this.data
    if (currentIndex <= 0) {
      return
    }
    const nextIndex = currentIndex - 1
    this.setData({
      currentIndex: nextIndex,
      currentQuestion: questions[nextIndex]
    })
  },

  nextQuestion() {
    const { currentIndex, questions } = this.data
    if (currentIndex >= questions.length - 1) {
      return
    }
    const nextIndex = currentIndex + 1
    this.setData({
      currentIndex: nextIndex,
      currentQuestion: questions[nextIndex]
    })
  },

  jumpToQuestion(e) {
    const index = Number(e.currentTarget.dataset.index)
    const { questions } = this.data
    if (Number.isNaN(index) || !questions[index]) {
      return
    }
    this.setData({
      currentIndex: index,
      currentQuestion: questions[index]
    })
  },

  submitTask() {
    const {
      requiredCount,
      answeredRequiredCount,
      types,
      answers
    } = this.data

    if (answeredRequiredCount < requiredCount) {
      wx.showToast({
        title: `还有${requiredCount - answeredRequiredCount}题未答`,
        icon: 'none'
      })
      return
    }

    const scores = types
      .map((type) => calcTypeScore(type, answers))
      .sort((a, b) => b.standard - a.standard)
    const result = {
      top: scores[0],
      scores
    }

    this.setData({ result })
    wx.setStorageSync('taskACompleted', true)
    wx.setStorageSync('taskAResult', result)

    wx.showToast({
      title: '提交成功',
      icon: 'success'
    })
  }
})
