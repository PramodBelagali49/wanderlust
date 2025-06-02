const RedisStore = require("connect-redis").default
const { createClient } = require("redis")

let redisClient;

// Only create Redis client if not in test environment
if (process.env.NODE_ENV !== 'test') {
    redisClient = createClient({
        password: process.env.REDIS_PASS,
        socket: {
            host: "redis-11634.c330.asia-south1-1.gce.redns.redis-cloud.com",
            port: 11634,
            reconnectStrategy: (retries) => {
                if (retries > 5) {
                    console.error("Too many Redis reconnection attempts. Exiting...")
                    return null // Stop retrying after 5 attempts
                }
                console.warn(`Retrying Redis connection (${retries} attempts)...`)
                return Math.min(retries * 100, 3000) // Exponential backoff up to 3 seconds
            },
        },
    });
} else {
    // Mock Redis client for testing
    console.log("Using mock Redis client for testing");
    redisClient = {
        connect: () => {
            console.log("Mock Redis connected");
            return Promise.resolve();
        },
        ping: () => Promise.resolve("PONG"),
        on: () => {},
        set: () => Promise.resolve("OK"),
        get: () => Promise.resolve(null),
        del: () => Promise.resolve(1),
        expire: () => Promise.resolve(1),
        quit: () => Promise.resolve("OK")
    };
}

async function initializeRedisClient() {
    if (process.env.NODE_ENV !== 'test') {
        try {
            await redisClient.connect()
            console.log("Connected to Redis")

            const pingResult = await redisClient.ping()
            console.log("Redis ping result:", pingResult)
        } catch (error) {
            console.error("Redis connection error:", error.message)
            process.exit(1)
        }
    }
}

// Initialize Redis connection if not in test environment
if (process.env.NODE_ENV !== 'test') {
    initializeRedisClient()
}

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
