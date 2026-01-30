import React from 'react';

export default function WelcomeCard() {
  return (
    <section className="w-full rounded-xl border border-white/10 bg-zinc-900 p-6 text-white">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight">
        ✨ Greetings Traveller!
      </h2>

      <p className="mt-3 text-zinc-200">
        My Genshin allows you to track daily farming, browse character info and track ascension materials in a lightweight and efficient way.
      </p>

      <p className="mt-2 text-sm font-light italic text-zinc-300">
        This project is inspired by <span className="font-semibold hover:cursor-pointer"><a href="https://github.com/MadeBaruna/paimon-moe" target='_blank'>community tools</a></span> and built to be fast, clean, and easy to expand.
      </p>
    </section>
  );
}
