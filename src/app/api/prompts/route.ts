import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

export async function POST(request: Request) {
    const json = await request.json();
    const { title, content, userId } = json;

    try {
        const { data, error } = await supabase
            .from('prompts')
            .insert({ title, content, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating prompt:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error('Unknown error creating prompt');
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('*');

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching prompts:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error('Unknown error fetching prompts');
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}