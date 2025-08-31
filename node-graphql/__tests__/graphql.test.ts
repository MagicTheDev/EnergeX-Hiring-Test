import request from 'supertest';
import { buildApp } from '../src/index';

jest.mock('../src/db', () => ({
    pool: { query: jest.fn() }
}));

jest.mock('../src/redis', () => {
    const redis = {
        get: jest.fn(),
        set: jest.fn(),
        expire: jest.fn(),
        setex: jest.fn(),
        flushall: jest.fn(),
    };
    const cacheKeys = {
        postsAll: 'posts:all',
        postById: (id: number) => `post:${id}`,
    };
    return { redis, cacheKeys };
});

import { pool } from '../src/db';
import { redis, cacheKeys } from '../src/redis';

describe('GraphQL API', () => {
    let app: any;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        app = await buildApp();
    });

    beforeEach(async () => {
        (pool.query as jest.Mock).mockReset();

        // reset all redis fns
        (redis.get as jest.Mock).mockReset();
        (redis.set as jest.Mock).mockReset();
        (redis.expire as jest.Mock).mockReset();
        (redis.setex as jest.Mock).mockReset();
        (redis.flushall as jest.Mock).mockReset();

        // default: behave like an empty cache (miss)
        (redis.get as jest.Mock).mockResolvedValue(null);
        (redis.flushall as jest.Mock).mockResolvedValue('OK');
        (redis.setex as jest.Mock).mockResolvedValue('OK');
    });

    test('posts: DB path populates cache (setex called with rows)', async () => {
        const rows = [
            { id: 3, title: 'C', content: 'c', user_id: 1, created_at: '2025-08-31 12:00:00' },
            { id: 2, title: 'B', content: 'b', user_id: 1, created_at: '2025-08-31 11:00:00' },
            { id: 1, title: 'A', content: 'a', user_id: 1, created_at: '2025-08-31 10:00:00' }
        ];
        (pool.query as jest.Mock).mockResolvedValueOnce([rows]);

        const res = await request(app)
            .post('/graphql')
            .set('Accept', 'application/json')
            .send({ query: '{ posts { id title content user_id created_at } }' })
            .expect(200);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.posts).toHaveLength(3);

        expect(redis.setex).toHaveBeenCalledWith(
            cacheKeys.postsAll,
            expect.any(Number),
            JSON.stringify(rows)
        );
    });

    test('posts: cache path (force redis.get to return JSON); DB not called', async () => {
        const rows = [
            { id: 3, title: 'C', content: 'c', user_id: 1, created_at: '2025-08-31 12:00:00' },
            { id: 2, title: 'B', content: 'b', user_id: 1, created_at: '2025-08-31 11:00:00' },
            { id: 1, title: 'A', content: 'a', user_id: 1, created_at: '2025-08-31 10:00:00' }
        ];

        (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(rows));

        const res = await request(app)
            .post('/graphql')
            .set('Accept', 'application/json')
            .send({ query: '{ posts { id title } }' })
            .expect(200);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.posts).toHaveLength(3);
        expect(pool.query).not.toHaveBeenCalled();
    });

    test('post(id): DB then cache (second call forces redis.get return); no second DB call', async () => {
        const row = { id: 42, title: 'Meaning', content: 'life', user_id: 7, created_at: null };
        const query = 'query($id:ID!){ post(id:$id){ id title content user_id created_at } }';
        const variables = { id: 42 };

        (pool.query as jest.Mock).mockResolvedValueOnce([[row]]);

        const first = await request(app)
            .post('/graphql').set('Accept','application/json')
            .send({ query, variables }).expect(200);

        expect(first.body.errors).toBeUndefined();
        expect(first.body.data.post).toMatchObject({ id: '42', title: 'Meaning' });

        (pool.query as jest.Mock).mockClear();
        (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(row));

        const second = await request(app)
            .post('/graphql').set('Accept','application/json')
            .send({ query, variables }).expect(200);

        expect(second.body.errors).toBeUndefined();
        expect(second.body.data.post.title).toBe('Meaning');
        expect(pool.query).not.toHaveBeenCalled(); // ✅ cache used
    });

    test('posts: DB error surfaces as GraphQL error (data=null, errors present)', async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error('boom'));

        const res = await request(app)
            .post('/graphql')
            .set('Accept','application/json')
            .send({ query: '{ posts { id title } }' })
            .expect(200);

        expect(res.body.data).toBeNull();
        expect(res.body.errors?.[0]?.message).toMatch(/boom/i);
    });
});