import React from 'react';
//import './Dashboard.css';

import FarmableToday from '../components/FarmableToday/farmableToday';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-900 p-6">
      <section className="max-w-4xl mx-auto grid gap-6">
        <FarmableToday />
      </section>
    </main>
  );
}
