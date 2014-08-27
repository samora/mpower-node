var Invoice = require('./invoice')
  , request = require('superagent')
  , Promise = require('bluebird')
  ;


// Inherit invoice
CheckoutInvoice.prototype = Object.create(Invoice.prototype);
CheckoutInvoice.prototype.constructor = CheckoutInvoice;

/**
 * CheckoutInvoice class
 * @param {object} setup Instance of mpower.Setup
 * @param {object} store Instance of mpower.Store
 */
function CheckoutInvoice(setup, store) {
  Invoice.call(this, setup, store);
  this.baseURL = this.baseURL + '/checkout-invoice';
}


/**
 * Create invoice
 * @return {promise}
 */
CheckoutInvoice.prototype.create = function (){
  var self = this;

  var requestBody = self.generateRequestBody();

  return new Promise(function (resolve, reject) {
    request.post(self.baseURL + '/create')
    .set(self.config)
    .send(requestBody)
    .end(function (err, res) {
      if (err) return reject(err)

      if (res.body.response_code === '00') {
        self.token = res.body.token;
        self.url = res.body.response_text;

        //check invoice status
        resolve(self.confirm());
      } else {
        var e = new Error('Failed to create invoice.')
        e.data = res.body
        reject(e)
      }
    })
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
    request.get(self.baseURL + '/confirm/' + token)
    .set(self.config)
    .end(function (err, res) {
      if (err) return reject(err)

      var body = res.body
      if (body.response_code === '00') {
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
      } else {
        var e = new Error('Could not confirm invoice status.')
        e.data = body
        reject(e)
      }
    })
  });  
}

module.exports = CheckoutInvoice;
