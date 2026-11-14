import Tagline from "@/components/elements/Tagline";
import PrimarySearchBar from "@/components/elements/PrimarySearchBar";

export default function Home() {
    return (
        <div className="flex flex-1 -translate-y-16 items-center justify-center">
            <div className="flex w-full max-w-[720px] flex-col items-center gap-6">
                <Tagline/>
                <PrimarySearchBar/>
            </div>
        </div>
    );
}
