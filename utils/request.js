const notLoading = ['/api/custom/company/getCompanyList', '/api/custom/goods/getGoodsList']
 const BASE_URL = 'http://duanyuanping.6655.la:13254';
const request = (options) => {
  const sessionId = wx.getStorageSync('sessionId');
  // console.log(sessionId)
  if (!notLoading.includes(options.url)) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      header: {
        ...options.header,
        "sessionid": sessionId
      },
      url: `${BASE_URL}${options.url}`,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == -2) {
          wx.removeStorageSync('sessionId')
          wx.showLoading({
            title: '登录中',
            mask: true,
          });
          // 用户session过期了
          require('./login.js')();
        } else {
          resolve(res)
        }
      },
      fail: (res) => {
        reject(res)
      },
      complete: () => {

      }
    })
  })
}

module.exports = request