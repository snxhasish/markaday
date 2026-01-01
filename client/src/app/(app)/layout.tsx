import Appbar from "@/components/appbar";
import { UserProvider } from "@/components/providers/user-provider";
import Userbar from "@/components/userbar";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function AppLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    const data = await getUser();

    if (!data || !data.user) {
        redirect("/login");
    }

    return (
        <UserProvider user={data.user} todays_entry={data.todays_entry}>
            <Appbar todays_entry={data.todays_entry} />
            <Userbar>
                {children}
                {modal}
            </Userbar>
        </UserProvider>
    )
}