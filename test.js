var assert = require('assert')
  , mpower = require('./lib/mpower')
  , Setup = mpower.Setup
  , Store = mpower.Store
  , Invoice = mpower.Invoice
  , CheckoutInvoice = mpower.CheckoutInvoice
  ;


describe('MPower', function () {
  describe('Setup', function () {
    it('should initialize with environment variables when no parameters are given', function (done){
      var setup = new Setup();
      assert.ok(setup.config['MP-Master-Key']);
      assert.ok(setup.config['MP-Private-Key']);
      assert.ok(setup.config['MP-Public-Key']);
      assert.ok(setup.config['MP-Token']);
      done();
    });

    it('should initialize with given data', function (done){
      var setup = new Setup({
        masterKey: 'master',
        privateKey: 'private',
        publicKey: 'public',
        token: 'token'
      });
      assert.strictEqual(setup.config['MP-Master-Key'], 'master');
      assert.strictEqual(setup.config['MP-Private-Key'], 'private');
      assert.strictEqual(setup.config['MP-Public-Key'], 'public');
      assert.strictEqual(setup.config['MP-Token'], 'token');
      done();
    });

    it('should set to sandbox base url as endpoint in test mode', function (done){
      var setup = new Setup({mode: 'test'});
      assert.strictEqual(setup.baseURL, 'https://app.mpowerpayments.com/sandbox-api/v1/');
      done();
    });

    it('should set live baseURL when mode !== "test"', function (done){
      var setup = new Setup();
      assert.strictEqual(setup.baseURL, 'https://app.mpowerpayments.com/api/v1/');
      done();
    });
  });

  describe('Store', function () {

    it('should not initialize without required parameters', function (done){
      assert.throws(function () {new Store()});
      done();
    });

    it('should initialize with required parameters', function (done){
      assert.doesNotThrow(function () {new Store({name: 'My Store'})});
      done();
    });

    it('should set values on initialize', function (done){
      var data = {
        name: 'My Awesome Store',
        tagline: 'Get all you need.',
        phoneNumber: '0246662003',
        postalAddress: 'CT 504'
      };
      var store = new Store(data);

      assert.strictEqual(store.name, data.name);
      assert.strictEqual(store.tagline, data.tagline);
      assert.strictEqual(store.phone_number, data.phoneNumber);
      assert.strictEqual(store.postal_address, data.postalAddress);
      done();
    });
  });

  describe('Invoice', function (){
    it('should add item to invoice', function (done){
      var setup = new Setup({mode: 'test'});
      var store = new Store({name: 'Awesome Store'});
      var invoice = new Invoice;
      invoice.init(setup, store);
      invoice.addItem('iPhone', 1, 1000, 1000, 'apple gadget');
      assert.strictEqual(invoice.items.item_1.name, 'iPhone');
      assert.strictEqual(invoice.items.item_1.quantity, 1);
      assert.strictEqual(invoice.items.item_1.unit_price, 1000);
      assert.strictEqual(invoice.items.item_1.total_price, 1000);
      assert.strictEqual(invoice.items.item_1.description, 'apple gadget');

      //add another item
      invoice.addItem('Galaxy Phone', 1, 800, 800);
      assert.strictEqual(invoice.items.item_2.name, 'Galaxy Phone');
      done();
    });

    it('should set and get total amount', function (done){
      var setup = new Setup({mode: 'test'});
      var store = new Store({name: 'Awesome Store'});
      var invoice = new Invoice;
      invoice.init(setup, store);
      assert.strictEqual(invoice.getTotalAmount(), 0);
      invoice.setTotalAmount(100);
      assert.strictEqual(invoice.total_amount, 100);
      assert.strictEqual(invoice.getTotalAmount(), 100);
      done();
    });
  });

  describe('CheckoutInvoice', function () {
    it('should work', function (done){
      this.timeout(10000);
      var setup = new Setup({mode: 'test'});
      var store = new Store({name: 'Awesome Store'});
      var invoice = new CheckoutInvoice;
      invoice.init(setup, store);
      invoice.setTotalAmount(100);
      console.log(invoice.config);

      invoice.create(function (err, response, body){
        console.log(body);
        done();
      });
    });
  });
});
