import { Suspense, lazy } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load components with named exports
const HeroSection = lazy(() =>
    import('@/components/sections/HeroSection').then(module => ({ default: module.HeroSection }))
);
const PromoSection = lazy(() =>
    import('@/components/sections/PromoSection').then(module => ({ default: module.PromoSection }))
);
const LocationAnalytics = lazy(() =>
    import('@/components/sections/LocationAnalytics').then(module => ({ default: module.LocationAnalytics }))
);
const PricingSection = lazy(() =>
    import('@/components/sections/PricingSection').then(module => ({ default: module.PricingSection }))
);
const AboutSection = lazy(() =>
    import('@/components/sections/AboutSection').then(module => ({ default: module.AboutSection }))
);
const DemoSection = lazy(() =>
    import('@/components/sections/DemoSection').then(module => ({ default: module.DemoSection }))
);
const FAQSection = lazy(() =>
    import('@/components/sections/FAQSection').then(module => ({ default: module.FAQSection }))
);
const ContactSection = lazy(() =>
    import('@/components/sections/ContactSection').then(module => ({ default: module.ContactSection }))
);

const LoadingFallback = ({ name }: { name: string }) => (
    <div className="p-4 text-center">
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Loading {name}...</p>
        </div>
    </div>
);

const HomePage = () => {
    return (
        <div className="relative">
            <ErrorBoundary>
                <Suspense fallback={<LoadingFallback name="HeroSection" />}>
                    <HeroSection />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="PromoSection" />}>
                    <PromoSection />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="LocationAnalytics" />}>
                    <LocationAnalytics />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="PricingSection" />}>
                    <PricingSection />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="AboutSection" />}>
                    <AboutSection />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="DemoSection" />}>
                    <DemoSection />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="FAQSection" />}>
                    <FAQSection />
                </Suspense>

                <Suspense fallback={<LoadingFallback name="ContactSection" />}>
                    <ContactSection />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

export default HomePage; 