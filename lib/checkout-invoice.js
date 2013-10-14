var Invoice = require('./invoice')
  , request = require('request')
  , _ = require('lodash')
  ;


// Inherit invoice
CheckoutInvoice.prototype = new Invoice();
CheckoutInvoice.prototype.constructor = CheckoutInvoice;
function CheckoutInvoice() {
}

CheckoutInvoice.prototype.init = function (setup, store) {
  Invoice.prototype.init.call(this, setup, store); // call Invoice initializer
  this.baseURL = this.baseURL + '/checkout-invoice';
};


CheckoutInvoice.prototype.create = function (callback){
  var self = this;

  var requestBody = self.generateRequestBody();

  // create invoice
  request.post({
    uri: self.baseURL + '/create',
    json: requestBody,
    headers: self.config
  }, function (err, response, body){
    if (body && body.response_code === '00') {
      self.token = body.token;
      self.url = body.response_text;

      //checking invoice status
      self.confirm(callback);
    } else callback(new Error('Failed to create invoice.'));
  });
};

CheckoutInvoice.prototype.confirm = function (callback) {
  var self = this;
  request({
    uri: self.baseURL + '/confirm/' + self.token,
    json: {},
    headers: self.config
  }, function (err, response, body) {
    if (body && body.response_code == '00') {
      self.status = body.status;
      self.responseText = body.response_text;
      // self.totalAmount = body.invoice.total_amount;
      callback(null, self);
    } else callback(new Error('Could not confirm invoice status.'));
  });
}

module.exports = CheckoutInvoice;
