/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/register_sales')
  .then(function (sales) {
    var promises = [];
    for(var index = 0; index < sales.length; index++) {
      promises.push(Hoist.event.raise('sale:found', sales[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};