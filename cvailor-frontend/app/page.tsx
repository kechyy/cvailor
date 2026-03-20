import HomeNav from '@/components/home/HomeNav'
import Hero from '@/components/home/Hero'
import StepsShowcase from '@/components/home/StepsShowcase'
import Footer from '@/components/home/Footer'
import FlowInit from '@/components/home/FlowInit'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F6FA]">
      <HomeNav />
      <FlowInit />
      <Hero />
      <StepsShowcase />
      <Footer />
    </main>
  )
}
