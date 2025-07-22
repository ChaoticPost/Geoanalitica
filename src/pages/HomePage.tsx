import { HeroSection } from '@/components/sections/HeroSection'
import { PromoSection } from '@/components/sections/PromoSection'
import { LocationAnalytics } from '@/components/sections/LocationAnalytics'
import { PricingSection } from '@/components/sections/PricingSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { DemoSection } from '@/components/sections/DemoSection'
import { ContactSection } from '@/components/sections/ContactSection'

const HomePage = () => {
    return (
        <main>
            <HeroSection />
            <PromoSection />
            <LocationAnalytics />
            <PricingSection />
            <AboutSection />
            <DemoSection />
            <ContactSection />
        </main>
    )
}

export default HomePage 