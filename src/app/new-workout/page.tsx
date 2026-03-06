'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Exercise = { id: string; name: string; target: string; gifUrl: string; }
type WorkoutSet = { id: number; previous: string; kg: number | ''; reps: number | ''; completed: boolean; }

// We added 'settings' to the frontend type!
type LoggedExercise = {
    exercise: Exercise;
    settings: string; 
    sets: WorkoutSet[];
}

export default function NewWorkoutPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); 

    const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // --- NEW: LIVE TIMER STATE ---
    const [durationInSeconds, setDurationInSeconds] = useState(0);

    // This hook runs the clock! It adds 1 second every 1000 milliseconds.
    useEffect(() => {
        const timer = setInterval(() => {
            setDurationInSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer); // Clean up when we leave the page
    }, []);

    // Formats seconds into MM:SS for the UI
    const formattedTime = () => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true); setError(null); setExercises([]); 
        try {
            const response = await fetch(`/api/search-exercises?name=${searchQuery}`);
            if (!response.ok) throw new Error('Failed to find exercises.');
            const data = await response.json();
            setExercises(data);
        } catch (err: any) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    const handleAddExercise = (exercise: Exercise) => {
        if (loggedExercises.some(log => log.exercise.id === exercise.id)) return;
        const newLoggedExercise: LoggedExercise = {
            exercise: exercise,
            settings: '', // Initialize blank settings
            sets: [{ id: Date.now(), previous: '-', kg: '', reps: '', completed: false }]
        };
        setLoggedExercises([...loggedExercises, newLoggedExercise]);
    };

    const handleRemoveExercise = (exerciseId: string) => {
        setLoggedExercises(loggedExercises.filter(log => log.exercise.id !== exerciseId));
    };

    // --- NEW: Update Settings Text ---
    const handleUpdateSettings = (exerciseId: string, text: string) => {
        setLoggedExercises(loggedExercises.map(log => 
            log.exercise.id === exerciseId ? { ...log, settings: text } : log
        ));
    };

    const handleAddSet = (exerciseId: string) => {
        setLoggedExercises(loggedExercises.map(log => {
            if (log.exercise.id === exerciseId) {
                return { ...log, sets: [...log.sets, { id: Date.now(), previous: '-', kg: '', reps: '', completed: false }] };
            }
            return log;
        }));
    };

    const handleUpdateSet = (exerciseId: string, setId: number, field: keyof WorkoutSet, value: any) => {
        setLoggedExercises(loggedExercises.map(log => {
            if (log.exercise.id === exerciseId) {
                return { ...log, sets: log.sets.map(set => set.id === setId ? { ...set, [field]: value } : set) };
            }
            return log;
        }));
    };

    const totalSets = loggedExercises.reduce((total, log) => total + log.sets.length, 0);
    const totalVolume = loggedExercises.reduce((total, log) => {
        return total + log.sets.reduce((setTotal, set) => {
            if (set.completed && typeof set.kg === 'number' && typeof set.reps === 'number') return setTotal + (set.kg * set.reps);
            return setTotal;
        }, 0);
    }, 0);

    const handleFinishWorkout = async () => {
        if (totalSets === 0) {
            alert("Please complete at least one set before finishing the workout!");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    volume: totalVolume,
                    totalSets: totalSets,
                    duration: durationInSeconds, // Send the timer!
                    loggedExercises: loggedExercises
                })
            });

            if (!response.ok) throw new Error("Failed to save");
            setIsSuccess(true);
        } catch (error) {
            alert("There was an issue saving your workout.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-m3-background text-m3-text-main flex flex-col items-center justify-center p-6 font-sans">
                <div className="bg-m3-surface border border-m3-surface-variant p-10 rounded-m3-card shadow-2xl flex flex-col items-center max-w-md w-full animate-fade-in">
                    <div className="w-24 h-24 bg-m3-primary/20 rounded-full flex items-center justify-center mb-6">
                        <span className="text-5xl text-m3-primary">✓</span>
                    </div>
                    <h1 className="text-3xl font-bold text-m3-primary mb-3 text-center">Workout Recorded!</h1>
                    <p className="text-m3-text-muted text-center mb-8 text-lg">
                        You crushed <span className="font-bold text-m3-text-main">{totalSets} sets</span> for a total volume of <span className="font-bold text-m3-text-main">{totalVolume} kg</span> in <span className="font-bold text-m3-text-main">{formattedTime()}</span>.
                    </p>
                    <button onClick={() => router.push('/dashboard')} className="w-full bg-m3-primary text-m3-background py-4 rounded-m3-btn font-bold text-lg hover:opacity-90 transition-opacity">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-m3-background text-m3-text-main p-6 font-sans">
            <div className={`mx-auto transition-all duration-300 ${loggedExercises.length > 0 ? 'max-w-7xl flex flex-col lg:flex-row gap-8' : 'max-w-3xl'}`}>
                
                {/* --- LEFT PANEL --- */}
                {loggedExercises.length > 0 && (
                    <div className='w-full lg:w-1/2 bg-m3-surface text-m3-text-main border border-m3-surface-variant p-6 rounded-m3-card sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto shadow-lg'>
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Log Workout</h2>
                            <button onClick={handleFinishWorkout} disabled={isSaving} className="bg-m3-primary text-m3-background px-6 py-2 rounded-m3-btn font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Finish'}
                            </button>
                        </div>

                        {/* ADDED THE TIMER TO THE TOP STATS! */}
                        <div className="flex justify-between items-center mb-8 bg-m3-background p-4 rounded-m3-card border border-m3-surface-variant">
                            <div className="text-center">
                                <p className="text-sm text-m3-text-muted font-bold tracking-wider">TIME</p>
                                <p className="text-blue-400 font-bold text-xl">{formattedTime()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-m3-text-muted font-bold tracking-wider">VOLUME</p>
                                <p className="text-m3-primary font-bold text-xl">{totalVolume}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-m3-text-muted font-bold tracking-wider">SETS</p>
                                <p className="font-bold text-xl">{totalSets}</p>
                            </div>
                        </div>
                        
                        <div className="h-px bg-m3-surface-variant w-full mb-8"></div>

                        {loggedExercises.map((log) => (
                            <div key={log.exercise.id} className="mb-10 animate-fade-in">
                                
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <img src={`/api/exercise-image?id=${log.exercise.id}`} alt={log.exercise.name} className="w-12 h-12 rounded-full object-cover bg-white shrink-0" />
                                        <h3 className="text-m3-primary text-xl font-bold capitalize">{log.exercise.name}</h3>
                                    </div>
                                    <button onClick={() => handleRemoveExercise(log.exercise.id)} className="text-red-400 hover:text-red-500 hover:bg-red-400/10 p-2 rounded-full transition-colors font-bold text-sm flex items-center gap-1">✕</button>
                                </div>
                                
                                {/* ADDED SETTINGS/NOTES INPUT */}
                                <input 
                                    type="text" 
                                    placeholder="Add notes or settings (e.g., Seat 4, Pad 2)..." 
                                    value={log.settings}
                                    onChange={(e) => handleUpdateSettings(log.exercise.id, e.target.value)}
                                    className="w-full bg-transparent border-b border-m3-surface-variant text-m3-text-muted text-sm focus:outline-none focus:border-m3-primary mb-6 pb-2 transition-colors"
                                />
                                
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
                                            <div key={set.id} className={`grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1fr] gap-2 items-center rounded-m3-btn p-2 transition-colors border ${set.completed ? 'bg-m3-primary/10 border-m3-primary/30' : 'bg-m3-background border-m3-surface-variant'}`}>
                                                <div className="font-bold text-center text-m3-text-main">{index + 1}</div>
                                                <div className="text-m3-text-muted text-sm truncate">{set.previous}</div>
                                                <div className="theme-spinners w-full"><input type="number" value={set.kg} onChange={(e) => handleUpdateSet(log.exercise.id, set.id, 'kg', Number(e.target.value))} className="bg-m3-surface text-m3-text-main border border-m3-surface-variant rounded-m3-btn p-2 text-center w-full focus:outline-none focus:ring-1 focus:ring-m3-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="-" /></div>
                                                <div className="theme-spinners w-full"><input type="number" value={set.reps} onChange={(e) => handleUpdateSet(log.exercise.id, set.id, 'reps', Number(e.target.value))} className="bg-m3-surface text-m3-text-main border border-m3-surface-variant rounded-m3-btn p-2 text-center w-full focus:outline-none focus:ring-1 focus:ring-m3-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="-" /></div>
                                                <button onClick={() => handleUpdateSet(log.exercise.id, set.id, 'completed', !set.completed)} className={`mx-auto w-8 h-8 rounded-m3-btn flex items-center justify-center transition-all ${set.completed ? 'bg-m3-primary text-m3-background' : 'bg-m3-surface-variant text-transparent hover:bg-m3-surface'}`}>✓</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => handleAddSet(log.exercise.id)} className="w-full bg-m3-surface-variant hover:bg-m3-surface border border-m3-surface-variant text-m3-text-main py-2 rounded-m3-btn font-bold transition-colors text-sm">
                                    + Add Set
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- RIGHT PANEL (SEARCH) --- */}
                <div className={`w-full transition-all duration-300 ${loggedExercises.length > 0 ? 'lg:w-1/2' : ''}`}>
                    <div className='mb-6 flex items-center gap-4'>
                        <button onClick={() => router.back()} className='text-m3-text-muted hover:text-m3-primary transition-colors text-lg font-medium'>← Back</button>
                        <h1 className='text-3xl font-bold text-m3-primary'>Find Exercises</h1>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <input type="text" placeholder="Search for an exercise (e.g., Bicep curl)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className='w-full rounded-m3-btn bg-m3-surface border border-m3-surface-variant p-4 shadow-lg focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary text-lg text-m3-text-main placeholder-m3-text-muted transition-all' />
                        <button onClick={handleSearch} disabled={isLoading} className='bg-m3-primary text-m3-background px-6 rounded-m3-btn font-bold hover:opacity-90 transition-opacity disabled:opacity-50'>{isLoading ? 'Searching...' : 'Search'}</button>
                    </div>

                    <div className='mt-8'>
                        {error && <p className='text-red-500 text-center'>{error}</p>}
                        {!isLoading && !error && exercises.length === 0 && searchQuery && <p className='text-m3-text-muted text-center'>No exercises found.</p>}

                        <div className='flex flex-col gap-6'>
                            {exercises.map((exercise) => {
                                const isAdded = loggedExercises.some(log => log.exercise.id === exercise.id);
                                return (
                                <div key={exercise.id} onClick={() => handleAddExercise(exercise)} className={`rounded-m3-card p-6 shadow-lg border flex flex-col sm:flex-row gap-6 items-center sm:items-start cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden ${isAdded ? 'bg-m3-surface-variant border-m3-primary ring-1 ring-m3-primary' : 'bg-m3-surface border-m3-surface-variant hover:border-m3-primary'}`}>
                                    {isAdded && <div className="absolute top-0 right-0 bg-m3-primary text-m3-background text-xs font-bold px-3 py-1 rounded-bl-lg">Added</div>}
                                    <img src={`/api/exercise-image?id=${exercise.id}`} alt={exercise.name} className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl object-cover bg-white shrink-0" />
                                    <div className="flex flex-col justify-center pt-2"> 
                                        <h3 className='text-2xl font-bold text-m3-primary capitalize mb-2'>{exercise.name}</h3>
                                        <p className='text-lg text-m3-text-muted capitalize'><span className="font-semibold opacity-75">Target:</span> {exercise.target}</p>
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