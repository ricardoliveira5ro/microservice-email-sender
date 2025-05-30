'use client'

import { UsersAPI } from "@/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Profile() {

    const router = useRouter();
    const [isTokenVerified, setIsTokenVerified] = useState(false);

    useEffect(() => {
        UsersAPI.verifyToken()
            .then(() => setIsTokenVerified(true))
            .catch(() => router.push('/'));
    }, [router]);

    return (
        <div>
            {isTokenVerified &&
                <div>

                </div>
            }
        </div>
    )
}