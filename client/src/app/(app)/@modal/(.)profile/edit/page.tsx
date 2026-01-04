import EditProfile from "@/app/(app)/profile/edit/edit-profile";

export default async function NewDayEntryModal() {
    return (
        <div className="absolute backdrop-blur-sm h-screen w-full bg-primary/5 flex justify-center items-center">
            <EditProfile
                closeButton
            />
        </div>
    );
}
