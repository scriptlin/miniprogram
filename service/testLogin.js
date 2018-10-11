const request = require('../utils/request.js');

module.exports.testLogin = () => {
  return request({
    method: 'GET',
    url: '/api/custom'
  });
}