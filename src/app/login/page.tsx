'use client';

import React, { useState } from 'react';
export default function LoginPage() { 
const[email, setEmail] = useState('');
const[password,setPassword] = useState('');

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // just logging the data for now, later connect to supabase
    console.log('Logging in with:',{email});
};

return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
            <h1 className='mb-6 text-center text-3xl front-bold text-blue-600'>GymLogger</h1>
            <p className='mb-8 text-center text-gray-600 font-medium'>
                Welcome back !
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Email</label>
                    <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
                    placeholder='abc@gmail.com'
                    required
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700'>Password</label>
                    <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
                    required
                    />
                     </div>

                    <button
                    type='submit'
                    className='w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors'>
                        Sign In 
                    </button>
               
            </form>
        </div>


    </div>
);
}