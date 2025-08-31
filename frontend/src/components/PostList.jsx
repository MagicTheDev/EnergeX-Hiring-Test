import React from 'react';

export default function PostList({ posts }) {
    if (!posts?.length) return <p>No posts yet.</p>;
    return (
        <ul className="posts">
            {posts.map(p => (
                <li key={p.id} className="post">
                    <h3>{p.title}</h3>
                    {p.content ? <p>{p.content}</p> : null}
                    <small>id #{p.id} • user {p.user_id} {p.created_at ? `• ${p.created_at}` : ''}</small>
                </li>
            ))}
        </ul>
    );
}