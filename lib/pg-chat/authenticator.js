var authenticator = function(){
};

module.exports = authenticator;

authenticator.prototype.auth_key = "auth_token";

authenticator.prototype.authenticate = function(params, callback) {
  PointGaming.api_client.getUserSession(params[this.auth_key], function(err, result) {
    if (result && result.success === true) callback(null, result.user);
    else callback(err ? err : result);
  });
};
