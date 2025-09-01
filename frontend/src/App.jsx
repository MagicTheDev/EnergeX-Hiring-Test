import React, { useEffect, useState } from 'react';
import api from './api.js';
import Auth from './components/Auth.jsx';
import NewPost from './components/NewPost.jsx';
import PostList from './components/PostList.jsx';

export default function App() {             // <-- default export
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loggedIn = Boolean(token);

    const loadPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/posts');
            setPosts(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Load posts failed:', e);
            setError('Failed to load posts.');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loggedIn) loadPosts();
    }, [loggedIn]);

    const handleAuth = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setPosts([]);
    };

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', color: '#eee', fontFamily: 'system-ui, sans-serif' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h1 style={{ margin: 0 }}>EnergeX Assessment</h1>
                <div style={{ flex: 1 }} />
                {loggedIn && (
                    <button onClick={handleLogout} style={{ padding: '8px 12px' }}>
                        Logout
                    </button>
                )}
            </header>

            {!loggedIn ? (
                <Auth onAuth={handleAuth} />
            ) : (
                <>
                    <NewPost onCreated={loadPosts} />
                    <section style={{ marginTop: 24 }}>
                        <h2 style={{ marginTop: 0 }}>Posts</h2>
                        {error && <p style={{ color: '#f66' }}>{error}</p>}
                        {loading ? <p>Loading…</p> : <PostList posts={posts} />}
                    </section>
                </>
            )}
        </div>
    );
}