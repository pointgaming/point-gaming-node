// Add uncaught-exception handler in prod-like environments
if (process.env.NODE_ENV !== "development") {
    process.addListener("uncaughtException", function (err) {
        var msg = err.message;
        if (err.stack) {
            msg += "\n" + err.stack;
        }
        if (!msg) {
            msg = JSON.stringify(err);
        }
        console.log('Error: ' + msg);
    });
}
