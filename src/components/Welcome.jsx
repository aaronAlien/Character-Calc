import React from "react";

export default function WelcomeCard() {
  return (
    <section className='w-full rounded-xl border border-white/10 bg-zinc-900 p-6 text-white'>
      <h1 className='text-4xl md:text-5xl'>Greetings Traveller</h1>

      <p className='mt-3 text-zinc-200 text-sm md:text-base'>
        Character Calc allows you to track daily farming, browse character info
        <br /> & track ascension materials in a lightweight and efficient way.
      </p>

      <p className='mt-2 text-xs md:text-sm font-light italic text-zinc-300'>

      </p>
    </section>
  );
}
