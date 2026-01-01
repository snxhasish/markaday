import express from "express";
import { isEmail, sendEmail } from "../lib/email";
import Users from "../db/models/user";
import { userFindOrCreate } from "../lib/user";
import generateEmailHTML from "../lib/email-html";
import generateJWT from "../lib/jwt";

const router = express.Router();

// POST /auth/email
router.post("/email", async (req, res) => {
    const { email } = req.body;

    if (!email || isEmail(email) !== true) {
        res.status(400).json({ error: "Invalid email was provided" });
        return;
    }

    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    const ONE_TIME_CODE = `${Math.floor(Math.random() * 1000)}${letters[Math.floor(Math.random() * letters.length)]}${Math.floor(Math.random() * 1000)}`; // format: `123X456`

    try {
        const user = await Users.findOne({ email });

        if (user && user.email === email) {
            if (user.auth?.provider !== "email") {
                res.status(400).json({ error: "Invalid auth type. Please use social sign-in." });
                return;
            }

            user.auth = {
                provider: "email",
                code: ONE_TIME_CODE
            }

            if (!user.auth.jwt) {
                const jwt = generateJWT(email);
                user.auth.jwt = jwt;
            }

            user.save();
        } else {
            const data = await userFindOrCreate(email, req, "email", null, null, ONE_TIME_CODE);

            if (data.error && data.error !== null) {
                res.status(500).json({ error: "Account creation failed. Please retry after a while." });
                return;
            }
        }

        const emailInfo = await sendEmail(
            email,
            "MarkADay: Login email verification one-time code.",
            `${generateEmailHTML({ code: ONE_TIME_CODE, registration: user?.email === email })}`
        );

        console.log(emailInfo);

        res.status(201).json({ message: "Login verification email was sent.", EMAIL_SENT: true });
    }
    catch (error) {
        console.error("ERROR sending verifiation email:", error);
        res.status(500).json({ error: "Internal Server Error", EMAIL_SENT: false });
    }
});

router.post("/email/verify", async (req, res) => {
    const { email, code } = req.body;

    if (!email || isEmail(email) !== true) {
        return res.status(400).json({ error: "Invalid email was provided" });
    }

    if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Invalid code" });
    }

    const user = await Users.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "Invalid email was provided" });
    }

    if (!user.auth || user.auth.provider !== "email" || !user.auth.code) {
        return res
            .status(400)
            .json({ error: "Invalid login type. Please login with social sign-in." });
    }

    if (user.auth.code !== code) {
        return res.status(400).json({ error: "Invalid code" });
    }

    const token = user.auth.jwt;
    console.log("Generated JWT token for user:", token);

    const isProd = process.env.NODE_ENV === "production";
    const DAYS_28 = 28 * 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: DAYS_28,
        // incase of production, set the cookie for the main domain
        // domain: ".yourdomain.com",
    });

    return res.status(200).json({ success: true, user: { id: user._id, email: user.email, username: user.username, avatar_url: user.avatar_url } });
});


export default router;