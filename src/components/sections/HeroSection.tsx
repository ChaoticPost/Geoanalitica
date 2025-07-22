import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const HeroSection = () => {
    return (
        <section className="relative py-20 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4"
            >
                <div className="max-w-3xl">
                    <h1 className="text-5xl font-bold mb-6">
                        Геоаналитика для вашего бизнеса
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Принимайте решения на основе данных о локациях, конкурентах и целевой аудитории
                    </p>
                    <Button size="lg">
                        Начать работу
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </motion.div>
        </section>
    )
} 