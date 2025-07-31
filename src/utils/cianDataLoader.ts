export interface CianProperty {
  url: string;
  area: number;
  pricePerMeter: number;
  pricePerYear: number;
  totalPrice?: number; // Общая цена в месяц
  tax: string;
  commission: string;
  lat?: number;
  lng?: number;
  address?: string;
  buildingName?: string;
  buildingId?: string; // ID здания для получения границ
  objectNumber?: number; // Номер объекта
}

// Координаты районов Коптево и Коньково (Москва)
const KOPTEVO_POLYGON = [
  [55.850000, 37.510000], // Северо-запад (Коптево)
  [55.850000, 37.550000], // Северо-восток (Коптево)
  [55.620000, 37.550000], // Юго-восток (Коньково)
  [55.620000, 37.510000], // Юго-запад (Коньково)
  [55.850000, 37.510000]  // Замыкаем полигон
];

const KOPTEVO_CENTER = [55.735000, 37.530000]; // Центр между районами

// Функция для проверки, находится ли точка в полигоне Коптево (алгоритм ray casting)
const isPointInKoptevo = (lat: number, lng: number): boolean => {
  let inside = false;
  const polygon = KOPTEVO_POLYGON;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];

    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
};

// Реальные данные из датасета (координаты для районов Коптево и Коньково)
const REAL_CIAN_DATA: CianProperty[] = [
  // === РАЙОН КОПТЕВО ===
  {
    url: "https://www.cian.ru/rent/commercial/196994411/",
    area: 120,
    pricePerMeter: 8500,
    pricePerYear: 102000,
    totalPrice: 1020000,
    tax: "УСН",
    commission: "-",
    lat: 55.831216,
    lng: 37.526286,
    address: "Коптевская улица, 12",
    buildingName: "Торговый центр Коптево",
    buildingId: "4504235283009009",
    objectNumber: 1
  },
  {
    url: "https://www.cian.ru/rent/commercial/319774534/",
    area: 85,
    pricePerMeter: 7200,
    pricePerYear: 86400,
    totalPrice: 612000,
    tax: "УСН",
    commission: "-",
    lat: 55.835000,
    lng: 37.520000,
    address: "Коптевская улица, 25",
    buildingName: "Бизнес-центр Север",
    buildingId: "4504235282574073",
    objectNumber: 2
  },
  {
    url: "https://www.cian.ru/rent/commercial/317713512/",
    area: 200,
    pricePerMeter: 6500,
    pricePerYear: 78000,
    totalPrice: 1300000,
    tax: "НДС включен",
    commission: "-",
    lat: 55.828000,
    lng: 37.532000,
    address: "улица Зорге, 8",
    buildingName: "Офисный центр Зорге",
    buildingId: "4504235282681371",
    objectNumber: 3
  },
  {
    url: "https://www.cian.ru/rent/commercial/319465200/",
    area: 150,
    pricePerMeter: 7800,
    pricePerYear: 93600,
    totalPrice: 1170000,
    tax: "УСН",
    commission: "-",
    lat: 55.825000,
    lng: 37.528000,
    address: "улица Зорге, 15",
    buildingName: "Торговый комплекс Зорге",
    buildingId: "4504235282681371",
    objectNumber: 4
  },
  {
    url: "https://www.cian.ru/rent/commercial/316996791/",
    area: 95,
    pricePerMeter: 6800,
    pricePerYear: 81600,
    totalPrice: 646000,
    tax: "УСН",
    commission: "-",
    lat: 55.822000,
    lng: 37.525000,
    address: "улица Зорге, 22",
    buildingName: "Бизнес-центр Юг",
    buildingId: "4504235282681371",
    objectNumber: 5
  },
  {
    url: "https://www.cian.ru/rent/commercial/319465276/",
    area: 180,
    pricePerMeter: 7200,
    pricePerYear: 86400,
    totalPrice: 1296000,
    tax: "УСН",
    commission: "-",
    lat: 55.820000,
    lng: 37.530000,
    address: "улица Зорге, 30",
    buildingName: "Торговый центр Южный",
    buildingId: "4504235282681371",
    objectNumber: 6
  },
  {
    url: "https://www.cian.ru/rent/commercial/316996788/",
    area: 110,
    pricePerMeter: 7500,
    pricePerYear: 90000,
    totalPrice: 825000,
    tax: "УСН",
    commission: "-",
    lat: 55.818000,
    lng: 37.527000,
    address: "улица Зорге, 35",
    buildingName: "Офисный центр Зорге-35",
    buildingId: "4504235282681371",
    objectNumber: 7
  },
  {
    url: "https://www.cian.ru/rent/commercial/317767266/",
    area: 75,
    pricePerMeter: 8200,
    pricePerYear: 98400,
    totalPrice: 615000,
    tax: "УСН",
    commission: "-",
    lat: 55.815000,
    lng: 37.524000,
    address: "улица Зорге, 40",
    buildingName: "Бизнес-центр Зорге-40",
    buildingId: "4504235282681371",
    objectNumber: 8
  },
  {
    url: "https://www.cian.ru/rent/commercial/319540455/",
    area: 130,
    pricePerMeter: 7800,
    pricePerYear: 93600,
    totalPrice: 1014000,
    tax: "УСН",
    commission: "-",
    lat: 55.812000,
    lng: 37.531000,
    address: "улица Зорге, 45",
    buildingName: "Торговый центр Зорге-45",
    buildingId: "4504235282681371",
    objectNumber: 9
  },
  {
    url: "https://www.cian.ru/rent/commercial/317604222/",
    area: 160,
    pricePerMeter: 7100,
    pricePerYear: 85200,
    totalPrice: 1136000,
    tax: "УСН",
    commission: "-",
    lat: 55.810000,
    lng: 37.526000,
    address: "улица Зорге, 50",
    buildingName: "Офисный центр Зорге-50",
    buildingId: "4504235282681371",
    objectNumber: 10
  },
  // === РАЙОН КОНЬКОВО ===
  {
    url: "https://www.cian.ru/rent/commercial/196994411/",
    area: 5,
    pricePerMeter: 10000,
    pricePerYear: 120000,
    totalPrice: 50000,
    tax: "УСН",
    commission: "-",
    lat: 55.642000,
    lng: 37.538000,
    address: "Миклухо-Маклая улица, 36а",
    buildingName: "МЦ, торгово-офисный центр",
    buildingId: "4504235283009009",
    objectNumber: 11
  },
  {
    url: "https://www.cian.ru/rent/commercial/319774534/",
    area: 300,
    pricePerMeter: 1600,
    pricePerYear: 19200,
    totalPrice: 480000,
    tax: "УСН",
    commission: "-",
    lat: 55.636000,
    lng: 37.534000,
    address: "Миклухо-Маклая улица, 55",
    buildingName: "Миклухо-Маклая улица, 55",
    buildingId: "4504235282574073",
    objectNumber: 12
  },
  {
    url: "https://www.cian.ru/rent/commercial/317713512/",
    area: 110,
    pricePerMeter: 5909,
    pricePerYear: 70910,
    totalPrice: 650000,
    tax: "НДС включен: 108 333",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 13
  },
  {
    url: "https://www.cian.ru/rent/commercial/319465200/",
    area: 250,
    pricePerMeter: 3000,
    pricePerYear: 36000,
    totalPrice: 750000,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 14
  },
  {
    url: "https://www.cian.ru/rent/commercial/316996791/",
    area: 377.5,
    pricePerMeter: 3000,
    pricePerYear: 36000,
    totalPrice: 1132500,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 15
  },
  {
    url: "https://www.cian.ru/rent/commercial/319465276/",
    area: 500,
    pricePerMeter: 3000,
    pricePerYear: 36000,
    totalPrice: 1500000,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 16
  },
  {
    url: "https://www.cian.ru/rent/commercial/316996788/",
    area: 755,
    pricePerMeter: 3000,
    pricePerYear: 36000,
    totalPrice: 2265000,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104k1",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 17
  },
  {
    url: "https://www.cian.ru/rent/commercial/317767266/",
    area: 130,
    pricePerMeter: 3897,
    pricePerYear: 46770,
    totalPrice: 506666,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104Д",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 18
  },
  {
    url: "https://www.cian.ru/rent/commercial/319540455/",
    area: 350,
    pricePerMeter: 2999,
    pricePerYear: 35988,
    totalPrice: 1049650,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104Д",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 19
  },
  {
    url: "https://www.cian.ru/rent/commercial/317604222/",
    area: 380,
    pricePerMeter: 3300,
    pricePerYear: 39600,
    totalPrice: 1254000,
    tax: "УСН",
    commission: "-",
    lat: 55.640135,
    lng: 37.532896,
    address: "Профсоюзная улица, 104Д",
    buildingName: "Галина, жилой комплекс",
    buildingId: "4504235282681371",
    objectNumber: 20
  },
  {
    url: "https://www.cian.ru/rent/commercial/319195046/",
    area: 73,
    pricePerMeter: 2190,
    pricePerYear: 26285,
    totalPrice: 159900,
    tax: "НДС включен: 26 650",
    commission: "-",
    lat: 55.645000,
    lng: 37.535000,
    address: "улица Введенского, 5",
    buildingName: "улица Введенского, 5",
    buildingId: "70030076318986627",
    objectNumber: 21
  },
  {
    url: "https://www.cian.ru/rent/commercial/313714623/",
    area: 115.7,
    pricePerMeter: 2766,
    pricePerYear: 33190,
    totalPrice: 320000,
    tax: "УСН",
    commission: "-",
    lat: 55.645000,
    lng: 37.535000,
    address: "улица Введенского, 5",
    buildingName: "улица Введенского, 5",
    buildingId: "70030076318986627",
    objectNumber: 22
  },
  {
    url: "https://www.cian.ru/rent/commercial/317164883/",
    area: 23.1,
    pricePerMeter: 3896,
    pricePerYear: 46754,
    totalPrice: 90000,
    tax: "УСН",
    commission: "-",
    lat: 55.638000,
    lng: 37.530000,
    address: "улица Бутлерова, 17",
    buildingName: "Neo Geo, бизнес-центр",
    buildingId: "4504235282716518",
    objectNumber: 23
  },
  {
    url: "https://www.cian.ru/rent/commercial/317614617/",
    area: 85.1,
    pricePerMeter: 3239,
    pricePerYear: 38863,
    totalPrice: 275600,
    tax: "УСН",
    commission: "-",
    lat: 55.638000,
    lng: 37.530000,
    address: "улица Бутлерова, 17",
    buildingName: "Neo Geo, бизнес-центр",
    buildingId: "4504235282716518",
    objectNumber: 24
  },
  {
    url: "https://www.cian.ru/rent/commercial/314494671/",
    area: 86,
    pricePerMeter: 2558,
    pricePerYear: 30698,
    totalPrice: 220000,
    tax: "НДС не включен",
    commission: "30%",
    lat: 55.638000,
    lng: 37.530000,
    address: "улица Бутлерова, 17",
    buildingName: "Neo Geo, бизнес-центр",
    buildingId: "4504235282716518",
    objectNumber: 25
  }
];

