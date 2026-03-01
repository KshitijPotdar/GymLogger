import { NextResponse} from 'next/server';

export async function GET(request: Request) {

    // Get the search query from the request URL

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('name');

    // If no query is provided, return an error
    if (!query) {
        return NextResponse.json({ error: 'No search query provided' }, { status: 400 });
    }

    // Add search query to rapidAPI url

    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${query}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
    };

    try {
        // Fetch data from the API
        const response = await fetch(url, options);
        
        // convert response to json
        const result = await response.json();

        // Return the data as a JSON response
        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching data from API:', error);
        return NextResponse.json({ error: 'Failed to fetch data from API' }, { status: 500 });
    }
}