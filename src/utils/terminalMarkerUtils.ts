import type { TerminalLocation } from './transactionDataLoader';
import { getTransactionMarkerColor, getTransactionMarkerSize } from './transactionDataLoader';

export interface TerminalMarker {
    marker: any;
    terminal: TerminalLocation;
    destroy: () => void;
}

// Функция для создания маркеров терминалов
export const createTerminalMarkers = (
    map: any,
    terminals: TerminalLocation[],
    onTerminalClick?: (terminal: TerminalLocation) => void
): TerminalMarker[] => {
    const markers: TerminalMarker[] = [];

    terminals.forEach(terminal => {
        try {
            // Создаем маркер терминала
            const marker = (window as any).DG.marker([terminal.lat, terminal.lng], {
                icon: createTerminalIcon(terminal),
                title: `Терминал ${terminal.terminal_id}`
            });

            // Добавляем всплывающую подсказку
            const popup = (window as any).DG.popup({
                maxWidth: 300,
                className: 'terminal-popup'
            }).setContent(createTerminalPopupContent(terminal));

            marker.bindPopup(popup);

            // Добавляем обработчик клика
            if (onTerminalClick) {
                marker.on('click', () => {
                    onTerminalClick(terminal);
                });
            }

            // Добавляем маркер на карту
            marker.addTo(map);

            markers.push({
                marker,
                terminal,
                destroy: () => {
                    marker.remove();
                }
            });

        } catch (error) {
            console.error('Error creating terminal marker:', error);
        }
    });

    return markers;
};

// Функция для создания иконки терминала
const createTerminalIcon = (terminal: TerminalLocation) => {
    const color = getTransactionMarkerColor(terminal.totalAmount);
    const size = getTransactionMarkerSize(terminal.transactionCount);

    return (window as any).DG.divIcon({
        html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width: ${size * 0.6}px;
          height: ${size * 0.6}px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${Math.max(8, size * 0.3)}px;
          font-weight: bold;
          color: #333;
        ">
          ₽
        </div>
      </div>
    `,
        className: 'terminal-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

// Функция для создания содержимого всплывающей подсказки
const createTerminalPopupContent = (terminal: TerminalLocation) => {
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return `
    <div style="font-family: Arial, sans-serif; min-width: 250px;">
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px;
        margin: -12px -12px 12px -12px;
        border-radius: 8px 8px 0 0;
        font-weight: bold;
        font-size: 14px;
      ">
        💳 Терминал ${terminal.terminal_id}
      </div>
      
      <div style="margin-bottom: 8px;">
        <strong>📍 Адрес:</strong><br>
        <span style="color: #666;">${terminal.address}</span>
      </div>
      
      <div style="margin-bottom: 8px;">
        <strong>🏷️ Категории:</strong><br>
        <span style="color: #666;">${terminal.category}</span>
      </div>
      
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 12px;
      ">
        <div style="
          background: #f8f9fa;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
        ">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Общая сумма</div>
          <div style="font-weight: bold; color: #28a745; font-size: 14px;">
            ${formatAmount(terminal.totalAmount)}
          </div>
        </div>
        
        <div style="
          background: #f8f9fa;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
        ">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Количество транзакций</div>
          <div style="font-weight: bold; color: #007bff; font-size: 14px;">
            ${terminal.transactionCount}
          </div>
        </div>
        
        <div style="
          background: #f8f9fa;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
          grid-column: 1 / -1;
        ">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Средняя сумма</div>
          <div style="font-weight: bold; color: #ffc107; font-size: 14px;">
            ${formatAmount(terminal.averageAmount)}
          </div>
        </div>
      </div>
    </div>
  `;
};

// Функция для обновления маркеров терминалов
export const updateTerminalMarkers = (
    markers: TerminalMarker[],
    terminals: TerminalLocation[]
) => {
    // Удаляем старые маркеры
    markers.forEach(marker => marker.destroy());

    // Создаем новые маркеры (если есть доступ к карте)
    // В реальном приложении нужно передать map как параметр
    return [];
};

// Функция для фильтрации маркеров по категории
export const filterTerminalMarkers = (
    markers: TerminalMarker[],
    category: string
): TerminalMarker[] => {
    if (!category || category === 'Все') return markers;

    return markers.filter(marker =>
        marker.terminal.category.toLowerCase().includes(category.toLowerCase())
    );
}; 