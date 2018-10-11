// pages/payNow/payNow.js
//调用支付
const payMent = require('../../utils/payMent.js').payMent;
//获取订单详情
const orderInfo = require('../../service/payNow.js').orderInfo;
// 生成订单
const makeOrder = require('../../service/payNow.js').makeOrder;
//获取日期
var util = require('../../utils/util.js');
Page({
      data: {
            "id": "",
            "name": "",
            "mobile":"",
            "id_card": "",
            effectDate:[],
            informs: {id:0},
            goodsImformation:{},
            start_time:'',
            last_time: '',
            dayBuyLast:'',
            goods_id: '',
            subscribe_time: '',
            amount: 1,
            contact_inform_id: '',
            singlePrice: '',
            totalPrice: '',
            goodDate: '2001-1-1',
            display:'',
      },  
    onLoad: function (option){
      var that = this;
      var id = option.id
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          //调用获取订单详情接口
          orderInfo(id).then((res) => {
            const goodsInfo = res.data.data;
            //设置data：单价，总价，商品信息（goodsImformation），商品id，等
            const start_time = new Date(goodsInfo.start_time);
            const last_time = new Date(goodsInfo.last_time);
            console.log(goodsInfo.limite_amount)
            that.setData({
              singlePrice: goodsInfo.price.toFixed(2),
              goodsImformation:goodsInfo,
              dayBuyLast:goodsInfo.day_buy_last,
              goods_id: goodsInfo.id,
              start_time: `${start_time.getFullYear()}.${start_time.getMonth()+1}.${start_time.getDate()}`,
              last_time: `${last_time.getFullYear()}.${last_time.getMonth()+1}.${last_time.getDate()}`,
              effectDate: [that.returnYMD(goodsInfo.start_time), that.returnYMD(goodsInfo.last_time)],
              loadCalendar: true,
            })
            that.setData({
              totalPrice: (that.data.singlePrice * that.data.amount).toFixed(2),
            })
          })
          //数据设置完毕后隐藏Loading
          wx.hideLoading()
        }
      });
      wx.setStorage({
        key: "date",
        data: {
          goodDate: this.data.goodDate
        },
      })
      //页面初始加载完闭，将当前日历选择的时间和选择的数量存至本地缓存
      // wx.setStorage({
      //   key: 'date',
      //   data: { goodDate: this.data.goodDate }
      // })
      // wx.setStorage({
      //   key: 'amount',
      //   data: { amount: this.data.amount }
      // })
    },
    returnYMD: function(data) {
      const date = new Date(data);
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    //页面重新加载获取用户信息，并拉取本地缓存
    onShow: function (){
      var that = this;
      wx.getStorage({
        key: 'chooseContact',
        success: function (res) {
          that.setData({
            informs: res.data,
            userInfo:'ture',
          })
        },
      })
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          //获取用户选择的数量
          wx.getStorage({
            key: 'amount',
            success: (res) => {
              that.setData({
                amount: res.data.amount,
              })
            }
          })
          //获取用户选择的日期
          wx.getStorage({
            key: 'date',
            success: (res) => {
              that.setData({
                goodDate: res.data.goodDate,
              })
              //当用户选择了日期，就将“请选择出行日期这句话设置为display：none”
              if (res.data.goodDate != "2001-1-1") {
                that.setData({
                  display: "display:none"
                })
              }
            }
          })
          wx.hideLoading()
        }
      })
    },     
    onUnload: function(options) {
      //离开页面时。清除本地缓存
      wx.removeStorage({ key: 'amount' });
      wx.removeStorage({ key: 'chooseContact' });
      wx.removeStorage({ key: 'date' });
    },
    //button绑定计数器
    reduce: function (amount, singlePrice, totalPrice){
      this.setData({
        amount: this.data.amount - 1,
      })
      //如果同时设置两个值，会导致数量和总价不同步，下同
      this.setData({
        totalPrice: (this.data.singlePrice * this.data.amount).toFixed(2),
      })
    },
    add: function (amount, singlePrice, totalPrice) {
        this.setData({
            amount: this.data.amount + 1,
        })
        this.setData({
            totalPrice: (this.data.singlePrice * this.data.amount).toFixed(2),
        })
    },
    //立即支付
    payNow: function(e) {
      var that = this;
      var goodDate = this.data.goodDate;
      //判断日期是否为空
      if(goodDate == "2001-1-1"){
        //如果为空，抛出提示
        wx.showToast({
            title: '请选择日期',
            duration: 1000,
        })
      }else{
        //获取日期
        var date = util.formatTime(new Date());
        goodDate = goodDate.replace(/\-/g, '/')
        var goodDate = util.formatTime(new Date(goodDate));
        var date1 = new Date(date);
        var goodDate2 = new Date(goodDate);
        //获取年月日，以做比较
        const iosDate1 = `${date1.getFullYear()}.${date1.getMonth()}.${date1.getDate()}`
        const iosDate2 = `${goodDate2.getFullYear()}.${goodDate2.getMonth()}.${goodDate2.getDate()}`
        if (iosDate1 == iosDate2) {
          //如果是今天，就把向后台传输的日期数据设为今天
          this.setData({
            subscribe_time: date1
          })
        } else {
          //如果不是今天，就把向后台传输的日期数据设为用户选择的那天的00:00:00
          this.setData({
            subscribe_time: goodDate2
          })
        }
        //判断是否选择了联系人
        //判断用户信息数组中是否有联系人信息
        // if (this.data.informs[0] == undefined) {
        //   //如果没有联系人信息
        //   wx.showToast({
        //       title: '请添加联系人',
        //       duration: 1000,
        //   })
        // } else 
        if (this.data.informs.id == 0) {
          //如果有信息，但没有选择
          wx.showToast({
              title: '请选择联系人',
              duration: 1000,
          })
          return;
        }
        //如果有联系人信息，且已选择，就把当前商品id，联系人id，存至data
        this.setData({
          goods_id: this.data.goodsImformation.id,
          contact_inform_id: this.data.informs.id
        })
        //声明调用生成订单需要的四个参数
        var amount = this.data.amount,
        goods_id = this.data.goods_id,
        subscribe_time = this.data.subscribe_time,
        contact_inform_id = this.data.contact_inform_id
        //调用之前抛出提示
        makeOrder(amount, goods_id, subscribe_time, contact_inform_id).then((res) => {
          //如果后台返回参数code为0，表示订单生成成功
          if (res.data.code == 0) {
            //声明一个data，将后台返回的参数全部赋值进去
            var data = res.data.data;
            //调用微信支付接口
            payMent(data);
            // wx.showLoading({
            //   title: '加载中',
            //   mask: true,
            //   success: () => {
            //     //调用成功之后，清除一波本地缓存，不知道有没有用
            //     wx.removeStorage({ key: 'amount' });
            //     wx.removeStorage({ key: 'chooseContact' });
            //     wx.removeStorage({ key: 'date' });
            //     wx.hideLoading();
            //   }
            // })
            //如果后端返回code为-1，表示生成订单失败
          } else if (res.data.code == -1) {
            //再判断一波返回的msg
            if (res.data.msg == "缺少必要参数") {
              wx.showLoading({
                title: '缺少必要参数',
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            } else {
              wx.showLoading({
                title: '预约时间不在活动范围内',
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            }
          }
        })
      } 
    },
    //添加联系人信息
  toChooseContact:function(){
      //避免跳转回页面，用户之前选择的数量和日期数据重置，所以将这两个数据存进本地缓存
      wx.setStorage({
        key: 'date',
        data: { goodDate: this.data.goodDate }
      })
      wx.setStorage({
        key: 'amount',
        data: { amount: this.data.amount }
      })
      //跳转页面
    wx.navigateTo({
      url: '/pages/manageInfo/index?isOrder=true'
    })
    },
    dateChoose: function(e){
      if (e.detail === '2001-1-1') {
        this.setData({
          calendar: false,
        });
        return;
      }
      this.setData({
        calendar: false,
        goodDate: e.detail
      })
    },
    during: function(option) {
      wx.setStorage({
        key: "amount",
        data: {
          amount: this.data.amount
        },
      })
      wx.getStorage({
        key: 'date',
        success: (res) => {
          let chooseDate = null;
          if (res.data.goodDate && res.data.goodDate !== '2001-1-1') {
            const date = res.data.goodDate.split('-');
            chooseDate = [parseInt(date[0]), parseInt(date[1]), parseInt(date[2])]
          }
          const { dayBuyLast, effectDate } = this.data;
          const url = `/pages/calendar/index?dayBuyLast=${dayBuyLast}&startDate=${effectDate[0]}&endDate=${effectDate[1]}&chooseDate=${chooseDate}`;
          wx.navigateTo({ url })
        }, 
        fail: function(res) {
          // console.log(res)
        }
      });
    },

    radio: function (e) {
        this.setData({
            mobile: e.currentTarget.dataset.mobile,
            id: e.currentTarget.dataset.id,
            name:e.currentTarget.dataset.name
        })
    },
    listenRadioGroup: function (e) {
        this.setData({
            name:e.detail.value,
        })
    },
})