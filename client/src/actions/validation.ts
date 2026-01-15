"use server";

import { cookies } from "next/headers";

export async function usernameAvailable(username: string) {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/username/availability?username=${username}`, {
            headers: {
                cookie: cookieHeader
            },
            cache: "no-store"
        });

        if (res.ok) return true;
        else return false;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}