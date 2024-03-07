import {supabase} from "./supabase";
import {Session} from "@supabase/supabase-js";
import {QueryClient} from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
})

export function getUser(id: string) {
    return supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
}

export async function getSession(): Promise<Session> {
    const {data, error} = await supabase.auth.getSession();

    if (error) throw error;
    if (!data || !data.session) throw new Error("No session found");

    return data.session;
}


// export function search(query: string): Machine[] {
//     return getPins().filter(machine => machine.name.toLowerCase().includes(query.toLowerCase()));
// }

export interface Tag {
    id: string;
    name: string;
    color: string;
    description: string;
}

export interface Log {
    id: string;
    author: string;
    time: number;
    title: string;
    content: string;
    changes: Change[];
}

export type Change = TaskStatusChange;

export interface TaskStatusChange {
    task: string;
    status: boolean;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    pinned: string[];
}