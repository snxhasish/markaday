export async function sendLoginVerification(email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error("Failed to send login verification email.");
    }

    const email_sent: { EMAIL_SENT: boolean } = await res.json();

    return email_sent;
}

export async function verifyLoginCode(email: string, code: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email/verify`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
        throw new Error("Could not verify login code. Please try again.");
    }

    const data: { success: boolean, user?: { id: string, jwt: string } } = await res.json();

    return data;
}