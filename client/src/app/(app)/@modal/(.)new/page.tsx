import NewEntry from "../../new/new-entry";
import { getTags } from "@/lib/tags";

export default async function NewDayEntryModal() {
    const tags = await getTags();

    return (
        <div className="absolute backdrop-blur-sm h-screen w-full bg-primary/5 flex justify-center items-center">
            <NewEntry
                tags={tags!}
                closeButton
            />
        </div>
    );
}
