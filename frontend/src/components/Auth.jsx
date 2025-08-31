import React, { useState } from 'react';
import api from '../api';

export default function Auth({ onAuth }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const isRegister = mode === 'register';

    const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const getErr = (k) => {
        const src = fieldErrors?.errors ?? fieldErrors ?? {};
        const arr = src?.[k];
        return Array.isArray(arr) ? arr[0] : undefined;
    };

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFieldErrors({});
        setGeneralError('');

        try {
            if (isRegister) {
                const { data } = await api.post('/api/register', {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                });
                onAuth?.(data.token);
            } else {
                const { data } = await api.post('/api/login', {
                    email: form.email,
                    password: form.password,
                });
                onAuth?.(data.token);
            }
        } catch (err) {
            // Axios error parsing
            const res = err?.response;
            if (res?.status === 422) {
                // Lumen/Laravel validation
                // could be { errors: {...} } OR plain field map
                setFieldErrors(res.data || {});
                setGeneralError('');
            } else if (res?.data?.message) {
                setGeneralError(res.data.message);
            } else if (err?.message) {
                setGeneralError(err.message);
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="tabs" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                    className={isRegister ? '' : 'active'}
                    onClick={() => { setMode('login'); setFieldErrors({}); setGeneralError(''); }}
                >
                    Login
                </button>
                <button
                    className={isRegister ? 'active' : ''}
                    onClick={() => { setMode('register'); setFieldErrors({}); setGeneralError(''); }}
                >
                    Register
                </button>
            </div>

            {/* General error box (non-field errors) */}
            {generalError && (
                <div
                    style={{
                        background: '#3a0c0c',
                        border: '1px solid #5b1b1b',
                        color: '#ffb3b3',
                        padding: '8px 10px',
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                >
                    {generalError}
                </div>
            )}

            <form onSubmit={submit} className="form" noValidate>
                {isRegister && (
                    <div style={{ marginBottom: 10 }}>
                        <input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) => setVal('name', e.target.value)}
                            required
                        />
                        {getErr('name') && (
                            <div style={{ color: '#ff8888', fontSize: 12, marginTop: 4 }}>{getErr('name')}</div>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: 10 }}>
                    <input
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setVal('email', e.target.value)}
                        required
                    />
                    {getErr('email') && (
                        <div style={{ color: '#ff8888', fontSize: 12, marginTop: 4 }}>{getErr('email')}</div>
                    )}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <input
                        placeholder="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setVal('password', e.target.value)}
                        required
                    />
                    {getErr('password') && (
                        <div style={{ color: '#ff8888', fontSize: 12, marginTop: 4 }}>{getErr('password')}</div>
                    )}
                </div>

                <button className="btn" type="submit" disabled={submitting} style={{ width: '100%' }}>
                    {submitting ? 'Please wait…' : isRegister ? 'Register' : 'Login'}
                </button>
            </form>
        </section>
    );
}