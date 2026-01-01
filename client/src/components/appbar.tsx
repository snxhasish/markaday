import Link from "next/link"
import { Button } from "./ui/button"
import { EditIcon, LayoutDashboard, PlusIcon, SettingsIcon, SquareUserRoundIcon, TagsIcon } from "lucide-react"
import { TodaysEntry } from "./providers/user-provider"

export default function Appbar({ todays_entry }: { todays_entry?: TodaysEntry }) {
    console.log(todays_entry)

    return (
        <nav className="fixed z-99 w-full bg-transparent bottom-0 left-0 right-0 flex justify-center items-center py-8 px-4">
            <div className="w-fit h-fit rounded-full p-5 bg-primary/5 border backdrop-blur-xl shadow flex justify-center items-center gap-4">
                <AppbarItem
                    href="/app"
                    icon={(
                        <LayoutDashboard />
                    )}
                >
                    Dashboard
                </AppbarItem>

                <AppbarItem
                    href="/tags"
                    icon={(
                        <TagsIcon />
                    )}
                >
                    Tags
                </AppbarItem>

                <AppbarCreateItem
                    isEditItem={(todays_entry && todays_entry.tags && todays_entry.tags.length > 0) ? true : false}
                />

                <AppbarItem
                    href="/profile"
                    icon={(
                        <SquareUserRoundIcon />
                    )}
                >
                    Profile
                </AppbarItem>

                <AppbarItem
                    href="/settings"
                    icon={(
                        <SettingsIcon />
                    )}
                >
                    Settings
                </AppbarItem>
            </div>
        </nav>
    )
}

export function AppbarItem({ href, icon, children }: { href: string, icon?: React.ReactNode, children: React.ReactNode }) {
    return (
        <Link href={href}>
            <Button size="lg" variant={"ghost"} className="rounded-full bg-primary/10 hover:bg-primary/20 text-lg font-medium py-6">
                {icon}
                <span className="hidden md:block">
                    {children}
                </span>
            </Button>
        </Link>
    )
}

export function AppbarCreateItem({ isEditItem }: { isEditItem: boolean }) {
    return (
        <Link href="/new">
            <Button size="lg" variant={"outline"} className="rounded-full bg-primary/10 hover:bg-primary/20 text-lg font-medium py-6">
                {isEditItem ?
                    <>
                        <EditIcon />
                        <span className="hidden md:block">
                            Edit Entry
                        </span>
                    </>
                    :
                    <>
                        <PlusIcon />
                        <span className="hidden md:block">
                            New Entry
                        </span>
                    </>
                }
            </Button>
        </Link>
    )
}