'use client';

import { useEffect, useState } from "react";
import { Plus, CodeXml, Clipboard, RefreshCcw } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast';
import { KeysAPI } from "@/api/api";

import ApiKeysLoading from "./apiKeysLoading";
import ApiKeysList from "./apiKeysList";

import '../profile.css'
import { APIKey } from "@/models/apiKey";

export default function ApiKeysPage() {
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [apiKeys, setApiKeys] = useState<APIKey[] | null>(null);
    const [generatedKey, setGeneratedKey] = useState<{ authId: string, apiKey: string } | null>(null);

    const fetchApiKeys = async () => {
        const data = await KeysAPI.all();
        setApiKeys(data.apiKeys);
    };

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const [newAPIKeyName, setNewAPIKeyName] = useState("");
    const [permission, setPermission] = useState("READ");

    async function createAPIKey() {
        if (!newAPIKeyName || newAPIKeyName === "")
            return;

        KeysAPI.generateAPIKey({ name: newAPIKeyName, permission: permission })
            .then(async (data) => {
                toast.success("API Key created");

                setGeneratedKey({ authId: data.authId, apiKey: data.apiKey });
                await fetchApiKeys();
            })
            .catch(() => {
                toast.error("Could not create API Key");
            });

    }

    function handlePostAPIKeyCreation() {
        setGeneratedKey(null);
        setIsModalOpen(false);
        setNewAPIKeyName("");
        setPermission("READ");
    }

    async function refresh() {
        await fetchApiKeys();
        toast.success("Up to date");
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied");
    }

    return (
        <div className="flex flex-col w-fit gap-y-8">
            <Toaster />
            <div className="flex justify-between items-center gap-x-4">
                <div className="flex gap-x-4">
                    <button onClick={() => setIsModalOpen(true)} className="flex gap-x-2 bg-[var(--orange)] py-2 px-4 rounded-lg">
                        <Plus />
                        <span>Create API Key</span>
                    </button>
                    <button className="flex gap-x-2 bg-[#34353b] py-2 px-4 rounded-lg">
                        <CodeXml />
                        <span>API</span>
                    </button>
                </div>
                <button onClick={refresh}>
                    <RefreshCcw />
                </button>
            </div>

            <Dialog open={isModalOpen} as="div" className="relative z-10 focus:outline-none" onClose={handlePostAPIKeyCreation}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel transition className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
                            <DialogTitle as="h3" className="text-lg font-medium text-white">
                                Create API Key
                            </DialogTitle>
                            <input value={newAPIKeyName} onChange={(e) => setNewAPIKeyName(e.target.value)} type="text" placeholder="Name" className="mt-5 border border-[#34353b] px-3 py-1 rounded-lg w-full" />
                            <div className="flex gap-x-6 my-5 w-full radio-button-permission">
                                <label className="flex items-center gap-x-1">
                                    <input type="radio" name="permission" value="READ" checked={permission === "READ"} onChange={(e) => setPermission(e.target.value)} className="accent-[var(--orange)]" />
                                    READ
                                </label>
                                <label className="flex items-center gap-x-1">
                                    <input type="radio" name="permission" value="WRITE" checked={permission === "WRITE"} onChange={(e) => setPermission(e.target.value)} className="accent-[var(--orange)]"  />
                                    WRITE
                                </label>
                            </div>
                            {generatedKey ? (
                                <>
                                    <hr />
                                    <div className="flex flex-col mt-4 gap-y-2">
                                        <span className="text-sm">Auth Id</span>
                                        <div className="flex justify-between items-center border border-[#34353b] rounded-lg px-3 py-1">
                                            <span>{generatedKey.authId}</span>
                                            <button onClick={() => copyToClipboard(generatedKey.authId)}>
                                                <Clipboard size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-4 gap-y-2">
                                        <span className="text-sm text-[var(--orange)]">This key will only be shown once. Please make sure to copy it now.</span>
                                        <div className="flex justify-between items-center border border-[#34353b] rounded-lg px-3 py-1">
                                            <span>{generatedKey.apiKey}</span>
                                            <button onClick={() => copyToClipboard(generatedKey.apiKey)}>
                                                <Clipboard size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={handlePostAPIKeyCreation} className="bg-[var(--orange)] rounded-lg px-6 py-1.5 mt-4">Done</button>
                                </>
                            ) : (
                                <div className="flex w-full justify-end gap-x-3 mt-6">
                                    <button onClick={() => setIsModalOpen(false)} className="bg-[#34353b] rounded-lg px-6 py-1.5">Cancel</button>
                                    <button onClick={createAPIKey} className="bg-[var(--orange)] rounded-lg px-6 py-1.5">Create</button>
                                </div>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <table className="apiKey-table">
                <thead className="bg-[#16171c] text-left">
                    <tr>
                        <th className="w-[300px] px-5 py-2.5 rounded-l-lg">Name</th>
                        <th className="w-[100px] px-5 py-2.5 text-center">Auth Id</th>
                        <th className="w-[100px] px-5 py-2.5 text-center">Active</th>
                        <th className="w-[200px] px-5 py-2.5">Permission</th>
                        <th className="w-[200px] px-5 py-2.5">Last Used</th>
                        <th className="w-[200px] px-5 py-2.5">Created At</th>
                        <th className="w-[70px] px-5 py-2.5 rounded-r-lg"></th>
                    </tr>
                </thead>
                {apiKeys ? (
                    <ApiKeysList apiKeys={apiKeys} fetchKeys={fetchApiKeys} copyToClipboard={copyToClipboard} />
                ) : (
                    <ApiKeysLoading />
                )}
            </table>
        </div>
    );
}