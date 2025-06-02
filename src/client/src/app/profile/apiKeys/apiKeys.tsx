'use client';

import { Suspense } from "react";
import { Plus, CodeXml } from "lucide-react";

import ApiKeysLoading from "./apiKeysLoading";
import ApiKeysList from "./apiKeysList";

import '../profile.css'

export default function ApiKeysPage() {
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

            <table className="apiKey-table">
                <thead className="bg-[#16171c] text-left">
                    <tr>
                        <th className="w-[300px] px-5 py-2.5 rounded-l-lg">Name</th>
                        <th className="w-[100px] px-5 py-2.5 text-center">Active</th>
                        <th className="w-[200px] px-5 py-2.5">Permission</th>
                        <th className="w-[200px] px-5 py-2.5">Last Used</th>
                        <th className="w-[200px] px-5 py-2.5">Created At</th>
                        <th className="w-[70px] px-5 py-2.5 rounded-r-lg"></th>
                    </tr>
                </thead>
                <Suspense fallback={<ApiKeysLoading />}>
                    <ApiKeysList />
                </Suspense>
            </table>
        </div>
    );
}