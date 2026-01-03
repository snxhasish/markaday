"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { sendLoginVerification, verifyLoginCode } from "@/lib/login";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<"email" | "code">("email");
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const handleEmailSubmit = async () => {
        if (!email || email.indexOf("@") === -1) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const emailSent = await sendLoginVerification(email);

            if (emailSent.EMAIL_SENT) {
                setLoading(false);
                setCurrentStep("code");
                toast.success("Verification email sent. Please check your inbox.");
            }
            else {
                setLoading(false);
                toast.error("Failed to send verification email. Please try again.");
            }
        }
        catch (e) {
            console.error(e);
            setLoading(false);
            toast.error("Failed to send verification email. Please try again.");
            return;
        }
    }

    const handleCodeSubmit = async () => {
        if (!code) {
            toast.error("Please enter a valid verification code.");
            return;
        }

        setLoading(true);

        try {
            const data = await verifyLoginCode(email, code);

            if (data.success && data.user) {
                toast.success("Successfully logged in!");
                router.push("/");
            } else {
                setLoading(false);
                toast.error("Invalid verification code. Please try again.");
            }
        }
        catch (e) {
            console.error(e);
            setLoading(false);
            toast.error("Failed to verify code. Please try again.");
            return;
        }
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full md:max-w-lg">
                <div className={cn("flex flex-col gap-6", "bg-card rounded-2xl px-10 py-5")}>
                    <form>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Link
                                    href="/"
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex size-12 items-center justify-center rounded-md pointer-events-none">
                                        <Image
                                            src="/icon.png"
                                            alt="MarkADay Icon"
                                            height={75}
                                            width={75}
                                        />
                                    </div>
                                    <span className="sr-only">MarkADay</span>
                                </Link>
                                <h1 className="text-xl font-bold">Login to MarkADay.</h1>
                                <FieldDescription>
                                    We will create an account for you if you don&apos;t have one yet.
                                </FieldDescription>
                            </div>

                            {
                                currentStep === "email" ?
                                    <React.Fragment key="email-step">
                                        <Field>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input
                                                defaultValue={email}
                                                id="email"
                                                type="email"
                                                placeholder="me@example.com"
                                                required
                                                onInput={(e) => setEmail(e.currentTarget.value)}
                                            />
                                            <FieldDescription>We will mail you a verification code.</FieldDescription>
                                        </Field>

                                        <Field>
                                            <Button
                                                type="button"
                                                onClick={handleEmailSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? <Spinner /> : <>Send Email Verification</>}

                                            </Button>
                                        </Field>
                                    </React.Fragment>
                                    :
                                    
                                    <React.Fragment key="vf-step">
                                        <Field>
                                            <FieldLabel htmlFor="vfcode">Verification Code</FieldLabel>
                                            <Input
                                                id="vfcode"
                                                type="text"
                                                placeholder="67A41"
                                                required
                                                onInput={(e) => setCode(e.currentTarget.value)}
                                            />
                                            <FieldDescription>Make sure to check your spam folder.</FieldDescription>
                                        </Field>

                                        <Field>
                                            <Button
                                                type="button"
                                                onClick={handleCodeSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? <Spinner /> : <>Login to MarkADay</>}

                                            </Button>
                                        </Field>
                                    </React.Fragment>
                            }

                            {/* <FieldSeparator>Or</FieldSeparator>
                            <Field className="grid gap-4 sm:grid-cols-2">
                                <Button variant="outline" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Continue with Apple
                                </Button>
                                <Button variant="outline" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </Field> */}

                        </FieldGroup>
                    </form>
                    <FieldDescription className="px-6 text-center">
                        You agree to our <Link href="/legal/terms">Terms of Service</Link>{" "} and <Link href="/legal/privacy">Privacy Policy</Link>.
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}
