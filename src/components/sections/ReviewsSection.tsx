import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// Import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useRef } from 'react';

interface Review {
    author: string;
    company: string;
    text: string;
    rating: number;
    position: string;
    photo: string;
}

const reviews: Review[] = [
    {
        author: "Анна Смирнова",
        company: "Coffee Story",
        position: "Основатель сети кофеен",
        text: "Благодаря GeoAnalitica мы открыли три успешные точки в Москве. Аналитика помогла найти места с высоким трафиком.",
        rating: 5,
        photo: "/src/assets/images/photos/review1.jpg"
    },
    {
        author: "Михаил Петров",
        company: "FreshMarket",
        position: "Директор по развитию",
        text: "Сервис помог сэкономить более 2 месяцев на поиске локации. Данные оказались точными, поддержка - отличной.",
        rating: 5,
        photo: "/src/assets/images/photos/review2.jpg"
    },
    {
        author: "Елена Козлова",
        company: "Beauty Space",
        position: "Владелец",
        text: "За последний год открыли 2 салона красоты в отличных локациях. Учитывается специфика именно нашей ниши.",
        rating: 5,
        photo: "/src/assets/images/photos/review3.jpg"
    },
    {
        author: "Дмитрий Волков",
        company: "Urban Gym",
        position: "CEO",
        text: "Открыли фитнес-клуб в отличном месте. Данные о проходимости и целевой аудитории полностью подтвердились.",
        rating: 5,
        photo: "/src/assets/images/photos/review4.jpg"
    },
    {
        author: "Ольга Морозова",
        company: "Kids Club",
        position: "Руководитель",
        text: "GeoAnalitica помогла найти идеальное место для детского центра. Особенно ценно, что учитывается демография района.",
        rating: 5,
        photo: "/src/assets/images/photos/review5.jpg"
    }
];

export const ReviewsSection = () => {
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);

    return (
        <section id="reviews" className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Отзывы клиентов
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Истории успеха наших партнеров
                        </p>
                    </motion.div>
                </div>

                <div className="relative px-4">
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        centeredSlides={false}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            bulletActiveClass: 'bg-red-500 !opacity-100',
                            bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mx-1.5 transition-all duration-300 cursor-pointer opacity-60',
                        }}
                        navigation={{
                            prevEl: navigationPrevRef.current,
                            nextEl: navigationNextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            // @ts-ignore
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            // @ts-ignore
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                        className="!pb-8"
                    >
                    {reviews.map((review, index) => (
                            <SwiperSlide key={index} className="h-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col mx-3"
                        >
                            {/* Quote icon */}
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm mb-3">
                                        <Quote className="w-3 h-3 text-white" />
                            </div>

                            {/* Rating */}
                                    <div className="flex mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                                className="w-4 h-4 text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>

                            {/* Review text */}
                                    <div className="flex-grow mb-4">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                "{review.text}"
                            </p>
                                    </div>

                                    {/* Author info with photo */}
                                    <div className="flex items-center space-x-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500/20 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                                                {review.photo ? (
                                                    <img
                                                        src={review.photo}
                                                        alt={review.author}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            target.parentElement!.innerHTML = review.author
                                                                .split(' ')
                                                                .map(n => n[0])
                                                                .join('')
                                                                .toUpperCase();
                                                            target.parentElement!.className += ' text-red-500 text-sm font-medium';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-red-500 text-xs font-medium">
                                                        {review.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                        {review.author}
                                    </h4>
                                            <p className="text-red-500 font-medium text-xs truncate">
                                        {review.company}
                                    </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {review.position}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                            </SwiperSlide>
                    ))}
                    </Swiper>

                    {/* Navigation buttons - moved below and centered */}
                    <div className="flex justify-center items-center gap-8 mt-12">
                        <button
                            ref={navigationPrevRef}
                            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow flex items-center justify-center"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                            ref={navigationNextRef}
                            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow flex items-center justify-center"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}; 