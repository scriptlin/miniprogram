const request = require('../../utils/request.js');
function getOrderList(status) {
  return request({
    data: { status },
    url: '/api/custom/order/getOrderList',
    method: 'GET',
  })
}
function tRequest(status){
    getOrderList(status).then((result) => {
      wx.hideLoading();
      if (result.data.code === 0) {
        const { data: { data } } = result;
        this.setData({
          loadding: 'none',
          array1: data.orderList,
          array2: {},
        })
      }
    })
}





