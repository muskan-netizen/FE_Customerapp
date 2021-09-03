import LocalizedStrings from 'react-native-localization';
import en from './en';
import ar from './ar';
import es from './es';
import de from './de';
import fr from './fr';
import tr from './tr';

let strings = new LocalizedStrings({
  en: en,
  ar: ar,
  es: es,
  de: de,
  fr: fr,
  tr: tr,
});
export const changeLaguage = (languageKey) => {
  strings.setLanguage(languageKey);
};
export default strings;
