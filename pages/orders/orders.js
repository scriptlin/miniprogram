const request = require('../../utils/request.js');
const getTime = require('../../utils/util.js');
const grtApi = require('../../service/order.js');
// pages/orders/orders.js
const array = [];
Page({
  data: {
    array1: '',
    nothing: 'block',
  },
  tap:function(e){
    this.setData({
      color1: 'black',
      color2: 'black',
      color3: 'black',
      color4: 'black'
    })
 
  },
  witepay: function(e) {
    var a = e.currentTarget.id;
    wx.navigateTo({
      url: `/pages/orderDetail/index?id=${a}`
    })
  },
  returnYMD: function (data) {
    const date = new Date(data);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  },
  tap1: function(e) {
    const _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function() {
        grtApi.getOrderList(0).then((result) => {
          if (result.data.code === 0) {
            const { data: { data } } = result;
            for (let i = 0; i < data.total;i++){
              const berif=data.orderList[i];
              berif.subscribe_time = _this.returnYMD(berif.subscribe_time)
            };
            _this.setData({
             color1: 'red',
              array1: data.orderList,
            })
            if (data.total == 0) {
              _this.setData({
                nothing: 'blokc',
              })
            } else
              _this.setData({
                nothing: 'none',
              })
            wx.hideLoading();
          }
        })
      }
    })
  },
  tap2: function(e) {
    const _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function() {
        grtApi.getOrderList(3).then((result) => {
          if (result.data.code === 0) {
            const { data: { data } } = result;
            for (let i = 0; i < data.total; i++) {
              const berif = data.orderList[i];
              berif.subscribe_time = _this.returnYMD(berif.subscribe_time)
            };
            _this.setData({
              color2: 'red',
              array1: data.orderList,
            })
            if (data.total == 0) {
              _this.setData({
                nothing: 'blokc',
              })
            } else
              _this.setData({
                nothing: 'none',
              })
            wx.hideLoading();
          }
        })
      }
    })
  },
  tap3: function(e) {
    const _this = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function() {
        grtApi.getOrderList(1).then((result) => {
          if (result.data.code === 0) {
            const {data:{data}} = result;
            _this.data.array1 = data.orderList
            grtApi.getOrderList(4).then((result) => {
              if (result.data.code === 0) {
                const { data: { data } } = result;
                _this.data.array1 = _this.data.array1.concat(data.orderList);
                for (let i = 0; i < _this.data.array1.length; i++) {
                  _this.data.array1[i].subscribe_time = _this.returnYMD(_this.data.array1[i].subscribe_time)
                };
                _this.setData({
                  color3: 'red',
                  array1: _this.data.array1,
                })
                if (_this.data.array1.length == 0) {
                  _this.setData({
                    nothing: 'blokc',
                  })
                } else
                  _this.setData({
                    nothing: 'none',
                  })
                wx.hideLoading();
              }
            })
          }
        })
      }
    })
  },
  tap4: function(e) {
    const _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function() {
        grtApi.getOrderList(5).then((result) => {
          if (result.data.code === 0) {
            const { data: { data } } = result;
            for (let i = 0; i < data.total; i++) {
              const berif = data.orderList[i];
              berif.subscribe_time = _this.returnYMD(berif.subscribe_time)
            };
            _this.setData({
              color4: 'red',
              array1: data.orderList,
            })
            if (data.total == 0) {
              _this.setData({
                nothing: 'blokc',
              })
            } else
              _this.setData({
                nothing: 'none',
              })
            wx.hideLoading();
          }
        })
      }
    })
  },
  onLoad: function(options) {
    const _this = this;
    if (options.status == 1) {
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function() {
          grtApi.getOrderList(0).then((result) => {
            if (result.data.code === 0) {
              const { data: { data } } = result;
              for (let i = 0; i < data.total; i++) {
                const berif = data.orderList[i];
                berif.subscribe_time = _this.returnYMD(berif.subscribe_time)
              };
              _this.setData({
                color1: 'red',
                array1: data.orderList,
              })
              if (data.total == 0) {
                _this.setData({
                  nothing: 'blokc',
                })
              } else
                _this.setData({
                  nothing: 'none',
                })
              wx.hideLoading();
            }
          })
        }
      })
    }
    if (options.status == 3) {
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          grtApi.getOrderList(1).then((result) => {
            if (result.data.code === 0) {
              const { data: { data } } = result;
              _this.data.array1 = data.orderList
              grtApi.getOrderList(4).then((result) => {
                if (result.data.code === 0) {
                  const { data: { data } } = result;
                  _this.data.array1 = _this.data.array1.concat(data.orderList);
                  for (let i = 0; i < _this.data.array1.length; i++) {
                    _this.data.array1[i].subscribe_time = _this.returnYMD(_this.data.array1[i].subscribe_time)
                  };
                  _this.setData({
                    color3: 'red',
                    array1: _this.data.array1,
                  })
                  if (_this.data.array1.length == 0) {
                    _this.setData({
                      nothing: 'blokc',
                    })
                  } else
                    _this.setData({
                      nothing: 'none',
                    })
                  wx.hideLoading();
                }
              })
            }
          })
        }
      })

    }
    if (options.status == 4) {
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function() {
          grtApi.getOrderList(3).then((result) => {
            if (result.data.code === 0) {
              const { data: { data } } = result;
              for (let i = 0; i < data.total; i++) {
                const berif = data.orderList[i];
                berif.subscribe_time = _this.returnYMD(berif.subscribe_time)
              };
              _this.setData({
                color2: 'red',
                array1: data.orderList,
              })
              if (data.total == 0) {
                _this.setData({
                  nothing: 'blokc',
                })
              } else
                _this.setData({
                  nothing: 'none',
                })
              wx.hideLoading();
            }
          })
        }
      })
    }
    if (options.status == 5) {
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function() {
          grtApi.getOrderList(5).then((result) => {
            if (result.data.code === 0) {
              const { data: { data } } = result;
              for (let i = 0; i < data.total; i++) {
                const berif = data.orderList[i];
                berif.subscribe_time = _this.returnYMD(berif.subscribe_time)
              };
              _this.setData({
            color4: 'red',
                array1: data.orderList,
              })
              if (data.total == 0) {
                _this.setData({
                  nothing: 'blokc',
                })
              } else
                _this.setData({
                  nothing: 'none',
                })
              wx.hideLoading();
            }
          })
        }
      })
    }
  }
})