var Invoice = require('./invoice')
  , request = require('superagent')
  , Promise = require('bluebird')
  ;

// Inherit invoice
OnsiteInvoice.prototype = Object.create(Invoice.prototype);
OnsiteInvoice.prototype.constructor = OnsiteInvoice;

function OnsiteInvoice(setup, store) {
  Invoice.call(this, setup, store); // call Invoice initializer
  this.baseURL = this.baseURL + '/opr';
};

OnsiteInvoice.prototype.create = function (customer) {
  var self = this;

  // setup request body
  var body = {
    invoice_data: self.generateRequestBody(),
    opr_data: {
      account_alias: customer
    }
  };

  return new Promise(function (resolve, reject) {
    request.post(self.baseURL + '/create')
    .set(self.config)
    .send(body)
    .end(function (err, res) {
      if (err) return reject(err)

      if (res.body.response_code === '00') {
        self.token = res.body.invoice_token;
        self.oprToken = res.body.token;
        self.responseText = res.body.description;
        resolve();
      } else {
        var e = new Error('Failed to create invoice')
        e.data = res.body
        reject(e)
      }
    })
  })
};

OnsiteInvoice.prototype.charge = function (oprToken, confirmToken){
  var self = this;
  var body = {
    token: oprToken,
    confirm_token: confirmToken
  };
  
  return new Promise (function (resolve, reject) {
    request.post(self.baseURL + '/charge')
    .set(self.config)
    .send(body)
    .end(function (err, res) {
      if (err) return reject(err)

      if (res.body.response_code === '00') {
        self.responseText = res.body.response_text;
        self.status = res.body.invoice_data.status;
        self.receiptURL = res.body.invoice_data.receipt_url;
        self.customer = res.body.invoice_data.customer;
        resolve();
      } else {
        var e = new Error('Failed to charge invoice. Check OPR/confirm token and try again.')
        e.data = res.body
        reject(e)
      }
    })
  })
};

module.exports = OnsiteInvoice;