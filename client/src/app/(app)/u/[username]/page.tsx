import { Entry, getEntries } from "@/lib/entries";
import Profile from "@/app/(app)/profile/profile";
import { getProfile } from "@/lib/profile";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const profile = await getProfile(username);

    console.log(profile);

    const dayMap = new Map<string, Entry>(
        profile?.entries?.map(entry => [entry.date, entry])
    );

    return (
        <div className="w-full flex justify-center">
            <Profile
                profile={profile?.profile}
                dayMap={dayMap}
            />
        </div>
    )
}