const trusts = [
  "No Data Collected",
  "Powered by GPT-4o",
  "25 Gifts Per Search",
  "Free to Use",
  "Results in Seconds",
]

export function TrustBar() {
  return (
    <section className="bg-curate-subtle border-y border-curate-border py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {trusts.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-curate-gold inline-block" />
              <span className="text-sm font-medium text-curate-muted">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
