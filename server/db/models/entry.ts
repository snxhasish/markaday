import { Schema, model } from "mongoose";

export interface DayEntry {
    user_id: string
    date: string // YYYY-MM-DD
    tags: string[] // array of tag IDs : 0th index is the primary tag
    mood_score?: number // between 1-10
    note?: {
        content: string
        is_private: boolean
    }
    createdAt: Date;
    updatedAt: Date;
}

const dayEntrySchema = new Schema<DayEntry>({
    user_id: { type: String, required: true },
    date: { type: String, required: true },
    tags: { type: [String], required: true },
    mood_score: { type: Number, required: false },
    note: {
        content: { type: String },
        is_private: { type: Boolean }
    }
}, {
    timestamps: true
});

const Entries = model<DayEntry>("entries", dayEntrySchema);

export default Entries;