const app = getApp()

function getCart() {
  return app.globalData.cart || {}
}

function saveCart(cart) {
  app.globalData.cart = cart
  wx.setStorageSync('cart', cart)
}

function addGoods(goods) {
  const cart = getCart()
  const id = goods.id

  if (cart[id]) {
    cart[id].count++
  } else {
    cart[id] = {
      ...goods,
      count: 1
    }
  }

  saveCart(cart)
}

function minusGoods(id) {
  const cart = getCart()

  if (!cart[id]) return

  if (cart[id].count > 1) {
    cart[id].count--
  } else {
    delete cart[id]
  }

  saveCart(cart)
}

function getCount(id) {
  const cart = getCart()
  return cart[id] ? cart[id].count : 0
}

function getCartList() {
  return Object.values(getCart())
}



module.exports = {
  addGoods,
  minusGoods,
  getCount,
  getCartList,
  getCart
}
