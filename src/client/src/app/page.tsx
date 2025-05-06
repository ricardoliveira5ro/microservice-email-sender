import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <h1 className="text-2xl pb-8 font-[family-name:var(--font-geist-mono)] font-semibold">Still working on it, please be patient</h1>
      <Image
        src="/work.png"
        alt="Under construction"
        width={180}
        height={38}
        priority
      />
    </div>
  );
}
