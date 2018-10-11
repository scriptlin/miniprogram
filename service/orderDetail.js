const request = require('../utils/request.js');

//项目详细
exports.getOrderDetail = function (id) {
  return request({
    url: `/api/custom/order/getOrderDetail?id=${id}`,
    method: 'GET',
  })
}