import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackOpd() {
    return (
        <div className="px-2 py-6 mx-auto w-full max-w-4xl">
            <h1 className="font-bold text-2xl md:text-3xl">Track Your OPD Status</h1>
            <div className="flex flex-col items-start gap-3 mt-8">
                <Input placeholder="Enter your token no. (eg. A-123)" />
                <Button className="mt-2">Track OPD</Button>
            </div>
        </div>
    )
}