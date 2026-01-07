// utils/api.js
const BASE_URL = "https://www.njwjxy.cn:30443/api/yangsheng/yaoshanbao" // 改成你的服务地址

function request(url, method = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: { "Content-Type": "application/json" },
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          wx.showToast({
            title: res.data.msg || "请求错误",
            icon: "none"
          })
          reject(res.data)
        }
      },
      fail(err) {
        wx.showToast({ title: "网络请求失败", icon: "none" })
        reject(err)
      }
    })
  })
}

function getGoodsList() {
  return request("/goods")
}

function getGoodsDetail(id) {
  return request(`/goods/${id}`)
}

module.exports = { getGoodsList, getGoodsDetail }
