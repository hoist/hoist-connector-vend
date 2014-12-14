/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/users')
  .then(function (users) {
    var promises = [];
    for(var index = 0; index < users.length; index++) {
      promises.push(Hoist.event.raise('user:found', users[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};