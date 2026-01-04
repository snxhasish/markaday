import { Entry, getEntries } from "@/lib/entries";
import Profile from "./profile";

export default async function ProfilePage() {
    const entries = await getEntries();

    const dayMap = new Map<string, Entry>(
        entries?.map(entry => [entry.date, entry])
    );

    return (
        <div className="w-full flex justify-center">
            <Profile
                dayMap={dayMap}
            />
        </div>
    )
}