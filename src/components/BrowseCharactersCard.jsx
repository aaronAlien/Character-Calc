import React from "react";
import { Link } from "react-router-dom";

export default function BrowseCharactersCard({ variant = "default" }) {
  const compact = variant === "compact";

  return (
    <section
      className={[
        "relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60",
        compact ? "min-h-[220px] lg:min-h-[260px]" : "",
      ].join(" ")}
    >
      {/* background image layer 
      <div className='absolute inset-0'>
        <img
          src='/static/images/group_photo.jpg'
          alt=''
          className={[
            "h-full w-full object-cover opacity-35 scale-105",
            compact ? "object-center" : "",
          ].join(" ")}
        />
         dark overlay for readability 
        <div className='absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/40 to-zinc-950/70' />
      </div>
*/}
      {/* content */}
      <div
        className={[
          "relative z-10 flex flex-col items-center text-center",
          compact ? "px-6 py-8" : "px-6 py-10",
        ].join(" ")}
      >
        <h2 className='text-2xl md:text-3xl font-black tracking-tight'>
          Browse all characters
        </h2>
        <p className='mt-2 text-zinc-200 max-w-xl'>
          Explore every character, filter by element, and jump into detailed
          pages.
        </p>

        <Link
          to='/characters'
          className='mt-6 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-2 text-zinc-100 hover:bg-white/15 hover:border-white/25 transition'
        >
          Go →
        </Link>
      </div>
    </section>
  );
}
