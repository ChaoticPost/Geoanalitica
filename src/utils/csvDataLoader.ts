import type { Transaction } from './transactionDataLoader';

// Функция для парсинга CSV строки
const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
};

// Функция для загрузки CSV данных
export const loadCSVData = async (csvContent: string): Promise<Transaction[]> => {
    try {
        const lines = csvContent.trim().split('\n');
        const headers = parseCSVLine(lines[0]);
        const transactions: Transaction[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= 5) {
                const transaction: Transaction = {
                    transaction_id: parseInt(values[0]) || 0,
                    terminal_id: values[1] || '',
                    category: values[2] || '',
                    amount: parseFloat(values[3]) || 0,
                    timestamp: values[4] || ''
                };
                transactions.push(transaction);
            }
        }

        console.log(`Loaded ${transactions.length} transactions from CSV`);
        return transactions;
    } catch (error) {
        console.error('Error parsing CSV data:', error);
        return [];
    }
};

// Функция для загрузки CSV из файла (для демонстрации)
export const loadCSVFromFile = async (filePath: string): Promise<Transaction[]> => {
    try {
        // В реальном приложении здесь будет fetch к файлу
        // Для демонстрации используем моковые данные
        const mockCSV = `transaction_id,terminal_id,category,amount,timestamp
1,K0IOLA40,продукты,20528.967290,2024-10-13 12:22:54.318482
2,N9PK2K829,одежда,13331.025399,2023-12-02 12:47:09.088676
3,F8AN9PK2,одежда,24956.948767,2023-11-28 13:44:03.938906
4,BAKS8JK3LK,одежда,13108.640221,2024-01-23 12:28:20.548932
5,N9PPK29S,услуги,18557.608829,2025-02-09 08:25:44.168324
6,K2L9M4N5,продукты,32000.000000,2024-11-15 14:30:00.000000
7,P7Q8R9S0,одежда,45000.000000,2024-11-16 09:15:00.000000
8,T1U2V3W4,услуги,28000.000000,2024-11-17 16:45:00.000000
9,X5Y6Z7A8,продукты,15000.000000,2024-11-18 11:20:00.000000
10,B9C0D1E2,одежда,35000.000000,2024-11-19 13:10:00.000000
11,F3G4H5I6,продукты,18000.000000,2024-11-20 10:30:00.000000
12,J7K8L9M0,одежда,22000.000000,2024-11-21 15:45:00.000000
13,N1O2P3Q4,услуги,25000.000000,2024-11-22 12:00:00.000000
14,R5S6T7U8,продукты,12000.000000,2024-11-23 08:15:00.000000
15,V9W0X1Y2,одежда,38000.000000,2024-11-24 17:30:00.000000
16,Z3A4B5C6,услуги,30000.000000,2024-11-25 14:20:00.000000
17,D7E8F9G0,продукты,16000.000000,2024-11-26 09:45:00.000000
18,H1I2J3K4,одежда,42000.000000,2024-11-27 16:10:00.000000
19,L5M6N7O8,услуги,27000.000000,2024-11-28 11:35:00.000000
20,P9Q0R1S2,продукты,14000.000000,2024-11-29 13:50:00.000000`;

        return await loadCSVData(mockCSV);
    } catch (error) {
        console.error('Error loading CSV file:', error);
        return [];
    }
};

// Функция для загрузки данных из Hugging Face датасета
export const loadHuggingFaceData = async (): Promise<Transaction[]> => {
    try {
        // В реальном приложении здесь будет API вызов к Hugging Face
        // Для демонстрации используем моковые данные
        console.log('Loading data from Hugging Face dataset...');

        // Симуляция загрузки большого количества данных
        const transactions: Transaction[] = [];
        const terminalIds = ['K0IOLA40', 'N9PK2K829', 'F8AN9PK2', 'BAKS8JK3LK', 'N9PPK29S',
            'K2L9M4N5', 'P7Q8R9S0', 'T1U2V3W4', 'X5Y6Z7A8', 'B9C0D1E2',
            'F3G4H5I6', 'J7K8L9M0', 'N1O2P3Q4', 'R5S6T7U8', 'V9W0X1Y2',
            'Z3A4B5C6', 'D7E8F9G0', 'H1I2J3K4', 'L5M6N7O8', 'P9Q0R1S2'];
        const categories = ['продукты', 'одежда', 'услуги'];

        // Генерируем 1000 транзакций для демонстрации
        for (let i = 1; i <= 1000; i++) {
            const terminalId = terminalIds[Math.floor(Math.random() * terminalIds.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const amount = Math.random() * 50000 + 5000; // Сумма от 5000 до 55000

            transactions.push({
                transaction_id: i,
                terminal_id: terminalId,
                category,
                amount: Math.round(amount * 100) / 100,
                timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
            });
        }

        console.log(`Generated ${transactions.length} transactions for demonstration`);
        return transactions;
    } catch (error) {
        console.error('Error loading Hugging Face data:', error);
        return [];
    }
}; 