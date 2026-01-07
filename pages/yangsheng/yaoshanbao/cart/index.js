// pages/yangsheng/yaoshanbao/cart/index.js
const cart = require('../../../../utils/cart')

Page({
  data: {
    cartList: [],
    totalPrice: 0
  },

  onShow() {
    this.loadCart()
  },

  loadCart() {
    const cartData = Object.values(cart.getCart())
    const total = cartData.reduce((sum, item) => sum + item.price * item.count, 0)

    const list = cartData.map(item => ({
      ...item,
      subtotal: (item.price * item.count).toFixed(2)
    }))

    this.setData({
      cartList: list,
      totalPrice: total.toFixed(2)
    })
  },

  add(e) {
    const id = e.currentTarget.dataset.id
    const goods = this.data.cartList.find(item => item.id === id)
    cart.addGoods(goods)
    this.loadCart()
  },

  minus(e) {
    const id = e.currentTarget.dataset.id
    cart.minusGoods(id)
    this.loadCart()
  },

  // ----------------------
  // 清空购物车
  // ----------------------
  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确认清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('cart', {})
          const app = getApp()
          app.globalData.cart = {}
          this.loadCart()
        }
      }
    })
  },

  checkout() {
    wx.showToast({
      title: '结算功能待实现',
      icon: 'none'
    })
  },

  goBack() {
    wx.navigateBack()
  }
})