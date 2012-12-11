exports.formFor = function (object, options, builder) {
    var output = "<form",
        _ = require("underscore")._,
        helpers = {};

// Input-checking here.

    if (!object) {
        throw "Object required.";
    }

    if (!options) {
        options = {};
    }

    if (!builder || typeof builder !== "function") {
        throw "Builder function required.";
    }

// Form action, method, and classes.

    if (!options.action) {
        options.action = "#";
    }

    output += ' action="' + options.action + '"';

    if (options.method) {
        options.method = "POST";
    }

    output += ' method="' + options.method + '"';

    if (typeof options.classes === "object") {
        output += ' class="';
        output += _.values(options.classes).join(" ");
        output += '"';
    } else if (typeof options.classes === "string") {
        output += ' class="' + options.classes + '"';
    }

// Close the starting form tag.

    output += ">";

// Add _method for PUT or DELETE requests.

    output += '<input type="hidden" name="_method" value="' + options.method + '" />';

    helpers.textField = function (attribute) {
        if (!object.hasOwnProperty(attribute)) {
            throw "Attribute " + attribute + " not found.";
        }

        output += '<div class="control-group">';
        output += '<label for="user_firstName" class="control-label">First Name</label>';
        output += '<div class="controls">';
        output += '<input type="text" class="input-xlarge" id="" name="user[firstName]" value="" />';
        output += '</div>';
        output += '</div>';
    };

    builder.call(this, helpers);

    output += "</form>";
    console.log(this);
    console.log(builder);

    return output;
};
