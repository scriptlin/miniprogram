Page({
  data: {
    timeout: 3,
    timer: null,
    iconTimer: null,
    id: 0,
    iconSize: 50,
    iconNum: 0,
    navClass: 'toNow'
  },
  onLoad: function(options) {
    const id = options.id;
    // 计时器定时器
    const timer = setInterval(() => {
      if (this.data.timeout > 0) {
        this.setData({
          timeout: this.data.timeout - 1
        });
      } else {
        wx.navigateTo({
          url: `/pages/orderDetail/index?id=${id}`
        });
        clearInterval(this.data.iconTimer);
        clearInterval(this.data.timer);
      }
    }, 1000);
    // icon图标定时器
    const iconTimer = setInterval(() => {
      if (this.data.iconNum >= 3) {
        this.setData({
          iconNum: 0
        });
      } else {
        this.setData({
          iconNum: this.data.iconNum + 1
        });
      }
    }, 500);
    this.setData({
      id,
      timer,
      iconTimer,
    });
  },
  onShow: function() {
    if (this.data.id == 0) {
      wx.navigateBack({
        delta: 3,
        success: () => {
          clearInterval(this.data.timer);
          clearInterval(this.data.iconTimer);
        }
      });
      
    }
  },
  onHide: function() {
    this.setData({
      id: 0
    })
  },
  toNow: function() {
    if (this.data.timeout <= 1) {
      this.setData({
        navClass: 'activeNav'
      })
      wx.navigateTo({
        url: `/pages/orderDetail/index?id=${this.data.id}`,
      })
      clearInterval(this.data.timer);
      clearInterval(this.data.iconTimer);
    }
  }
})