// pages/yangsheng/yaoshanbao/good-detail/index.js
const cart = require('../../../../utils/cart')
const api = require('../../../../utils/api')

Page({
  data: {
    goods: {},
    count: 0
  },

  onLoad(options) {
    this.goodsId = options.id
    this.loadDetail()
  },

  async loadDetail() {
    const goods = await api.getGoodsDetail(this.goodsId)
    this.setData({ goods }, () => this.syncCount())
  },

  onShow() {
    if (this.data.goods.id) this.syncCount()
  },

  onQrLongPress() {
    wx.previewImage({
      current: this.data.goods.video,
      urls: [this.data.goods.video]
    })
  },

  syncCount() {
    this.setData({
      count: cart.getCount(this.data.goods.id)
    })
  },

  add() {
    cart.addGoods(this.data.goods)
    this.syncCount()
  },

  minus() {
    cart.minusGoods(this.data.goods.id)
    this.syncCount()
  },

  goCart() {
    wx.navigateTo({ url: '/pages/yangsheng/yaoshanbao/cart/index' })
  },

  onQrLongPress() {
    wx.previewImage({
      current: this.data.goods.video,
      urls: [this.data.goods.video]
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
