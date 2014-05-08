"use strict";

var fs = require("fs"),
    s = require("string"),
    modelPath = __dirname + "/../../lib/pg-chat/models",
    capitalizeFirst = function (string) {
        return string.substr(0, 1).toUpperCase() + string.substring(1);
    },
    PointGaming = global.PointGaming;

PointGaming.models = PointGaming.models || {};

module.exports = function (callback) {
    fs.readdir(modelPath, function (err, files) {
        if (err) {
            throw err;
        }

        files.forEach(function (file) {
            var klass = capitalizeFirst(s(file.replace(/\.js$/, "")).camelize().toString());
            PointGaming.models[klass] = new(require(modelPath + "/" + file))();
        });

        if (typeof callback === "function") {
            callback();
        }
    });
};
