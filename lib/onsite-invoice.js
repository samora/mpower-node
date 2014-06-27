var Invoice = require('./invoice')
  , request = require('request')
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
    request.post({
      uri: self.baseURL + '/create',
      json: body,
      headers: self.config
    }, function (err, response, body){
      if (body && body.response_code === '00') {
        self.token = body.invoice_token;
        self.oprToken = body.token;
        self.responseText = body.description;
        resolve();
      } else reject(new Error('Failed to create invoice.'))
    });
  })
};

OnsiteInvoice.prototype.charge = function (oprToken, confirmToken){
  var self = this;
  var body = {
    token: oprToken,
    confirm_token: confirmToken
  };
  
  return new Promise (function (resolve, reject) {
    request.post({
      uri: self.baseURL + '/charge',
      json: body,
      headers: self.config
    }, function (err, response, body){
      if (body && body.response_code === '00') {
        self.responseText = body.response_text;
        self.status = body.invoice_data.status;
        self.receiptURL = body.invoice_data.receipt_url;
        self.customer = body.invoice_data.customer;
        resolve();
      } else reject(new Error('Failed to charge invoice. Check confirmation token/pin and try again.'))
    });
  })
};

module.exports = OnsiteInvoice;