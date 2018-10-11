const request = require('../utils/request.js');

//联系人信息列表
exports.getContactList = function(){
  return request({
    url: '/api/custom/user/getContactList',
    method: 'GET',
  })
}
//删除联系人信息
exports.deleteInform = function(data){
  return request({
    url: '/api/custom/user/deleteContact',
    method: 'POST',
    data
  })
}
