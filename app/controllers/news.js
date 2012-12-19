var News = function () {
    this.respondsWith = ["html", "json"];

    this.before(this.requireAuth);

    this.index = function (req, resp, params) {
        var that = this;

        geddy.model.News.all(function (err, news) {
            that.respond({
                params: params,
                news: news
            });
        });
    };

    this.add = function (req, resp, params) {
        this.respond({ params: params });
    };

    this.create = function (req, resp, params) {
        var news = geddy.model.News.create(params.news),
            that = this;

        news.save(function (err, data) {
            if (err) {
                params.errors = err;
                that.transfer("add");
            } else {
                that.redirect({
                    controller: that.name
                });
            }
        });
    };
};

exports.News = News;
