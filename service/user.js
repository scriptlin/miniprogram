const request = require('../utils/request.js');

module.exports.login = (data) => {
  return request({
    url: '/api/user/userLogin',
    method: 'POST',
    data
  })
}