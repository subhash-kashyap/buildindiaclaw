import type { CronJob } from "@/lib/types";

export default function CronSchedule({ jobs }: { jobs: CronJob[] }) {
  return (
    <div className="mt-4 rounded-3xl bg-cream-50 p-4 shadow-soft">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Scheduled Jobs</div>
      <div className="mt-3 grid gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-2xl border border-cream-200 bg-cream-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-ink-900">{job.name}</div>
              <span className="rounded-full bg-mint-100 px-2 py-1 text-[10px] font-semibold text-mint-700">
                {job.status}
              </span>
            </div>
            <div className="mt-1 text-xs text-ink-600">{job.cadence}</div>
            <div className="mt-1 text-xs text-ink-500">Next run: {job.nextRun}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
