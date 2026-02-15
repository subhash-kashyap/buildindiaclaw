export default function OfflineBanner() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-soft">
      Agent unreachable. Drafts will queue until the agent is back online.
    </div>
  );
}
