import { CodeXml, Plus } from "lucide-react";

export default function ApiKeys() {

    return (
        <div className="w-full">
            <div className="flex gap-x-4">
                <button className="flex gap-x-2 bg-[var(--orange)] py-2 px-4 rounded-lg">
                    <Plus />
                    <span>Create API Key</span>
                </button>
                <button className="flex gap-x-2 bg-[#34353b] py-2 px-4 rounded-lg">
                    <CodeXml />
                    <span>API</span>
                </button>
            </div>
        </div>
    );
};