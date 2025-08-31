import { pool } from './db';
import { redis, cacheKeys } from './redis';

export const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String
    user_id: Int!
    created_at: String
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }
`;

export const resolvers = {
    Query: {
        // All posts (DESC by id), cached globally
        posts: async () => {
            const key = cacheKeys.postsAll;

            try {
                const cached = await redis.get(key);
                if (cached) return JSON.parse(cached);
            } catch {}

            const [rows] = await pool.query(
                'SELECT id, title, content, user_id, created_at FROM posts ORDER BY id DESC'
            );
            const data = rows as any[];

            try {
                await redis.setex(key, 60, JSON.stringify(data));
            } catch {}

            return data;
        },

        // One post by id, cached globally
        post: async (_: unknown, { id }: { id: number }) => {
            const key = cacheKeys.postById(Number(id));

            try {
                const cached = await redis.get(key);
                if (cached) return JSON.parse(cached);
            } catch {}

            const [rows] = await pool.query(
                'SELECT id, title, content, user_id, created_at FROM posts WHERE id = ? LIMIT 1',
                [id]
            );
            const post = (rows as any[])[0] || null;

            if (post) {
                try {
                    await redis.setex(key, 60, JSON.stringify(post));
                } catch {}
            }

            return post;
        }
    }
};