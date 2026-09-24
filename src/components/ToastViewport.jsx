import { useToasts, toastStore } from '../stores/toastStore.js';

export default function ToastViewport() {
  const toasts = useToasts();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={[
            'rounded-2xl border px-4 py-3 shadow-lg backdrop-blur',
            'bg-zinc-900/80 border-white/10 text-white',
            t.type === 'success' ? 'ring-1 ring-emerald-400/30' : '',
            t.type === 'error' ? 'ring-1 ring-red-400/30' : '',
          ].join(' ')}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {t.type === 'success' ? '✅' : t.type === 'error' ? '⚠️' : 'ℹ️'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-semibold leading-snug">{t.message}</div>
              {t.description && (
                <div className="text-sm text-zinc-300 leading-snug mt-1">{t.description}</div>
              )}
            </div>

            <button
              type="button"
              className="text-zinc-300 hover:text-white transition"
              onClick={() => toastStore.remove(t.id)}
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
