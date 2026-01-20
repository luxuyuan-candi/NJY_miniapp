// pages/yangsheng/yaoshanbao/good-detail/index.js
const cart = require('../../../../utils/cart')
const api = require('../../../../utils/api')
const jsQR = require('../../../../utils/jsqr/index.js')

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
    this._qrNavigated = false
    this._qrBusy = false
    if (this.data.goods.id) this.syncCount()
  },

  async onQrLongPress(e) {
    const now = Date.now()
    const lastTs = this._qrLastTs || 0
    const eventTs = (e && e.timeStamp) || 0

    if (this._qrBusy || this._qrNavigated) {
      return
    }
    if (eventTs && eventTs === lastTs) {
      return
    }
    if (now - lastTs < 1200) {
      return
    }

    this._qrBusy = true
    this._qrLastTs = eventTs || now
    wx.vibrateShort({ type: 'light' })

    const { video } = this.data.goods
    if (!video) {
      this._qrBusy = false
      return
    }

    try {
      const imageInfo = await new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: video,
          success: resolve,
          fail: reject
        })
      })

      const canvas = wx.createSelectorQuery()
        .in(this)
        .select('#qrCanvas')
      const canvasNode = await new Promise((resolve) => {
        canvas.node().exec((res) => resolve(res[0].node))
      })

      const ctx = canvasNode.getContext('2d')
      const width = imageInfo.width
      const height = imageInfo.height

      canvasNode.width = width
      canvasNode.height = height
      ctx.clearRect(0, 0, width, height)

      const image = canvasNode.createImage()
      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
        image.src = imageInfo.path
      })

      ctx.drawImage(image, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const code = jsQR(imageData.data, width, height)

      if (code && code.data) {
        const text = code.data.trim()
        if (/^https?:\/\//i.test(text)) {
          this._qrNavigated = true
          wx.navigateTo({
            url: `/pages/webview/index?url=${encodeURIComponent(text)}`
          })
          return
        }

        wx.showModal({
          title: '识别结果',
          content: text,
          showCancel: true,
          confirmText: '复制',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.setClipboardData({ data: text })
            }
          }
        })
      } else {
        wx.showToast({
          title: '未识别到二维码',
          icon: 'none'
        })
      }
    } catch (error) {
      wx.showToast({
        title: '识别失败，请重试',
        icon: 'none'
      })
    }
    this._qrBusy = false
    if (this._qrNavigated) {
      setTimeout(() => {
        this._qrNavigated = false
      }, 1500)
    }
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

  goBack() {
    wx.navigateBack()
  }
})
