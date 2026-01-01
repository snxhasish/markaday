"use client";

import { createEntry } from "@/actions/entries";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { UserTag } from "@/lib/tags";
import { EditIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewEntry({ tags, closeButton = false }: { tags: UserTag[], closeButton?: boolean }) {
    const router = useRouter();
    const { todays_entry } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<Option[]>([]);
    const [moodScore, setMoodScore] = useState<number>(0);
    const [notes, setNotes] = useState<string>("");


    const handleNewEntry = async () => {
        if (selectedTags.length < 1) return toast.error("At least one tag is required.");
        setLoading(true);

        const tagsIDs = selectedTags.map((a) => {
            return a.value
        });
        const status = await createEntry(tagsIDs, notes);

        if (status) {
            toast.success("Day entry created successfully");
            if (closeButton) router.back();
            else router.push("/app");
        } else {
            toast.error("Could not create day entry. Please retry.");
        }
    }

    if (todays_entry && todays_entry.tags.length > 0) {
        return (
            <div className="w-full flex flex-col bg-card text-card-foreground rounded-lg p-5 sm:max-w-md md:max-w-lg shadow shadow-card">
                <h2 className="text-2xl font-medium">Edit today&apos;s entry</h2>
                <p className="font-medium text-muted-foreground">Coming soon.</p>

                <div className="w-full flex items-center justify-between gap-2 mt-5">
                    {
                        closeButton && (
                            <Button className="flex-1" variant="secondary" onClick={() => router.back()}>
                                <XIcon />
                                <span>Cancel</span>
                            </Button>
                        )
                    }
                </div>

                <span className="text-sm font-medium text-center mt-5">Day entries can only be edited or created for the ongoing day.</span>
            </div>
        )
    }
    else return (
        <div className="w-full flex flex-col bg-card text-card-foreground rounded-lg p-5 sm:max-w-md md:max-w-lg shadow shadow-card">
            <h2 className="text-2xl font-medium">Create new day entry for today</h2>
            <p className="font-medium text-muted-foreground">Describe how you feel today using your created tags and it will be shown on your year calendar.</p>

            <div className="grid gap-4 py-5">
                <div className="grid gap-3">
                    <Label htmlFor="entry-tags">Select tags or <Link className="text-primary" href="/tags">create a new tag</Link></Label>
                    <MultipleSelector
                        value={selectedTags}
                        onChange={setSelectedTags}
                        placeholder="Select tags"
                        defaultOptions={tags.map(t => ({
                            label: t.label,
                            value: t.id
                        }))}
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="entry-notes">Day Notes</Label>
                    <Textarea
                        id="entry-notes"
                        placeholder="Some notes on your day"
                        onInput={(e) => setNotes(e.currentTarget.value)}
                        maxLength={500}
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-between gap-2">
                {
                    closeButton && (
                        <Button variant="secondary" onClick={() => router.back()}>
                            <XIcon />
                            <span>Cancel</span>
                        </Button>
                    )
                }

                <Button className="flex-1" onClick={handleNewEntry} disabled={loading}>
                    {loading ?
                        <>
                            <Spinner />
                            <span>Creating entry...</span>
                        </>
                        :
                        <>

                            <EditIcon />
                            <span>Confirm Day Entry</span>
                        </>
                    }
                </Button>
            </div>

            <span className="text-sm font-medium text-center mt-5">Day entries can only be edited or created for the ongoing day.</span>
        </div>
    )
}