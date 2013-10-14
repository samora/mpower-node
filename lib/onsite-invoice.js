var Invoice = require('./invoice')
  , request = require('request')
  , _ = require('lodash')
  ;

// Inherit invoice
OnsiteInvoice.prototype = new Invoice();
OnsiteInvoice.prototype.constructor = OnsiteInvoice;
function OnsiteInvoice() {
}

OnsiteInvoice.prototype.init = function (setup, store) {
  Invoice.prototype.init.call(this, setup, store); // call Invoice initializer
  this.baseURL = this.baseURL + '/opr';
};

OnsiteInvoice.prototype.create = function (customer, callback) {
  var self = this;

  // setup request body
  var body = {
    invoice_data: self.generateRequestBody(),
    opr_data: {
      account_alias: customer
    }
  };

  request.post({
    uri: self.baseURL + '/create',
    json: body,
    headers: self.config
  }, function (err, response, body){
    if (body && body.response_code === '00') {
      self.token = body.invoice_token;
      self.oprToken = body.token;
      self.responseText = body.description;
      callback(null, self);
    } else callback(new Error('Failed to create invoice.'))
  });
};

OnsiteInvoice.prototype.charge = function (confirmToken, callback){
  var self = this;
  var body = {
    token: self.oprToken,
    confirm_token: confirmToken
  };
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
      callback(null, self);
    } else callback(new Error('Failed to charge invoice. Check confirmation token/pin and try again.'))
  });
};

module.exports = OnsiteInvoice;