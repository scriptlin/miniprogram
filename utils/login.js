const userApi = require('../service/user.js')

const register = () => {
  wx.login({
    timeout: 5000,
    success: (res) => {
      if (res.code) {
        const code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: (res) => {
            const { iv, encryptedData, userInfo } = res;
            userApi.login({
              code,
              iv,
              encryptedData,
              ...userInfo
            }).then(res => {
              if (res.data.code === 0) {
                // 将标志用户登录的信息写入微信缓存中
                wx.setStorage({
                  key: "sessionId",
                  data: res.data.data.sessionId
                });
                wx.hideLoading();
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 1000
                })
              }
            }).catch(err => {
              console.log('登录失败', err);
            })
          }
        });
        
      } else {
        console.log('登录失败', res.code);
      }
    },
    fail: (error) => {
      console.log('code获取失败', error);
    }
  })
}

const login = () => {
  // console.log('login')
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userInfo']) {
        register();
      } else {
        console.log('用户未授权获取用户信息');
      }
    },
    fail: (error) => {
      console.log('获取授权信息错误', error);
    }
  }) 
}

module.exports = login;