import { HeroSection } from "@/components/HeroSection"
import { HowItWorks } from "@/components/HowItWorks"
import { ScoutCurateSplit } from "@/components/ScoutCurateSplit"
import { TrustBar } from "@/components/TrustBar"
import { InstallCTA } from "@/components/InstallCTA"
import { ComplianceBanner } from "@/components/ComplianceBanner"

export default function HomePage() {
  return (
    <>
      <ComplianceBanner />
      <HeroSection />
      <TrustBar />
      <ScoutCurateSplit />
      <HowItWorks />
      <InstallCTA />
    </>
  )
}
