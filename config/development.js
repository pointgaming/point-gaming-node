var config = {
    detailedErrors: true,
    debug: true,
    hostname: 'localhost',
    port: 9999,
    model: {
        defaultAdapter: 'memory'
    },
    sessions: {
        store: 'memory',
        key: 'sid',
        expiry: 14 * 24 * 60 * 60
    }
};

module.exports = config;
