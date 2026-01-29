import React from "react";
import FarmableToday from "../components/dashboard/farmableToday";
import WelcomeCard from "../components/dashboard/welcome";
import { Link } from "react-router-dom";
import BrowseCharactersCard from "../components/dashboard/BrowseCharactersCard";


export default function Dashboard() {
  return (
    <main className='dashboard min-h-screen bg-zinc-950 text-white pt-6 pb-10'>
      <div className="max-w-4xl mx-auto grid gap-4 lg:grid-cols-3 lg:auto-rows-min">
  {/* Full width header */}
  <div className="lg:col-span-3">
    <WelcomeCard />
  </div>

  {/* Left: tall */}
  <div className="lg:col-span-2">
    <FarmableToday />
  </div>

  {/* Right: short, top-aligned */}
  <div className="lg:col-span-1 lg:self-start">
    <BrowseCharactersCard variant="compact" />
  </div>
</div>

    </main>
  );
}
