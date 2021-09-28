import {Platform} from 'react-native';
import {getBundleId} from 'react-native-device-info';

const shortCodes = {
  runrun: 'bf8608',
  tranzit: '52a1a6',
  hmoobhub: 'fa11e1',
  capcorp: '149f3e',
  masa: 'c8490a',
  yogofood: '7c428e',
  spidbi: '4a7329',
  clicktoeat: 'd2f528',
  instamobile: '73bb60',
  bottomsup: '068ff0',
  africanvillagemarket: '1dfe7c',
  ufood: '14425c',
  martinionwheels: '439319',
  blip: 'fc7a07',
  helpnowrightnow: '0f64b9',
  cannabus: '45fdcb',
  govachow: 'ceac45',
  bustanfakieh: '9083c8',
  shariff: '3fd449',
  gajamove: '52fd5a',
  getme: '4361d1',
  orbit: '82c91c',
  carlitoo: '879df2',
  specialhalal: 'b0fc04',
  thehouse: 'edcbc0',
  tasmeem: '408d5a',
  klickmat: 'de2c54',
  lastminutedress: '6e940e',
  rerak: 'f16959',
  yummiidash: 'c23640',
  yoho: 'fdbcd9',
  glamsouq: '583ade',
  doctatransportation: '8115ce',
  washvalley: 'd5403a',
  equamd: '82a1eb',
  hellodeliver: '5ed004',
  hoganchef: '52a0c3',
  servze: '0b3f8c',
  travo: '6d58cc',
  cabdelivr: '5bf9f0',
  drus: '351d30',
  yahu: '2f6d58',
  zuzuclean: '649a9a',
  towtrek: 'e7a92f',
  arenagrub: '3f8210',
  jet: '8fb14b',
  africanize: '35822a',
  markita: '4edbd9',
  sirvu: '5ea0ae',
  ublue: 'f9f655',
  mstechy: 'ec2a07',
  senshive: 'f36591',
  ridemate: 'd517bf',
  codiner: 'd46808',
  housekeeper: 'd8b741',
  hairstonexpress: 'a64f8a',
  diamonddashers: '015a80',
  destinationOps: '83c6db',
  loopwhole: '62ee0e',
  vici: '121eb9',
  carhop: 'e292ec',
  yogolift: '4f3624',
  fleety: '45bef7',
  flyinghorse: '8577b8',
  errand: '62a348',
  partnerproject: '246a2a',
  menus: 'f644c8',
  doorstep: 'f76099',
  sunshinerideshare: 'cef206',
  autotek: '2fbe83',
  wegotit: 'f755bb',
  survuhs: 'ac8cda',
  igolux: 'd190a2',
  toda: '1a6236',
  mobi: '096939',
  yourlaundryapp: '03467c',
  hemptyfy: '1a7e89',
  sharu: '443e7e',
  smcompany: '69502d',
  totum4U: '04e60d',
  hmc: 'fa3fcd',
  groupy: 'd4f312',
  weeat: '03cff2',
  gorillas: 'd22ad9',
  baytukom: 'd0a898',
  eboyo: '1d0fd3',
  share: 'bb8440',
  pickmeup: '87a4de',
};

