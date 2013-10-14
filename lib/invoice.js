// Invoice class
function Invoice() {
  if (arguments[0] && arguments[1]) {
    // var setup = arguments[0];
    // var store = arguments[1];
    this.init(arguments[0], arguments[1]);
  }
}

Invoice.prototype.init = function (setup, store){
  // validate input
  if (!(setup && store && setup.config['MP-Master-Key'] && setup.config['MP-Private-Key'] && setup.config['MP-Token'] && store.name)) {
    throw new Error('Invalid parameters;');
  }

  this.baseURL = setup.baseURL;
  this.config = setup.config;

  if (store.return_url) this.returnURL = store.return_url;
  if (store.cancel_url) this.cancelURL = store.cancel_url;

  this.store = store;
  this.description = '';
  this.items = {};
  this.customData = {};
  this.taxes = {};
  this.totalAmount = 0;
}

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

Invoice.prototype.addTax = function (name, amount){
  if (!(name && amount && typeof name === 'string' && typeof Number(amount) === 'number'))
    throw new Error('Invalid parameters.');

  var position = Object.keys(this.taxes).length + 1;
  this.taxes['tax_' + position] = {
    name: name,
    amount: Number(amount)
  };
};

Invoice.prototype.addCustomData = function (title, value) {
  if (!(title && value)) throw new Error('Invalid parameters.');

  this.customData[title] = value;
};

Invoice.prototype.generateRequestBody = function () {
  if (!(this.store && this.store.name && this.baseURL && this.totalAmount > 0))
    throw new Error("Invalid parameters. Initialize Invoice with valid instances of Setup and Store. Total amount must also be set.\neg: var invoice = new Invoice; invoice.init(setup, store); invoice.setTotalAmount(40)");

  var body = {
    invoice: {
      total_amount: this.totalAmount
    },
    store: this.store
  };
  if (this.description) body.invoice.description = this.description;
  if (Object.keys(this.items).length > 0) body.invoice.items = this.items;
  if (this.returnURL || this.cancelURL) {
    body.actions = {};
    if (this.returnURL) body.actions.return_url = this.returnURL;
    if (this.cancelURL) body.actions.cancel_url = this.cancelURL;
  }
  if (Object.keys(this.taxes).length > 0) body.invoice.taxes = this.taxes;
  if (Object.keys(this.customData).length > 0) body.custom_data = this.customData;

  return body;
};

module.exports = Invoice;