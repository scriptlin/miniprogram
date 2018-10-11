const request = require('./request.js');

const toOrderDetail = (id) => {
  wx.navigateTo({
    url: `/pages/orderDetail/index?id=${id}`,
  })
}

module.exports.payMent = (data) => {
  const { timeStamp, nonceStr, prepay_id, signType = 'MD5', paySign, orderPayId: id } = data;
  if (!(timeStamp && nonceStr && prepay_id && signType && paySign && id)) {
    console.log('传入的参数缺少');
  }
  wx.requestPayment({
    timeStamp: timeStamp.toString(),
    nonceStr,
    'package': `prepay_id=${prepay_id}`,
    'signType': 'MD5',
    paySign,
    success: () => {
      wx.navigateTo({
        url: `/pages/loadStatus/index?id=${id}`,
      });
    },
    fail: () => {
      request({
        method: 'GET',
        data: {
          id
        },
        url: '/api/custom/order/cancelOrder'
      }).then(() => {
        toOrderDetail(id);
      })
    }
  })
}
