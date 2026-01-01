import { cookies } from "next/headers";
import { getPastDate } from "./calendar";

export async function getTagStats() {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.API_URL}/stats/tags?from=${getPastDate(6)}&to=${getPastDate(0)}`, {
        headers: {
            cookie: cookieHeader
        },
        cache: "no-store"
    });

    if (!res.ok) return null;

    const { data } = await res.json();

    return data;
}