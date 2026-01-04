// pages/yangsheng/aidentify/task/taskB/index.js
Page({
  takePhoto() {
    const ctx = wx.createCameraContext()

    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('照片路径：', res.tempImagePath)

        wx.showToast({
          title: '拍照成功',
          icon: 'success'
        })

        // 标记任务完成
        wx.setStorageSync('taskBCompleted', true)

        // 延迟返回体质测试页
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      },
      fail: (err) => {
        wx.showToast({
          title: '拍照失败',
          icon: 'error'
        })
        console.error(err)
      }
    })
  }
})


