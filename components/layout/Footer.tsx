import {CodeXmlIcon} from "lucide-react";

export default function Footer() {
    return (
        <div
            className="flex flex-row bg-accent-2 text-sm font-bold p-5 text-accent-foreground justify-between items-center">
            <div className="flex flex-col gap-6">
                <span>wherecanibuythis.lk</span>
                <span className="text-xs font-light">Made in Sri Lanka with 💛</span>
            </div>

            <div>
                <a href="https://github.com/furniture-helper" target="_blank"><CodeXmlIcon className="inline-block mr-2"
                                                                                           size={16}/></a>
            </div>
        </div>

    )
}