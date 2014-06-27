var Invoice = require('./invoice')
  , request = require('request')
  , Promise = require('bluebird')
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


/**
 * Create invoice
 * @return {promise}
 */
CheckoutInvoice.prototype.create = function (){
  var self = this;

  var requestBody = self.generateRequestBody();

  return new Promise(function (resolve, reject) {
    request.post({
      uri: self.baseURL + '/create',
      json: requestBody,
      headers: self.config
    }, function (err, response, body){
      if (body && body.response_code === '00') {
        self.token = body.token;
        self.url = body.response_text;

        //check invoice status
        resolve(self.confirm());
      } else reject(new Error('Failed to create invoice.'));
    });
  });
};

/**
 * Get token status.
 * @param  {string} givenToken Invoice token
 * @return {promise}
 */
CheckoutInvoice.prototype.confirm = function (givenToken) {
  var self = this;
  var token = givenToken ? givenToken : self.token;

  return new Promise(function (resolve, reject) {
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
        resolve();
      } else reject(new Error('Could not confirm invoice status.'));
    });
  });

  
  
}

module.exports = CheckoutInvoice;
