/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/payment_types')
  .then(function (paymentTypes) {
    var promises = [];
    for(var index = 0; index < paymentTypes.length; index++) {
      promises.push(Hoist.event.raise('paymentType:found', paymentTypes[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};