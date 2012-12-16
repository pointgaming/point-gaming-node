var config = {
    detailedErrors: false,
    hostname: null,
    port: 4000,
    model: {
        defaultAdapter: "riak"
    },
    db: {
        riak: {
            username: null,
            host: "localhost",
            port: 8098
        }
    },
    sessions: {
        store: "memcache",
        key: "sid",
        expiry: 14 * 24 * 60 * 60
    }
};

module.exports = config;
