import { User } from "@/components/providers/user-provider";
import { cookies } from "next/headers";
import { Entry } from "./entries";

export async function getProfile(username: string) {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`, {
            headers: {
                cookie: cookieHeader
            },
            cache: "no-store"
        });

        const { profile, entries } = await res.json();

        return { profile, entries } as { profile: User, entries: Entry[] };
    } catch (e) {
        console.error(e);
        return null;
    }
}
