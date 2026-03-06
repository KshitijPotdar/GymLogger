import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize Prisma 
const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// auto generate workout name based on the muscle group 
function getWorkoutTitle(exercises: any[]) {
  if(!exercises || exercises.length === 0) return "Quick session";

  const targets = [...new Set(exercises.map(ex => ex.target))];

  if(targets.length === 1) return `${targets[0]} Day`;
  if(targets.length === 2) return `${targets[0]} & ${targets[1]}`;
  if (targets.length >= 3) return "Full Body";
  
  return "General Workout";


}

export default async function Dashboard() {
   
   
  const workouts = await prisma.workout.findMany({
    orderBy: { createdAt: 'desc' }, // Newest first by default 
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  return (
    <div className='min-h-screen bg-m3-background text-m3-text-main font-sans'>
      
      {/* ===== HEADER ===== */}
      <header className='bg-m3-surface border-b border-m3-surface-variant'>
        <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-m3-primary'>GymLogger</h1>
            <div className='flex items-center gap-4'>
              <span className='text-m3-text-muted'>Welcome, Kshitij</span>
             
              <Link
                href="/"
                className='rounded-m3-btn border border-red-500/50 bg-transparent px-5 py-2 text-red-400 hover:bg-red-500/10 transition-colors'
              >
                Logout
              </Link>
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
            {/* Dynamic Stats */}
            <p className='text-4xl font-bold text-m3-primary mt-2'>
              {workouts.length}
            </p>
          </div>

          <div className='rounded-m3-card bg-m3-surface p-6 shadow-lg'>
            <p className='text-sm font-medium text-m3-text-muted uppercase tracking-wider'>Total Volume</p>
            {/* Total Volume across all workouts */}
            <p className='text-4xl font-bold text-m3-primary mt-2'>
              {workouts.reduce((sum, w) => sum + w.volume, 0)} kg
            </p>
          </div>

          <div className='rounded-m3-card bg-m3-surface p-6 shadow-lg'>
            <p className='text-sm font-medium text-m3-text-muted uppercase tracking-wider'>Total Duration</p>
            <p className='text-4xl font-bold text-m3-primary mt-2'>-- min</p>
          </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className='mb-8 flex gap-4'>
          
          <Link
            href="/new-workout"
            className='rounded-m3-btn bg-m3-primary px-8 py-4 text-m3-on-primary font-bold text-lg hover:brightness-110 shadow-lg shadow-m3-primary/20 transition-all active:scale-95 text-center'
          >
            + Log New Workout
          </Link>
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
                  <h3 className='text-lg font-semibold text-m3-primary capitalize'>
                  {new Date(workout.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <span className="text-m3-text-muted font-normal ml-2 capitalize">
      •           {getWorkoutTitle(workout.exercises)}
                  </span>
                  </h3>
                  <span className='rounded-full bg-m3-surface-variant px-3 py-1 text-sm text-m3-text-muted font-bold'>
                    {workout.volume} kg
                  </span>
                </div>

                <ul className='space-y-2'>
                  {workout.exercises.map((exercise) => {
                    // calculation to find the heaviest weight lifted in this exercise
                    const maxWeight = Math.max(...exercise.sets.map(set => set.kg));
                    const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);

                    return (
                      <li key={exercise.id} className='text-m3-text-main flex justify-between'>
                        <span className='font-medium capitalize'>{exercise.name}</span>
                        <span className="text-m3-text-muted">
                          {/* Showing Top Weight and Total Sets */}
                          {maxWeight > 0 ? `${maxWeight} kg top × ` : ''}
                          {totalReps} total reps ({exercise.sets.length} sets)
                        </span>
                      </li>
                    );
                  })}
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