const request = require('../utils/request.js');

exports.getOrderList=function(status) {
  return request({
    data: {
      status
    },
    url: '/api/custom/order/getOrderList',
    method: 'GET',
  })
}
