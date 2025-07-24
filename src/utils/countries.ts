export interface Country {
    code: string;
    name: string;
    phoneCode: string;
}

export const countries: Country[] = [
    { code: 'RU', name: 'Россия', phoneCode: '+7' },
    { code: 'KZ', name: 'Казахстан', phoneCode: '+7' },
    { code: 'BY', name: 'Беларусь', phoneCode: '+375' },
    { code: 'UA', name: 'Украина', phoneCode: '+380' },
    { code: 'UZ', name: 'Узбекистан', phoneCode: '+998' },
    { code: 'KG', name: 'Киргизия', phoneCode: '+996' },
    { code: 'TJ', name: 'Таджикистан', phoneCode: '+992' },
    { code: 'TM', name: 'Туркменистан', phoneCode: '+993' },
    { code: 'AZ', name: 'Азербайджан', phoneCode: '+994' },
    { code: 'AM', name: 'Армения', phoneCode: '+374' },
    { code: 'GE', name: 'Грузия', phoneCode: '+995' },
    { code: 'MD', name: 'Молдова', phoneCode: '+373' },
]; 