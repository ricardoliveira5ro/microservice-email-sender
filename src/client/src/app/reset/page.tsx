'use client'

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { UsersAPI } from "@/api/api";
import { CircleAlert } from "lucide-react";

import './reset.css'

function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isTokenVerified, setIsTokenVerified] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        UsersAPI.verifyResetToken(searchParams.get('user') ?? '', searchParams.get('resetToken') ?? '')
            .then(() => { setIsTokenVerified(true) })
            .catch(() => { router.push('/') });
    }, [router, searchParams]);

    async function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        UsersAPI.reset({ password: newPassword }, searchParams.get('user') ?? '', searchParams.get('resetToken') ?? '')
            .then(() => { router.push('/') })
            .catch(() => { setError("Something went wrong") });
    }

    return (
        <div className="flex justify-center items-center h-screen">
            {isTokenVerified &&
                <div className="flex rounded-md bg-white p-12">
                    <form onSubmit={(e) => submitForm(e)} className="flex flex-col gap-y-6 reset-form">
                        <h1 className="text-black text-4xl">Reset Password</h1>
                        <div className="flex flex-col gap-y-2">
                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="px-4 py-1.5 bg-[var(--orange)] rounded-md">Save</button>
                        {(error && error !== "") &&
                            <div className="flex items-center gap-x-3">
                                <CircleAlert size={20} color="red" />
                                <span className="text-red-500">{error}</span>
                            </div>
                        }
                    </form>
                </div>
            }
        </div>
    ); 
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPassword />
        </Suspense>
    );
}