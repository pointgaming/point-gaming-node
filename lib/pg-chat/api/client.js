var client = function(api_endpoint){
  this.api_endpoint = api_endpoint || "";
};

client.auth_key = 'api_token';
client.buildApiUrl = function(url, auth_token){
  return this.api_endpoint + url + '?' + this.auth_key + "=" + auth_token;
};

// TODO: we should eventually get rid of these instance methods
client.prototype.auth_key = 'api_token';
client.prototype.buildApiUrl = function(url, auth_token){
  return this.api_endpoint + url + '?' + this.auth_key + "=" + auth_token;
};

module.exports = client;
