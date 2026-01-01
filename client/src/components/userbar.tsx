"use client";

import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "./providers/user-provider";
import { LogOutIcon, SettingsIcon, UserSquareIcon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Userbar({ children }: { children: React.ReactNode }) {
    const user = useUser();
    const { theme, setTheme } = useTheme();

    return (
        <main className="h-screen flex flex-col gap-4">
            <nav className="w-full top-0 left-0 right-0 flex justify-center items-center py-8 px-4">
                <div className="w-full px-10 flex items-center justify-between gap-4">
                    <Image
                        src="/icon.png"
                        alt="Icon"
                        height={35}
                        width={35}
                        className="cursor-pointer"
                        onClick={() => theme === "light" ? setTheme("dark") : setTheme("light")}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="border-2 size-10 cursor-pointer">
                                <AvatarImage src={user.user?.avatar_url} alt={user.user?.username} />
                                <AvatarFallback>{user.user?.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-full">
                                        <AvatarImage src={user.user?.avatar_url} alt={user.user?.username} />
                                        <AvatarFallback>{user.user?.username?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.user?.name ?? "User"}</span>
                                        <span className="text-muted-foreground truncate text-xs">
                                            {user.user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <UserSquareIcon />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <SettingsIcon />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem variant="destructive">
                                    <LogOutIcon /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            {children}
        </main>
    )
}