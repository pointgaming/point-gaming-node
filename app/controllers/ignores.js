var async = require('async');

var Ignores = function () {
  this.respondsWith = ['html', 'json'];

  this.before(this.requireAuth);

  this.index = function (req, resp, params) {
    var self = this;

    self.currentUser.getIgnoredUsers(function(err, ignores){
      if (params.format !== 'html') {
        self.respond({ignores: ignores});
      } else {
        self.respond({params: params, ignores: ignores});
      }
    });
  };

  this.add = function (req, resp, params) {
    if (params.format !== 'html') {
      var newParams = {};
      if ('success' in params) newParams.success = params.success;
      if ('errors' in params) newParams.errors = params.errors;
      this.respond(newParams);
    } else {
      this.respond({params: params});
    }
  };

  this.create = function (req, resp, params) {
    var self = this;

    async.auto({
      validateSelf: function(callback) {
        if (params.username === self.currentUser.username) {
            callback({username: 'You cannot ignore yourself.'});
        } else {
            callback(null);
        }
      },
      // get User.id or error
      getIgnoreUserId: ["validateSelf", function(callback) {
        geddy.model.User.first({username: params.username}, function(err, data) {
          if (data) {
            callback(null, data.id);
          } else {
            callback({username: 'That user does not exist.'});
          }
        });
      }],
      // check if this user is already ignoring the specifiedUser
      ignoreRelationExists: ["getIgnoreUserId", function(callback, results) {
        geddy.model.Ignore.first({userId: self.currentUser.id, ignoreUserId: results.getIgnoreUserId}, function(err, data) {
          if (data) {
            callback({username: 'You are already ignoring that user.'});
          } else {
            callback(null, false);
          }
        });
      }],
      // create the ignore DB entry
      createIgnoreRelation: ["ignoreRelationExists", function(callback, results) {
        var ignore = geddy.model.Ignore.create({
          userId: self.currentUser.id,
          ignoreUserId: results.getIgnoreUserId
        });

        ignore.save(function(err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data.id);
          }
        });
      }]
    }, function(err, results){
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        if (params.format === 'html') {
          self.redirect({controller: self.name});
        } else {
          params.success = true;
          self.transfer('add');
        }
      }
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    async.auto({
      // find User.id by username (params.id until I fix route)
      getIgnoreUserId: function(callback) {
        geddy.model.User.first({username: params.id}, function(err, data) {
          if (data) {
            callback(null, data.id);
          } else {
            callback({username: 'That user does not exist.'});
          }
        });
      },
      // lookup the ignore relation
      ignoreRelationId: ["getIgnoreUserId", function(callback, results) {
        geddy.model.Ignore.first({userId: self.currentUser.id, ignoreUserId: results.getIgnoreUserId}, function(err, data) {
          if (data) {
            callback(null, data.id);
          } else {
            callback({username: 'You are not ignoring that user.'});
          }
        });
      }],
      // delete the ignore relation
      deleteIgnoreRelation: ["ignoreRelationId", function(callback, results) {
        geddy.model.Ignore.remove(results.ignoreRelationId, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      }]
    }, function(err, results){
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        if (params.format === 'html') {
          self.redirect({controller: self.name});
        } else {
          params.success = true;
          self.transfer('add');
        }

      }
    });
  };

};

exports.Ignores = Ignores;