import { Link } from "react-router-dom";

export default function DashboardAboutCard() {
  return (
    <section className='relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/85 hover:bg-violet-800/50 hover:border-transparent transition duration-500 ease-in-out'>
      <a
        href='https://github.com/aaronAlien/v2_Daily_Genshin'
        target='_blank'
        rel='noopener noreferrer'
        aria-label="link to GitHub"
        className='flex items-center justify-center text-right text-white font-averiao text-xl'
      >
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent blur-2xl opacity-60' />

        <div className='relative p-6 flex flex-col gap-3'>
          <h2>About →</h2>
        </div>
      </a>
    </section>
  );
}
