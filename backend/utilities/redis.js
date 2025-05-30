const RedisStore = require("connect-redis").default
const { createClient } = require("redis")

const redisClient = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: "redis-11634.c330.asia-south1-1.gce.redns.redis-cloud.com",
        port: 11634,
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.error(
                    "Too many Redis reconnection attempts. Exiting..."
                )
                return null // Stop retrying after 5 attempts
            }
            console.warn(`Retrying Redis connection (${retries} attempts)...`)
            return Math.min(retries * 100, 3000) // Exponential backoff up to 3 seconds
        },
    },
})

async function initializeRedisClient() {
    try {
        await redisClient.connect()
        console.log("Connected to Redis")

        const pingResult = await redisClient.ping() // Pinging Redis to check if it's reachable
        console.log("Redis ping result:", pingResult)
    } catch (error) {
        console.error("Redis connection error:", error.message)
        process.exit(1) // Exit process if Redis connection fails
    }
}

// Initialize Redis connection
initializeRedisClient()

// Initialize store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "session:",
})

// Token management utilities
const tokenUtils = {
    // Save a token with expiry time
    saveToken: async (prefix, key, value, expiryInSeconds) => {
        const fullKey = `${prefix}:${key}`;
        await redisClient.set(fullKey, value);
        await redisClient.expire(fullKey, expiryInSeconds);
        return true;
    },

    // Get a token
    getToken: async (prefix, key) => {
        const fullKey = `${prefix}:${key}`;
        return await redisClient.get(fullKey);
    },

    // Delete a token
    deleteToken: async (prefix, key) => {
        const fullKey = `${prefix}:${key}`;
        await redisClient.del(fullKey);
        return true;
    }
};

// Export both the store and the client
module.exports = {
    store: redisStore,
    client: redisClient,
    tokenUtils
};
