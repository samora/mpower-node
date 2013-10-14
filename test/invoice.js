var assert = require('assert')
  , Invoice = require('../lib/invoice')
  , mpower = require('../lib')
  , Setup = mpower.Setup
  , Store = mpower.Store
  ;

describe('Invoice', function (){

  describe('#addItem()', function () {
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
  });
  
  describe('#generateRequestBody()', function () {
    it('should fail with invalid parameters', function (done) {
      var setup = new Setup({made: 'test'});
      var store = new Store({name: 'Awesome Store', returnURL: 'http://mysite.com/callback'});
      var invoice = new Invoice();
      assert.throws(function () {
        invoice.generateRequestBody();
      });
      invoice.init(setup, store);
      assert.throws(function () {
        invoice.generateRequestBody();
      });
      invoice.setTotalAmount(50);
      assert.doesNotThrow(function () {
        invoice.generateRequestBody();
      });
      var body = invoice.generateRequestBody();
      assert.strictEqual(body.invoice.total_amount, 50);
      assert.strictEqual(body.store.name, 'Awesome Store');
      assert.strictEqual(body.actions.return_url, 'http://mysite.com/callback')
      done();
    });
  });
});