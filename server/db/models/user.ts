import { Schema, model } from "mongoose";

export interface User {
    email: string
    auth: {
        provider: "email" | "google"
        code?: string
        jwt?: string
    }

    name?: string
    username: string
    avatar_url?: string
    timezone: string

    tags: UserTag[]
    week_start: "sunday" | "monday"
    public_profile: boolean
}

export interface UserTag {
    _id?: string
    label: string
    color: string
}

const tagSchema = new Schema<UserTag>({
    label: { type: String, required: true },
    color: { type: String, required: true }
}, {
    timestamps: true
});

const userSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    auth: {
        provider: { type: String, required: true },
        code: { type: String },
        jwt: { type: String }
    },

    name: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    avatar_url: { type: String },
    tags: { type: [tagSchema], default: [], required: true },
    timezone: { type: String, required: true, default: "UTC" },
    week_start: { type: String, required: true, default: "sunday" },
    public_profile: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

const Users = model<User>("users", userSchema);

export default Users;