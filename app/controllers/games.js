var Games = function () {
    this.respondsWith = ["html", "json"];

    this.before(this.requireAuth);

    this.index = function (req, resp, params) {
        this.respond({params: params});
    };
};

exports.Games = Games;
