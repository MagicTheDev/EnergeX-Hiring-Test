import RedisMock from 'ioredis-mock';

export const redis = new (RedisMock as any)();

export const cacheKeys = {
    postsAll: 'posts:all',
    postById: (id: number) => `post:${id}`
};
