import { supabase } from "@/lib/supabaseClient";

export async function createUserInDatabase(userId: string) {
    try {
        const { data, error } = await supabase
            .from('users')
            .upsert({ id: userId })
            .select()
            .single();

        if (error) throw error;

        console.log('User created or updated in database:', data);
        return data;
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
}