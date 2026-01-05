// pages/yangsheng/video/video.js
Page({
  data: {
    video: {}
  },

  onLoad(options) {
    const id = options.id
    this.getVideoDetail(id)
  },

  getVideoDetail(id) {
    // 示例数据（后期换成接口）
    if (!id) return;

    wx.request({
      url: 'https://www.njwjxy.cn:30443/api/yangsheng/yangshengshiping/video/detail',
      method: 'GET',
      data: { id },
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({ video: res.data.data });
        } else {
          wx.showToast({ title: res.data.msg, icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '请求失败', icon: 'none' });
      },
    });
  }
})
