var rest = require('restler');

var authenticator = function(manager){
  this.manager = manager;
};
authenticator.prototype.auth_key = "auth_token";

authenticator.prototype.authenticate = function(params, callback) {
  this.manager.api_client.getUserSession(params[this.auth_key], function(err, result) {
    if (result && result.success === true) callback(null, result);
    else callback(err ? err : result);
  });
};

module.exports = authenticator;
