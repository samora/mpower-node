var Invoice = require('./invoice')
  , request = require('request')
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

CheckoutInvoice.prototype.confirm = function () {
  var self = this;
  if (arguments[0] && arguments[1]) {
    var token = arguments[0];
    var callback = arguments[1];
  }

  if (arguments[0] && !arguments[1]) {
    var callback = arguments[0];
    var token = self.token;
  }

  request({
    uri: self.baseURL + '/confirm/' + token,
    json: {},
    headers: self.config
  }, function (err, response, body) {
    if (body && body.response_code == '00') {
      self.status = body.status;
      self.responseText = body.response_text;

      if (self.status === 'completed') {
        self.customer = body.customer;
        self.receiptURL = body.receipt_url
        if (body.invoice.custom_data && Object.keys(body.invoice.custom_data).length > 0)
          self.customData = body.invoice.custom_data;
      }
      self.totalAmount = body.invoice.total_amount;
      callback(null, self);
    } else callback(new Error('Could not confirm invoice status.'));
  });
  
}

module.exports = CheckoutInvoice;
