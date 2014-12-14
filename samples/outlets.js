/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/outlets')
  .then(function (outlets) {
    var promises = [];
    for(var index = 0; index < outlets.length; index++) {
      promises.push(Hoist.event.raise('outlet:found', outlets[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};