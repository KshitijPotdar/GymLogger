'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewWorkoutPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-m3-background text-m3-text-main p-6 font-sans">
            <div className='mx-auto max-w-3xl'>

                {/* Header */}
                <div className='mb-6 flex items-center gap-4'>
                    <button
                        onClick={() => router.back()} // send back to dashboard
                        className='text-m3-text-muted hover:text-m3-primary transition-colors text-lg font-medium'
                    >
                        ← Back
                    </button>

                    <h1 className='text-3xl font-bold text-m3-primary'>Find Exercises</h1>
                </div>

                {/* Search bar */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search for an exercise (e.g., Bicep curl)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full rounded-m3-btn bg-m3-surface border border-m3-surface-variant p-4 shadow-lg focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary text-lg text-m3-text-main placeholder-m3-text-muted transition-all'
                    />
                </div>

                {/* Search results placeholder */}
                <div className="rounded-m3-card bg-m3-surface p-8 shadow-lg border border-m3-surface-variant text-center">
                    {searchQuery ? (
                        <p className="text-m3-text-main text-lg">
                            Searching for: <strong className="text-m3-primary">{searchQuery}</strong>...
                        </p>
                    ) : (
                        <p className="text-m3-text-muted text-lg">
                            Type in the box above to start searching for exercises.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}