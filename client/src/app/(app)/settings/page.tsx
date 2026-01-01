import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function settings() {
    return (
        <div className="h-full w-full flex items-center justify-center p-5 sm:p-8 md:p-10">
            <div className="w-full h-full rounded-xl flex flex-col gap-5 p-4 sm:p-5 md:p-8">
                <h1 className="text-4xl font-semibold">
                    Settings
                </h1>

                <div className="bg-card text-card-foreground flex justify-between items-center gap-5 p-4 rounded-xl w-full md:max-w-xl">
                    <Label htmlFor="public-profile" className="font-medium text-lg">
                        Public Profile
                    </Label>
                    <Switch
                        id="public-profile"
                    />
                </div>
            </div>
        </div>
    )
}