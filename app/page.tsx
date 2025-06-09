'use client'
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Home() {
  gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies 

const container = useRef<HTMLDivElement>(null);
const tweenRef = useRef<gsap.core.Tween | null>(null);

const { contextSafe } = useGSAP(() => {
    // gsap.set('.box', { opacity: 0, x: -100 })
    // gsap.to('.box', { opacity: 1, x: 100, duration: 2});
    // gsap.from('.box', { y: -200, duration: 3, repeat: -1, yoyoEase: true})
    tweenRef.current = gsap.to('.box', { y: -200, borderRadius: 0.5, opacity: 0, duration: 2, repeat: -1, yoyoEase: true, stagger: {
      each: 0.1,
      from: 'center',
      grid: 'auto',
      ease: 'power2.inOut',
      repeat: -1
    }})
},{ scope: container });
const play = contextSafe(() => {
  tweenRef.current?.play()
})
const pause = contextSafe(() => {
  tweenRef.current?.pause()
})
const restart = contextSafe(() => {
  tweenRef.current?.restart()
})
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div ref={container} className='container min-w-full flex gap-2'>
          <div className='box w-10 h-10 block bg-amber-300 rounded-full'></div>          
          <div className='box w-10 h-10 block bg-amber-300 rounded-full'></div>          
          <div className='box w-10 h-10 block bg-amber-300 rounded-full'></div>          
          <div className='box w-10 h-10 block bg-amber-300 rounded-full'></div>          
          <div className='box w-10 h-10 block bg-amber-300 rounded-full'></div>          
        </div>
        <Button onClick={play} variant={"secondary"}>Play me</Button>
        <Button onClick={pause} variant={"secondary"}>Pause me</Button>
        <Button onClick={restart} variant={"secondary"}>restart me</Button>
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={20}
          height={20}
        />
      </main>
    </div>
  );
}
