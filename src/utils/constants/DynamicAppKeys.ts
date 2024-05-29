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
  peerPulse: '70c245',
  rentzGo: '94dcab',
  spa:'574467',
  emart:'6ca3a4',
  rentzy:'d4fc07'
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
  emart: Platform.select({
    ios: 'com.emart.order',
    android: 'com.emart.order',
  }),
  spa: Platform.select({
    ios: 'com.customerApp.spa',
    android: 'com.customerApp.spa',
  }),
  peerPulse: Platform.select({
    ios: 'com.peerPulse.royoorder',
    android: 'com.peerPulse.royoorder',
  }),
  rentzGo: Platform.select({
    ios: 'com.rentzGo.royoorder',
    android: 'com.rentzGo.royoorder',
  }),
};

const socialKeys = {
  TWITTER_COMSUMER_KEY: getBundleId() == appIds.royoorder
    ? 'R66DHARfuoYAPowApUxNxwbPi' :
    'R66DHARfuoYAPowApUxNxwbPi',
  TWITTER_CONSUMER_SECRET: getBundleId() == appIds.royoorder
    ? 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15' : 
    'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15',
};

export { appIds, socialKeys, shortCodes };
