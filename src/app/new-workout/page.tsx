'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Exercise data structure from API

type Exercise = {
    id: string;
    name: string;
    target: string;
    gifUrl: string;
}

export default function NewWorkoutPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const [exercises, setExercises] = useState<Exercise[]>([]); // holds array of exercise data
    const [isLoading, setIsLoading] = useState(false); // indicates when to show a loading animation
    const [error, setError] = useState(null); // hold any error messages.


    const handleSearch = async () => {
        // no search if box is empty
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setExercises([]); // clear out previous results

        try {
            //calls api route

            const response = await fetch(`/api/search-exercises?name=${searchQuery}`);

            if (!response.ok) {
                throw new Error('Failed to find exercises.');
            }

            const data = await response.json();
            setExercises(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        };
console.log("API Data:", exercises);

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
                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search for an exercise (e.g., Bicep curl)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full rounded-m3-btn bg-m3-surface border border-m3-surface-variant p-4 shadow-lg focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary text-lg text-m3-text-main placeholder-m3-text-muted transition-all'
                    />

                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className='bg-m3-primary text-m3-background px-6 rounded-m3-btn font-bold hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            {isLoading ? 'Searching....' : 'Search'}
                        </button>
                </div>

                {/* Search results Area */}
                <div className='mt-8'>
                    {error && <p className='text-red-500 text-center'>{error}</p>}

                    {!isLoading && !error && exercises.length == 0 && searchQuery && (
                        <p className='text-m3-text-muted text-center'>No exercises found for "{searchQuery}".</p>
                    )}

                    {/* Changed to flex-col for a single column list */}
                    <div className='flex flex-col gap-6'>
                        {exercises.map((exercise) => (
                            <div 
                                key={exercise.id} 
                                // Changed layout to flex-row so image is on the left, text on the right
                                className='rounded-m3-card bg-m3-surface p-6 shadow-lg border border-m3-surface-variant flex flex-col sm:flex-row gap-6 items-center sm:items-start'
                            >
                                {/* Made the image much bigger (48) and added shrink-0 */}
                                <img 
                                    src={exercise.gifUrl} 
                                    alt={exercise.name} 
                                    className="w-48 h-48 rounded-xl object-cover bg-white shrink-0" 
                                />
                                
                                {/* Made the text slightly larger to match the big image */}
                                <div className="flex flex-col justify-center pt-2"> 
                                    <h3 className='text-2xl font-bold text-m3-primary capitalize mb-2'>{exercise.name}</h3>
                                    <p className='text-lg text-m3-text-muted capitalize'> 
                                        <span className="font-semibold opacity-75">Target:</span> {exercise.target}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}