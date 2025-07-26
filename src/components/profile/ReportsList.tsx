import { Button } from '../ui/Button';
import { Download, FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    id: number;
    name: string;
    date: string;
    size: string;
}

interface ReportsListProps {
    reports: Report[];
    onGenerate: () => void;
    onDownload: (id: number) => void;
}

export const ReportsList = ({ reports, onGenerate, onDownload }: ReportsListProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Отчёты</h2>
                <Button onClick={onGenerate} className="group">
                    <Plus size={16} className="mr-2 transition-transform group-hover:scale-125" />
                    Сгенерировать отчёт
                </Button>
            </div>
            <div className="space-y-4">
                <AnimatePresence>
                    {reports.map(report => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-card hover:shadow-lg dark:hover:shadow-primary/5 rounded-lg p-4 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-foreground font-medium">{report.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {report.date} • {report.size}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDownload(report.id)}
                                    className="hover:bg-primary hover:text-white transition-colors group"
                                >
                                    <Download size={16} className="mr-2 transition-transform group-hover:translate-y-0.5" />
                                    Скачать
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {reports.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground"
                    >
                        <FileText size={40} className="mx-auto mb-4 text-muted-foreground/50" />
                        <p>У вас пока нет сгенерированных отчётов</p>
                        <Button
                            variant="outline"
                            onClick={onGenerate}
                            className="mt-4"
                        >
                            Создать первый отчёт
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}; 