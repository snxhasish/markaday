import { getTags } from "@/lib/tags";
import CreateTag from "./create-tag";

export default async function Tags() {
    const tags = await getTags();

    return (
        <div className="h-full w-full flex flex-col justify-start items-start p-5 sm:p-10 md:px-20">
            <h2 className="text-2xl font-semibold">Tags</h2>

            <div className="w-full flex justify-start items-start gap-4 py-10 flex-wrap">
                <CreateTag />

                {
                    tags?.map(tag => (
                        <div
                            key={tag.id}
                            className="w-fit flex flex-row items-center gap-2 px-3 py-1 rounded-full border"
                            style={{
                                backgroundColor: `${tag.color}1A`,
                                borderColor: tag.color
                            }}
                        >
                            <div
                                className="size-4 rounded-full"
                                style={{ backgroundColor: tag.color }}
                            />
                            <span style={{ color: tag.color }}>
                                {tag.label}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
