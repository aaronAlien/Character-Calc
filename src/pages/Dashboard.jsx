import React from 'react';
import FarmableToday from '../components/dashboard/farmableToday';
import WelcomeCard from '../components/dashboard/welcome';



export default function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 pt-6 pb-10">
      <div className="max-w-6xl mx-auto grid gap-4">
        <WelcomeCard />
        <FarmableToday />
      </div>
    </main>
  );
}

