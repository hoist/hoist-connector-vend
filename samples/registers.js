/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/registers')
  .then(function (registers) {
    var promises = [];
    for(var index = 0; index < registers.length; index++) {
      promises.push(Hoist.event.raise('register:found', registers[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};