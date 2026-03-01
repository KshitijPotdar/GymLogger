import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Grab the exercise ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'No exercise ID provided' }, { status: 400 });
    }

    // Hit the new Image Service endpoint (180 resolution is the max for the free tier)
    const url = `https://exercisedb.p.rapidapi.com/image?exerciseId=${id}&resolution=180`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error('Image fetch failed');
        }

        // Convert GIF to a blob object
        const blob = await response.blob();
        
        // Send the raw GIF file back to the browser
        return new NextResponse(blob, {
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'public, max-age=86400' // Cache it for 24 hours 
            },
        });

    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}