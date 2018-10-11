// pages/addUserInfo/addUserInfo.js
const addContact = require('../../service/addUserInfo.js').addContact;
Page({
  data:{
    info:''
  },
  formSubmit: function(e) {
    const {
      username,
      phonenumber,
      idcard
    } = e.detail.value;
    const _this = this;
    var isFalse = true;
    //对用户输入进行判断
    if (username == '') {
      isFalse = false;
      wx.showToast({
        title: '姓名为空',
        duration: 1000,
      })
      return false;
    } else if (phonenumber == '') {
      isFalse = false;
      wx.showToast({
        title: '手机号为空',
        duration: 1000,
      })
      return false;
    } else if (idcard == '') {
      isFalse = false;
      wx.showToast({
        title: '身份证号为空',
        duration: 1000,
      })
      return false;
    }
    var phonetel = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phonetel.test(phonenumber)) {
      isFalse = false;
      wx.showToast({
        title: '手机号有误!',
        duration: 1000,
      })
      return false;
    }
    var name = /^([\u4e00-\u9fa5]){2,7}$/;
    if (!name.test(username)) {
      isFalse = false;
      wx.showToast({
        title: '姓名输入有误!',
        duration: 1000,
      })
      return false;
    }
    var ID = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    if (!ID.test(idcard)) {
      wx.showToast({
        title: '身份证号有误!',
        duration: 2000,
      })
      return false;
    }
    var data = {
      name: username,
      mobile: phonenumber,
      id_card: idcard
    }
    if(isFalse){
      wx.showLoading({
        title:"添加中",
        mask:true,
        success:function(){
          addContact(data).then((res)=>{
            if(res.data.code === 0){
              wx.hideLoading();
              wx.showToast({
                title: '添加信息成功!',
                duration: 1000,
                success:()=>{
                  wx.navigateBack();
                }
              });
              
            }
          },(err)=>{
            wx.hideLoading();
            wx.showToast({
              title: '添加信息失败!',
              duration: 1000,
            });
          }).catch((err)=>{
            wx.hideLoading();
            wx.showToast({
              title: '添加信息失败!',
              duration: 1000,
            });
          })
        }
      })
    }
  }
})