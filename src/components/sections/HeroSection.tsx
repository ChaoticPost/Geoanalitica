import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { MapPin } from 'lucide-react'

export const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <motion.div
                            className="sm:text-center lg:text-left"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                <span className="block">Геоаналитика для</span>{' '}
                                <span className="block text-red-600">вашего бизнеса</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Принимайте решения на основе данных. Анализируйте локации, конкурентов и целевую аудиторию с помощью передовых технологий геоаналитики.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Начать бесплатно
                                    </Button>
                                </motion.div>
                                <motion.div
                                    className="mt-3 sm:mt-0 sm:ml-3"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Демо анализ
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
            <motion.div
                className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                    src="/hero-image.jpg"
                    alt="Геоаналитика в действии"
                />
            </motion.div>
        </section>
    )
} 