var router = new geddy.RegExpRouter();

router.get("/").to("Home.index");
router.get("/home").to("Home.index");

// Basic routes
// router.match("/moving/pictures/:id", "GET").to("Moving.pictures");
//
// router.match("/farewells/:farewelltype/kings/:kingid", "GET").to("Farewells.kings");
//
// Can also match specific HTTP methods only
// router.get("/xandadu").to("Xanadu.specialHandler");
// router.del("/xandadu/:id").to("Xanadu.killItWithFire");
//
// Resource-based routes
// router.resource("hemispheres");
//
// Nested Resource-based routes
// router.resource("hemispheres", function(){
//   this.resource("countries");
//   this.get("/print(.:format)").to("Hemispheres.print");
// });

// Authentication

router.get("/login").to("Home.login");
router.get("/logout").to("Home.logout");
router.post("/auth/local").to("Auth.local");
router.post("/auth/api(.:format)").to("Auth.api");
router.get("/auth/twitter").to("Auth.twitter");
router.get("/auth/twitter/callback").to("Auth.twitterCallback");
router.get("/auth/facebook").to("Auth.facebook");
router.get("/auth/facebook/callback").to("Auth.facebookCallback");
router.get("/auth/yammer").to("Auth.yammer");
router.get("/auth/yammer/callback").to("Auth.yammerCallback");
router.resource("users");
router.match("/signup").to("Users.add");

// Navbar

router.match("/games").to({controller: "Games", action: "index"});
router.match("/leagues").to({controller: "Leagues", action: "index"});
router.match("/tournaments").to({controller: "Tournaments", action: "index"});
router.match("/store").to({controller: "Store", action: "index"});
router.match("/forums").to({controller: "Forums", action: "index"});
router.match("/faq").to({controller: "Faq", action: "index"});

router.get("/settings(/:page)").to({controller: "Settings", action: "index"});
router.put("/settings").to({ controller: "Settings", action: "update" });

router.resource("news");
router.resource("streams");
router.resource("lobbies");
router.resource("friends");
router.resource("ignores");

// Game room
router.match("/lobbies/1/room").to({controller: "Rooms", action: "show"});

exports.router = router;
