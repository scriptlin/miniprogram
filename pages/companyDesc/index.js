const homeApi = require('../../service/home.js');

Page({
  data: {
    companyDesc: [],
    id: 0,
    name: ''
  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
      name: options.name
    });
    wx.setNavigationBarTitle({
      title: options.name
    });
    homeApi.getCompanyInfo({ id: options.id}).then(data => {
      console.log(data.data.data)
      this.setData({
        companyDesc: data.data.data
      })
    })
  }
})