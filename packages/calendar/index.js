Component({
  properties: {
    dateChoose: {
      type: Function
    },
    effectDate: {
      type: Array,
    },
    id: {
        type: String,
    },
    dayBuyLast: {
      type: String,
    },
    calendar: {
      type: Boolean,
    }
  },
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
    confirmDate: {
      year: 0,
      month: 0,
      date: 0
    },
    changePage: true,
    startPlace: 0,
  },
  attached: function() {
    this.setData({
      todate: Date.parse(new Date())
    });
    this.haveDate(new Date());
  },
  methods: {
    haveDate: function (date) {
      const now = new Date();
      let { dayBuyLast, effectDate } = this.properties;
      dayBuyLast = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${dayBuyLast}`);
      if (typeof effectDate[0] === 'string') {
        effectDate[0] = new Date(effectDate[0].replace(/-/g, '/'));
        effectDate[1] = new Date(effectDate[1].replace(/-/g, '/'));
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const beginDate = date.getDate();
      let time = Date.parse(new Date(`${year}/${month}/1`));//时间戳
      const fontTime = Date.parse(effectDate[0]);
      const backTime = Date.parse(effectDate[1]);
      const firstDate = new Date(`${year}/${month}/01`);
      const nbsp = firstDate.getDay() === 0 ? 0 : firstDate.getDay();
      let monthDaySize;
      let fontDate = 0;
      let backDate = 1;
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
      if (Date.parse(now) <= Date.parse(effectDate[1])) {
        for (let i = 0; i < monthDaySize; i++) {
          if (fontDate === 0 && time > fontTime && time <= backTime) {
            if (month === now.getMonth() + 1) {
              if (Date.parse(now) >= Date.parse(dayBuyLast)) {
                fontDate = now.getDate();
              } else {
                fontDate = now.getDate() - 1;
              }
            } else if (effectDate[0].getMonth() > now.getMonth() && month === effectDate[0].getMonth() + 1) {
              fontDate = i - 1;
            } else {
              fontDate = i;
            }
          }

          if (fontDate !== 0 && ((i === monthDaySize - 1 && backDate === 1) || (backDate === 1 && time >= backTime))) {
            backDate = i;
          }
          time += 86400000;
        }
        if (backDate !== monthDaySize) {
          backDate -= 1;
        }
        if (now.getDate() !== 1 && fontDate !== 1 && fontDate !== 0) {
          fontDate += 1;
        }
      }
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
      console.log('+++++++++++++++++++++++++++')
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
      const chooseDate = `${this.data.chooseDate.year}-${this.data.chooseDate.month}-${this.data.chooseDate.date}`;
      this.triggerEvent('myevent', chooseDate);
      this.setData({
        confirmDate: {
          year: year,
          month: month,
          date: date
        }
      });
    },
    cancel: function() {
      const { year, month, date } = this.data.confirmDate;
      this.setData({
        chooseDate: {
          year: year,
          month: month,
          date: date
        }
      });
      // this.triggerEvent('myevent', '2001-1-1');
      if (year !== 0 && month !== 0 && date !==0) {
        this.haveDate(new Date(`${year}/${month}/${date}`));
        return;
      }
      this.haveDate(new Date());
    },
    touchStart: function(e) {
      this.setData({ startPlace: e.changedTouches[0].clientX});
    },
    touchEnd: function(e) {
      // console.log(e)
      const { startPlace } = this.data;
      const endPlace = e.changedTouches[0].clientX;
      if (startPlace - endPlace >= 70) {
        this.nextMonth();
      } else if (startPlace - endPlace <= -70) {
        this.backMonth();
      }
      this.setData({ startPlace: 0});
    }
  }
})