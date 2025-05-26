'use client'

import { FormEvent, useRef, useState } from "react";
import { UsersAPI } from "@/api/api";
import Image from "next/image";
import ReCAPTCHA from 'react-google-recaptcha'
import "./auth.css";

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);
  const recaptcha = useRef<ReCAPTCHA>(null)

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const captchaValue = recaptcha.current?.getValue()

    if (captchaValue) {
      UsersAPI.verifyRecaptcha({ captchaValue })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-2 border rounded-md w-fit bg-white">
          <div className="relative w-full h-full min-h-[600px]">
            <Image src="/sending.png" className="rounded-l-md" fill alt="Google authentication" priority/>
          </div>
          <div className="flex flex-col gap-y-10 justify-center rounded-r-md items-center px-16 py-10 border">
            <div className="flex flex-col gap-y-2 w-full">
              <h1 className="text-4xl font-medium text-black">Welcome to <span className="text-[var(--orange)]">Email Sender</span></h1>
              <p className="text-black">We make it easy for everyone to resolve problems</p>
            </div>

            <div className="flex w-full gap-x-3">
              <button onClick={() => setIsLogin(true)} className={`w-20 h-1.5 rounded-xs ${isLogin ? 'bg-[var(--orange)]' : 'bg-[var(--gray)]'}`}></button>
              <button onClick={() => setIsLogin(false)} className={`w-20 h-1.5 rounded-xs ${!isLogin ? 'bg-[var(--orange)]' : 'bg-[var(--gray)]'}`}></button>
            </div>

            <form onSubmit={(e) => submitForm(e)} className="flex flex-col w-full gap-y-8 auth-form">
              <div className="flex flex-col w-full gap-y-8">
                <input type="text" placeholder="Email" />
                {!isLogin && <input type="text" placeholder="Username" />}
                <input type="text" placeholder="Password" />
              </div>
              <div className="flex justify-between gap-x-10">
                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_SITE_KEY || ''} ref={recaptcha} />
                <a className="cursor-pointer underline" href="#">Forgot Password?</a>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                  <button className="bg-[var(--orange)] rounded-sm w-fit px-14 py-2">{isLogin ? "Login" : "Register"}</button>
                  <button className="p-1.5 rounded-full bg-[var(--orange)]"><Image src="/google-plus.png" width={24} height={24} alt="Google authentication"/></button>
                </div>
                <div>
                  <button type="submit" className="cursor-pointer text-black underline" onClick={() => setIsLogin(!isLogin)}>{!isLogin ? "Login?" : "Register?"}</button>
                </div>
              </div>
            </form>
          </div>
      </div>
    </div>
  )
}