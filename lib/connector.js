'use strict';
var BBPromise = require('bluebird');
var requestPromise = require('request-promise');
var logger = require('hoist-logger');
var url = require('url');
var errors = require('hoist-errors');
var _ = require('lodash');

var apiUrl = '.vendhq.com/api';
var authBaseUrl = 'https://secure.vendhq.com/connect';

/*jshint camelcase: false */

function VendConnector(settings) {
  logger.info({
    settings: settings
  }, 'constructed vend-connector');
  this.settings = settings;
}

VendConnector.prototype.get = function get(url, queryParams) {
  logger.info('inside hoist-connector-vend.get');
  return this.request('GET', url, queryParams);
};

VendConnector.prototype.post = function post(url, data) {
  logger.info('inside hoist-connector-vend.post');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in post');
  }
  return this.request('POST', url, null, data);
};

VendConnector.prototype.put = function put(url, data) {
  logger.info('inside hoist-connector-vend.put');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in put');
  }
  return this.request('PUT', url, null, data);
};

VendConnector.prototype.request = function request(method, path, queryParams, data) {
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

    var options = {
      uri: 'https://' + self.authSettings.get('domainPrefix') + apiUrl + path,
      headers: headers,
      method: method,
      resolveWithFullResponse: true
    };

    if (method === 'PUT' || method === 'POST') {
      options.json = true;
      options.body = data;
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
    return self.requestPromiseHelper(options);
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
      .then(bounce.done);
  } else {
    return bounce.redirect(authBaseUrl + '?response_type=code&client_id=' +
      this.settings.clientId + '&redirect_uri=' + this.settings.redirectUri);
  }
};

VendConnector.prototype.requestAccessToken = function (bounce) {
  var body = {
    code: bounce.get('code'),
    client_id: this.settings.clientId,
    client_secret: this.settings.clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: this.settings.redirectUri
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