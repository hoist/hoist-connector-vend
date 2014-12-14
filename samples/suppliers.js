/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/supplier')
  .then(function (suppliers) {
    var promises = [];
    for(var index = 0; index < suppliers.length; index++) {
      promises.push(Hoist.event.raise('supplier:found', suppliers[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};