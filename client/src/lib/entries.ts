import { cookies } from "next/headers";
import { UserTag } from "./tags";

export interface Entry {
    date: string
    tags: UserTag[]

    mood_score?: number
    note: {
        content: string
        is_private: boolean
    }
}

export async function getEntries() {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.API_URL}/entries`, {
        headers: {
            cookie: cookieHeader
        },
        cache: "no-store"
    });

    if (!res.ok) return null;

    const { entries } = await res.json();

    return entries as Entry[];
}