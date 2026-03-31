import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — ScoutCurate",
  description: "Privacy Policy for the ScoutCurate AI Gift Finder Chrome Extension.",
}

const LAST_UPDATED = "March 27, 2026"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-curate-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-sm text-curate-gold hover:underline font-medium">← Back to ScoutCurate</Link>
          <h1 className="font-curate text-3xl sm:text-4xl font-bold text-curate-primary mt-4 mb-2">Privacy Policy</h1>
          <p className="text-sm text-curate-muted">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Quick summary box */}
        <div className="bg-curate-subtle border border-curate-border rounded-2xl p-5 mb-10">
          <h2 className="font-bold text-curate-primary mb-2 flex items-center gap-2">
            <span>🔒</span> The Short Version
          </h2>
          <ul className="text-sm text-curate-muted space-y-1.5 list-disc list-inside">
            <li>ScoutCurate collects <strong className="text-curate-primary">zero personal data</strong> about you.</li>
            <li>Your voice/text input goes directly from your browser to OpenAI — we never see it.</li>
            <li>We do not store or record your voice or audio files.</li>
            <li>Amazon affiliate cookies may be set by Amazon.com when you click our links.</li>
            <li>Amazon affiliate links are disclosed clearly on every page.</li>
          </ul>
        </div>

        <div className="space-y-8 text-curate-muted text-[15px] leading-relaxed">

          <Section title="1. Who We Are">
            <p>
              ScoutCurate ("we," "our," or "us") operates the website at{" "}
              <a href="https://scoutcurate.com" className="text-curate-gold hover:underline">scoutcurate.com</a>{" "}
              and the ScoutCurate Chrome browser extension. This Privacy Policy explains how we handle information
              in connection with your use of our services.
            </p>
          </Section>

          <Section title="2. Data Collection &amp; Use">
            <p><strong className="text-curate-primary">Voice Data:</strong> We use the Web Speech API to convert your voice to text locally in your browser. We do not store or record your audio files.</p>
            <p className="mt-3"><strong className="text-curate-primary">User Inputs:</strong> Text descriptions of gift recipients (age, likes, dislikes) are processed via OpenAI to generate recommendations. This data is not used to identify you personally and is not stored by ScoutCurate.</p>
            <p className="mt-3"><strong className="text-curate-primary">Cookies:</strong> As an Amazon Associate, we use cookies to track qualifying purchases so we can receive a commission. These cookies are set by Amazon.com when you click affiliate links and are governed by Amazon's Privacy Notice.</p>
            <p className="mt-3">ScoutCurate itself does <strong className="text-curate-primary">not</strong> collect, store, or transmit:</p>
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>Your name, email address, or any account information</li>
              <li>Your voice recordings or audio files</li>
              <li>Your gift search history or results</li>
              <li>Any personally identifiable information</li>
            </ul>
          </Section>

          <Section title="3. Third-Party Sharing">
            <p>
              We do not sell your data. We share anonymized text inputs with OpenAI solely to provide the gift recommendation service. Product links redirect to Amazon.com; your interactions there are governed by <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ" target="_blank" rel="noopener noreferrer" className="text-curate-gold hover:underline">Amazon's Privacy Notice</a>.
            </p>
          </Section>

          <Section title="4. Amazon Associate Disclosure">
            <p>
              ScoutCurate is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
            </p>
            <p className="mt-3">
              When you click a "Buy on Amazon" button, you are redirected to Amazon.com. Amazon may set cookies to track qualifying purchases. ScoutCurate may earn a commission at no additional cost to you.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p>
              You can opt-out of data processing by uninstalling the ScoutCurate Chrome extension at any time. For questions or inquiries, contact us at <a href="mailto:hello@scoutcurate.com" className="text-curate-gold hover:underline">hello@scoutcurate.com</a>.
            </p>
          </Section>

          <Section title="6. Children's Privacy">
            <p>
              ScoutCurate is <strong className="text-curate-primary">not directed at children under 13</strong>. Our Scout mode is a tool
              for adults (parents, guardians, gift-givers) to find gift ideas for children — the adult
              user operates the extension, not the child.
            </p>
          </Section>

          <Section title="7. AI-Generated Content Disclosure">
            <p>
              All gift recommendations displayed by ScoutCurate are <strong className="text-curate-primary">generated by artificial intelligence</strong> (OpenAI). They are provided for informational purposes only and do not constitute professional advice. ScoutCurate does not guarantee the accuracy, safety, or suitability of any recommendation.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy occasionally. Changes will be posted on this page with an updated "Last updated" date. Continued use of ScoutCurate after changes constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              For questions or concerns: <a href="mailto:hello@scoutcurate.com" className="text-curate-gold hover:underline">hello@scoutcurate.com</a>
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-curate-primary mb-3 border-b border-curate-border pb-2">{title}</h2>
      {children}
    </section>
  )
}
