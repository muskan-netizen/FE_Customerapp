import LocalizedStrings from 'react-native-localization';
import DeviceInfo, {getBundleId} from 'react-native-device-info';
import en from './en';
import ar from './ar';
import es from './es';
import de from './de';
import fr from './fr';
import tr from './tr';
import sv from './sv';
import zh from './zh';
import ru from './ru';
import pt from './pt';
import vi from './vi';
import hi from './hi';
import ne from './ne';
import it from './it';
import fa from './fa';


import es_elcheragio from './es_elcheragio';
import es_heybuddy from './es_heybuddy';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import es_sabroson from './es_sabroson';
import ar_baytukom from './ar_baytukom';


//Spanish fils

const spanishfile = () => {
  switch (DeviceInfo.getBundleId()) {
    case appIds?.elcheregio:
      return es_elcheragio;
      case appIds?.heyBuddy:
        return es_heybuddy;
      case appIds?.sabroson:
        return es_sabroson;
    default:
      return es;
  }
};

const arbicFile = ()=>{
  switch (DeviceInfo.getBundleId()) {
    case appIds?.baytukom:
       return ar_baytukom
    default:
      return ar;
  }
}

let strings = new LocalizedStrings({
  en: en,
  ar: arbicFile(),
  es: spanishfile(),
  de: de,
  fr: fr,
  tr: tr,
  sv: sv,
  zh: zh,
  ru: ru,
  pt: pt,
  vi: vi,
  hi: hi,
  ne:ne,
  it:it,
  fa:fa,

});
export const changeLaguage = (languageKey) => {
  strings.setLanguage(languageKey);
};
export default strings;
