"use server";

import { cookies } from "next/headers";

export async function createTag(label: string, color: string) {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.API_URL}/tags/create`, {
        method: "POST",
        headers: {
            cookie: cookieHeader,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ label, color }),
        cache: "no-store"
    });

    return res.ok;
}
