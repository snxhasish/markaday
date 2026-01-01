import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarkADay",
  description: "",
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
            {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
