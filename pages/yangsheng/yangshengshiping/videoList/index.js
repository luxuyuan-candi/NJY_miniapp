// pages/yangsheng/index/index.js
Page({
  data: {
    title: '',
    type: '',
    videoList: [],
    loading: false
  },
  onLoad(options) {
    const { title, type } = options;

    this.setData({ title, type });



    // 请求列表数据
    this.fetchList(type);
  },

  fetchList(type) {
    if (!type) return;

    this.setData({ loading: true });

    wx.request({
      url: 'https://www.njwjxy.cn:30443/api/yangsheng/yangshengshiping/video/list',
      method: 'GET',
      data: { type },
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({ videoList: res.data.data });
        } else {
          wx.showToast({ title: res.data.msg, icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '请求失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },
  goVideo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/yangsheng/video/video?id=${id}`
    })
  }
})
