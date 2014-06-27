var request = require('request')
  , Promise = require('bluebird')
  , util = require('util')
  ;

function DirectPay(setup){
  if (!(setup && setup.config)) throw new Error('Must be initialized with instance of mpower.Setup');

  this.config = setup.config;
  this.baseURL = setup.baseURL + '/direct-pay';
}

DirectPay.prototype.creditAccount = function (account, amount){
  var self = this;
  var body = {
    account_alias: account,
    amount: Number(amount)
  };

  return new Promise(function (resolve, reject) {
    request.post({
      uri: self.baseURL + '/credit-account',
      json: body,
      headers: self.config
    }, function (err, response, body){
      if (body && body.response_code === '00') {
        self.responseText = body.response_text;
        self.description = body.description;
        self.transactionID = body.transaction_id;
        resolve();
      } else reject(new Error(util.format('Failed to credit account. Please ensure %s and %s are valid OR check your account balance.'
          , account, amount)));
    });
  })
};

module.exports = DirectPay;