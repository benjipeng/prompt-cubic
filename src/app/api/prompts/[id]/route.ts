import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { title, content } = await request.json();

    try {
        const { data, error } = await supabase
            .from('prompts')
            .update({ title, content })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating prompt:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error('Unknown error updating prompt');
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const { error } = await supabase
            .from('prompts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ message: 'Prompt deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting prompt:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error('Unknown error deleting prompt');
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}