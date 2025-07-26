import { Button } from '../ui/Button';
import { Trash2, Plus, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Location {
    id: number;
    address: string;
    createdAt: string;
}

interface LocationsListProps {
    locations: Location[];
    onAdd: () => void;
    onOpen: (id: number) => void;
    onDelete: (id: number) => void;
}

export const LocationsList = ({ locations, onAdd, onOpen, onDelete }: LocationsListProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Мои объекты</h2>
                <Button onClick={onAdd} className="group">
                    <Plus size={16} className="mr-2 transition-transform group-hover:scale-125" />
                    Добавить локацию
                </Button>
            </div>
            <div className="space-y-4">
                <AnimatePresence>
                    {locations.map(location => (
                        <motion.div
                            key={location.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-card hover:shadow-lg dark:hover:shadow-primary/5 rounded-lg p-4 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <MapPin size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-foreground font-medium">{location.address}</p>
                                        <p className="text-sm text-muted-foreground">{location.createdAt}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => onOpen(location.id)}
                                        className="hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Открыть
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => onDelete(location.id)}
                                        className="hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {locations.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground"
                    >
                        <MapPin size={40} className="mx-auto mb-4 text-muted-foreground/50" />
                        <p>У вас пока нет сохранённых локаций</p>
                        <Button 
                            variant="outline" 
                            onClick={onAdd} 
                            className="mt-4"
                        >
                            Добавить первую локацию
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}; 