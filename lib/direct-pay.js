var request = require('superagent')
  , Promise = require('bluebird')
  , util = require('util')
  ;

/**
 * DirectPay class
 * @param {object} setup Instance of mpower.Setup
 */
function DirectPay(setup){
  if (!(setup && setup.config)) throw new Error('Must be initialized with instance of mpower.Setup');

  this.config = setup.config;
  this.baseURL = setup.baseURL + '/direct-pay';
}

/**
 * Credit an MPower accoutn
 * @param  {string} account Account alias, number or username
 * @param  {number} amount  
 * @return {promise}         
 */
DirectPay.prototype.creditAccount = function (account, amount){
  var self = this;
  var body = {
    account_alias: account,
    amount: Number(amount)
  };

  return new Promise(function (resolve, reject) {
    request.post(self.baseURL + '/credit-account')
    .set(self.config)
    .send(body)
    .end(function (err, res) {
      if (err) return reject(err)

      if (res.body.response_code === '00') {
        self.responseText = res.body.response_text;
        self.description = res.body.description;
        self.transactionID = res.body.transaction_id;
        resolve();
      } else {
        var e = new Error(new Error(util.format('Failed to credit account. '
          + 'Please ensure %s and %s are valid OR check your account balance.'
          , account, amount)))
        e.data = res.body
        reject(e)
      }
    })
  })
};

module.exports = DirectPay;