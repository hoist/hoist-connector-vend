/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.delete('/supplier/1')
  .then(function (response) {
    if (response.statusCode === 200) {
      // delete worked
    }
  })
  .then(done);
};