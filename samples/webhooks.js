/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var vend = Hoist.connector('<key>');
  return vend.post('/webhooks', {
      type: 'product.update',
      url: 'https://endpoint.hoi.io/{organisationSlug}/{applicationSlug}/product/update',
      active: true
    })
    .then(function () {
      Hoist.log('webhook created');
    })
    .nodeify(done);
};