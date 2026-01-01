import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (token) {
    redirect("/app");
  }

  return (
    <>
    </>
  )
}
