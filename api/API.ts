import {supabase, useSession} from "./supabase";
import {Session} from "@supabase/supabase-js";
import {QueryClient} from "@tanstack/react-query";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";

const userColumns = "id,name,avatar";
const userRoleColumns = "user,role";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
})


export async function getSession(): Promise<Session> {
    const {data, error} = await supabase.auth.getSession();

    if (error) throw error;
    if (!data || !data.session) throw new Error("No session found");

    return data.session;
}

export function getUser(id: string) {
    return supabase
        .from('users')
        .select<typeof userColumns, User>(userColumns)
        .eq('id', id)
        .single();
}

export function getUserRole(user_id: string) {
    return supabase
        .from('user_roles')
        .select<typeof userRoleColumns, UserRole>(userRoleColumns)
        .eq('user', user_id)
        .single();
}

export function useUser(user_id?: string) {
    const session = useSession();
    const {data: user, error} = useQuery(getUser(user_id ?? session.session?.user.id ?? ""), {
        enabled: !!session.session?.user.id
    });
    return {user, error, session};
}

export function useRole() {
    const user = useUser();
    const {data: role, error} = useQuery(getUserRole(user.user?.id ?? ""), {
        enabled: !!user.user?.id
    });
    return {role, error, user};
}


// export function search(query: string): Machine[] {
//     return getPins().filter(machine => machine.name.toLowerCase().includes(query.toLowerCase()));
// }

export interface User {
    id: string;
    name: string;
    avatar: string;
    pinned: string[];
}

export interface UserRole {
    user: string;
    role: 'new' | 'intern' | 'user' | 'admin';
}