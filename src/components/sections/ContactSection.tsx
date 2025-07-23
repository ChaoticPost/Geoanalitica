import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export const ContactSection = () => {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // TODO: Implement form submission
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Сообщение отправлено!')
        } catch (error) {
            toast.error('Произошла ошибка при отправке')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Свяжитесь с нами
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-300 mb-8">
                            У вас есть вопросы? Мы готовы помочь!
                        </p>
                    </motion.div>

                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Input
                                type="text"
                                label="Имя"
                                placeholder="Иван Иванов"
                                required
                            />
                            <Input
                                type="email"
                                label="Email"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Сообщение
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Ваше сообщение..."
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            isLoading={isLoading}
                        >
                            Отправить сообщение
                        </Button>
                    </motion.form>
                </div>
            </div>
        </section>
    )
} 