//server side
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUser() {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.API_URL}/me`, {
        headers: {
            cookie: cookieHeader
        },
        cache: "no-store"
    });

    if (!res.ok) return null;

    const { user, todays_entry } = await res.json();

    return { user, todays_entry };
}
