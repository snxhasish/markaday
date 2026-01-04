"use client";

import { createEntry } from "@/actions/entries";
import { useUser } from "@/components/providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { UserTag } from "@/lib/tags";
import { CheckIcon, EditIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProfile({ closeButton = false }: { closeButton?: boolean }) {
    const router = useRouter();
    const { user } = useUser();
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
            if (closeButton) {
                router.back();
                router.refresh();
            }
            else {
                router.push("/app");
                router.refresh();
            }
        } else {
            toast.error("Could not create day entry. Please retry.");
        }
    }

    return (
        <div className="w-full flex flex-col bg-card text-card-foreground rounded-lg p-5 sm:max-w-md md:max-w-lg shadow shadow-card">
            <h2 className="text-2xl font-medium">Edit your public profile</h2>

            <div className="grid gap-4 py-5">
                <div className="grid gap-3">
                    <Label htmlFor="avatar-url">Avatar URL</Label>
                    <div className="flex gap-4 items-end">
                        <Avatar className="size-16 md:size-25 rounded-full">
                            <AvatarImage src={user?.avatar_url ?? "/avatar.png"} alt={user?.id} />
                            <AvatarFallback>{(user?.name ?? user?.username ?? "User").charAt(0)}</AvatarFallback>
                        </Avatar>

                        <Input
                            type="url"
                            id="avatar-url"
                            placeholder="Avatar URL"
                        />
                    </div>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder={user?.name ?? "Ron Weasley"}
                        defaultValue={user?.name}
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        type="text"
                        id="username"
                        placeholder={user?.username ?? "johndoe"}
                        defaultValue={user?.username}
                    />
                    <Label className="text-xs font-medium text-muted-foreground">This will be used for your public profile URL.</Label>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="timezone">Preferred Timezone</Label>
                    <Input
                        type="text"
                        id="timezone"
                        placeholder="UTC"
                        defaultValue="UTC"
                        disabled
                    />
                    <Label className="text-xs font-medium text-muted-foreground">This will be used for generating your calendar grid.</Label>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="week-start">Week Starts On</Label>
                    <Input
                        type="text"
                        id="week-start"
                        placeholder="Sunday"
                        defaultValue="Sunday"
                        disabled
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
                            <span>Saving updates...</span>
                        </>
                        :
                        <>

                            <CheckIcon />
                            <span>Update Profile</span>
                        </>
                    }
                </Button>
            </div>
        </div>
    )
}