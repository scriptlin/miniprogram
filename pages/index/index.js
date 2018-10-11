const homeApi = require('../../service/home.js');
const goodApi = require('../../service/good.js');
const mta = require('../../mta_analysis.js');
const share = require('../../utils/share.js');
Page({
  data: {
    swiper: {
      indecatotDots: true,
      indicatorColor: '#eee',
      indicatorActiveColor: '#fff',
      autoplay: true,
      interval: 3000,
      duration: 500,
      circular: true
    },
    slider: [],
    companys: [],
    goods: [],
    touchBlock: 0,
    status: {
      current: 1,
      pageSize: 3
    },
    lockNum: 0,
    fetching: false,
  },
  onShareAppMessage: function (res) {
    share.share(res)
  },
  onLoad: function () {
    wx.showShareMenu({ withShareTicket: true });
    this.fetchSliderList();
    this.fetchCompanyList();
    mta.Page.init()
  },
  fetchSliderList: function () {
    homeApi.getSlider().then((result) => {
      const { data: { data } } = result;
      this.setData({
        slider: data.slider_list
      });
    }).catch(err => {
      console.log('获取slider出错了');
    });
  },
  fetchCompanyList: function () {
    let { current, pageSize } = this.data.status;
    let {lockNum, fetching} = this.data;
    // 并发问题
    if (fetching) {
      return;
    }
    this.setData({
      fetching: true
    });
    return homeApi.getCompanyList({current, page_size: pageSize}).then((result) => {
      const { data: { data } } = result;
      fetching = false;
      // 锁住current值
      if (lockNum !== 0 && lockNum !== pageSize) {
        const newV = data.company_list.slice(lockNum);
        lockNum = data.company_list.length;
        if (lockNum === pageSize) {
          current++;
        }
        this.setData({
          fetching,
          lockNum, 
          status: { pageSize, current },
          companys: [...this.data.companys, ...newV]
        });
        return;
      }
      lockNum === 0;
      if (data.company_list.length < pageSize) {
        lockNum = data.company_list.length;
      }  
      if (data.company_list.length === pageSize) {
        current++;
      }
      this.setData({
        fetching,
        lockNum: lockNum,
        status: { pageSize, current },
        companys: [...this.data.companys, ...data.company_list]
      });
      this.initGoodsList();
    }).catch(err => {
      console.log('获取公司列表出错了');
    });
  },
  initGoodsList: function() {
    const { current, pageSize} = this.data.status;
    this.data.companys.map((com, index) => {
      if (index >= (current - 2) * pageSize) {
        homeApi.getGoodsList({ id: com.id, current: 1, page_size: pageSize }).then((result) => {
          const data = result.data.data;
          const goods = this.data.goods;
          goods[index] = {
            fetching: false,
            lockNum: 0,
            current: 2,
            list: data.goods_list
          };
          this.setData({ goods });
        }).catch(err => {
          console.log('获取公司对应项目列表出错了', err);
        });
      }
    });
  },
  fetchOneGoodsList: function (e) {
    const {id, index} = e.target.dataset;
    const { goods, status } = this.data;
    let {current, lockNum, list, fetching} = goods[index];
    // 并发问题
    if (fetching) {
      return;
    } 
    goods[index] = { ...goods[index], fetching: true };
    this.setData({ goods });
    const pageSize = status.pageSize;
    homeApi.getGoodsList({ id, current, page_size: pageSize }).then(result => {
      const data = result.data.data;
      const newGoods = data.goods_list;
      if (lockNum !== 0 && lockNum !== pageSize) {
        const newV = newGoods.slice(lockNum);
        lockNum = newGoods.length;
        if (lockNum === pageSize) {
          current++;
        }
        goods[index] = {
          fetch: false,
          lockNum,
          current,
          list: [...goods[index].list, ...newV]
        };
        this.setData({ goods });
        return;
      }
      lockNum = 0;
      if (newGoods.length < pageSize) {
        lockNum = newGoods.length;
      }
      if (newGoods.length === pageSize) {
        current++;
      }
      goods[index] = {
        fetching: false,
        lockNum,
        current,
        list: [...goods[index].list, ...newGoods]
      };
      this.setData({goods});
    }).catch(error => {
      console.log('获取更多项目错误', error);
    });
  }, 
})
