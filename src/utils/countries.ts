export interface Country {
  name: string;
  code: string;
  phoneCode: string;
}

export const countries: Country[] = [
  { name: 'Россия', code: 'RU', phoneCode: '+7' },
  { name: 'Казахстан', code: 'KZ', phoneCode: '+7' },
  { name: 'Беларусь', code: 'BY', phoneCode: '+375' },
  { name: 'Армения', code: 'AM', phoneCode: '+374' },
  { name: 'Азербайджан', code: 'AZ', phoneCode: '+994' },
  { name: 'Грузия', code: 'GE', phoneCode: '+995' },
  { name: 'Киргизия', code: 'KG', phoneCode: '+996' },
  { name: 'Таджикистан', code: 'TJ', phoneCode: '+992' },
  { name: 'Туркменистан', code: 'TM', phoneCode: '+993' },
  { name: 'Узбекистан', code: 'UZ', phoneCode: '+998' },
  { name: 'Украина', code: 'UA', phoneCode: '+380' },
  { name: 'Молдова', code: 'MD', phoneCode: '+373' },
  { name: 'Латвия', code: 'LV', phoneCode: '+371' },
  { name: 'Литва', code: 'LT', phoneCode: '+370' },
  { name: 'Эстония', code: 'EE', phoneCode: '+372' }
]; 