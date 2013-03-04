var fs = require('fs'),
    S = require('string'),
    modelPath = __dirname + '/../../lib/pg-chat/models',
    PointGaming = global.PointGaming;

PointGaming.models = PointGaming.models || {};

module.exports = function(callback) {
  fs.readdir(modelPath, function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      var klass_name = capitalizeFirst(S(file.replace(/\.js$/, '')).camelize().toString());
      PointGaming.models[klass_name] = new (require(modelPath + '/' + file))();
    });

    if (typeof(callback) === 'function') {
      callback();
    }
  });
};

var capitalizeFirst = function(string) {
  return string.substr(0, 1).toUpperCase() + string.substring(1);
};
