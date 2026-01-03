"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createTag } from "@/actions/tags";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateTag() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [label, setLabel] = useState<string>("");
    const [color, setColor] = useState<string>("#FFFFFF");
    const [open, setOpen] = useState(false);

    const handleCreateTag = async () => {
        if (!label) return toast.error("Tag label is required.");
        if (!color) return toast.error("Tag color is required.");

        setLoading(true);

        const status = await createTag(label, color);

        setLoading(false);

        if (status) {
            setLabel("");
            setColor("#FFFFFF");
            setOpen(false);
            toast.success("Tag created.");
            router.refresh();
        }
        else toast.error("Failed to create tag. Please try again.");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-fit flex flex-row items-center gap-2 px-3 py-1 rounded-full border"
                >
                    <PlusIcon />
                    <span>
                        Create new tag
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a tag</DialogTitle>
                    <DialogDescription>You can assign these tags to your day entry.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="tag-label">Tag Label</Label>
                        <Input
                            id="tag-label"
                            name="tag-label"
                            onInput={(e) => setLabel(e.currentTarget.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="tag-color">Tag Color</Label>
                        <Input
                            type="color"
                            id="tag-color"
                            name="tag-color"
                            defaultValue={color}
                            onInput={(e) => setColor(e.currentTarget.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleCreateTag}>
                        {loading ?
                            <>
                                <Spinner />
                                <span>Creating...</span>
                            </>
                            :
                            <>
                                <PlusIcon />
                                <span>Create Tag</span>
                            </>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}