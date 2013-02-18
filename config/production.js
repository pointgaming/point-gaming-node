var config = {
    debug: false,
    hostname: "dev.pointgaming.net",
    api_url: "http://dev.pointgaming.net/",
    port: 4000,
    redis: {
        host: "localhost",
        port: 6379
    },
    ssl: {
        key: '/opt/nginx/keys/server.key',
        cert: '/opt/nginx/keys/server.csr',
        ca: '/etc/ssl/certs/star_pointgaming_com.pem'
    }
};

module.exports = config;
