'use client'

import { UsersAPI } from "@/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChartColumn, Inbox, KeyRound } from "lucide-react";
import ApiKeys from "./apiKeys";

export default function Profile() {

    const router = useRouter();
    const [isTokenVerified, setIsTokenVerified] = useState(false);

    useEffect(() => {
        UsersAPI.verifyToken()
            .then(() => setIsTokenVerified(true))
            .catch(() => router.push('/auth'));
    }, [router]);

    return (
        <div className="flex justify-center h-screen p-12">
            {isTokenVerified &&
                <div className="flex flex-col w-full items-center gap-y-8 px-8">
                    <div className="flex flex-row justify-center items-center gap-x-8 border border-[#34353b] w-fit h-fit rounded-lg">
                        <div className="flex px-6 py-4 gap-x-3 cursor-pointer ">
                            <KeyRound />
                            <p>API Keys</p>
                        </div>
                        <div className="flex px-6 py-4 gap-x-3 cursor-pointer">
                            <Inbox />
                            <p>Emails</p>
                        </div>
                        <div className="flex px-6 py-4 gap-x-3 cursor-pointer">
                            <ChartColumn />
                            <p>Metrics</p>
                        </div>
                    </div>
                    <ApiKeys />
                </div>
            }
        </div>
    )
}