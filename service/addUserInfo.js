const request = require('../utils/request.js');

//新增用户基本信息
exports.addContact = function (data) {
  return request({
    url: '/api/custom/user/addContact',
    method: 'POST',
    data
  })
}