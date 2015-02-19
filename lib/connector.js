'use strict';
var BBPromise = require('bluebird');
var requestPromise = require('request-promise');
var logger = require('hoist-logger');
var url = require('url');
var errors = require('hoist-errors');
var _ = require('lodash');
var _path = require('path');
var apiUrl = '.vendhq.com/api';
var authBaseUrl = 'https://secure.vendhq.com/connect';
var redirectUri = 'https://bouncer.hoist.io/bounce';

/*jshint camelcase: false */

function VendConnector(settings) {
  logger.info({
    settings: settings
  }, 'constructed vend-connector');
  this.settings = settings;
}

VendConnector.prototype.get = function (url, queryParams) {
  logger.info('inside hoist-connector-vend.get');
  return this.request('GET', url, queryParams);
};

VendConnector.prototype.post = function (url, data) {
  logger.info('inside hoist-connector-vend.post');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in post');
  }
  return this.request('POST', url, null, data);
};

VendConnector.prototype.put = function (url, data) {
  logger.info('inside hoist-connector-vend.put');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in put');
  }
  return this.request('PUT', url, null, data);
};

VendConnector.prototype.delete = function (url) {
  logger.info('inside hoist-connector-vend.delete');
  return this.request('DELETE', url);
};

VendConnector.prototype.request = function (method, path, queryParams, data) {
  if (!path) {
    throw new errors.connector.request.InvalidError('no path specified');
  }

  data = data ? data : null;
  logger.info({
    method: method,
    path: path
  }, 'inside hoist-connector-vend.request');
  //check if token is expired
  var self = this;
  return this.refreshToken().then(function () {
    var headers = {
      Authorization: 'Bearer ' + self.authSettings.get('token').access_token
    };
    var uri = 'https://' + self.authSettings.get('domainPrefix') + _path.join(apiUrl, path);
    var options = {
      uri: uri,
      headers: headers,
      method: method,
      json: true,
      resolveWithFullResponse: true,
    };

    if (method === 'PUT' || method === 'POST') {
      if (path.search(/^\/?webhooks/i) !== -1) {
        options.form = {
          data: typeof data === 'string'? data: JSON.stringify(data)
        };
      } else {
        options.body = data;
      }
    }

    if (method === 'GET') {
      var parsedUrl = url.parse(options.uri, true);
      parsedUrl.search = null;
      var query = parsedUrl.query;
      if (queryParams) {
        query = _.extend(query, queryParams);
      }
      options.uri = url.format(parsedUrl);
    }
    return self.requestPromiseHelper(options)
      .then(function (response) {
        logger.info({
          responseBody: response.body
        }, 'inside hoist-connector-vend.request');
        return response.body;
      });
  });
};

VendConnector.prototype.refreshToken = function () {
  if (this.authSettings) {
    if (this.authSettings.get('token').expires < Date.now()) {
      var body = {
        refresh_token: this.authSettings.get('token').refresh_token,
        client_id: this.settings.clientId,
        client_secret: this.settings.clientSecret,
        grant_type: 'refresh_token'
      };
      var options = {
        method: 'POST',
        uri: 'https://' + this.authSettings.get('domainPrefix') + apiUrl + '/1.0/token',
        formData: body,
        resolveWithFullResponse: true
      };
      return this.requestPromiseHelper(options)
        .bind(this)
        .then(function (response) {
          var token = response.body;
          if (response.statusCode === 200) {
            token = JSON.parse(token);
            token.refresh_token = token.refresh_token ? token.refresh_token : this.authSettings.get('token').refresh_token;
            return this.authSettings.set('token', token);
          } else {
            throw new errors.connector.ConnectorError();
          }
        });
    }
    return BBPromise.resolve();
  } else {
    throw new errors.connector.request.UnauthorizedError();
  }
};

/* istanbul ignore next */
VendConnector.prototype.authorize = function (authSettings) {
  this.authSettings = authSettings;
  return BBPromise.resolve({});
};

VendConnector.prototype.receiveBounce = function (bounce) {
  if (bounce.query && bounce.query.code) {
    return bounce.set('code', bounce.query.code)
      .then(function () {
        return bounce.set('domainPrefix', bounce.query.domain_prefix);
      })
      .bind(this)
      .then(function () {
        return this.requestAccessToken(bounce);
      })
      .then(function (response) {
        return bounce.set('token', JSON.parse(response.body));
      })
      .then(function () {
        bounce.done();
      })
      .catch(function (err) {
        logger.error(err);
        bounce.done(err);
      });
  } else {
    return bounce.redirect(authBaseUrl + '?response_type=code&client_id=' +
      this.settings.clientId + '&redirect_uri=' + redirectUri);
  }
};

VendConnector.prototype.requestAccessToken = function (bounce) {
  var body = {
    code: bounce.get('code'),
    client_id: this.settings.clientId,
    client_secret: this.settings.clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  };

  var options = {
    method: 'POST',
    uri: 'https://' + bounce.get('domainPrefix') + apiUrl + '/1.0/token',
    formData: body,
    resolveWithFullResponse: true
  };

  return this.requestPromiseHelper(options);
};

/* istanbul ignore next */
VendConnector.prototype.requestPromiseHelper = function requestPromiseHelper(options) {
  return BBPromise.resolve(requestPromise(options));
};

module.exports = VendConnector;