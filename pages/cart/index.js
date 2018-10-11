Page({
  data: {
    total: 0,
    goodCount: 0,
    orders: [
      {
        orderId: 1,
        name: '皮划艇',
        companyName: '华仁启智',
        companyId: 1,
        imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        price: 100,
        time: '2018-7-20',
        amount: 3
      }, {
        orderId: 2,
        name: '皮划艇',
        companyName: '华仁启智',
        companyId: 1,
        imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        price: 100,
        time: '2018-7-20',
        amount: 4
      }, {
        orderId: 3,
        name: '皮划艇',
        companyName: '华仁启智',
        companyId: 1,
        imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        price: 100,
        time: '2018-7-20',
        amount: 2
      }
    ]
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '购物车'
    });
  }
})