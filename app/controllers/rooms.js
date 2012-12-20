var Rooms = function () {
    this.respondsWith = ["html", "json"];

    this.before(this.requireAuth);

    this.show = function (req, resp, params) {
        this.respond({
            params: params
        });
    };
};

exports.Rooms = Rooms;
