var News = function () {
    this.respondsWith = ["html", "json"];

    this.index = function (req, resp, params) {
        this.respond({params: params});
    };
};

exports.News = News;
