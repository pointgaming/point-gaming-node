var client = function(api_endpoint){
  this.api_endpoint = api_endpoint || "";
};

client.prototype.auth_key = 'api_token';

client.prototype.buildApiUrl = function(url, auth_token){
  return this.api_endpoint + url + '?' + this.auth_key + "=" + auth_token;
};

module.exports = client;
