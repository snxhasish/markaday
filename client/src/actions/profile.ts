"use server";

import { cookies } from "next/headers";

export async function updateProfile({ name, username, avatar_url, tz, week_start }: { name: string, username: string, avatar_url: string, tz: string, week_start: string }) {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        method: "POST",
        headers: {
            cookie: cookieHeader,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name, username, avatar_url, tz, week_start,
        }),
        cache: "no-store"
    });

    return res.ok;
}
