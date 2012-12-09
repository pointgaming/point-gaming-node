var Application = function () {
    this._setCurrentUser = function (next) {
        var userId = this.session.get("userId"),
            User = geddy.model.User,
            that = this;

        that.currentUser = null;

        if (userId) {
            User.first({ id: userId }, function (err, _user) {
                console.log(this);
                console.log(err);
                that.currentUser = _user;
                next();
            });
        } else {
            next();
        }
    };

    this.before(this._setCurrentUser, { async: true });
};

exports.Application = Application;
