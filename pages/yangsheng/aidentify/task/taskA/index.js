// pages/yangsheng/aidentify/task/taskA/index.js
Page({
  submitTask() {
    wx.setStorageSync('taskACompleted', true)

    wx.showToast({
      title: '提交成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  }
})
