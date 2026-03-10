import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@clerk/nextjs/server';

const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const finalUserId = userId || "guest"; 

        const body = await request.json();
        const { rows } = body;

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "No data found" }, { status: 400 });
        }

        // Group rows by Workout (using start_time)
        const workoutsMap = new Map();

        rows.forEach((row: any) => {
            const startTime = row.start_time;
            if (!startTime) return;

            // Initialize a new workout if no start_time
            if (!workoutsMap.has(startTime)) {
                let duration = 0;
                if (row.end_time) {
                    const start = new Date(startTime).getTime();
                    const end = new Date(row.end_time).getTime();
                    if (!isNaN(start) && !isNaN(end)) duration = Math.floor((end - start) / 1000);
                }

                workoutsMap.set(startTime, {
                    userId: finalUserId,
                    createdAt: new Date(startTime),
                    duration: duration,
                    volume: 0,
                    totalSets: 0,
                    title: row.title || "Imported Workout",
                    exercisesMap: new Map()
                });
            }

            const workout = workoutsMap.get(startTime);
            const exTitle = row.exercise_title;
            
            // Initialize a new exercise if not seen it in this workout yet
            if (!workout.exercisesMap.has(exTitle)) {
                workout.exercisesMap.set(exTitle, {
                    apiId: exTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'), // Generate fake ID
                    name: exTitle,
                    target: row.title || "Imported",
                    settings: row.exercise_notes || "",
                    sets: []
                });
            }

            const exercise = workout.exercisesMap.get(exTitle);
            
            // Clean the numbers (Hevy leaves blank strings for cardio)
            const weight = parseFloat(row.weight_kg) || 0;
            const reps = parseInt(row.reps) || 0;
            
            workout.volume += (weight * reps);
            workout.totalSets += 1;

            // Push the set into the exercise array
            exercise.sets.push({
                setNumber: (parseInt(row.set_index) || 0) + 1, // Hevy is 0-indexed, we are 1-indexed
                kg: weight,
                reps: reps,
                completed: true
            });
        });

        // Convert Maps to raw arrays formatted for Prisma
        const workoutsToCreate = Array.from(workoutsMap.values()).map(w => ({
            userId: w.userId,
            createdAt: w.createdAt,
            duration: w.duration,
            volume: w.volume,
            totalSets: w.totalSets,
            exercises: {
                create: Array.from(w.exercisesMap.values()).map((ex: any) => ({
                    apiId: ex.apiId,
                    name: ex.name,
                    target: ex.target,
                    settings: ex.settings,
                    sets: { create: ex.sets }
                }))
            }
        }));

        let successCount = 0;
        
        for (const wData of workoutsToCreate) {
            await prisma.workout.create({ data: wData });
            successCount++;
        }

        return NextResponse.json({ success: true, count: successCount }, { status: 201 });
        
    } catch (error) {
        console.error("Import Error:", error);
        return NextResponse.json({ error: "Failed to import history." }, { status: 500 });
    }
}