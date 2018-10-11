const homeApi = require('../../service/home.js');
const share = require('../../utils/share.js');

Page({
  data: {
    id: 0,
    name: '',
    goods: [],
    current: 1,
    pageSize: 4,
    lockNum: 0,
    fetching: false,
  },
  onShareAppMessage: function (res) {
    share.share(res)
  },
  onLoad: function(options) {
    wx.showShareMenu({ withShareTicket: true });
    this.setData({
      id: options.id,
      name: options.name
    });
    wx.setNavigationBarTitle({
      title: this.data.name
    });
    this.fetchGoodList();
  },
  fetchGoodList: function() {
    let { current, pageSize, id } = this.data;
    let {lockNum, fetching} = this.data;
    // 并发问题
    if (fetching) {
      return;
    }
    this.setData({
      fetching: true,
    })
    homeApi.getGoodsList({ id, current, page_size: pageSize }).then((result) => {
      const data = result.data.data;
      const goods_list = data.goods_list.map(item => {
        return { ...item, start_time: this.turnDate(item.start_time), last_time: this.turnDate(item.last_time)};
      })
      // 锁住current值
      if (lockNum !== 0 && lockNum !== pageSize) {
        const newV = data.goods_list.slice(lockNum);
        lockNum = data.goods_list.length;
        if (lockNum === pageSize) {
          current++;
        }
        this.setData({
          fetching: false,
          lockNum,
          goods: [...this.data.goods, ...newV]
        });
        return;
      }
      lockNum = 0;
      if (data.goods_list.length < pageSize) {
        lockNum = data.goods_list.length;
      }
      if (data.goods_list.length === pageSize) {
        current++;
      }
      this.setData({
        fetching: false,
        lockNum,
        current,
        goods: [...this.data.goods, ...goods_list]
      });
    }).catch(error => {
      console.log(`获取公司id为${id}的项目列表错误`, error);
    }) 
  },
  turnDate: function(date) {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}.${newDate.getMonth() + 1}.${newDate.getDate()}`;
  }
})