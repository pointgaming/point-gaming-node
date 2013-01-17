var Authtoken = function () {
    this.belongsTo("User");
};

Authtoken = geddy.model.register("Authtoken", Authtoken);
