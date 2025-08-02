import { Button } from '../ui/Button';
import { CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Subscription {
    plan: string;
    price: string;
    nextPayment: string;
}

interface SubscriptionInfoProps {
    subscription: Subscription;
    onChangePlan: () => void;
}

const features = [
    'Неограниченное количество локаций',
    'Расширенная аналитика',
    'Экспорт в PDF и Excel',
    'Приоритетная поддержка',
];

export const SubscriptionInfo = ({ subscription, onChangePlan }: SubscriptionInfoProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="bg-card rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Текущий тариф</h2>
                        <div className="flex items-center mt-2 space-x-2">
                            <CreditCard className="text-primary" size={20} />
                            <p className="text-xl text-primary font-semibold">{subscription.plan}</p>
                        </div>
                        <p className="text-2xl font-bold mt-4">{subscription.price}</p>
                    </div>
                    <Button
                        onClick={onChangePlan}
                        className="group"
                    >
                        Сменить тариф
                        <ChevronRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                <div className="border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                        Обновление тарифа: {subscription.nextPayment}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center space-x-2 text-sm text-foreground"
                            >
                                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                                <span>{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}; 