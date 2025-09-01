import React, { useState } from 'react';
import api from '../api';

export default function NewPost({ onCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/posts', { title, content });
            setTitle(''); setContent('');
            onCreated?.(data);
        } catch (e) {
            console.error(e);
            alert('Create failed (are you logged in?)');
        }
    };

    return (
        <section className="card">
            <h2>New Post</h2>
            <form onSubmit={submit} className="form">
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <textarea placeholder="Content (optional)" value={content} onChange={e => setContent(e.target.value)} />
                <button className="btn" type="submit">Create</button>
            </form>
        </section>
    );
}