const steps = [
  {
    number: "01",
    title: "Speak or Type",
    description:
      "Hit Record and describe the person — their age, interests, vibe, or what they hate. The more specific, the better the results.",
    accent: "border-scout-primary/30",
    numColor: "text-scout-primary",
  },
  {
    number: "02",
    title: "AI Curates 25 Gifts",
    description:
      "ScoutCurate sends your description to GPT-4o, which applies deep gift-finding logic — safety, aesthetics, utility — and returns 25 perfect picks.",
    accent: "border-rose-gold/40",
    numColor: "text-rose-gold",
  },
  {
    number: "03",
    title: "Buy on Amazon",
    description:
      'Each gift card has a "Buy on Amazon" button with your search pre-filled. Every link includes an affiliate tag — you shop, we earn a small commission at no cost to you.',
    accent: "border-curate-primary/30",
    numColor: "text-curate-primary",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-curate-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-curate text-3xl sm:text-4xl font-bold text-curate-primary mb-4">
            How It Works
          </h2>
          <p className="text-curate-muted text-lg max-w-xl mx-auto">
            From blank page to 25 gift ideas in under 30 seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-2xl border-2 ${step.accent} p-7 bg-curate-card relative shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`text-6xl font-black mb-4 ${step.numColor} opacity-10 absolute top-4 right-5 leading-none font-curate`}>
                {step.number}
              </div>
              <h3 className="font-bold text-base text-curate-primary mb-2">{step.title}</h3>
              <p className="text-sm text-curate-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-curate-muted/60 mt-8">
          * As an Amazon Associate, ScoutCurate earns from qualifying purchases. Prices subject to change. All recommendations are AI-generated.
        </p>
      </div>
    </section>
  )
}
