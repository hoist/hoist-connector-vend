/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var vend = Hoist.connector('<key>');
  vend.get('/stock_movements')
  .then(function (stockMovements) {
    var promises = [];
    for(var index = 0; index < stockMovements.length; index++) {
      promises.push(Hoist.event.raise('stockMovement:found', stockMovements[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};