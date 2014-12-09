'use strict';
require('../bootstrap');
var Vend = require('../../lib/connector');
var sinon = require('sinon');
var BBPromise = require('bluebird');
var expect = require('chai').expect;
var requestPromise = require('request-promise');
var config = require('config');
var errors = require('hoist-errors');

/*jshint camelcase: false */

describe('VendConnector', function () {
  var connector;
  var authProxy = {
    token: {
      access_token: '<access-token>',
      refresh_token: '<refresh-token>',
      expires: Date.now + 10 * 60 * 1000,
      expires_in: '7200'
    },
    domainPrefix: 'test'
  };
  before(function () {
    connector = new Vend({
      settings: {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        redirectUri: 'redirectUri'
      }
    });
    connector.authSettings = {
      get: function (name) {
        return authProxy[name];
      }
    };
  });
  describe('#get', function () {
    describe('with no queryParams', function () {
      var response = {};
      var result;
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/products');
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/products', undefined);
      });
    });
    describe('with queryParams', function () {
      var response = {};
      var result;
      var queryParams = {
        query: 'query'
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/products', queryParams);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/products', queryParams);
      });
    });
  });
  describe('#post', function () {
    describe('with no data', function () {
      it('rejects', function () {
        expect(function () {
          connector.post('/path');
        }).to.throw(errors.connector.request.InvalidError);
      });
    });
    describe('with data', function () {
      var response = {};
      var result;
      var data = {
        query: 'query'
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.post('/products', data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('POST', '/products', null, data);
      });
    });
  });
  describe('#put', function () {
    describe('with no data', function () {
      it('rejects', function () {
        expect(function () {
          connector.put('/path');
        }).to.throw(errors.connector.request.InvalidError);
      });
    });
    describe('with data', function () {
      var response = {};
      var result;
      var data = {
        query: 'query'
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.put('client.api/update', data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('PUT', 'client.api/update', null, data);
      });
    });
  });
  describe('#request', function () {
    describe('GET', function () {
      describe('with no queryParams', function () {
        var response = {
          body: 'body'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('GET', '/product');
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
      });
      describe('with queryParams object', function () {
        var response = {
          body: 'body'
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?query=query',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('GET', '/product', queryParams);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
      });
      describe('with queryParams in path', function () {
        var response = {
          body: 'body'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?query=query',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('GET', '/product?query=query');
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
      });
      describe('with queryParams in path and object', function () {
        var response = {
          body: 'body'
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?querypath=querypath&query=query',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('GET', '/product?querypath=querypath', queryParams);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
      });
      describe('with duplicate queryParams in path and object', function () {
        var response = {
          body: 'body'
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?query=query',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('GET', '/product?query=queryfalse', queryParams);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper correctly', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
      });
    });
    describe('POST', function () {
      describe('with json string', function () {
        var response = {
          body: 'body'
        };
        var data = '{"Staff":{"Name":"John"}}';
        var options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true,
          uri: 'https://test.vendhq.com/api/stock_transfers',
          body: data,
          json: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('POST', '/stock_transfers', null, data);
          return result;
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
        it('returns response', function () {
          return expect(result).to.become(response);
        });
      });
      describe('with object', function () {
        var response = {
          body: 'body'
        };
        var data = {
          Staff: {
            Name: "John"
          }
        };
        var options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true,
          uri: 'https://test.vendhq.com/api/stock_transfers',
          body: data,
          json: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('POST', '/stock_transfers', null, data);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
        it('returns response', function () {
          return expect(result).to.become(response);
        });
      });
    });
    describe('PUT', function () {
      describe('with json string', function () {
        var response = {
          body: 'body'
        };
        var data = '{"Staff":{"Name":"John"}}';
        var options = {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true,
          uri: 'https://test.vendhq.com/api/consignment/12345',
          body: data,
          json: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('PUT', '/consignment/12345', null, data);
          return result;
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
        it('returns response', function () {
          return expect(result).to.become(response);
        });
      });
      describe('with object', function () {
        var response = {
          body: 'body'
        };
        var data = {
          Staff: {
            Name: "John"
          }
        };
        var options = {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer <access-token>'
          },
          resolveWithFullResponse: true,
          uri: 'https://test.vendhq.com/api/consignment/12345',
          body: data,
          json: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
          result = connector.request('PUT', '/consignment/12345', null, data);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
          connector.refreshToken.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('calls refreshToken', function () {
          expect(connector.refreshToken)
            .to.have.been.called;
        });
        it('returns response', function () {
          return expect(result).to.become(response);
        });
      });
    });
    describe('with no path', function () {
      it('rejects', function () {
        expect(function () {
          connector.request();
        }).to.throw(errors.connector.request.InvalidError);
      });
    });
  });
  describe.skip('#refreshToken', function () {});
  describe.skip('#receiveBounce', function () {});
  describe.skip('#requestAccessToken', function () {});
});