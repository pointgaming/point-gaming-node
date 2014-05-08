var config = {
    debug: false,
    hostname: "socket.pointgaming.com",
    api_url: "https://dev.pointgaming.com/",
    api_token: "25ds-45p56q63-56b75s5m-ndma2fd86gkjo4n6-5124z5568-68f9s",
    port: 4000,
    redis: {
        host: "localhost",
        port: 6379
    },
    ssl: {
        key: "/opt/nginx/keys/server.key",
        cert: "/etc/ssl/certs/star_pointgaming_com.pem"
    }
};

module.exports = config;
