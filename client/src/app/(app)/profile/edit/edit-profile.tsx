"use client";

import { useUser } from "@/components/providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profile";
import { useDebounce } from "@/hooks/use-debounce";
import { usernameAvailable } from "@/actions/validation";

const timezones = Intl.supportedValuesOf("timeZone");

export default function EditProfile({ closeButton = false }: { closeButton?: boolean }) {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [tz, setTZ] = useState<string>("UTC");
    const [weekStart, setWeekStart] = useState<string>("sunday");

    const debouncedUsername = useDebounce(username, 500);

    useEffect(() => {
        if (!debouncedUsername) {
            setUsernameStatus("idle");
            return;
        }

        let cancelled = false;

        async function checkUsername() {
            setUsernameStatus("checking");
            if (user?.username === debouncedUsername) return setUsernameStatus("available");

            const v = await usernameAvailable(debouncedUsername);

            if (!cancelled) {
                setUsernameStatus(v ? "available" : "taken");
            }
        }

        checkUsername();

        return () => {
            cancelled = true;
        };
    }, [debouncedUsername, user]);

    const handleProfileUpdate = async () => {
        setLoading(true);
        const status = await updateProfile({ name, username, tz, week_start: weekStart, avatar_url: avatar });
        if (status) {
            toast.success("Profile details updated.");
            if (closeButton) {
                router.back();
                router.refresh();
            }
            else {
                router.push("/profile");
                router.refresh();
            }
        }
        else toast.error("Could not save profile changes. Please retry.");
        setLoading(false);
    }

    return (
        <div className="w-full flex flex-col bg-card text-card-foreground rounded-lg p-5 sm:max-w-md md:max-w-lg shadow shadow-card">
            <h2 className="text-2xl font-medium">Edit your public profile</h2>

            <div className="grid gap-4 py-5">
                <div className="grid gap-3">
                    <Label htmlFor="avatar-url">Avatar URL</Label>
                    <div className="flex gap-4 items-end">
                        <Avatar className="size-16 md:size-25 rounded-full">
                            <AvatarImage src={avatar ?? user?.avatar_url ?? "/avatar.png"} alt={user?.id} />
                            <AvatarFallback>{(user?.name ?? user?.username ?? "User").charAt(0)}</AvatarFallback>
                        </Avatar>

                        <Input
                            type="url"
                            id="avatar-url"
                            placeholder="Avatar URL"
                            onInput={(e) => setAvatar(e.currentTarget.value)}
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
                        onInput={(e) => setName(e.currentTarget.value)}
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex items-center justify-between gap-2">
                        <Input
                            type="text"
                            id="username"
                            placeholder={user?.username ?? "johndoe"}
                            defaultValue={user?.username}
                            onInput={(e) => setUsername(e.currentTarget.value)}
                        />

                        <Button size="icon" variant="outline">
                            {usernameStatus === "idle" && <span><CheckIcon /></span>}
                            {usernameStatus === "checking" && <Spinner />}
                            {usernameStatus === "available" && <span><CheckIcon /></span>}
                            {usernameStatus === "taken" && <span><XIcon /></span>}
                        </Button>
                    </div>
                    <Label className="text-xs font-medium text-muted-foreground">This will be used for your public profile URL.</Label>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="timezone">Preferred Timezone</Label>
                    <Select defaultValue={userTz} onValueChange={(v) => setTZ(v)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>

                        <SelectContent className="z-99">
                            <SelectGroup>
                                <SelectLabel>Timezones</SelectLabel>
                                {timezones.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label className="text-xs font-medium text-muted-foreground">This will be used for generating your calendar grid.</Label>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="week-start">Week Starts On</Label>

                    <Select defaultValue={weekStart} onValueChange={(v) => setWeekStart(v)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>

                        <SelectContent className="z-99">
                            <SelectGroup>
                                <SelectLabel>Days</SelectLabel>
                                <SelectItem value="sunday">Sunday</SelectItem>
                                <SelectItem value="monday">Monday</SelectItem>
                                <SelectItem value="tuesday">Tuesday</SelectItem>
                                <SelectItem value="wednesday">Wednesday</SelectItem>
                                <SelectItem value="thursday">Thursday</SelectItem>
                                <SelectItem value="friday">Friday</SelectItem>
                                <SelectItem value="saturday">Saturday</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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

                <Button className="flex-1" onClick={handleProfileUpdate} disabled={loading}>
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