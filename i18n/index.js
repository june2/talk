import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './en';
import ko from './ko';

const locale = Localization.locale;

i18n.fallbacks = true;
i18n.translations = { ko, en };
i18n.locale = (locale.includes('KR') ? 'ko' : 'en');

export default i18n;