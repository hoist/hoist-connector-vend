/* Just copy and paste this snippet into your code */

module.main = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/products', function(products) {
    for(var index = 0; index < products.length; index++) {
      Hoist.event.raise('job:found', products[index]);
    }
  });

};