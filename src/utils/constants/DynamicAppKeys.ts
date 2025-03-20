import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';

const shortCodes = {
  ace: '2d98b5',
  
};

const appIds = {
  ace: Platform.select({
    ios: 'com.customer.ace',
    android: 'com.customer.ace',
  }),
 
};

const socialKeys = {
  TWITTER_COMSUMER_KEY:
    'R66DHARfuoYAPowApUxNxwbPi',
  TWITTER_CONSUMER_SECRET:
    'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15',
};

export { appIds, socialKeys, shortCodes };
