"use strict";

var argv = require("optimist").string("e").argv,
    PointGaming = global.PointGaming || {};

// setup the global variable
global.PointGaming = PointGaming;

// setup the environment
if (typeof argv.e !== "undefined") {
    process.env.NODE_ENV = argv.e;
} else if (typeof process.env.NODE_ENV === "undefined") {
    process.env.NODE_ENV = "development";
}

// run the initialization script
require("./config/init");

// load the config
PointGaming.config = require("config");

// run the initializers
require("./config/initializers/index")(function (err) {
    if (err) {
        console.log("There was a problem loading the initializers");
        console.log(err);
        process.exit(1);
    }

    console.log("starting the server");

    // start the server
    require("./lib/pg-chat/server").start();
});
