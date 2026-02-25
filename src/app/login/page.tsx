'use client';

import React, { useState } from 'react';

export default function LoginPage() { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // just logging the data for now, later connect to supabase
        console.log('Logging in with:', {email});
    };

    return (
        <div className='flex min-h-screen items-center justify-center bg-m3-background p-4 font-sans'>
            <div className='w-full max-w-md rounded-m3-card bg-m3-surface p-8 shadow-xl border border-m3-surface-variant'>
                
                <h1 className='mb-2 text-center text-4xl font-bold text-m3-primary'>GymLogger</h1>
                <p className='mb-8 text-center text-m3-text-muted font-medium'>
                    Welcome back!
                </p>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label className='block text-sm font-medium text-m3-text-main mb-2'>Email</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // Styled the input to match the dark M3 theme
                            className='w-full rounded-xl bg-m3-background border border-m3-surface-variant p-3 text-m3-text-main placeholder-m3-text-muted focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all'
                            placeholder='abc@gmail.com'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-m3-text-main mb-2'>Password</label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full rounded-xl bg-m3-background border border-m3-surface-variant p-3 text-m3-text-main focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        // Matches the primary button styling from the Dashboard
                        className='mt-8 w-full rounded-m3-btn bg-m3-primary py-3 text-m3-on-primary font-bold text-lg hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-m3-primary/20'
                    >
                        Sign In 
                    </button>
               
                </form>
            </div>
        </div>
    );
}