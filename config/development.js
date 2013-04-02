var config = {
    debug: true,
    hostname: "localhost",
    api_url: "http://localhost:3000/",
    api_token: "M9812Y125T-V234BCOV6-B7PGL23WM-S68CAS53FNGO2B-4JGNT-6RU",
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
