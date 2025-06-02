'use client';

import { Trash2 } from "lucide-react";
import { KeysAPI } from "@/api/api";
import { APIKey } from "@/models/apiKey";
import { useEffect, useState } from "react";

export default function ApiKeysList() {
    const [apiKeys, setApiKeys] = useState<APIKey[] | null>(null);

    useEffect(() => {
        KeysAPI.all().then((data) => setApiKeys(data.apiKeys));
    }, []);

    if (!apiKeys) {
        return (null);
    }

    return (
        <tbody>
            {apiKeys.map((apiKey, index) => (
                <tr key={index}>
                    <td className="px-5 py-3">{apiKey.name}</td>
                    <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center">
                            <span className={`h-[16px] w-[16px] ${apiKey.isActive ? 'bg-green-500' : 'bg-red-500'} rounded-full inline-block`} />
                        </div>
                    </td>
                    <td className="px-5 py-3">{apiKey.permission}</td>
                    <td className="px-5 py-3">{apiKey.lastUsage}</td>
                    <td className="px-5 py-3">{apiKey.createdAt}</td>
                    <td className="px-5 py-3">
                        <Trash2 size={20} color="var(--orange)"/>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}