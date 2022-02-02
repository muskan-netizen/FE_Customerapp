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
  snabbhem: 'de2c54',
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
  taquick: '630e49',
  vecto: '39f6fd',
  goody: '397840',
  grub: '2f3120',
  gusto: 'd1b1a0',
  gokab: 'fb78f0',
  suel: '638bd1',
  elixir: '574467',
  ace: '2d98b5',
  punnet: 'd2cca0',
  homeric: 'c8fbba',
  voltaic: 'd8473d',
  zest: '6865aa',
  empire: '79fbc8',
  expressdelivery: '6098e4',
  booziedoozie: '9f5473',
  zestyclickz: '3046ca',
  bakesale: '55534f',
  elcheregio: '3154ed',
  yaawi: '64a3e8',
  hosta: '757287',
  somame: '069701',
  goodwheelz: 'ceab64',
  tranznet: '02aad0',
  sambiga: '4fadae',
  agrionline: 'dd93ce',
  quickquick: '9bd088',
  caribeclean: 'a6bf72',
  stonses: '6acd69',
  agbdeliveries: 'e0d849',
  twofinder: '104a74',
  bookem: 'f87d4c',
  zip: '5ecbab',
  ridetci: '89e246',
  noki: '779cb6',
  driveree: '1ead91',
  rxnow: '476dfb',
  seachangevending: 'caacbc',
  ored: 'fb0df5',
  orderchekout: 'f6cd9d',
  maxisdelivery: '1e1c90',
  donepacked: '4fc332',
  careworks: '81c669',
  thubaerides: '47f449',
  pinkjet: '7e0ff5',
  mokabfix: '88d242',
  botseats: 'fe9076',
  gumastas: '2cdae8',
  dishefs: '4c13fd',
  bilionza: '9a8793',
  doleypharmacy: 'e925ef',
  bezalio: 'c1ab2b',
  youchillax: 'a2c90d',
  instashop: 'cb6671',
  shoorafresh: 'bd4fe8',
  click2deliver: '6483c6',
  trucktirenow: '82c016',
  kel360: '9087f6',
  yeboy: 'e4ec39',
  moboserrandsservice: '3d2e75',
  cabway: 'e1331a',
  tajammul: '7c4e0b',
  carroai: '0d6852',
  ssuum: 'b3cc0b',
  blacnetwork: 'e51092',
  threadagain: 'a4543c',
  ezmobilefuel: 'a024bd',
  runaround: 'f2a962',
  swiftandvalu: 'f89822',
  trucxi: '3096b7',
  paysic: '786133',
  chipetaxi: '29790b',
  laundryorders: '995951',
  ineed: '10d0dd',
  nadelivery: '9aee12',
  marasym: 'af735a',
  silvestre: '5fa7f3',
  samakeemart: 'c473b2',
  seaeats: '27b6eb',
  enext: 'e36583',
  hokitch: 'bc54f4',
  foodnests: '82b5bc',
  sponge: 'c2c6c5',
  gomeat: '98f085',
  shopcentral: '9bdfac',
  skidoo: '4f130d',
  admCourier: '56383d',
  kurbsidekings: '67346e',
  movingwheelsdelivery: '46ee7c',
  safewalks: 'bb699c',
  dimavega: 'd25db3',
  skoop: 'ff2327',
  kudhyo: '300420',
  bharatMove: 'e2ec5e',
  sofia: 'e2ef1a',
  mml: '348045',
  bimol: '94fc5b',
  vendorspot: 'dfa952',
  sxm2go: 'b6e6e8',
  pinkydeli: '66c095',
  gasgiant: 'e6c73a',
  releezer: 'c2a130',
  vendoor: '203685',
  farmersouq: 'cc6a32',
  tmgShops: '6da47f',
  stitchesonsite: '5bdfee',
  easyu: '20b62b',
  mozmarcas: '649832',
  myfiji: 'a69fda',
  fastmikes: 'd89823',
  citysuds: 'aaedee',
  homeTownDelivery: 'c49349',
  ritenow: '4b0d72',
  flit: '20c702',
  ihelp: '6c74a0',
  ullaz: '1b1c0d',
  privatepremiumpickups: '8d559d',
  fidesDelivery: 'd83920',
  bksTaxi: 'b66295',
  oxo: '48200b',
  sijang: '16b184',
  fairex: '1e3e30',
  everywhere: 'bc09ef',
  cannabisClubSF: '351b2b',
  halaTalabat: 'ccc32e',
  palmettoplus: '007b7b',
  allotaxi: '2142db',
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
    ios: 'com.africanvillagemarket',
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
    android: 'com.app.blip',
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
    ios: 'com.app.govachow',
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
  snabbhem: Platform.select({
    ios: 'com.snabbhem',
    android: 'com.snabbhem',
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
    ios: 'com.app.yummiidash',
    android: 'com.app.yummiidash',
  }),
  yoho: Platform.select({
    ios: 'com.codebrew.yoho',
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
    ios: 'com.app.cabdelivr',
    android: 'com.app.cabdelivr',
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
    ios: 'com.app.codiner',
    android: 'com.app.codiner',
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
    ios: 'com.customer.vici',
    android: 'com.app.vici',
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
    android: 'com.toda.orders',
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
    ios: 'com.eatkareem.hmchalal',
    android: 'com.eatkareem.hmchalal',
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
  taquick: Platform.select({
    ios: 'com.taquick',
    android: 'com.taquick',
  }),
  goody: Platform.select({
    ios: 'com.goody.customer',
    android: 'com.goody',
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
  empire: Platform.select({
    ios: 'com.customer.empire',
    android: 'com.empire',
  }),
  expressdelivery: Platform.select({
    ios: 'com.customer.expressdelivery',
    android: 'com.expressdelivery',
  }),
  booziedoozie: Platform.select({
    ios: 'com.booziedoozie',
    android: 'com.booziedoozie',
  }),
  zestyclickz: Platform.select({
    ios: 'com.zestyclickz',
    android: 'com.zestyclickz',
  }),
  bakesale: Platform.select({
    ios: 'com.bakesale',
    android: 'com.bakesale',
  }),
  elcheregio: Platform.select({
    ios: 'com.elcheregio',
    android: 'com.elcheregio',
  }),
  yaawi: Platform.select({
    ios: 'com.yaawi',
    android: 'com.yaawi',
  }),
  hosta: Platform.select({
    ios: 'com.hosta',
    android: 'com.hosta',
  }),
  somame: Platform.select({
    ios: 'com.somame',
    android: 'com.somame',
  }),
  goodwheelz: Platform.select({
    ios: 'com.goodwheelz',
    android: 'com.goodwheelz',
  }),
  tranznet: Platform.select({
    ios: 'com.tranznet',
    android: 'com.tranznet',
  }),
  sambiga: Platform.select({
    ios: 'com.sambiga',
    android: 'com.sambiga',
  }),
  agrionline: Platform.select({
    ios: 'com.app.agrionline',
    android: 'com.agrionline',
  }),
  quickquick: Platform.select({
    ios: 'com.quickquick',
    android: 'com.quickquick',
  }),
  caribeclean: Platform.select({
    ios: 'com.caribeclean',
    android: 'com.caribeclean',
  }),
  stonses: Platform.select({
    ios: 'com.stonses',
    android: 'com.stonses',
  }),
  agbdeliveries: Platform.select({
    ios: 'com.agbdeliveries',
    android: 'com.agbdeliveries',
  }),
  twofinder: Platform.select({
    ios: 'com.twofinder',
    android: 'com.twofinder',
  }),
  bookem: Platform.select({
    ios: 'com.bookem',
    android: 'com.bookem',
  }),
  zip: Platform.select({
    ios: 'com.customer.zip',
    android: 'com.zip',
  }),
  ridetci: Platform.select({
    ios: 'com.ridetci',
    android: 'com.ridetci',
  }),
  noki: Platform.select({
    ios: 'com.customer.noki',
    android: 'com.noki',
  }),
  driveree: Platform.select({
    ios: 'com.driveree',
    android: 'com.driveree',
  }),
  rxnow: Platform.select({
    ios: 'com.rxnow',
    android: 'com.rxnow',
  }),
  seachangevending: Platform.select({
    ios: 'com.customer.seachangevending',
    android: 'com.seachangevending',
  }),
  ored: Platform.select({
    ios: 'com.ored',
    android: 'com.ored',
  }),
  orderchekout: Platform.select({
    ios: 'com.orderchekout.application',
    android: 'com.orderchekout',
  }),
  maxisdelivery: Platform.select({
    ios: 'com.maxisdelivery',
    android: 'com.maxisdelivery',
  }),
  donepacked: Platform.select({
    ios: 'com.donepacked',
    android: 'com.donepacked',
  }),
  careworks: Platform.select({
    ios: 'com.careworks',
    android: 'com.careworks',
  }),
  thubaerides: Platform.select({
    ios: 'com.thubaerides',
    android: 'com.thubaerides',
  }),
  pinkjet: Platform.select({
    ios: 'com.pinkjet',
    android: 'com.customer.pinkjet',
  }),
  mokabfix: Platform.select({
    ios: 'com.mokabfix',
    android: 'com.mokabfix',
  }),
  botseats: Platform.select({
    ios: 'com.botseats',
    android: 'com.botseats',
  }),
  gumastas: Platform.select({
    ios: 'com.gumastas',
    android: 'com.gumastas',
  }),
  dishefs: Platform.select({
    ios: 'com.dishefs',
    android: 'com.dishefs',
  }),
  bilionza: Platform.select({
    ios: 'com.bilionza',
    android: 'com.bilionza',
  }),
  doleypharmacy: Platform.select({
    ios: 'com.doleypharmacy',
    android: 'com.doleypharmacy',
  }),
  bezalio: Platform.select({
    ios: 'com.bezalio',
    android: 'com.bezalio',
  }),
  youchillax: Platform.select({
    ios: 'com.youchillax',
    android: 'com.youchillax',
  }),
  instashop: Platform.select({
    ios: 'com.customer.instashop',
    android: 'com.instashop',
  }),
  shoorafresh: Platform.select({
    ios: 'com.shoorafresh',
    android: 'com.shoorafresh',
  }),
  click2deliver: Platform.select({
    ios: 'com.click2deliver',
    android: 'com.click2deliver',
  }),
  trucktirenow: Platform.select({
    ios: 'com.trucktirenow',
    android: 'com.trucktirenow',
  }),
  yeboy: Platform.select({
    ios: 'com.yeboy',
    android: 'com.yeboy',
  }),
  kel360: Platform.select({
    ios: 'com.kel',
    android: 'com.kel',
  }),
  moboserrandsservice: Platform.select({
    ios: 'com.moboserrandsservice',
    android: 'com.moboserrandsservice',
  }),
  cabway: Platform.select({
    ios: 'com.cabway',
    android: 'com.cabway',
  }),
  tajammul: Platform.select({
    ios: 'com.tajammul',
    android: 'com.tajammul',
  }),
  carroai: Platform.select({
    ios: 'com.carroai',
    android: 'com.carroai',
  }),
  ssuum: Platform.select({
    ios: 'com.ssuum',
    android: 'com.ssuum',
  }),
  blacnetwork: Platform.select({
    ios: 'com.blacnetwork',
    android: 'com.blacnetwork',
  }),
  threadagain: Platform.select({
    ios: 'com.threadagain',
    android: 'com.threadagain',
  }),
  ezmobilefuel: Platform.select({
    ios: 'com.ezmobilefuel',
    android: 'com.ezmobilefuel',
  }),
  runaround: Platform.select({
    ios: 'com.runaround',
    android: 'com.runaround',
  }),
  swiftandvalu: Platform.select({
    ios: 'com.customer.swiftandvalu',
    android: 'com.swiftandvalu',
  }),
  trucxi: Platform.select({
    ios: 'com.trucxi',
    android: 'com.trucxi',
  }),
  paysic: Platform.select({
    ios: 'com.paysic',
    android: 'com.paysic',
  }),
  chipetaxi: Platform.select({
    ios: 'com.chipetaxi',
    android: 'com.chipetaxi',
  }),
  laundryorders: Platform.select({
    ios: 'com.laundryorders',
    android: 'com.laundryorders',
  }),
  ineed: Platform.select({
    ios: 'com.customer.ineed',
    android: 'com.customer.ineed',
  }),
  nadelivery: Platform.select({
    ios: 'com.app.nadelivery',
    android: 'com.nadelivery',
  }),
  marasym: Platform.select({
    ios: 'com.marasym',
    android: 'com.marasym',
  }),
  silvestre: Platform.select({
    ios: 'com.silvestre',
    android: 'com.silvestre',
  }),
  samakeemart: Platform.select({
    ios: 'com.samakeemart',
    android: 'com.samakeemart',
  }),
  seaeats: Platform.select({
    ios: 'com.seaeats',
    android: 'com.seaeats',
  }),
  enext: Platform.select({
    ios: 'com.enext',
    android: 'com.enext',
  }),
  hokitch: Platform.select({
    ios: 'com.hokitch',
    android: 'com.hokitch',
  }),
  foodnests: Platform.select({
    ios: 'com.foodnests',
    android: 'com.foodnests',
  }),
  sponge: Platform.select({
    ios: 'com.app.sponge',
    android: 'com.sponge',
  }),
  gomeat: Platform.select({
    ios: 'com.app.gomeat',
    android: 'com.app.gomeat',
  }),
  shopcentral: Platform.select({
    ios: 'com.shopcentral',
    android: 'com.shopcentral',
  }),
  skidoo: Platform.select({
    ios: 'com.skidoo',
    android: 'com.skidoo',
  }),
  admCourier: Platform.select({
    ios: 'com.admcourier',
    android: 'com.admcourier',
  }),
  kurbsidekings: Platform.select({
    ios: 'com.kurbsidekings',
    android: 'com.kurbsidekings',
  }),
  movingwheelsdelivery: Platform.select({
    ios: 'com.movingwheelsdelivery',
    android: 'com.movingwheelsdelivery',
  }),
  safewalks: Platform.select({
    ios: 'com.safewalks',
    android: 'com.safewalks',
  }),
  dimavega: Platform.select({
    ios: 'com.dimavega',
    android: 'com.dimavega',
  }),
  skoop: Platform.select({
    ios: 'com.app.skoop',
    android: 'com.app.skoop',
  }),
  kudhyo: Platform.select({
    ios: 'com.kudhyo',
    android: 'com.kudhyo',
  }),
  bharatMove: Platform.select({
    ios: 'com.bharatMove',
    android: 'com.bharatMove',
  }),
  sofia: Platform.select({
    ios: 'com.app.sofia',
    android: 'com.app.sofia',
  }),
  mml: Platform.select({
    ios: 'com.mml',
    android: 'com.mml',
  }),
  bimol: Platform.select({
    ios: 'com.bimol',
    android: 'com.bimol',
  }),
  vendorspot: Platform.select({
    ios: 'com.vendorspot',
    android: 'com.vendorspot',
  }),
  sxm2go: Platform.select({
    ios: 'com.sxm2go',
    android: 'com.sxm2go',
  }),
  pinkydeli: Platform.select({
    ios: 'com.codebrew.pinkydeli',
    android: 'com.app.pinkydeli',
  }),
  gasgiant: Platform.select({
    ios: 'com.gasgiant',
    android: 'com.gasgiant',
  }),
  releezer: Platform.select({
    ios: 'com.releezer',
    android: 'com.releezer',
  }),
  vendoor: Platform.select({
    ios: 'com.vendoor',
    android: 'com.vendoor',
  }),
  farmersouq: Platform.select({
    ios: 'com.farmersouq',
    android: 'com.farmersouq',
  }),
  tmgShops: Platform.select({
    ios: 'com.tmgShops',
    android: 'com.tmgShops',
  }),
  stitchesonsite: Platform.select({
    ios: 'com.stitchesonsite',
    android: 'com.stitchesonsite',
  }),
  easyu: Platform.select({
    ios: 'com.easyu',
    android: 'com.easyu',
  }),
  mozmarcas: Platform.select({
    ios: 'com.mozmarcas',
    android: 'com.mozmarcas',
  }),
  myfiji: Platform.select({
    ios: 'com.myfiji',
    android: 'com.myfiji',
  }),
  fastmikes: Platform.select({
    ios: 'com.fastmikes',
    android: 'com.fastmikes',
  }),
  citysuds: Platform.select({
    ios: 'com.citysuds',
    android: 'com.citysuds',
  }),
  homeTownDelivery: Platform.select({
    ios: 'com.homeTownDelivery',
    android: 'com.homeTownDelivery',
  }),
  ritenow: Platform.select({
    ios: 'com.ritenow',
    android: 'com.ritenow',
  }),
  flit: Platform.select({
    ios: 'com.app.flit',
    android: 'com.app.flit',
  }),
  ihelp: Platform.select({
    ios: 'com.customer.Ihelp',
    android: 'com.customer.Ihelp',
  }),
  ullaz: Platform.select({
    ios: 'com.ullaz',
    android: 'com.ullaz',
  }),
  privatepremiumpickups: Platform.select({
    ios: 'com.privatepremiumpickups',
    android: 'com.privatepremiumpickups',
  }),
  fidesDelivery: Platform.select({
    ios: 'com.fidesDelivery',
    android: 'com.fidesDelivery',
  }),
  bksTaxi: Platform.select({
    ios: 'com.bksTaxi',
    android: 'com.bksTaxi',
  }),
  oxo: Platform.select({
    ios: 'com.oxo',
    android: 'com.oxo',
  }),
  sijang: Platform.select({
    ios: 'com.sijang',
    android: 'com.sijang',
  }),
  fairex: Platform.select({
    ios: 'com.fairex',
    android: 'com.fairex',
  }),
  everywhere: Platform.select({
    ios: 'com.app.everywhere',
    android: 'com.app.everywhere',
  }),
  cannabisClubSF: Platform.select({
    ios: 'com.cannabisClubSF',
    android: 'com.cannabisClubSF',
  }),
  cannabisClubSF: Platform.select({
    ios: 'com.halaTalabat',
    android: 'com.halaTalabat',
  }),
  palmettoplus: Platform.select({
    ios: 'com.palmettoplus',
    android: 'com.palmettoplus',
  }),
  allotaxi: Platform.select({
    ios: 'com.allotaxi',
    android: 'com.allotaxi',
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
