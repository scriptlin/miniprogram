const testLogin = require('../../service/testLogin.js');

Page({
  data: {
    ifShow: 'none'
  },
  onLoad(){
    let _this = this
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){
          _this.jumpToHome()
        }else{
          _this.setData({ifShow:'block'})
        }
      }
    });
  },
  authUserInfo(e) {
    let _this = this
    if (e.detail.errMsg === 'getUserInfo:ok'){
      _this.jumpToHome();
    }
  },
  jumpToHome(){
    testLogin.testLogin();
    wx.switchTab({
      url: '../index/index',
      error(){
        console.log("跳转失败")
      }
    })
  }
})