var assert = require('assert')
  , Setup = require('../lib').setup
  ;

describe('Setup', function () {
  it('should initialize with environment variables when no parameters are given', function (done){
    var setup = new Setup();
    assert.strictEqual(setup.config['MP-Master-Key'], process.env.MP_MASTER_KEY);
    assert.strictEqual(setup.config['MP-Private-Key'], process.env.MP_PRIVATE_KEY);
    // assert.strictEqual(setup.config['MP-Public-Key'], process.env.MP_PUBLIC_KEY);
    assert.strictEqual(setup.config['MP-Token'], process.env.MP_TOKEN);
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
    // assert.strictEqual(setup.config['MP-Public-Key'], 'public');
    assert.strictEqual(setup.config['MP-Token'], 'token');
    done();
  });

  it('should set to sandbox base url as endpoint in test mode', function (done){
    var setup = new Setup({mode: 'test'});
    assert.strictEqual(setup.baseURL, 'https://app.mpowerpayments.com/sandbox-api/v1');
    done();
  });

  it('should set live baseURL when mode !== "test"', function (done){
    var setup = new Setup();
    assert.strictEqual(setup.baseURL, 'https://app.mpowerpayments.com/api/v1');
    done();
  });
});