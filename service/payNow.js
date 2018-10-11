const request = require('../utils/request.js');
//获取订单详情
module.exports.orderInfo = function(id){
    return request({
        url: `/api/custom/goods/getGoodsDetail?id=${id}`,
        method: 'GET',
    })
},
//生成订单
module.exports.makeOrder = function (amount, goods_id, subscribe_time, contact_inform_id) {
    return request({
        url: `/api/custom/order/createOrder`,
        method: 'post',
        data:{
            amount, 
            goods_id, 
            subscribe_time, 
            contact_inform_id,
        }
    })
}
