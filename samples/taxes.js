/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/taxes')
  .then(function (taxes) {
    var promises = [];
    for(var index = 0; index < taxes.length; index++) {
      promises.push(Hoist.event.raise('tax:found', taxes[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};