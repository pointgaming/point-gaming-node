var Lobbies = function () {
    this.respondsWith = ["html", "json"];

    this.index = function (req, resp, params) {
        this.respond({
            params: params
        });
    };

    this.show = function (req, resp, params) {
        this.respond({
            params: params
        });
    };
};

exports.Lobbies = Lobbies;
