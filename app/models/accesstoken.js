var Accesstoken = function () {
    this.belongsTo("User");
};

Accesstoken = geddy.model.register("Accesstoken", Accesstoken);
