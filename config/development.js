var config = {
    detailedErrors: true,
    debug: true,
    hostname: "localhost",
    port: 9999,
    model: {
        defaultAdapter: "riak",
    },
    db: {
        riak: {
            protocol: "http",
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
