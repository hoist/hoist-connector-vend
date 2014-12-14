/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/products', function(products) {
    for(var index = 0; index < products.length; index++) {
      Hoist.event.raise('product:found', products[index]);
    }
  });

};