import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';

const shortCodes = {
  royoorder: '245bae',
  grub: '2f3120',
  gusto: 'd1b1a0',
  gokab: 'fb78f0', // live
  // gokab: '578b33', // staging
  suel: '638bd1',
  elixir: '574467',
  ace: '2d98b5',
  punnet: 'd2cca0',
  homeric: 'c8fbba',
  voltaic: 'd8473d',
  zest: '6865aa',
  skyline: 'ce1ed6',
  rentzy: 'd4fc07',
  spa: '9022c6',
  emart: '6ca3a4'
};

const appIds = {

  royoorder: Platform.select({
    ios: 'com.codebrew.royoordersreactnative',
    android: 'com.codebrew.royoorder',
  }),
  grub: Platform.select({
    ios: 'com.customer.grub',
    android: 'com.customer.grub',
  }),
  gusto: Platform.select({
    ios: 'com.gusto',
    android: 'com.customer.gusto',
  }),
  punnet: Platform.select({
    ios: 'com.punnet',
    android: 'com.punnet',
  }),
  homeric: Platform.select({
    ios: 'com.homeric',
    android: 'com.homeric',
  }),
  voltaic: Platform.select({
    ios: 'com.voltaic',
    android: 'com.voltaic',
  }),
  zest: Platform.select({
    ios: 'com.zest.customer',
    android: 'com.zest.customer',
  }),
  suel: Platform.select({
    ios: 'com.suel',
    android: 'com.suel',
  }),
  gokab: Platform.select({
    ios: 'com.gokab',
    android: 'com.gokab',
  }),
  elixir: Platform.select({
    ios: 'com.elixir',
    android: 'com.elixir.customer',
  }),
  ace: Platform.select({
    ios: 'com.customer.ace',
    android: 'com.customer.ace',
  }),
  skyline: Platform.select({
    ios: 'com.skyline.royoorders',
    android: 'com.skyline',
  }),
  rentzy: Platform.select({
    ios: 'com.rentzy.royoorders',
    android: 'com.rentzy',
  }), 
  spa: Platform.select({
    ios: 'com.customerApp.spa',
    android: 'com.customerApp.spa',
  }),
  emart: Platform.select({
    ios: 'com.emart.order',
    android: 'com.emart.order',
  }),
};

const socialKeys = {
  TWITTER_COMSUMER_KEY:
    getBundleId() == appIds.runrun
      ? 'OCOQeRWzRoDAnGNbNFsbN5kuk'
      : getBundleId() == appIds.royoorder
        ? 'R66DHARfuoYAPowApUxNxwbPi'
        : getBundleId() == appIds.capcorp
          ? 'R66DHARfuoYAPowApUxNxwbPi'
          : getBundleId() == appIds.tranzit
            ? 'iOOPhwfIqnQfmyjZqDbKzMNgP'
            : getBundleId() == appIds.hmoobhub
              ? 'AvNzKlREbm3Aan3sEKYbXv0k8'
              : 'R66DHARfuoYAPowApUxNxwbPi',
  TWITTER_CONSUMER_SECRET:
    getBundleId() == appIds.runrun
      ? 'zBfzttCBVAzimuaIsDWDU1MjqI4pWzvNsrW6YOYPVZtgtzTlN8'
      : getBundleId() == appIds.royoorder
        ? 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15'
        : getBundleId() == appIds.capcorp
          ? 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15'
          : getBundleId() == appIds.tranzit
            ? 'pg72uq6SVPkUn0Ts3lQWPfqHSXwR09Tb64d3bPrnIcPnZdd5Tq'
            : getBundleId() == appIds.hmoobhub
              ? '5UW5ukiVG49CmpAh7hBWP333K68gz8hfeUXzmoL3p6jIWy0qQa'
              : 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15',
};

export { appIds, socialKeys, shortCodes };
