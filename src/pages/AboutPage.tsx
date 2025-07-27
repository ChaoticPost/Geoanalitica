import { type ReactElement } from 'react';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { RecommendationsGrid } from '@/components/sections/RecommendationsGrid';
import { PromoSection } from '@/components/sections/PromoSection';

export const AboutPage = (): ReactElement => {
    return (
        <>
            <section className="py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                                О компании GeoAnalitica
                            </h1>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Мы помогаем бизнесу принимать правильные решения о развитии и размещении объектов с помощью передовых технологий геоаналитики
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PromoSection />

            <section className="py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter">
                                Наша миссия
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Предоставить бизнесу инструменты для принятия обоснованных решений о развитии и размещении объектов на основе актуальных данных и передовых технологий анализа
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter">
                                Наши ценности
                            </h2>
                            <ul className="grid gap-2">
                                <li className="flex items-center gap-2">
                                    <span className="font-medium">Инновации</span> - Постоянно развиваем технологии анализа
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="font-medium">Точность</span> - Используем только проверенные данные
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="font-medium">Эффективность</span> - Помогаем экономить время и ресурсы
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <RecommendationsGrid />
            <ReviewsSection />
        </>
    );
}; 