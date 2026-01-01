import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function RootPage() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (token) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen w-full flex flex-col gap-16 items-center justify-center px-6 py-16">
      <div className="text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="/">
            v1 BETA
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          A simple calendar grid for your everyday progress.
        </h1>
        <p className="mt-6 md:text-lg text-foreground/80">
          A simple way to track how your day went. Log each day with a color-coded tag, add a short note if you want, and watch your life take shape as a grid over time.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="https://discord.gg/K6k6ebkJkx" target="_blank">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
              </svg>
            </Button>
          </Link>

          <Link href="https://x.com/snxhasish" target="_blank">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </Button>
          </Link>

          <Link href="/login">
            <Button size="lg" className="rounded-full text-base">
              Get Started <ArrowUpRight className="h-5! w-5!" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-(--breakpoint-xl) mx-auto aspect-video bg-accent/10 rounded-xl overflow-hidden shadow-2xl hover:scale-102 duration-500">
        <Image
          src="/preview.png"
          alt="Preview"
          fill
          quality={200}
          className="object-cover scale-[1.02]"
          priority
        />
      </div>

    </div>
  )
}