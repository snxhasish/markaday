import { Request } from "express";
import Users, { User } from "../db/models/user";
import generateJWT from "./jwt";
import { emailToUsername } from "./email";

export const userFindOrCreate =
    async (email: string, req: Request, provider: string, name: string | null, avatar: string | null, verificationCode?: string) => {
        const user = await Users.findOne({ email: email });

        if (user && user.email === email) {
            if (user.auth.provider !== provider) return { error: "Please choose a different auth provider.", user: null };

            const jwt = generateJWT(email);

            user.auth.jwt = jwt;
            await user.save();

            return {
                error: null,
                user: {
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar_url,
                    jwt
                }
            };
        } else {
            const jwt = generateJWT(email);

            Users.create({
                email,
                auth: {
                    provider: "email",
                    code: verificationCode ?? null,
                    jwt
                },

                name,
                username: emailToUsername(email),
                tags: [
                    { label: "Productive", color: "#34D399" },
                    { label: "Got things done", color: "#1976d2" },
                    { label: "Bare minimum", color: "#FBBF24" },
                    { label: "Unproductive", color: "#EF4444" },
                    { label: "Rest day", color: "#9CA3AF" }
                ],
                timezone: "UTC",
                week_start: "monday",
                public_profile: false
            } as User);

            return {
                error: null,
                user: {
                    email,
                    name,
                    avatar,
                    jwt
                }
            };
        }
    }