const appIds = {
  royoorder: Platform.select({
    ios: 'com.codebrew.royoordersreactnative',
    android: 'com.codebrew.royoorder',
  }),
  runrun: Platform.select({
    ios: 'com.codebrew.runrun',
    android: 'com.codebrew.runrun',
  }),
  tranzit: Platform.select({
    ios: 'com.tranzit',
    android: 'com.tranzit',
  }),
  hmoobhub: Platform.select({
    ios: 'com.codebrew.hmoobhub',
    android: 'com.codebrew.hmoobhub',
  }),
  capcorp: Platform.select({
    ios: 'com.capcorpapp',
    android: 'com.capcorpapp',
  }),
  masa: Platform.select({
    ios: 'com.app.masa',
    android: 'com.app.masa',
  }),
  yogofood: Platform.select({
    ios: 'com.yogofood',
    android: 'com.yogofood',
  }),
  spidbi: Platform.select({
    ios: 'com.user.spidbi',
    android: 'com.user.spidbi',
  }),
  clicktoeat: Platform.select({
    ios: 'com.codebrew.clicktoeat',
    android: 'com.clicktoeat',
  }),
  instamobile: Platform.select({
    ios: 'com.instamobile',
    android: 'com.instamobile',
  }),
  bottomsup: Platform.select({
    ios: 'com.bottomsup',
    android: 'com.bottomsup',
  }),
  africanvillagemarket: Platform.select({
    ios: 'com.codebrew.africanvillagemarket',
    android: 'com.africanvillagemarket',
  }),
  ufood: Platform.select({
    ios: 'com.ufood',
    android: 'com.ufood',
  }),
  martinionwheels: Platform.select({
    ios: 'com.martinionwheels',
    android: 'com.martinionwheels',
  }),
  blip: Platform.select({
    ios: 'com.blip',
    android: 'com.blip',
  }),
  helpnowrightnow: Platform.select({
    ios: 'com.helpnowrightnow',
    android: 'com.helpnowrightnow',
  }),
  cannabus: Platform.select({
    ios: 'com.cannabus',
    android: 'com.cannabus',
  }),
  govachow: Platform.select({
    ios: 'com.codebrew.govachow',
    android: 'com.govachow',
  }),
  bustanfakieh: Platform.select({
    ios: 'com.codebrew.bustan',
    android: 'com.codebrew.bustan',
  }),
  shariff: Platform.select({
    ios: 'com.codebrew.shariff',
    android: 'com.shariff',
  }),
  gajamove: Platform.select({
    ios: 'com.codebrew.gajamove',
    android: 'com.codebrew.gajamove',
  }),
  getme: Platform.select({
    ios: 'com.codebrew.getme',
    android: 'com.codebrew.getme',
  }),
  orbit: Platform.select({
    ios: 'com.codebrew.orbit',
    android: 'com.codebrew.orbit',
  }),
  carlitoo: Platform.select({
    ios: 'com.codebrew.carlitoo',
    android: 'com.codebrew.carlitoo',
  }),
  specialhalal: Platform.select({
    ios: 'com.codebrew.specialhalal',
    android: 'com.codebrew.specialhalal',
  }),
  thehouse: Platform.select({
    ios: 'com.codebrew.thehouse',
    android: 'com.codebrew.thehouse',
  }),
  tasmeem: Platform.select({
    ios: 'com.codebrew.tasmeem',
    android: 'com.codebrew.tasmeem',
  }),
  klickmat: Platform.select({
    ios: 'com.codebrew.klickmat',
    android: 'com.codebrew.klickmat',
  }),
  lastminutedress: Platform.select({
    ios: 'com.codebrewLab.lastminutedress',
    android: 'com.codebrewLab.lastminutedress',
  }),
  rerak: Platform.select({
    ios: 'com.codebrew.rerak',
    android: 'com.codebrew.rerak',
  }),
  yummiidash: Platform.select({
    ios: 'com.yummiidash',
    android: 'com.yummiidash',
  }),
  yoho: Platform.select({
    ios: 'com.codebrewlab.yoho',
    android: 'com.codebrew.yoho',
  }),
  glamsouq: Platform.select({
    ios: 'com.codebrew.glamsouq',
    android: 'com.codebrew.glamsouq',
  }),
  doctatransportation: Platform.select({
    ios: 'com.codebrew.doctatransportation',
    android: 'com.codebrew.doctatransportation',
  }),
  washvalley: Platform.select({
    ios: 'com.codebrew.washvalley',
    android: 'com.codebrew.washvalley',
  }),
  equamd: Platform.select({
    ios: 'com.codebrew.equamd',
    android: 'com.codebrew.equamd',
  }),
  hellodeliver: Platform.select({
    ios: 'com.codebrew.hellodeliver',
    android: 'com.codebrew.hellodeliver',
  }),
  hoganchef: Platform.select({
    ios: 'com.codebrew.hoganchef',
    android: 'com.codebrew.hoganchef',
  }),
  servze: Platform.select({
    ios: 'com.app.servze',
    android: 'com.servze',
  }),
  travo: Platform.select({
    ios: 'com.codebrew.travo',
    android: 'com.travo',
  }),
  cabdelivr: Platform.select({
    ios: 'com.cabdelivr',
    android: 'com.cabdelivr',
  }),
  drus: Platform.select({
    ios: 'com.drus.customer',
    android: 'com.app.drus',
  }),
  yahu: Platform.select({
    ios: 'com.yahu',
    android: 'com.yahu',
  }),
  zuzuclean: Platform.select({
    ios: 'com.zuzuclean',
    android: 'com.zuzuclean',
  }),
  towtrek: Platform.select({
    ios: 'com.app.towtrek',
    android: 'com.app.towtrek',
  }),
  arenagrub: Platform.select({
    ios: 'com.arenagrub',
    android: 'com.arenagrub',
  }),
  jet: Platform.select({
    ios: 'com.jet.customer',
    android: 'com.jet',
  }),
  africanize: Platform.select({
    ios: 'com.africanize',
    android: 'com.africanize',
  }),
  markita: Platform.select({
    ios: 'com.markita',
    android: 'com.markita',
  }),
  sirvu: Platform.select({
    ios: 'com.sirvu',
    android: 'com.sirvu',
  }),
  ublue: Platform.select({
    ios: 'com.ublue',
    android: 'com.ublue',
  }),
  mstechy: Platform.select({
    ios: 'com.mstechy',
    android: 'com.mstechy',
  }),
  senshive: Platform.select({
    ios: 'com.senshive',
    android: 'com.senshive',
  }),
  ridemate: Platform.select({
    ios: 'com.ridemate',
    android: 'com.ridemate',
  }),
  codiner: Platform.select({
    ios: 'com.codiner',
    android: 'com.codiner',
  }),
  housekeeper: Platform.select({
    ios: 'com.housekeeper4hire',
    android: 'com.housekeeper',
  }),
  hairstonexpress: Platform.select({
    ios: 'com.hairstonexpress',
    android: 'com.hairstonexpress',
  }),
  diamonddashers: Platform.select({
    ios: 'com.diamonddashers',
    android: 'com.diamonddashers',
  }),
  destinationOps: Platform.select({
    ios: 'com.destinationOps',
    android: 'com.destinationOps',
  }),
  loopwhole: Platform.select({
    ios: 'com.loopwhole',
    android: 'com.loopwhole',
  }),
  vici: Platform.select({
    ios: 'com.vici',
    android: 'com.vici',
  }),
  carhop: Platform.select({
    ios: 'com.carhop',
    android: 'com.carhop',
  }),
  yogolift: Platform.select({
    ios: 'com.yogolift',
    android: 'com.yogolift',
  }),
  fleety: Platform.select({
    ios: 'com.fleety',
    android: 'com.fleety',
  }),
  flyinghorse: Platform.select({
    ios: 'com.flyinghorse',
    android: 'com.flyinghorse',
  }),
  errand: Platform.select({
    ios: 'com.errand',
    android: 'com.errand',
  }),
  partnerproject: Platform.select({
    ios: 'com.partnerproject',
    android: 'com.partnerproject',
  }),
  menus: Platform.select({
    ios: 'com.menusvirtual',
    android: 'com.menus',
  }),
  doorstep: Platform.select({
    ios: 'com.doorstepone',
    android: 'com.doorstep',
  }),
  sunshinerideshare: Platform.select({
    ios: 'com.sunshinerideshare',
    android: 'com.sunshinerideshare',
  }),
  autotek: Platform.select({
    ios: 'com.autotek',
    android: 'com.autotek',
  }),
  wegotit: Platform.select({
    ios: 'com.wegotit',
    android: 'com.wegotit',
  }),
  survuhs: Platform.select({
    ios: 'com.survuhs',
    android: 'com.survuhs',
  }),
  igolux: Platform.select({
    ios: 'com.igolux',
    android: 'com.igolux',
  }),
  toda: Platform.select({
    ios: 'com.toda.orders',
    android: 'com.toda',
  }),
  mobi: Platform.select({
    ios: 'com.mobi.customer',
    android: 'com.mobi',
  }),
  yourlaundryapp: Platform.select({
    ios: 'com.yourlaundryapp',
    android: 'com.yourlaundryapp',
  }),
  hemptyfy: Platform.select({
    ios: 'com.hemptyfy',
    android: 'com.hemptyfy',
  }),
  sharu: Platform.select({
    ios: 'com.sharu',
    android: 'com.sharu',
  }),
  smcompany: Platform.select({
    ios: 'com.smcompany',
    android: 'com.smcompany',
  }),
  totum4U: Platform.select({
    ios: 'com.totum4U',
    android: 'com.totum4U',
  }),
  hmc: Platform.select({
    ios: 'com.hmc.customer',
    android: 'com.hmc',
  }),
  groupy: Platform.select({
    ios: 'com.groupy',
    android: 'com.groupy',
  }),
  weeat: Platform.select({
    ios: 'com.weeat.customer',
    android: 'com.weeat',
  }),
  gorillas: Platform.select({
    ios: 'com.gorillas',
    android: 'com.gorillas',
  }),
  baytukom: Platform.select({
    ios: 'com.baytukom',
    android: 'com.baytukom',
  }),
  eboyo: Platform.select({
    ios: 'com.eboyo',
    android: 'com.eboyo',
  }),
  vecto: Platform.select({
    ios: 'com.vecto',
    android: 'com.vecto',
  }),
  share: Platform.select({
    ios: 'com.share.customer',
    android: 'com.share',
  }),
  pickmeup: Platform.select({
    ios: 'com.pickmeup.customer',
    android: 'com.pickmeup',
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

export {appIds, socialKeys, shortCodes};
