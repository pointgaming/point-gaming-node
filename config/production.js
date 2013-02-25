var config = {
    debug: false,
    hostname: "socket.pointgaming.com",
    api_url: "https://dev.pointgaming.com/",
    port: 4000,
    redis: {
        host: "localhost",
        port: 6379
    },
    ssl: {
        key: '/opt/nginx/keys/server.key',
        cert: '/etc/ssl/certs/star_pointgaming_com.pem'
    }
};

module.exports = config;
