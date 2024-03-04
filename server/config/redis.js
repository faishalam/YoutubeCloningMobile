const Redis = require("ioredis");

const redis = new Redis({
    port: 14605, // Redis port
    host: "redis-14605.c1.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.PASSWORD_REDIS,
    db: 0, // Defaults to 0
});

module.exports = redis