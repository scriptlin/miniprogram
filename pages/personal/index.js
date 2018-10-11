Page({
  data:{
    personData: {
      avatarUrl: '',
      nickName: ''
    },
    showModal: false,
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '我的'
    });
    let _this = this
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log(res)
              _this.setData({
                personData: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                }
              })
            }
          })
        }
      }
    })
  },
  allOrder: function() {
    wx.navigateTo({
      url: '/pages/orders/orders?status=1',
    })
  },
  needPay: function () {
    wx.navigateTo({
      url: '/pages/orders/orders?status=2',
    })
  },
  cancelOrder: function () {
    wx.navigateTo({
      url: '/pages/orders/orders?status=3',
    })
  },
  confirmOrder: function () {
    wx.navigateTo({
      url: '/pages/orders/orders?status=4',
    })
  },
  finishOrder: function () {
    wx.navigateTo({
      url: '/pages/orders/orders?status=5',
    })
  },
  toInforms: function() {
    wx.navigateTo({
      url: '/pages/manageInfo/index',
    });
  },
})