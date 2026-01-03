import { Entry, getEntries } from "@/lib/entries";
import Dash from "./dash";
import { getTagStats } from "@/lib/stats";
import { getTags } from "@/lib/tags";

export default async function App() {
    const entries = await getEntries();
    const tags = await getTags();
    const tagStats = await getTagStats();

    const dayMap = new Map<string, Entry>(
        entries?.map(entry => [entry.date, entry])
    );

    // console.log();

    return (
        <main className="h-screen w-full p-4 flex flex-col items-center gap-4 px-2 sm:px-8 md:px-20">
            <Dash
                dayMap={dayMap}
                stats={{
                    tags: tagStats
                }}
                tags={tags!}
            />
        </main>
    );
}
