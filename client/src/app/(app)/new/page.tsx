import { getTags } from "@/lib/tags";
import NewEntry from "./new-entry";

export default async function NewEntryPage() {
    const tags = await getTags();

    return (
        <div className="h-full w-full flex flex-col justify-start items-start p-5 sm:p-10 md:px-20">
            <div className="w-full h-full flex justify-center items-start gap-4 py-10">
                <NewEntry
                    tags={tags!}
                />
            </div>
        </div>
    );
}
