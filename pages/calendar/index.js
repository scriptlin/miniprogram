Page({
  data: {
    todate: 0,
    year: 2001,
    month: 1,
    nbsp: 0,
    monthDaySize: 31,
    date: 1,
    timeModel: 1,
    chooseDate: {
      year: 0,
      month: 0,
      date: 0
    },
    effectDate: [],
    dayBuyLast: '23:59:59',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择预定日期'
    });
    let chooseDate = {
      year: 0,
      month: 0,
      date: 0
    };
    if (options.chooseDate !== 'null') {
      const confirmD = options.chooseDate.split(',');
      chooseDate = {
        year: parseInt(confirmD[0]),
        month: parseInt(confirmD[1]),
        date: parseInt(confirmD[2])
      };
    }
    this.setData({
      chooseDate,
      todate: Date.parse(new Date()),
      dayBuyLast: options.dayBuyLast,
      effectDate: [options.startDate, options.endDate]
    });
    const { year, month, date } = this.data.chooseDate;
    if (this.data.chooseDate.year !== 0) {
      this.haveDate(new Date(`${year}/${month}/${date}`));
    } else {
      this.haveDate(new Date());
    } 
  },
  haveDate: function (date) {
    // 今天的日期获取
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDate = now.getDate();
    // 获取每天的最后预定时间和活动预定时间区间
    let dayBuyLast = this.data.dayBuyLast;
    let effectDate = [...this.data.effectDate];
    dayBuyLast = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${dayBuyLast}`);
    if (typeof effectDate[0] === 'string') {
      effectDate[0] = new Date(effectDate[0].replace(/-/g, '/'));
      effectDate[1] = new Date(effectDate[1].replace(/-/g, '/'));
    }
    const fontTime = Date.parse(effectDate[0]);
    const backTime = Date.parse(effectDate[1]);
    // 获取传入的时间的各个属性
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const beginDate = date.getDate();
    // let time = Date.parse(new Date(`${year}/${month}/1`));//时间戳
    // 获取本月第一日的星期，nbsp是用来控制本月的星期
    const firstDate = new Date(`${year}/${month}/01`); // 每月第一天时间
    const nbsp = firstDate.getDay() === 0 ? 0 : firstDate.getDay();
    let monthDaySize; // 每月的天数
    let fontDate = 0; // 本月可预定的最早时间
    let backDate = 1; // 本月可预订的最晚时间
    // 判断月份的天数
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    // 获取fontDate和backDate
    if (year < effectDate[0].getFullYear()) {
      fontDate = 0;
    } else if (year > effectDate[1].getFullYear()) {
      fontDate = 0;
    } else {
      if (year > effectDate[0].getFullYear()) {
        effectDate[0] = new Date(`${year}/1/1 0:0:0`);
      }
      if (year < effectDate[1].getFullYear()) {
        effectDate[1] = new Date(`${year}/12/31 23:59:59`);
      }
      if (year > nowYear) {
        if (effectDate[0].getMonth() + 1 > month || effectDate[1].getMonth() + 1 < month) {
          fontDate = 0;
        } else if (effectDate[0].getMonth() + 1 < month && effectDate[1].getMonth() + 1 > month){
          fontDate = 1;
          backDate = monthDaySize;
        } else if (effectDate[0].getMonth() + 1 == month && effectDate[1].getMonth() + 1 > month) {
          fontDate = effectDate[0].getDate();
          backDate = monthDaySize;
        } else if (effectDate[0].getMonth() + 1 == month && effectDate[1].getMonth() + 1 == month) {  
          fontDate = effectDate[0].getDate();
          backDate = effectDate[1].getDate();
        } else if (effectDate[0].getMonth() + 1 < month && effectDate[1].getMonth() + 1 == month) {
          fontDate = 1;
          backDate = effectDate[1].getDate();
        }

      } else if (year < nowYear) {
        fontDate = 0
      } 
      // fontDate=0：本月大于展示的月份 || 起始可预订的月份大于展示月份 || 展示月份大于最后可预订的月份
      else if (nowMonth > month || effectDate[0].getMonth() + 1 > month || effectDate[1].getMonth() + 1 < month) {
        fontDate = 0;
      }
      // fontDate=其他值：起始可预订日期小于展示日期
      else if (nowMonth <= month && fontTime <= Date.parse(date) && backTime >= Date.parse(date)) {
        // 大于起始可预订的日期：月份不一样；月份一样
        if (month !== effectDate[0].getMonth() + 1) {
          // 是否等于本月
          if (month > nowMonth) {
            fontDate = 1;
          } else {
            // 是否超过每天最后的预定时间
            if (Date.parse(dayBuyLast) > Date.parse(now)) {
              fontDate = nowDate;
            }
            // 本日是否是本月最后一日
            else {
              if (nowDate === monthDaySize) {
                fontDate = 0;
              } else {
                fontDate = nowDate + 1;
              }
            }
          }
        } else {
          // 起始可预订的时间小于||大于本日
          if (fontTime <= Date.parse(now)) {
            // 是否超过每天最后的预定时间
            if (Date.parse(dayBuyLast) > Date.parse(now)) {
              fontDate = nowDate;
            }
            // 本日是否是本月最后一日
            else {
              if (nowDate === monthDaySize) {
                fontDate = 0;
              } else {
                fontDate = nowDate + 1;
              }
            }
          } else {
            fontDate = effectDate[0].getDate()
          }
        }
      }
      // 起始可预订日期等于展示日期 
      else if (nowMonth <= month && fontTime >= Date.parse(date)) {
        fontDate = effectDate[0].getDate();
      }
      // backDate=monthDaySize：展示月小于最后预定日期 && 展示月大于等于本月
      if (month < effectDate[1].getMonth() + 1 && month >= nowMonth) {
        backDate = monthDaySize
      }
      // backDate=最后预定日期：展示月等于最后预定日期
      else if (month === effectDate[1].getMonth() + 1) {
        backDate = effectDate[1].getDate();
      }
    } 
    console.log(fontDate, backDate)
    this.setData({
      year,
      month,
      nbsp,
      monthDaySize,
      fontDate,
      backDate,
      date: beginDate,
      timeModel: 1
    });
  },
  backMonth: function () {
    if (this.data.month === 1) {
      this.setData({
        year: this.data.year - 1,
        month: 13,
      })
    }
    this.haveDate(new Date(`${this.data.year}/${this.data.month - 1}/1`))
  },
  nextMonth: function () {
    if (this.data.month === 12) {
      this.setData({
        year: this.data.year + 1,
        month: 0,
      })
    }
    this.haveDate(new Date(`${this.data.year}/${this.data.month + 1}/1`))
  },
  chooseDate: function (e) {
    this.setData({
      chooseDate: {
        year: this.data.year,
        month: this.data.month,
        date: e.target.dataset.date
      }
    });
  },
  confirm: function () {
    const { year, month, date } = this.data.chooseDate;
    const chooseDate = `${year}-${month}-${date}`;
    wx.setStorage({
      key: 'date',
      data: {
        goodDate: chooseDate
      }
    });
    wx.navigateBack({
      data: 1
    });
  },
  cancel: function () {
    wx.navigateBack({
      data: 1
    });
  },
  // 滑动切换月份
  touchStart: function (e) {
    this.setData({ startPlace: e.changedTouches[0].clientX });
  },
  touchEnd: function (e) {
    const { startPlace } = this.data;
    const endPlace = e.changedTouches[0].clientX;
    if (startPlace - endPlace >= 70) {
      this.nextMonth();
    } else if (startPlace - endPlace <= -70) {
      this.backMonth();
    }
    this.setData({ startPlace: 0 });
  }
})