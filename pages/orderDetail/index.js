const getTime = require('../../utils/util.js');
const getOrderDetail = require('../../service/orderDetail.js').getOrderDetail;
Page({
  data: {
    detail: {},
    id: 0,
  },
  onPullDownRefresh: function() {
    this.getOrderInfo(this.data.id);
  },
  onLoad: function (options) {
    wx.startPullDownRefresh()
    const id = options.id;
    this.setData({ id });
    this.getOrderInfo(id);
  },
  getOrderInfo: function (id) {
    const _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        getOrderDetail(id).then((result) => {
          if (result.data.code === 0) {
            //修改时间格式
            const { data } = result.data.data;
            data.create_time = getTime.formatTime(new Date(data.create_time));
            data.subscribe_time = getTime.formatTime(new Date(data.subscribe_time));
            console.log(data);
            //修改支付状态
            switch (data.status) {
              case 1:
                data.status = '已取消';
                break;
              case 3:
                data.status = '待出行';
                break;
              case 4:
                data.status = '已取消';
                break;
              case 5:
                data.status = '已完成';
                break;
            };
            //修改活动日期格式
            data.start_time = _this.returnYMD(data.start_time);
            data.last_time = _this.returnYMD(data.last_time);
            //修改金额格式
            data.price = data.price.toFixed(2);
            data.pay_price = data.pay_price.toFixed(2);
            _this.setData({
              detail: data
            });
            wx.stopPullDownRefresh();
            wx.hideLoading();
          }
        })
      },
    })
  },
  returnYMD: function (data) {
    const date = new Date(data);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  },
  jump: function () {
    wx.navigateTo({
      url: `/pages/good/index?id=${this.data.detail.goods_id}&name=${this.data.detail.goods_name}`
    });
  }
})