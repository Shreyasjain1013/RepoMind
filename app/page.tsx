import { DependencyMap } from '@/components/dependency-map'
import { FeatureStrip } from '@/components/feature-strip'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Investigation } from '@/components/investigation'
import { RepoProvider } from '@/components/repo-provider'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Workbench } from '@/components/workbench'

export default function Home() {
  return (
    <RepoProvider>
      <SiteHeader />
      <main>
        <Hero />
        <FeatureStrip />
        <Investigation />
        <Workbench />
        <DependencyMap />
        <HowItWorks />
      </main>
      <SiteFooter />
    </RepoProvider>
  )
}
