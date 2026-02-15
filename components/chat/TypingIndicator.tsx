export default function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-3xl bg-cream-50 p-4 shadow-soft">
      <div className="text-xs uppercase tracking-[0.2em] text-ink-500">{label}</div>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-mint-400" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-mint-300 [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-mint-200 [animation-delay:240ms]" />
      </div>
    </div>
  );
}
