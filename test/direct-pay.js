var assert = require('assert')
  , mpower = require('../lib')
  , Setup = mpower.setup
  , DirectPay = mpower.directPay;
  ;

describe('DirectPay', function () {
  describe('#creditAccount()', function () {
    it('should not credit account if not initialized correctly', function (done){
      assert.throws(function (){
        new DirectPay();
      });
      done();
    });

    it('should credit account if initialized correctly', function (done){
      this.timeout(10000);
      var setup = new Setup({mode: 'test'});
      var directPay = new DirectPay(setup);
      directPay.creditAccount('samora', 50, function (err, directPay){
        assert.ok(directPay.description);
        assert.ok(directPay.transactionID);
        assert.ok(directPay.responseText);
        done();
      });
    });
  });
});