export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-violet-950/50 backdrop-blur-sm">
      <div className="mx-auto w-full px-6 py-6 text-xs text-zinc-400 text-center">
        <p>
          Genshin Impact, all game content, images, characters, and trademarks
          are the property of <span className="text-zinc-300">HoYoverse</span>.
          This project is <span className="text-zinc-300">not affiliated with or endorsed by HoYoverse</span>.
        </p>

        <p className="mt-2">
          Character and item data is provided under the{' '}
          <a
            href="https://github.com/MadeBaruna/paimon-moe"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-300 underline hover:text-white"
          >
            MIT License
          </a>
          . Original data source credited to the respective authors.
        </p>
      </div>
    </footer>
  );
}
