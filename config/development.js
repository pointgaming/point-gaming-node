var config = {
    debug: true,
    hostname: "localhost",
    api_url: "http://localhost:3000/",
    port: 9999,
    redis: {
        host: "localhost",
        port: 6379
    },
    ssl: {
        key: '/etc/ssl/private/ssl-cert-snakeoil.key',
        cert: '/etc/ssl/certs/ssl-cert-snakeoil.pem'
    }
};

module.exports = config;
