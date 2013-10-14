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

  this.baseURL = setup.baseURL ;
  this.config = setup.config;

  if (store.return_url) this.returnURL = store.return_url;
  if (store.cancel_url) this.cancelURL = store.cancel_url;

  this.store = store;
  this.description = '';
  this.items = {};
  this.customData = {};
  this.taxes = {};
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

Invoice.prototype.getDescription = function () {
   return this.description;
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

Invoice.prototype.generateRequestBody = function () {
  if (!(this.store && this.store.name && this.baseURL && this.total_amount > 0))
    throw new Error("Invalid parameters. Initialize Invoice with valid instances of Setup and Store.\n\
                      eg: var invoice = new Invoice; invoice.init(setup, store);");

  var body = {
    invoice: {
      total_amount: this.total_amount
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

  return body;
};

module.exports = Invoice;