"use server";

import { cookies } from "next/headers";

export async function createEntry(tags: string[], notes?: string) {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries/create`, {
        method: "POST",
        headers: {
            cookie: cookieHeader,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tags,
            notes
        }),
        cache: "no-store"
    });

    return res.ok;
}
