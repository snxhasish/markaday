import { cookies } from "next/headers";

export interface UserTag {
    id: string
    label: string
    color: string
}

export async function getTags() {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
        headers: {
            cookie: cookieHeader
        },
        cache: "no-store"
    });

    if (!res.ok) return null;

    const { tags } = await res.json();

    return tags as UserTag[];
}