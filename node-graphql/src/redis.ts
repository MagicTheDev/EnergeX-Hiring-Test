import Redis from 'ioredis';

export const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined
});

// 💡 Global cache keys now (no user scoping)
export const cacheKeys = {
    postsAll: 'posts:all',
    postById: (id: number) => `post:${id}`
};