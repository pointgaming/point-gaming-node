exports.helpers = {
    sidebarItem: function (options) {
        var path = options.path,
            currentPath = options.currentPath,
            name = options.name,
            output = "<li";

// Add active class if the paths match

        if (path === currentPath) {
            output += " class=\"active\"";
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
    }
};
