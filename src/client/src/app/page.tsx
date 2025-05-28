import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="grid grid-cols-2 gap-x-8 rounded-md w-fit">
        <div className="flex flex-col gap-y-8 mt-6">
          <div>
            <h1 className="text-5xl mb-2 font-semibold">Email Sender<span className="text-[var(--orange)]">.</span></h1>
            <span className="ml-0.5">We make it easy for everyone to resolve problems</span>
          </div>
          <div className="flex gap-x-6">
            <Link href={'/auth'} className="flex items-center rounded-2xl bg-[var(--orange)] py-2 px-4 gap-x-1">
              <span>Get Started</span>
              <ChevronRight size={20} />
            </Link>
            <a href="https://github.com/ricardoliveira5ro/microservice-email-sender/blob/main/README.md" className="flex items-center gap-x-1" target="_blank" rel="noopener noreferrer">
              <span>Documentation</span>
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
        <Image src='/curl.png' alt="curl image" width={500} height={305} className="rounded-md" priority />
      </div>
    </div>
  );
}
