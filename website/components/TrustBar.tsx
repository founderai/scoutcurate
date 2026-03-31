const trusts = [
  { icon: "🔒", label: "No Data Collected" },
  { icon: "✨", label: "Powered by GPT-4o" },
  { icon: "🎁", label: "25 Gifts Per Search" },
  { icon: "🛡️", label: "Free to Use" },
  { icon: "⚡", label: "Results in Seconds" },
]

export function TrustBar() {
  return (
    <section className="bg-curate-subtle border-y border-curate-border py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {trusts.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <span className="text-base">{t.icon}</span>
              <span className="text-sm font-medium text-curate-muted">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
