// src/app/history/page.tsx
import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@clerk/nextjs/server';
import WorkoutItem from '../dashboard/WorkoutItem';

// Initialize Prisma 
const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getWorkoutTitle(exercises: any[]) {
  if(!exercises || exercises.length === 0) return "Quick session";
  const targets = [...new Set(exercises.map(ex => ex.target))];
  if(targets.length === 1) return `${targets[0]} Day`;
  if(targets.length === 2) return `${targets[0]} & ${targets[1]}`;
  if (targets.length >= 3) return "Full Body";
  return "General Workout";
}

export default async function HistoryPage({ searchParams }: { searchParams: { view?: string } }) {
  const params = await searchParams;
  const isRecruiter = params.view === 'resume1703';
  const { userId } = await auth();

  const whereClause = isRecruiter ? {} : {userId : userId || "guest" };
   
  const workouts = await prisma.workout.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  return (
    <div className='min-h-screen bg-m3-background text-m3-text-main font-sans p-6'>
        <div className='max-w-4xl mx-auto'>
            <div className='mb-8 flex items-center gap-4'>
                <Link 
                    href={isRecruiter ? "/dashboard?view=resume1703" : "/dashboard"} 
                    className='text-m3-text-muted hover:text-m3-primary transition-colors text-lg font-medium'
                >
                    ← Back to Dashboard
                </Link>
                <h1 className='text-3xl font-bold text-m3-primary'>Workout History</h1>
            </div>
            
            <div className='rounded-m3-card bg-m3-surface overflow-hidden shadow-lg'>
                <div className='divide-y divide-m3-surface-variant'>
                    {workouts.map((workout) => (
                    <WorkoutItem 
                        key={workout.id} 
                        workout={workout} 
                        title={getWorkoutTitle(workout.exercises)} 
                    />
                    ))}
                </div>
                {workouts.length === 0 && (
                    <div className='px-6 py-12 text-center text-m3-text-muted'>
                        No workout history found. Get lifting!
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}