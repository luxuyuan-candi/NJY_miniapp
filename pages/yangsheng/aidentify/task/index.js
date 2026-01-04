// pages/yangsheng/aidentify/task/index.js
Page({
  data: {
    taskACompleted: false,
    taskBCompleted: false,
    allCompleted: false
  },

  onShow() {
    this.checkTaskStatus()
  },

  checkTaskStatus() {
    const taskA = wx.getStorageSync('taskACompleted')
    const taskB = wx.getStorageSync('taskBCompleted')

    this.setData({
      taskACompleted: !!taskA,
      taskBCompleted: !!taskB,
      allCompleted: !!taskA && !!taskB
    })
  },

  goTaskA() {
    wx.navigateTo({
      url: '/pages/yangsheng/aidentify/task/taskA/index'
    })
  },

  goTaskB() {
    wx.navigateTo({
      url: '/pages/yangsheng/aidentify/task/taskB/index'
    })
  },

  goResult() {
    wx.navigateTo({
      url: '/pages/yangsheng/aidentify/task/result/index'
    })
  },
  resetTest() {
    wx.showModal({
      title: '确认',
      content: '确定要重新测试吗？之前的数据将被清空。',
      success: (res) => {
        if (res.confirm) {
          // 清空存储
          wx.removeStorageSync('taskACompleted')
          wx.removeStorageSync('taskBCompleted')

          // 更新页面状态
          this.setData({
            taskACompleted: false,
            taskBCompleted: false,
            allCompleted: false
          })

          wx.showToast({
            title: '已重置',
            icon: 'success'
          })
        }
      }
    })
  }
})
