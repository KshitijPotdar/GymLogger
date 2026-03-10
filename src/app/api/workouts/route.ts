import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@clerk/nextjs/server';

// connect prisma to supabase
const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);


//Initialize Prisma Client 
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
    try {

        const { userId } = await auth();

        const finalUserId = userId || "recruiter_guest";
        const body = await request.json();
        const { volume, totalSets,duration, loggedExercises } = body;

        // validation
        if (!loggedExercises || loggedExercises.length === 0) {
            return NextResponse.json({ error: "No exercises logged" }, { status: 400 });
        }

        // Prisma nested writes
        const workout = await prisma.workout.create({
            data: {
                userId: finalUserId,
                volume: volume,
                totalSets: totalSets,
                duration: duration,
                exercises: {
                    create: loggedExercises.map((log: any) => ({
                        apiId: log.exercise.id,
                        name: log.exercise.name,
                        target: log.exercise.target,
                        settings: log.settings,
                        sets: {
                            create: log.sets
                                // only save checked off sets
                                .filter((set: any) => set.completed && typeof set.kg === 'number' && typeof set.reps === 'number')
                                .map((set: any, index: number) => ({
                                    setNumber: index + 1,
                                    kg: set.kg,
                                    reps: set.reps,
                                    completed: set.completed
                                }))
                        }
                    }))
                }
            }
        });

        // Send a success message back to the frontend
        return NextResponse.json({ success: true, workout }, { status: 201 });
        
    } catch (error) {
        console.error("Error saving workout:", error);
        return NextResponse.json({ error: "Failed to save workout data." }, { status: 500 });
    }
}