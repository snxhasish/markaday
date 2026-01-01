"use client";

import { createContext, useContext } from "react";

export type User = {
    id: string;
    email: string;
    name?: string;
    username?: string;
    avatar_url?: string;
};

export type TodaysEntry = {
    date: string;
    tags: string[];
    note?: {
        content: string;
        is_private: boolean;
    }
    mood_score?: number
}

type UserContextType = {
    user: User | null;
    todays_entry: TodaysEntry | null;
    isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ user, todays_entry, children }: { user: User | null; todays_entry: TodaysEntry; children: React.ReactNode; }) {
    return (
        <UserContext.Provider
            value={{
                user,
                todays_entry,
                isAuthenticated: !!user
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);

    if (!ctx) {
        throw new Error("useUser must be used inside <UserProvider>");
    }

    return ctx;
}
