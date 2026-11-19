import Tagline from "@/components/elements/Tagline";
import PrimarySearchBar from "@/components/elements/PrimarySearchBar";
import {Button} from "@/components/ui/button";
import {ShuffleIcon} from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-1 -translate-y-16 items-center justify-center p-5">
            <div className="flex w-full max-w-[720px] flex-col items-center gap-6">
                <Tagline/>
                <PrimarySearchBar/>

                <a href={"/product/random"}>
                    <Button type="submit" variant="default"
                            className="rounded-none bg-accent cursor-pointer hover:bg-accent/80 p-5">
                        <span>I&#39;m feeling lucky</span>
                        <ShuffleIcon className="text-accent-foreground"/>
                    </Button>
                </a>
            </div>
        </div>
    );
}
