const request = require('../../utils/request.js');

Component({
  properties: {},
  data: {
    showModal: false,
    phoneNumber: []
  },
  attached: function(options) {
    request({ method: 'get', url: '/api/getCustomer'}).then(data => {
      this.setData({
        phoneNumber: data.data.data
      });
    })
  },
  methods: {
    modalShow: function (e) {
      this.setData({
        showModal: true
      })
    },
    modalCancel: function () {
      this.setData({
        showModal: false
      })
    },
    call: function (e) {
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.phone.mobile,
        success: () => {
          this.setData({
            showModal: false
          });
        }
      });
    }
  }
})