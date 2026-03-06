import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter});

export async function GET(request: Request) {

    // grab exercise id from the url

    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
        return NextResponse.json({ error : 'No exercise ID provided'})
    }

    try {
        const previousExercise = await prisma.loggedExercise.findFirst({
            where: {
                apiId: exerciseId, // find exercise

            },
            orderBy: {
                workout: {
                    createdAt: 'desc',
                }
            },
            include: {
                sets: {
                    orderBy: {
                        setNumber: 'asc'
                    }
                }
            }
        });

        return NextResponse.json({ previousExercise }, ); // send data to frontend

    } catch (error) {
        console.error("Failed to fetch previous exercise:", error);
        return NextResponse.json({ error: "Database error"});
    }
    
}