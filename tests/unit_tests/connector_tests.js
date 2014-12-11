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
  before(function () {
    connector = new Vend({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'redirectUri'
    });
    connector.authSettings = {
      authProxy: {
        token: {
          access_token: '<access_token>',
          refresh_token: '<refresh_token>',
          expires: Date.now() + 10 * 60 * 1000,
          expires_in: '7200'
        },
        domainPrefix: 'test'
      },
      get: function (name) {
        return this.authProxy[name];
      },
      set: function (name, value) {
        this.authProxy[name] = value;
        return BBPromise.resolve(this);
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
          body: {body: "some body"},
          statusCode: 200
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product',
          headers: {
            Authorization: 'Bearer <access_token>'
          },
          json: true,
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
          body: {body: "some body"},
          statusCode: 200
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?query=query',
          headers: {
            Authorization: 'Bearer <access_token>'
          },
          json: true,
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
          body: {body: "some body"},
          statusCode: 200
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?query=query',
          headers: {
            Authorization: 'Bearer <access_token>'
          },
          json: true,
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
          body: {body: "some body"},
          statusCode: 200
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?querypath=querypath&query=query',
          headers: {
            Authorization: 'Bearer <access_token>'
          },
          json: true,
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
          body: {body: "some body"},
          statusCode: 200
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://test.vendhq.com/api/product?query=query',
          headers: {
            Authorization: 'Bearer <access_token>'
          },
          json: true,
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
          body: {body: "some body"},
          statusCode: 200
        };
        var data = '{"Staff":{"Name":"John"}}';
        var options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer <access_token>'
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
          return expect(result).to.become(response.body);
        });
      });
      describe('with json string and statusCode not 200', function () {
        var response = {
          body: '{"body": "some body"}',
          statusCode: 500,
          headers: {}
        };
        var data = '{"Staff":{"Name":"John"}}';
        var options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer <access_token>'
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
          return expect(result).to.become(response.body);
        });
      });
      describe('with object', function () {
        var response = {
          body: {body: "some body"},
          statusCode: 200
        };
        var data = {
          Staff: {
            Name: "John"
          }
        };
        var options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer <access_token>'
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
          return expect(result).to.become(response.body);
        });
      });
    });
    describe('PUT', function () {
      describe('with json string', function () {
        var response = {
          body: {body: "some body"},
          statusCode: 200
        };
        var data = '{"Staff":{"Name":"John"}}';
        var options = {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer <access_token>'
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
          return expect(result).to.become(response.body);
        });
      });
      describe('with object', function () {
        var response = {
          body: {body: "some body"},
          statusCode: 200
        };
        var data = {
          Staff: {
            Name: "John"
          }
        };
        var options = {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer <access_token>'
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
          return expect(result).to.become(response.body);
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
  describe('#refreshToken', function () {
    describe('with an expired token and no refreshToken in response.body', function () {
      var response = {
        statusCode: 200,
        body: '{\n    "access_token": "accessToken"\n}'
      };
      var body = {
        refresh_token: '<refresh_token>',
        client_id: 'clientId',
        client_secret: 'clientSecret',
        grant_type: 'refresh_token'
      };
      var options = {
        method: 'POST',
        resolveWithFullResponse: true,
        uri: 'https://test.vendhq.com/api/1.0/token',
        formData: body
      };
      before(function () {
        connector.authSettings.authProxy.token.expires = Date.now() - 1000;
        sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
        return connector.refreshToken();
      });
      after(function () {
        connector.requestPromiseHelper.restore();
        connector.authSettings.authProxy = {
          token: {
            access_token: '<access_token>',
            refresh_token: '<refresh_token>',
            expires: Date.now() + 10 * 60 * 1000,
            expires_in: '7200'
          },
          domainPrefix: 'test'
        };
      });
      it('calls requestPromiseHelper with correct arguments', function () {
        expect(connector.requestPromiseHelper).to.have.been.calledWith(options);
      })
      it('sets authSettings.token', function () {
        expect(connector.authSettings.authProxy.token).to.eql({
          access_token: 'accessToken',
          refresh_token: '<refresh_token>'
        });
      })
    });
    describe('with an expired token and a refreshToken in response.body', function () {
      var response = {
        statusCode: 200,
        body: '{\n    "access_token": "accessToken",\n   "refresh_token": "refreshToken"\n}'
      };
      var body = {
        refresh_token: '<refresh_token>',
        client_id: 'clientId',
        client_secret: 'clientSecret',
        grant_type: 'refresh_token'
      };
      var options = {
        method: 'POST',
        resolveWithFullResponse: true,
        uri: 'https://test.vendhq.com/api/1.0/token',
        formData: body
      };
      before(function () {
        connector.authSettings.authProxy.token.expires = Date.now() - 1000;
        sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
        return connector.refreshToken();
      });
      after(function () {
        connector.requestPromiseHelper.restore();
        connector.authSettings.authProxy = {
          token: {
            access_token: '<access_token>',
            refresh_token: '<refresh_token>',
            expires: Date.now() + 10 * 60 * 1000,
            expires_in: '7200'
          },
          domainPrefix: 'test'
        };
      });
      it('calls requestPromiseHelper with correct arguments', function () {
        expect(connector.requestPromiseHelper).to.have.been.calledWith(options);
      })
      it('sets authSettings.token', function () {
        expect(connector.authSettings.authProxy.token).to.eql({
          access_token: 'accessToken',
          refresh_token: 'refreshToken'
        });
      });
    });
    describe('with an expired token with response statusCode not 200', function () {
      var response = {
        statusCode: 400,
      };
      var body = {
        refresh_token: '<refresh_token>',
        client_id: 'clientId',
        client_secret: 'clientSecret',
        grant_type: 'refresh_token'
      };
      var options = {
        method: 'POST',
        resolveWithFullResponse: true,
        uri: 'https://test.vendhq.com/api/1.0/token',
        formData: body
      };
      var error;
      before(function (done) {
        connector.authSettings.authProxy.token.expires = Date.now() - 1000;
        sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
        return connector.refreshToken().catch(function (err) {
          error = err;
          done();
        });
      });
      after(function () {
        connector.requestPromiseHelper.restore();
        connector.authSettings.authProxy = {
          token: {
            access_token: '<access_token>',
            refresh_token: '<refresh_token>',
            expires: Date.now() + 10 * 60 * 1000,
            expires_in: '7200'
          },
          domainPrefix: 'test'
        };
      });
      it('calls requestPromiseHelper with correct arguments', function () {
        expect(connector.requestPromiseHelper).to.have.been.calledWith(options);
      })
      it('rejects', function () {
        expect(error)
          .to.be.instanceOf(errors.connector.ConnectorError);
      });
    });
    describe('with an unexpired token', function () {
      var result;
      before(function () {
        sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve());
        return (result = connector.refreshToken());
      });
      after(function () {
        connector.requestPromiseHelper.restore();
      });
      it('does not call requestPromiseHelper', function () {
        expect(connector.requestPromiseHelper.called).to.eql(false);
      })
      it('expects result to become a promise', function () {
        expect(result.then).to.be.a('function');
      })
    });
    describe('with no authSettings', function () {
      before(function () {
        connector.authSettings = undefined;
      });
      it('rejects', function () {
        expect(function () {
          connector.refreshToken();
        }).to.throw(errors.connector.request.UnauthorizedError);
      });
    });
  });
  describe('#receiveBounce', function () {
    describe('with bounce.query', function () {
      var bounce = {
        query: {
          code: 'code',
          domain_prefix: 'domain_prefix'
        },
        proxy: {},
        get: function (name) {
          return this.proxy[name];
        },
        set: function (name, value) {
          this.proxy[name] = value;
          return BBPromise.resolve(this);
        },
        done: sinon.stub()
      };
      var response = {
        body: '{\n    "access_token": "accessToken",\n   "refresh_token": "refreshToken"\n}'
      }
      before(function () {
        sinon.stub(connector, 'requestAccessToken').returns(BBPromise.resolve(response));
        return connector.receiveBounce(bounce);
      });
      after(function () {
        connector.requestAccessToken.restore();
      });
      it('calls requestAccessToken with correct arguments', function () {
        expect(connector.requestAccessToken).to.have.been.calledWith(bounce);
      });
      it('sets correct properties on bounce', function () {
        expect(bounce.get('code')).to.eql('code');
        expect(bounce.get('domainPrefix')).to.eql('domain_prefix');
        expect(bounce.get('token')).to.eql(JSON.parse(response.body));
      });
      it('calls bounce.done', function () {
        expect(bounce.done).to.have.been.called;
      });
    });
    describe('without bounce.query', function () {
      var bounce = {
        proxy: {},
        get: function (name) {
          return this.proxy[name];
        },
        set: function (name, value) {
          this.proxy[name] = value;
          return BBPromise.resolve(this);
        },
        redirect: sinon.stub(),
        done: sinon.stub()
      };
      var response = {
        body: 'body'
      }
      before(function () {
        sinon.stub(connector, 'requestAccessToken').returns(BBPromise.resolve(response));
        return connector.receiveBounce(bounce);
      });
      after(function () {
        connector.requestAccessToken.restore();
      });
      it('does not call requestAccessToken', function () {
        expect(connector.requestAccessToken).to.have.not.been.called;
      });
      it('does not call bounce.done', function () {
        expect(bounce.done).to.have.not.been.called;
      });
      it('calls redirect with correct url', function () {
        expect(bounce.redirect)
          .to.have.been.calledWith('https://secure.vendhq.com/connect?response_type=code&client_id=clientId&redirect_uri=redirectUri');
      });
    });
  });
  describe('#requestAccessToken', function () {
    var bounce = {
      proxy: {
        code: 'code',
        domainPrefix: 'test'
      },
      get: function (name) {
        return this.proxy[name];
      }
    };
    var body = {
      code: 'code',
      client_id: 'clientId',
      client_secret: 'clientSecret',
      grant_type: 'authorization_code',
      redirect_uri: 'redirectUri'
    };
    var options = {
      method: 'POST',
      resolveWithFullResponse: true,
      uri: 'https://test.vendhq.com/api/1.0/token',
      formData: body
    };
    before(function () {
      sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve());
      return connector.requestAccessToken(bounce)
    });
    it('calls requestPromiseHelper with correct arguments', function () {
      expect(connector.requestPromiseHelper).to.have.been.calledWith(options);
    })
  });
});