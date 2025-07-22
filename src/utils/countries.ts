export interface Country {
    code: string;
    flag: string;
    phoneCode: string;
    name: string;
}

export const countries: Country[] = [
    { code: 'ru', flag: 'fi fi-ru', phoneCode: '+7', name: 'Россия' },
    { code: 'kz', flag: 'fi fi-kz', phoneCode: '+7', name: 'Казахстан' },
    { code: 'by', flag: 'fi fi-by', phoneCode: '+375', name: 'Беларусь' },
    { code: 'ua', flag: 'fi fi-ua', phoneCode: '+380', name: 'Украина' },
    { code: 'us', flag: 'fi fi-us', phoneCode: '+1', name: 'США' },
    { code: 'gb', flag: 'fi fi-gb', phoneCode: '+44', name: 'Великобритания' },
    { code: 'de', flag: 'fi fi-de', phoneCode: '+49', name: 'Германия' },
    { code: 'fr', flag: 'fi fi-fr', phoneCode: '+33', name: 'Франция' },
    { code: 'cn', flag: 'fi fi-cn', phoneCode: '+86', name: 'Китай' },
    { code: 'jp', flag: 'fi fi-jp', phoneCode: '+81', name: 'Япония' },
]; 