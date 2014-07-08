exports.Setup = exports.setup = Setup;
exports.Store = exports.store = Store;
exports.CheckoutInvoice = exports.checkoutInvoice = require('./checkout-invoice');
exports.OnsiteInvoice = exports.onsiteInvoice = require('./onsite-invoice');
exports.DirectPay = exports.directPay = require('./direct-pay');

function Setup(data) {
  this.config = {}
  this.config['MP-Master-Key'] = data && data.masterKey || process.env.MP_MASTER_KEY;
  this.config['MP-Private-Key'] = data && data.privateKey || process.env.MP_PRIVATE_KEY;
  // this.config['MP-Public-Key'] = data && data.publicKey || process.env.MP_PUBLIC_KEY;
  this.config['MP-Token'] = data && data.token || process.env.MP_TOKEN;
  if (data && data.mode && data.mode.toLowerCase() === 'test')
    this.baseURL = 'https://app.mpowerpayments.com/sandbox-api/v1';
  else
    this.baseURL = 'https://app.mpowerpayments.com/api/v1';
}

function Store(data) {
  if (!(data && data.name))
    throw new Error('Invalid parameters.');
  this.name = data.name;
  if (data.tagline) this.tagline = data.tagline;
  if (data.phoneNumber) this.phone_number = data.phoneNumber;
  if (data.postalAddress) this.postal_address = data.postalAddress;
  if (data.logoURL) this.logo_url = data.logoURL;
  if (data.websiteURL) this.website_url = data.websiteURL;
  if (data.cancelURL) this.cancel_url = data.cancelURL;
  if (data.returnURL) this.return_url = data.returnURL;
}