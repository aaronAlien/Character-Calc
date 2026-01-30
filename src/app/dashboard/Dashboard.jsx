import React from "react";
import WelcomeCard from "../../components/Welcome";
import { Link } from "react-router-dom";
import BrowseCharactersCard from "../../components/BrowseCharactersCard";
import FarmableToday from "../../components/FarmableToday";

export default function Dashboard() {
  return (
    <main className='dashboard min-h-screen bg-zinc-950 text-white pt-6 pb-10'>
      <div className='max-w-4xl mx-auto grid gap-4 lg:grid-cols-3 lg:auto-rows-min'>
        {/* Full width header */}
        <div className='lg:col-span-3'>
          <WelcomeCard />
        </div>
      
        {/* calculator & todo */}
        <Link to='/calculator' className='text-zinc-300 hover:text-white'>
          Calculator →
        </Link>

        <Link to='/todo' className='text-zinc-300 hover:text-white'>
          Todo List →
        </Link>
        
        {/* Left: tall */}
        <div className='lg:col-span-2'>
          <FarmableToday />
        </div>

        {/* Right: short, top-aligned */}
        <div className='lg:col-span-1 lg:self-start'>
          <BrowseCharactersCard variant='compact' />
        </div>
      </div>
    </main>
  );
}
