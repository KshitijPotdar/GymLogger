'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Exercise {
  name: string;
  weight?: number;
  reps: number;
  sets: number;
}

interface Workout {
  id: string;
  date: string;
  workoutType: string;
  exercises: Exercise[];
  duration: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      date: 'Feb 21, 2026',
      workoutType: 'Chest & Triceps',
      exercises: [
        { name: 'Bench Press', weight: 185, reps: 8, sets: 4 },
        { name: 'Dips', reps: 12, sets: 3 },
      ],
      duration: 45,
    },
    {
      id: '2',
      date: 'Feb 19, 2026',
      workoutType: 'Back & Biceps',
      exercises: [
        { name: 'Deadlifts', weight: 225, reps: 5, sets: 3 },
        { name: 'Barbell Rows', weight: 185, reps: 8, sets: 4 },
      ],
      duration: 50,
    },
  ]);

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleNewWorkout = () => {
    console.log('Navigating to new workout page');
    router.push('/new-workout');
  };

  return (
    <div className='min-h-screen bg-m3-background text-m3-text-main font-sans'>
      
      {/* ===== HEADER ===== */}
      <header className='bg-m3-surface border-b border-m3-surface-variant'>
        <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-m3-primary'>GymLogger</h1>
            <div className='flex items-center gap-4'>
              <span className='text-m3-text-muted'>Welcome, Kshitij</span>
              <button
                onClick={handleLogout}
                className='rounded-m3-btn border border-red-500/50 bg-transparent px-5 py-2 text-red-400 hover:bg-red-500/10 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        
        {/* === STATS SECTION === */}
        <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div className='rounded-m3-card bg-m3-surface p-6 shadow-lg'>
            <p className='text-sm font-medium text-m3-text-muted uppercase tracking-wider'>Total Workouts</p>
            <p className='text-4xl font-bold text-m3-primary mt-2'>
              {workouts.length}
            </p>
          </div>

          <div className='rounded-m3-card bg-m3-surface p-6 shadow-lg'>
            <p className='text-sm font-medium text-m3-text-muted uppercase tracking-wider'>Current Streak</p>
            <p className='text-4xl font-bold text-m3-primary mt-2'>5 days</p>
          </div>

          <div className='rounded-m3-card bg-m3-surface p-6 shadow-lg'>
            <p className='text-sm font-medium text-m3-text-muted uppercase tracking-wider'>Total Duration</p>
            <p className='text-4xl font-bold text-m3-primary mt-2'>95 min</p>
          </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className='mb-8 flex gap-4'>
          <button
            onClick={handleNewWorkout}
            className='rounded-m3-btn bg-m3-primary px-8 py-4 text-m3-on-primary font-bold text-lg hover:brightness-110 shadow-lg shadow-m3-primary/20 transition-all active:scale-95'
          >
            + Log New Workout
          </button>
          <button className='rounded-m3-btn bg-m3-surface-variant px-8 py-4 text-m3-text-main font-semibold hover:brightness-110 transition-all'>
            View History
          </button>
        </div>

        {/* === RECENT WORKOUTS SECTION === */}
        <div className='rounded-m3-card bg-m3-surface overflow-hidden shadow-lg'>
          <div className='border-b border-m3-surface-variant px-6 py-5'>
            <h2 className='text-2xl font-bold text-m3-text-main'>Recent Workouts</h2>
          </div>

          <div className='divide-y divide-m3-surface-variant'>
            {workouts.map((workout) => (
              <div key={workout.id} className='px-6 py-5 hover:bg-m3-surface-variant/30 transition-colors'>
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-m3-primary'>
                    {workout.date} <span className="text-m3-text-muted font-normal">• {workout.workoutType}</span>
                  </h3>
                  <span className='rounded-full bg-m3-surface-variant px-3 py-1 text-sm text-m3-text-muted'>
                    {workout.duration} min
                  </span>
                </div>

                <ul className='space-y-2'>
                  {workout.exercises.map((exercise, index) => (
                    <li key={index} className='text-m3-text-main flex justify-between'>
                      <span className='font-medium'>{exercise.name}</span>
                      <span className="text-m3-text-muted">
                        {exercise.weight && `${exercise.weight} lbs × `}
                        {exercise.reps} reps ({exercise.sets} sets)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {workouts.length === 0 && (
            <div className='px-6 py-12 text-center text-m3-text-muted'>
              No workouts yet. Start by logging your first workout!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}