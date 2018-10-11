const request = require('../utils/request.js');

//项目详细
exports.getGoodsDetail = function (id) {
  return request({
    url: '/api/custom/goods/getGoodsDetail',
    method: 'GET',
    data: {id}
  })
}