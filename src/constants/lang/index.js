import LocalizedStrings from 'react-native-localization';
import en from './en';
import ar from './ar';
import es from './es';
import de from './de';

let strings = new LocalizedStrings({
  en: en,
  ar: ar,
  es: es,
  de: de,
});
export const changeLaguage = (languageKey) => {
  strings.setLanguage(languageKey);
};
export default strings;
