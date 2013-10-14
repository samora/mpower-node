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
  this.baseURL = store.baseURL + '/checkout-invoice';
};


CheckoutInvoice.prototype.create = function (){
  var self = this;
  self.generateRequestBody();
  // create invoice
  request.post({
    uri: self.baseURL + '/create',
    json: body,
    headers: self.config
  }, function (err, response, body){
    if (body && body.response_code === '00') {
      self.token = body.token;
      self.url = body.response_text;

      //checking invoice status
      return self.confirm(self.token);
    } else return false;
  });
};

CheckoutInvoice.prototype.confirm = function (token) {
  request({
    uri: this.baseURL + '/confirm/' + (token || this.token),
    headers: this.config
  }, function (err, response, body) {
    if (body && body.response_code == '00') {
      this.status = body.status;
      this.responseText = body.response_text;
      this.totalAmount = body.invoice.total_amount;
      return true;
    } else return false;
  });
}

module.exports = CheckoutInvoice;
