// pages/yangsheng/index/index.js
const cart = require('../../../utils/cart')
const api = require('../../../utils/api')

Page({
  data: {
    showSidebar: false,
    goodsList: [],
    totalCartCount: 0
  },

  openSidebar() {
    this.setData({ showSidebar: true })
  },

  closeSidebar() {
    this.setData({ showSidebar: false })
  },

  goPage(e) {
    const page = e.currentTarget.dataset.page


    wx.navigateTo({
      url: `/pages/yangsheng/${page}/index`
    })
  },
  goIndex() {
    this.closeSidebar()

    wx.switchTab({
      url: `/pages/index/index`
    })
  },

  onShow() {
    this.loadGoods()
    this.updateCartCount()
  },

  async loadGoods() {
    try {
      const list = await api.getGoodsList()
      // 同步每个商品数量
      const mappedList = list.map(item => ({
        ...item,
        count: cart.getCount(item.id)
      }))
      this.setData({ goodsList: mappedList })
    } catch (err) {
      console.error(err)
    }
  },

  refreshCount() {
    const list = this.data.goodsList.map(item => ({
      ...item,
      count: cart.getCount(item.id)
    }))

    this.setData({ goodsList: list })
  },

  updateCartCount() {
    const cartList = Object.values(cart.getCart())
    const total = cartList.reduce((sum, item) => sum + item.count, 0)
    this.setData({ totalCartCount: total })
  },

  add(e) {
    const id = e.currentTarget.dataset.id
    const goods = this.data.goodsList.find(item => item.id === id)

    cart.addGoods(goods)
    this.refreshCount()
    this.updateCartCount()
  },

  minus(e) {
    const id = e.currentTarget.dataset.id
    cart.minusGoods(id)
    this.refreshCount()
    this.updateCartCount()
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/yangsheng/yaoshanbao/good-detail/index?id=${id}`
    })
  },

  goCart() {
    wx.navigateTo({
      url: '/pages/yangsheng/yaoshanbao/cart/index'
    })
  }
})
