var Application = function () {
    this.before(function (next) {
        var userId = this.session.get("userId"),
            User = geddy.model.User,
            that = this;

        that.currentUser = null;

        if (userId) {
            User.first({ id: userId }, function (err, _user) {
                that.currentUser = _user;
                next();
            });
        } else {
            next();
        }
    }, { async: true });
};

exports.Application = Application;
