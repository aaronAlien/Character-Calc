import React from "react";
import { Link } from "react-router-dom";

export default function BrowseCharactersCard({ variant = "default" }) {
  const compact = variant === "compact";

  return (
    <section
      className={[
        "relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/85 hover:bg-violet-950/80 hover:border-transparent transition duration-500 ease-in-out",
        compact ? "min-h-[220px] lg:min-h-min" : "",
      ].join(" ")}
    >
      {/* content */}
        <Link
          to='/characters'
          className="">

      <div
        className={[
          "relative z-10 flex flex-col items-center text-center max-h-min px-4 py-8",
        ].join(" ")}
      >
        <h2 className='text-2xl md:text-3xl tracking-tight'>
          Browse all characters
        </h2>
        <p className='mt-2 text-zinc-200 text-sm max-w-xl'>
          Explore every character, filter by element, and jump into detailed
          pages.
        </p>

      </div>
      </Link>
    </section>
  );
}
