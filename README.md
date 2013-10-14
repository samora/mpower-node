# mpower-node

Unofficial MPower Payments Node library.

Built on the MPower Payments HTTP API (beta).

## Installation

```javascript
npm install mpower
```

## API configuration

Setup MPower API keys.

```javascript
var setup = new mpower.Setup({
  masterKey: 'dd6f2c90-f075-012f-5b69-00155d864600',
  privateKey: 'test_private_oDLVlm1eNyh0IsetdhdJvcl0ygA',
  publicKey: 'test_public_zzF3ywvX9DE-OSDNhUqKoaTI4wc',
  token: 'ca03737cf942cf644f36',
  mode: 'test' // optional. use in sandbox mode.
});
```

It might usually be suitable to put your API configuration in environment variables. In which case you can initialize `mpower.Setup` without passing configuration parameters. 
The library will automatically detect the environment variables to use.
Keys for your environment variables: `MP_MASTER_KEY`, `MP_PRIVATE_KEY`, `MP_PUBLIC_KEY`,  `MP_TOKEN`


## Checkout Store configuration

```javascript
var store = new mpower.Store({
  name: 'Awesome Store', // only name is required
  tagline: 'Easy shopping',
  phoneNumber: '0261234567',
  postalAddress: 'P.0. Box MP555, Accra',
  logoURL: 'http://www.awesomestore.com.gh/logo.png'
});
```

## Initialize Checkout Invoice

```javascript
var invoice = new mpower.CheckoutInvoice;
invoice.init(setup, store);
```

## Initialize Onsite Invoice

```javascript
var invoice = new mpower.OnsiteInvoice;
invoice.init(setup, store);
```

## Add Invoice Items & Description

```javascript
invoice.addItem('iPhone 4', 1, 500, 500); // name, quantity, unit price, total price
invoice.description = 'Apple product'
```

## Setting Total Amount Chargeable

```javascript
invoice.totalAmount = 50;
```

## Redirecting to MPower Checkout
After setting total amount and adding items to your invoice you can create a checkout and redirect the customer. It takes a callback which gets passed the updated invoice object containing the url.

```javascript
invoice.create(function (err, invoice){
  invoice.status;
  invoice.token; // invoice token
  invoice.responseText;
  invoice.url; // MPower redirect checkout url
});
```

## (OPR) Onsite Payment Request: Step 1 - Token request
After setting total amount and adding items to your invoice get the MPower customer's username or phone number and start an OPR request.

```javascript
invoice.create('samora', function(err, invoice){
  invoice.oprToken; // You need to pass the OPR Token on the 2nd step
  invoice.token; // invoice token
  invoice.responseText;
});
```

## (OPR) Onsite Payment Request: Step 2 - Charge
To successfully complete an OPR charge, you need both your OPR Token & the Confirmation code sent to the customer. After a successfull charge you can programatically access the receipt url, customer information and more.

```javascript
invoice.charge('oprToken', '0000', function (err, invoice){
  invoice.status;
  invoice.responseText;
  invoice.receiptURL;
  invoice.customer; // {name: 'Samora Dake', phone: '0204939902', email: 'samoradake@gmail.com'}
});
```

## Extra API methods

### Adding Tax Information
You may include tax information on on the checkout page. This information will be available on the invoice & receipt printouts and PDF downloads.

```javascript
invoice.addTax('VAT (15%)', 5);
invoice.addTax('NHIL (5%)', 2);
```

### Adding Custom Data
There are times when you may need to add an extra load of data with the checkout information for later use. MPower allows saving of custom data on their servers which are persisted even after successful payment.
Note: Custom data is not displayed anywhere on the checkout page, invoice/receipt download & printouts.

```javascript
invoice.addCustomData('CartID', 32393);
invoice.addCustomData('Plan', 'JUMBO');
```

### Setting a Cancel URL
You can optionally set the URL where your customers will be redirected to after canceling a checkout.
Note: There are two options as to how the cancel URL is set, one is to set it globally using the checkout setup information and the other is set it as per checkout invoice.
Setting the cancel URL directly on the invoice instance will overwrite the global settings if already set.

```javascript
// Globally
var store = new mpower.Store({
  name: 'Awesome Store',
  cancelURL: 'http://www.awesomestore.com'
});

// Per Checkout
invoice.cancelURL;
```

### Setting a Return URL
MPower does a good job of managing receipt downloads and printouts after your customer successfuly makes payment. However there may be cases where you may descide to redirect your customers to another URL after successfully making payment. Return URL guarantees this action.
Note: MPower will append `?token=INVOICE_TOKEN` to your URL.

```javascript
// Globally
var store = new mpower.Store({
  name: 'Awesome Store',
  returnURL: 'http://www.awesomestore.com'
});

// Per Checkout
invoice.returnURL;
```

### Confirming a Checkout Programatically
The API allows you to check on the status of any checkout using the checkout token key. You have access to all the data including the receipt download link & customer information in cases where the checkout has been confirmed as completed.

```javascript
var token = 'aodaff0023';

var invoice = new mpower.CheckoutInvoice;
invoice.init(setup, store);
invoice.confirm(token, function (err, invoice){
  invoice.status; //  completed, pending, canceled or fail
  invoice.responseText;
  
  // available if status == 'completed'
  invoice.customer; // {name: 'Samora Dake', phone: '0281234567', email: 'samoradake@gmail.com'}
  invoice.receiptURL; // 'https://app.mpowerpayments.com/sandbox-checkout/receipt/pdf/test_a6fef1449a.pdf'
});
```

## DirectPay
You can pay any MPower account directly via your third party apps. This is particularly excellent for implementing your own Adaptive payment solutions on top of MPower.

```javascript
var directPay = new mpower.DirectPay(setup);
directPay.creditAccount('customer', 50, function (err, directPay){
  directPay.description;
  directPay.responseText;
  directPay.transactionID;
});
```

# Running Tests
To run tests just setup the API configuration environment variables. An internet connection is required for some of the tests to pass.

```javascript
mocha test
```

# TODO
Add DirectCard functionality.