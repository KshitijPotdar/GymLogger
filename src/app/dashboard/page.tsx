'use client';

import React, { useState } from 'react';

// **TYPE DEFINITIONS** - This tells TypeScript what data looks like
// Think of it as describing the shape of your data
interface Exercise {
  name: string;
  weight?: number;
  reps: number;
  sets: number;
}

interface Workout {
  id: string;
  date: string;
  workoutType: string; // e.g., "Chest & Triceps"
  exercises: Exercise[];
  duration: number; // in minutes
}

export default function Dashboard() {
  // **STATE MANAGEMENT** - This stores data that can change
  // useState returns [currentValue, functionToUpdateIt]
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

  // **HANDLER FUNCTION** - Runs when user clicks logout
  const handleLogout = () => {
    console.log('User logged out');
    // TODO: Later we'll redirect to login page with: window.location.href = '/login'
  };

  // **HANDLER FUNCTION** - Runs when user clicks "Log New Workout"
  const handleNewWorkout = () => {
    console.log('Opening new workout form');
    // TODO: Open modal or redirect to workout form page
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ===== HEADER ===== */}
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-blue-600'>GymLogger</h1>
            <div className='flex items-center gap-4'>
              <span className='text-gray-700'>Welcome, User</span>
              <button
                onClick={handleLogout}
                className='rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors'
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
          {/* Stat Card 1 */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <p className='text-sm text-gray-600'>Total Workouts</p>
            <p className='text-3xl font-bold text-blue-600'>
              {workouts.length}
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <p className='text-sm text-gray-600'>Current Streak</p>
            <p className='text-3xl font-bold text-green-600'>5 days</p>
          </div>

          {/* Stat Card 3 */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <p className='text-sm text-gray-600'>Total Duration</p>
            <p className='text-3xl font-bold text-purple-600'>95 min</p>
          </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className='mb-8 flex gap-4'>
          <button
            onClick={handleNewWorkout}
            className='rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors'
          >
            + Log New Workout
          </button>
          <button className='rounded-md bg-gray-600 px-6 py-3 text-white font-semibold hover:bg-gray-700 transition-colors'>
            View History
          </button>
        </div>

        {/* === RECENT WORKOUTS SECTION === */}
        <div className='rounded-lg bg-white shadow'>
          <div className='border-b border-gray-200 px-6 py-4'>
            <h2 className='text-2xl font-bold text-gray-800'>Recent Workouts</h2>
          </div>

          <div className='divide-y divide-gray-200'>
            {/* Map through workouts array to show each one */}
            {workouts.map((workout) => (
              <div key={workout.id} className='px-6 py-4'>
                {/* Workout header with date and type */}
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {workout.date} • {workout.workoutType}
                  </h3>
                  <span className='text-sm text-gray-600'>
                    {workout.duration} min
                  </span>
                </div>

                {/* Exercises list */}
                <ul className='space-y-2'>
                  {workout.exercises.map((exercise, index) => (
                    <li key={index} className='text-gray-700'>
                      <span className='font-medium'>{exercise.name}:</span>{' '}
                      {exercise.weight && `${exercise.weight} lbs `}
                      × {exercise.reps} reps ({exercise.sets} sets)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* If no workouts exist, show this message */}
          {workouts.length === 0 && (
            <div className='px-6 py-12 text-center text-gray-500'>
              No workouts yet. Start by logging your first workout!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
