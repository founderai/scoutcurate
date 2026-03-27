const steps = [
  {
    number: "01",
    icon: "🎙️",
    title: "Speak or Type",
    description:
      "Hit Record and describe the person — their age, interests, vibe, or what they hate. The more specific, the better the results.",
    color: "bg-orange-50 border-orange-200",
    numColor: "text-scout-primary",
  },
  {
    number: "02",
    icon: "🤖",
    title: "AI Curates 25 Gifts",
    description:
      "ScoutCurate sends your description to GPT-4o, which applies deep gift-finding logic — safety, aesthetics, utility — and returns 25 perfect picks.",
    color: "bg-violet-50 border-violet-200",
    numColor: "text-violet-500",
  },
  {
    number: "03",
    icon: "🛍️",
    title: "Buy on Amazon",
    description:
      'Each gift card has a "Buy on Amazon" button with your search pre-filled. Every link includes an affiliate tag — you shop, we earn a small commission at no cost to you.',
    color: "bg-yellow-50 border-yellow-200",
    numColor: "text-yellow-600",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From blank page to 25 gift ideas in under 30 seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-2xl border-2 p-6 bg-white ${step.color} relative`}
            >
              <div className={`text-5xl font-black mb-4 ${step.numColor} opacity-20 absolute top-4 right-5 leading-none`}>
                {step.number}
              </div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Affiliate note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          * As an Amazon Associate, ScoutCurate earns from qualifying purchases. Prices subject to change. All recommendations are AI-generated.
        </p>
      </div>
    </section>
  )
}
