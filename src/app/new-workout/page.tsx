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

// Workout set structure
type WorkoutSet = {
    id: number;
    previous: string;
    kg: number | '';
    reps: number | '';
    completed: boolean;
}

// NEW: Combines the exercise with its specific sets
type LoggedExercise = {
    exercise: Exercise;
    sets: WorkoutSet[];
}

export default function NewWorkoutPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); 

    // --- NEW LOGGING STATES ---
    // Instead of one selected exercise, we track an array of them.
    const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setExercises([]); 

        try {
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

    // Add exercise to the left panel
    const handleAddExercise = (exercise: Exercise) => {
        // Prevent adding the exact same exercise twice
        if (loggedExercises.some(log => log.exercise.id === exercise.id)) return;

        const newLoggedExercise: LoggedExercise = {
            exercise: exercise,
            sets: [
                { id: Date.now(), previous: '-', kg: '', reps: '', completed: false }
            ]
        };
        setLoggedExercises([...loggedExercises, newLoggedExercise]);
    };

    // Remove an exercise from the left panel
    const handleRemoveExercise = (exerciseId: string) => {
        setLoggedExercises(loggedExercises.filter(log => log.exercise.id !== exerciseId));
    };

    // Add a new set to a specific exercise
    const handleAddSet = (exerciseId: string) => {
        setLoggedExercises(loggedExercises.map(log => {
            if (log.exercise.id === exerciseId) {
                return {
                    ...log,
                    sets: [...log.sets, { id: Date.now(), previous: '-', kg: '', reps: '', completed: false }]
                };
            }
            return log;
        }));
    };

    // Update a specific field (kg, reps, completed) for a specific set in a specific exercise
    const handleUpdateSet = (exerciseId: string, setId: number, field: keyof WorkoutSet, value: any) => {
        setLoggedExercises(loggedExercises.map(log => {
            if (log.exercise.id === exerciseId) {
                return {
                    ...log,
                    sets: log.sets.map(set => set.id === setId ? { ...set, [field]: value } : set)
                };
            }
            return log;
        }));
    };

    // --- CALCULATE DYNAMIC STATS ---
    const totalSets = loggedExercises.reduce((total, log) => total + log.sets.length, 0);
    
    // Only calculates volume (kg * reps) for sets that are marked as completed!
    const totalVolume = loggedExercises.reduce((total, log) => {
        return total + log.sets.reduce((setTotal, set) => {
            if (set.completed && typeof set.kg === 'number' && typeof set.reps === 'number') {
                return setTotal + (set.kg * set.reps);
            }
            return setTotal;
        }, 0);
    }, 0);

    return (
        <div className="min-h-screen bg-m3-background text-m3-text-main p-6 font-sans">
            
            <div className={`mx-auto transition-all duration-300 ${loggedExercises.length > 0 ? 'max-w-7xl flex flex-col lg:flex-row gap-8' : 'max-w-3xl'}`}>
                
                {/* --- LEFT PANEL (LOG WORKOUT) --- */}
                {loggedExercises.length > 0 && (
                    <div className='w-full lg:w-1/2 bg-m3-surface text-m3-text-main border border-m3-surface-variant p-6 rounded-m3-card sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto shadow-lg'>
                        
                        {/* Header & Stats Area */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Log Workout</h2>
                            <button className="bg-m3-primary text-m3-background px-4 py-1.5 rounded-m3-btn font-bold hover:opacity-90 transition-opacity">
                                Finish
                            </button>
                        </div>

                        <div className="flex justify-between items-center mb-8 bg-m3-background p-4 rounded-m3-card border border-m3-surface-variant">
                            <div className="text-center">
                                <p className="text-sm text-m3-text-muted font-bold tracking-wider">VOLUME</p>
                                <p className="text-m3-primary font-bold text-xl">{totalVolume} kg</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-m3-text-muted font-bold tracking-wider">SETS</p>
                                <p className="font-bold text-xl">{totalSets}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-m3-text-muted font-bold tracking-wider">EXERCISES</p>
                                <p className="font-bold text-xl">{loggedExercises.length}</p>
                            </div>
                        </div>
                        
                        <div className="h-px bg-m3-surface-variant w-full mb-8"></div>

                        {/* --- EXERCISE LIST LOOP --- */}
                        {loggedExercises.map((log) => (
                            <div key={log.exercise.id} className="mb-10 animate-fade-in">
                                
                                {/* Exercise Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={`/api/exercise-image?id=${log.exercise.id}`} 
                                            alt={log.exercise.name} 
                                            className="w-12 h-12 rounded-full object-cover bg-white shrink-0" 
                                        />
                                        <h3 className="text-m3-primary text-xl font-bold capitalize">{log.exercise.name}</h3>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveExercise(log.exercise.id)}
                                        className="text-red-400 hover:text-red-500 hover:bg-red-400/10 p-2 rounded-full transition-colors font-bold text-sm flex items-center gap-1"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                                
                                {/* Sets Table */}
                                <div className="mb-4">
                                    <div className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1fr] gap-2 text-xs font-bold tracking-wider text-m3-text-muted mb-2 px-2">
                                        <div className="text-center">SET</div>
                                        <div>PREVIOUS</div>
                                        <div className="text-center">KG</div>
                                        <div className="text-center">REPS</div>
                                        <div className="text-center">✓</div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {log.sets.map((set, index) => (
                                            <div 
                                                key={set.id} 
                                                className={`grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1fr] gap-2 items-center rounded-m3-btn p-2 transition-colors border ${set.completed ? 'bg-m3-primary/10 border-m3-primary/30' : 'bg-m3-background border-m3-surface-variant'}`}
                                            >
                                                <div className="font-bold text-center text-m3-text-main">{index + 1}</div>
                                                <div className="text-m3-text-muted text-sm truncate">{set.previous}</div>

                                                {/* ADDED theme-spinners WRAPPER HERE */}
                                                <div className="theme-spinners w-full">
                                                    <input 
                                                        type="number" 
                                                        value={set.kg} 
                                                        onChange={(e) => handleUpdateSet(log.exercise.id, set.id, 'kg', Number(e.target.value))}
                                                        className="bg-m3-surface text-m3-text-main border border-m3-surface-variant rounded-m3-btn p-2 text-center w-full focus:outline-none focus:ring-1 focus:ring-m3-primary transition-colors" 
                                                        placeholder="-" 
                                                    />
                                                </div>

                                                {/* ADDED theme-spinners WRAPPER HERE */}
                                                <div className="theme-spinners w-full">
                                                    <input 
                                                        type="number" 
                                                        value={set.reps} 
                                                        onChange={(e) => handleUpdateSet(log.exercise.id, set.id, 'reps', Number(e.target.value))}
                                                        className="bg-m3-surface text-m3-text-main border border-m3-surface-variant rounded-m3-btn p-2 text-center w-full focus:outline-none focus:ring-1 focus:ring-m3-primary transition-colors" 
                                                        placeholder="-" 
                                                    />
                                                </div>

                                                <button 
                                                    onClick={() => handleUpdateSet(log.exercise.id, set.id, 'completed', !set.completed)}
                                                    className={`mx-auto w-8 h-8 rounded-m3-btn flex items-center justify-center transition-all ${set.completed ? 'bg-m3-primary text-m3-background' : 'bg-m3-surface-variant text-transparent hover:bg-m3-surface'}`}
                                                >
                                                    ✓
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleAddSet(log.exercise.id)} 
                                    className="w-full bg-m3-surface-variant hover:bg-m3-surface border border-m3-surface-variant text-m3-text-main py-2 rounded-m3-btn font-bold transition-colors text-sm"
                                >
                                    + Add Set
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- RIGHT PANEL (SEARCH) --- */}
                <div className={`w-full transition-all duration-300 ${loggedExercises.length > 0 ? 'lg:w-1/2' : ''}`}>

                    {/* Header */}
                    <div className='mb-6 flex items-center gap-4'>
                        <button
                            onClick={() => router.back()} 
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
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className='w-full rounded-m3-btn bg-m3-surface border border-m3-surface-variant p-4 shadow-lg focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary text-lg text-m3-text-main placeholder-m3-text-muted transition-all'
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className='bg-m3-primary text-m3-background px-6 rounded-m3-btn font-bold hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Search results Area */}
                    <div className='mt-8'>
                        {error && <p className='text-red-500 text-center'>{error}</p>}
                        {!isLoading && !error && exercises.length === 0 && searchQuery && (
                            <p className='text-m3-text-muted text-center'>No exercises found for "{searchQuery}".</p>
                        )}

                        <div className='flex flex-col gap-6'>
                            {exercises.map((exercise) => {
                                // Check if this exercise is already in our workout log
                                const isAdded = loggedExercises.some(log => log.exercise.id === exercise.id);

                                return (
                                <div 
                                    key={exercise.id}
                                    onClick={() => handleAddExercise(exercise)} 
                                    className={`rounded-m3-card p-6 shadow-lg border flex flex-col sm:flex-row gap-6 items-center sm:items-start cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden
                                        ${isAdded 
                                            ? 'bg-m3-surface-variant border-m3-primary ring-1 ring-m3-primary' 
                                            : 'bg-m3-surface border-m3-surface-variant hover:border-m3-primary'}`}
                                >
                                    {isAdded && (
                                        <div className="absolute top-0 right-0 bg-m3-primary text-m3-background text-xs font-bold px-3 py-1 rounded-bl-lg">
                                            Added
                                        </div>
                                    )}

                                    <img 
                                        src={`/api/exercise-image?id=${exercise.id}`} 
                                        alt={exercise.name} 
                                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl object-cover bg-white shrink-0" 
                                    />
                                    <div className="flex flex-col justify-center pt-2"> 
                                        <h3 className='text-2xl font-bold text-m3-primary capitalize mb-2'>{exercise.name}</h3>
                                        <p className='text-lg text-m3-text-muted capitalize'> 
                                            <span className="font-semibold opacity-75">Target:</span> {exercise.target}
                                        </p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}