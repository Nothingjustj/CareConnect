import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackOpd() {
    return (
        <div className="px-2 py-6 mx-auto w-full max-w-4xl">
            <h1 className="font-bold text-2xl md:text-3xl">Track Your OPD Status</h1>
            <div className="flex items-center gap-3 mt-4">
                <Input placeholder="Enter your token no. (eg. A-123)" />
                <Button>Track OPD</Button>
            </div>
        </div>
    )
}