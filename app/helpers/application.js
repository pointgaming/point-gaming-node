var _ = require("underscore")._;

exports.navItem = function (options) {
    var path = options.path,
        currentPath = options.currentPath,

// +also+ is used for other possibly matching URLs.

        also = options.also,
        name = options.name,
        output = "<li",

        addActive = function () {
            output += " class=\"active\"";
        },

        found;

// Add active class if the paths match

    if (path === currentPath) {
        addActive();
    }

    if (typeof also === "string") {
        if (also === currentPath) {
            addActive();
        }
    } else if (typeof also === "object") {
        found = false;

        _.each(also, function (item) {
            if (currentPath === item) {
                found = true;
                return true;
            }
        });

        if (found === true) {
            addActive();
        }
    }

// Close li opening tag.

    output += ">";

// Add link element

    output += "<a href=\"" + path + "\">";
    output += name;
    output += "</a>";

// Close li node.

    output += "</li>";

    return output;
};
