'use client';

import { Ban, Clipboard, Trash2 } from "lucide-react";
import { APIKey } from "@/models/apiKey";
import { KeysAPI } from "@/api/api";

export default function ApiKeysList({ apiKeys, fetchKeys, copyToClipboard }: { 
    apiKeys: APIKey[],
    fetchKeys: () => void;
    copyToClipboard: (text: string) => void;
}) {

    async function handleInvalidateAPIKey (authId: string) {
        KeysAPI.invalidateAPIKey({ authId })
            .then(() => fetchKeys());
    };

    async function handleDeleteAPIKey (authId: string) {
        KeysAPI.deleteAPIKey(authId)
            .then(() => fetchKeys());
    }

    return (
        <tbody>
            {apiKeys.map((apiKey, index) => (
                <tr key={index}>
                    <td className="px-5 py-3">{apiKey.name}</td>
                    <td className="px-5 py-3 flex items-center justify-center">
                        <button onClick={() => copyToClipboard(apiKey.authId)}>
                            <Clipboard size={22} />
                        </button>
                    </td>
                    <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center">
                            <span className={`h-[16px] w-[16px] ${apiKey.isActive ? 'bg-green-500' : 'bg-red-500'} rounded-full inline-block`} />
                        </div>
                    </td>
                    <td className="px-5 py-3">{apiKey.permission}</td>
                    <td className="px-5 py-3">{apiKey.lastUsage}</td>
                    <td className="px-5 py-3">{apiKey.createdAt}</td>
                    <td className="px-5 py-3">
                        <div className="flex gap-x-4 justify-end">
                            {apiKey.isActive &&
                                <button onClick={() => handleInvalidateAPIKey(apiKey.authId)}>
                                    <Ban size={20} />
                                </button>
                            }
                            <button onClick={() => handleDeleteAPIKey(apiKey.authId)}>
                                <Trash2 size={20} color="var(--orange)"/>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}