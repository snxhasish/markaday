import EditProfile from "./edit-profile";

export default async function EditProfilePage() {

    return (
        <div className="h-full w-full flex flex-col justify-start items-start px-5 sm:px-10 md:px-20">
            <div className="w-full h-full flex justify-center items-start gap-4 py-4">
                <EditProfile />
            </div>
        </div>
    );
}
