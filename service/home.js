const request = require('../utils/request.js');

module.exports.getSlider = (data) => {
  return request({
    data,
    url: '/api/custom/goods/getSlider',
    method: 'GET',
  });
}

module.exports.getCompanyList = (data) => {
  return request({
    data,
    url: '/api/custom/company/getCompanyList',
    method: 'GET',
  })
}

module.exports.getGoodsList = (data) => {
  return request({
    data,
    url: '/api/custom/goods/getGoodsList',
    method: 'GET',
  })
}


module.exports.getCompanyInfo = (data) => {
  return request({
    data,
    url: '/api/custom/company/getCompanyInfo',
    method: 'GET'
  })
}

