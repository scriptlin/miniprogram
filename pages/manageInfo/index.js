const getContactList = require('../../service/managelnfo.js').getContactList;
const deleteInform = require('../../service/managelnfo.js').deleteInform;
let newChoosed = [];
Page({
  data: {
    informs: [],
    editor: false,
    buttonInfo: "新增信息",
    color: [],
    disabled: false,
    choosedId: {
      id: []
    },
    isOrder: false
  },
  onShow: function () {
    this.getContact();
  },
  onLoad: function(options) {
    console.log(options)
    const {isOrder} = options;
    if (isOrder) {
      this.setData({
        isOrder: true
      });
    }
  },
  //调用获取联系人接口
  getContact: function () {
    getContactList().then((res) => {
      wx.hideLoading();
      const inform = res.data.data;
      this.setData({
        informs: inform
      })
      const newColor = [];
      for (let index in this.data.informs) {
        newColor.push('#ccc');
      }
      this.setData({
        color: newColor
      })
    })
  },
  //编辑按钮事件
  editor: function () {
    if (this.data.editor) {
      let newColor = this.data.color.map(function (item) {
        item = '#ccc';
        return item;
      })
      this.setData({
        color: newColor,
        disabled: false
      })
    }
    if (!this.data.editor) {
      this.setData({
        disabled: true
      })
    }
    this.setData({
      editor: !this.data.editor,
      buttonInfo: this.data.editor ? "新增信息" : "删除信息",
    });

  },
  //删除用户信息
  deleteInfo: function (e) {
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
            success: function () {
              //调用删除联系人接口
              deleteInform(_this.data.choosedId).then(function (res) {
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功',
                })
                _this.getContact(_this);
              }, function (err) {
                wx.hideLoading();
                wx.showToast({
                  title: '删除失败',
                })
              }).catch(function (err) {
                wx.hideLoading();
                wx.showToast({
                  title: '删除失败',
                })
                console.log(err);
              })
            }
          })
        }
      }
    });
  },

  //判断是增加信息还是删除信息进行操作
  toAddInfo: function () {
    if (this.data.buttonInfo == "新增信息") {
      wx.showLoading({
        title: '页面加载中',
        success: function () {
          wx.navigateTo({
            url: '../addUserInfo/addUserInfo',
            success: function () {
              wx.hideLoading();
            }
          })
        }
      })
    } else {
      this.deleteInfo();
    }
  },
  //用户选择删除的信息
  choose: function (e) {
    // 是否是从确认订单页面跳转过来的
    if (this.data.isOrder) {
      wx.setStorage({
        key: 'chooseContact',
        data: this.data.informs[e.currentTarget.dataset.index],
        success: () => {
          wx.navigateBack({
            delta: 1
          });
        }
      });
    } else if (this.data.editor) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.id;
      //更改选中删除的颜色，并且获取删除元素的ID
      let newColor = Array.from(this.data.color);
      if (newColor[index] == '#ccc') {
        newColor[index] = 'red';
        if (newChoosed.indexOf(id) === -1) {
          newChoosed.push(id);
        }
      } else {
        newColor[index] = '#ccc';
        if (newChoosed.indexOf(id) != 0) {
          newChoosed.splice(newChoosed.indexOf(id), 1);
        }
      }
      let middle = {
        id: newChoosed
      };
      this.setData({
        color: newColor,
        choosedId: middle
      });
      //判断有没有red，来改变按钮
      var have = newColor.includes('red');
      if (have) {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
    }
  }
})