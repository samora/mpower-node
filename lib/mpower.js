var request = require('request');

function Setup(data) {
  this.config = {}
  this.config['MP-Master-Key'] = data && data.masterKey || process.env.MP_MASTER_KEY;
  this.config['MP-Private-Key'] = data && data.privateKey || process.env.MP_PRIVATE_KEY;
  this.config['MP-Public-Key'] = data && data.publicKey || process.env.MP_PUBLIC_KEY;
  this.config['MP-Token'] = data && data.token || process.env.MP_TOKEN;
  if (data && data.mode && data.mode.toLowerCase() === 'test')
    this.baseURL = 'https://app.mpowerpayments.com/sandbox-api/v1/';
  else
    this.baseURL = 'https://app.mpowerpayments.com/api/v1/';
}

function Store(data) {
  if (!(data && data.name))
    throw new Error('Invalid parameters.');
  this.name = data.name;
  if (data.tagline) this.tagline = data.tagline;
  if (data.phoneNumber) this.phone_number = data.phoneNumber;
  if (data.postalAddress) this.postal_address = data.postalAddress;
  if (data.cancelURL) this.cancel_url = data.cancelURL;
  if (data.returnURL) this.return_url = data.returnURL;
}


// Invoice class
function Invoice() {
  if (arguments[0] && arguments[1]) {
    var setup = arguments[0];
    var store = arguments[1];
    this.init(setup, store);
  }
}

Invoice.prototype.init = function (setup, store){
  if (!(setup && store && setup.config['MP-Master-Key'] && setup.config['MP-Private-Key'] && setup.config['MP-Token'] && store.name)) {
    throw new Error('Invalid parameters;');
  }

  this.baseURL = setup.baseURL + 'checkout-invoice/';
  this.config = setup.config;
  if (store.returnURL) {
    this.returnURL = store.returnURL;
    delete store.returnURL;
  }
  if (store.cancelURL) {
    this.cancelURL = store.cancelURL;
    delete store.cancelURL;
  }
  this.token = '';
  this.store = store;
  this.description = '';
  this.items = {};
  this.total_amount = 0;
}

Invoice.prototype.setTotalAmount = function (amount) {
  this.total_amount = amount;
};

Invoice.prototype.getTotalAmount = function () {
  return this.total_amount;
}

Invoice.prototype.setDescription = function (description) {
  this.description = description;
};

Invoice.prototype.addItem = function (name, quantity, unitPrice, totalPrice, description) {
  if (!(name && quantity && unitPrice && totalPrice)) throw new Error('Invalid parameters.');

  var position = Object.keys(this.items).length + 1;
  this.items['item_' + position] = {
    name: name,
    quantity: quantity,
    unit_price: unitPrice,
    total_price: totalPrice
  }

  if (description) this.items['item_' + position].description = description;
};

// CheckoutInvoice class
// Inherits Invoice
CheckoutInvoice.prototype = new Invoice();
CheckoutInvoice.prototype.constructor = CheckoutInvoice;
function CheckoutInvoice() {
}

CheckoutInvoice.prototype.create = function (callback){
  if (!(this.store && this.store.name && this.baseURL && this.total_amount > 0))
    throw new Error('Invalid parameters. Initialize CheckoutInvoice with valid instances of Setup and Store. eg: new CheckoutInvoice(setup, store).');

  var body = {
    invoice: {
      total_amount: this.total_amount},
    store: this.store
  };
  if (this.description) body.invoice.description = this.description;
  if (Object.keys(this.items).length > 0) body.invoice.items = this.items;

  var self = this;

  // create invoice
  request.post({
    uri: self.baseURL + 'create',
    json: body,
    headers: self.config
  }, function (err, response, body){
    if (body && body.response_code === '00') {
      self.token = 

      //checking invoice status
      request({
        uri: self.baseURL + 'confirm/' + body.token,
        headers: self.config
      }, function (err, response, body) {
        if (body && body.response_code == '00') {

        }
        return false;
      });
    }
    return false;
  });
};

exports.Invoice = Invoice;
exports.CheckoutInvoice = CheckoutInvoice;
exports.Setup = Setup;
exports.Store = Store;