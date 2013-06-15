var async = require('async'),
    initializers = [
      'amqp',
      'api_client',
      'redis',
      'load_models',
      'cleanup_redis'
    ],
    initializer;

module.exports = function(callback) {
  // include the files listed above in the order they are specified
  async.eachSeries(initializers, function(file, iter_callback) {
      initializer = require('./' + file);
      if (typeof(initializer) === 'function') {
        initializer(iter_callback);
      } else {
        iter_callback(null);
      }
  }, function(err) {
      if (typeof(callback) === 'function') {
          callback(err);
      }
  });
}
