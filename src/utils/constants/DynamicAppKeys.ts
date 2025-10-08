import { Platform } from 'react-native';

const shortCodes = {
  gusto: 'd1b1a0',
  gokab: 'fb78f0',
  grub: '2f3120',
  ace: '2d98b5',
};

const appIds = {
  ace: Platform.select({
    ios: 'com.customer.ace',
    android: 'com.customer.ace',
  }),
  gusto: Platform.select({
    ios: 'com.gusto',
    android: 'com.customer.gusto',
  }),
  gokab: Platform.select({
    ios: 'com.gokab',
    android: 'com.gokab',
  }),
  grub: Platform.select({
    ios: 'com.customer.grub',
    android: 'com.customer.grub',
  }),
};

const socialKeys = {
  TWITTER_COMSUMER_KEY:
    'R66DHARfuoYAPowApUxNxwbPi',
  TWITTER_CONSUMER_SECRET:
    'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15',
};

export { appIds, shortCodes, socialKeys };

