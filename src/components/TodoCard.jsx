import { Link } from 'react-router-dom';

export default function DashboardTodoCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/85">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent blur-2xl opacity-60" />

      <div className="relative p-6 flex flex-col gap-3">
        <h2 className="text-xl text-white">Todo List</h2>

        <p className="text-zinc-300 text-sm leading-relaxed">
          View your todo list or use the calculator to add new goals </p>

        <div className="pt-2 flex gap-2 flex-wrap">
          <Link
            to="/todo"
            className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-2 font-averiao text-white hover:bg-violet-800/50 transition duration-500 ease-in-out"
          >
            View todo →
          </Link>

        </div>
      </div>
    </section>
  );
}
