const getGoodsDetail = require('../../service/good.js').getGoodsDetail;
const share = require('../../utils/share.js');
Page({
  data: {
    goodDetail: {}
  },
  onShareAppMessage: function (res) {
    share.share(res)
  },
  onLoad: function (options) {
    wx.showShareMenu({ withShareTicket: true });
    wx.setNavigationBarTitle({
      title: options.name
    });
    const id = options.id;
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: () => {
        getGoodsDetail(id).then((res) => {
          wx.hideLoading();
          if (res.data.code === 0) {
            this.setData({
              goodDetail: res.data.data
            })
          }
        })
      }
    })
  },
  order: function (e) {
    wx.navigateTo({
      url: `/pages/payNow/payNow?id=${this.data.goodDetail.id}`
    });
  }
})