Page({
  data: {
    products: []
  },

  onLoad() {
    this.loadProducts();
  },

  loadProducts(callback) {
    wx.request({
      url: 'https://www.njwjxy.cn:30443/api/maoning_maosha/products',
      method: 'GET',
      success: (res) => {
        this.setData({ products: res.data });
        if (callback) callback();
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' });
        if (callback) callback();
      }
    });
  },

  // ✅ 点击图片放大预览
  previewImage(e) {
    let current = e.currentTarget.dataset.current;
    let urls = e.currentTarget.dataset.urls.filter(u => u); // 去掉 null

    wx.previewImage({
      current: current, // 当前显示的图片
      urls: urls        // 所有可预览的图片
    });
  },

  onPullDownRefresh() {
    this.loadProducts(() => {
      wx.stopPullDownRefresh();
    });
  },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/maosha_add/index'
    });
  }
});

