"use client";

import CalendarGrid from "@/components/calendar";
import { useUser } from "@/components/providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Entry } from "@/lib/entries";
import { EditIcon } from "lucide-react";
import Link from "next/link";

export default function Profile({ dayMap }: { dayMap: Map<string, Entry>; }) {
    const { user } = useUser();
    const isMobile = useMediaQuery("(max-width: 639px)");
    const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
    // const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
        <div className="w-full md:max-w-2xl lg:max-w-3xl bg-card text-card-foreground p-5 lg:px-10 rounded-2xl flex flex-col justify-center gap-4">
            <div className="w-full flex items-center justify-between gap-5">
                <div className="flex flex-row items-center gap-5">
                    <Avatar className="size-16 md:size-25 rounded-full">
                        <AvatarImage src={user?.avatar_url ?? "/avatar.png"} alt={user?.id} />
                        <AvatarFallback>{(user?.name ?? user?.username ?? "User").charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-semibold">
                            {user?.name ?? user?.username}
                        </h1>
                        <p className="font-medium text-muted-foreground">
                            @{user?.username}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-between gap-5">
                <Link href="/profile/edit">
                    <Button variant="secondary">
                        <EditIcon />
                        <span>Edit Profile</span>
                    </Button>
                </Link>
            </div>

            <Separator />

            <div className="w-full pb-2 overflow-x-auto">
                <CalendarGrid
                    data={dayMap}
                    size={isMobile ? 15 : isTablet ? 18 : 22}
                />
            </div>
        </div>
    )
}