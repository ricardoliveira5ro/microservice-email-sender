import { CodeXml, Plus, Trash2 } from "lucide-react";

export default function ApiKeys() {

    return (
        <div className="flex flex-col w-fit gap-y-8">
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
            <table className="">
                <thead className="bg-[#16171c] text-left">
                    <tr>
                        <th className="w-[300px] px-5 py-2.5 rounded-l-lg">Name</th>
                        <th className="w-[300px] px-5 py-2.5">Permission</th>
                        <th className="w-[300px] px-5 py-2.5">Last Used</th>
                        <th className="w-[200px] px-5 py-2.5">Created At</th>
                        <th className="w-[70px] px-5 py-2.5 rounded-r-lg"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-5 py-3">Personal queue</td>
                        <td className="px-5 py-3">Sending access</td>
                        <td className="px-5 py-3">2 minutes ago</td>
                        <td className="px-5 py-3">2025-05-03</td>
                        <td className="px-5 py-3">
                            <Trash2 size={20} color="var(--orange)"/>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-5 py-3">Personal queue</td>
                        <td className="px-5 py-3">Sending access</td>
                        <td className="px-5 py-3">2 minutes ago</td>
                        <td className="px-5 py-3">2025-05-03</td>
                        <td className="px-5 py-3">
                            <Trash2 size={20} color="var(--orange)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};