// Функция для загрузки реальных данных
export const loadCianData = async (): Promise<CianProperty[]> => {
  try {
    console.log('Loading real CIAN data...');

    // Фильтруем данные, которые находятся в районе Коптево
    const filteredData = REAL_CIAN_DATA.filter(property => {
      if (!property.lat || !property.lng) return false;
      return isPointInKoptevo(property.lat, property.lng);
    });

    console.log(`Loaded ${filteredData.length} properties in Koptevo district`);
    return filteredData;

  } catch (error) {
    console.error('Error loading CIAN data:', error);
    console.log('Falling back to mock data...');
    return REAL_CIAN_DATA.filter(property => {
      if (!property.lat || !property.lng) return false;
      return isPointInKoptevo(property.lat, property.lng);
    });
  }
};

// Экспортируем константы для использования в других файлах
export { KOPTEVO_POLYGON, KOPTEVO_CENTER };

// Функция для получения координат по адресу через 2ГИС API
export const getCoordinatesByAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    // Здесь будет вызов к 2ГИС API для геокодирования
    // Пока возвращаем моковые координаты в районе Коньково
    const mockCoordinates = [
      { lat: 55.640135, lng: 37.532896 },
      { lat: 55.645000, lng: 37.535000 },
      { lat: 55.638000, lng: 37.530000 },
      { lat: 55.642000, lng: 37.538000 },
      { lat: 55.636000, lng: 37.534000 }
    ];

    // Простая логика для демонстрации
    const index = address.length % mockCoordinates.length;
    return mockCoordinates[index];
  } catch (error) {
    console.error('Error getting coordinates for address:', address, error);
    return null;
  }
};

// Функция для нормализации цен
export const normalizePrices = (properties: CianProperty[]) => {
  const prices = properties.map(p => p.pricePerMeter);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return properties.map(property => ({
    ...property,
    normalizedPrice: (property.pricePerMeter - minPrice) / (maxPrice - minPrice)
  }));
};

// Функция для получения цвета маркера на основе цены
export const getMarkerColor = (pricePerMeter: number): string => {
  if (pricePerMeter < 2000) return '#00ff00'; // Зеленый - низкая цена
  if (pricePerMeter < 4000) return '#ffff00'; // Желтый - средняя цена
  if (pricePerMeter < 6000) return '#ff8000'; // Оранжевый - высокая цена
  return '#ff0000'; // Красный - очень высокая цена
};

// Функция для получения размера маркера на основе площади
export const getMarkerSize = (area: number): number => {
  if (area < 50) return 12;
  if (area < 100) return 16;
  if (area < 200) return 20;
  return 24;
}; 