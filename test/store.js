var assert = require('assert')
  , Store = require('../lib').store
  ;

describe('Store', function () {
  it('should not initialize without required parameters', function (done){
    assert.throws(function () {new Store()});
    done();
  });

  it('should initialize without error when name is initialized', function (done){
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