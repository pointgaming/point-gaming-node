var News = function () {
    this.defineProperties({
        title: {
            type: "string",
            required: true
        },
        content: {
            type: "string"
        }
    });

    this.validatesPresent("title");
    this.validatesPresent("content");
};

News = geddy.model.register("News", News);
