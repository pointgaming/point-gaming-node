var rest = require('restler');

var authenticator = function(){};
authenticator.prototype.auth_url = "http://localhost:3000/api/v1/sessions/show";
authenticator.prototype.auth_key = "auth_token";

authenticator.prototype.authenticate = function(params, callback) {
  var api_url = this.auth_url + '?' + this.auth_key + "=" + params[this.auth_key];
  rest.get(api_url).on('complete', function(result) {
    if (result && result.success === true) callback(null, result);
    else callback(result);
  });
};

module.exports = authenticator;
