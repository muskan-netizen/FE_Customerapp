import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';

const shortCodes = {
  royoorder: '245bae',
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
  snabbhem: 'bad620',
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
  // gokab: 'fb78f0', // live
  gokab: '578b33', // staging
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
  rxnow: '58e790',
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
  mozmarcas: '53ea8a',
  // myfiji: 'a0c80e',
  myfiji: '245bae',
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
  jadorDrive: 'a001aa',
  ubercann: '3a99ad',
  kongafood: 'c08eab',
  launch: '88cccf',
  kampick: 'd12c28',
  cabio: '476cf3',
  tumbak: '59944a',
  iPicknDrop: 'f9cf93',
  bluebolt: 'e5a64c',
  onthego: '5e0900',
  mylaglobal: 'a35cd8',
  ambutap: 'b436bb',
  sabroson: 'af268c',
  swiffyllc: 'da7ecb',
  meatEasy: '3e89e5',
  boltDelivery: '07a31a',
  gamaDelivery: 'b77561',
  hivefair: 'f0cede',
  localdropoff: '960a1f',
  ubi: '085703',
  scoopaTechnologies: '3c6a7e',
  knockknock: '3403fc',
  qrider: 'b715e7',
  dlvrd: '525456',
  delivery: 'd477fd',
  timHomeServices: 'ab2892',
  beakme: '6dcadc',
  onscart: '10abb5',
  mandaExpress: 'b405dd',
  foodies: '939bd6',
  gO: 'a83053',
  bauBau: 'e5e48e',
  bookARyde: '3c4b81',
  petsChoice: 'c995df',
  heyBuddy: '66ca24',
  yoloSonic: 'fc53be',
  mrHealth: 'e04975',
  lopht: '16ab0d',
  yalary: '9571e0',
  seratho: '0aa2e4',
  xborne: '16c5f2',
  fawaz: '806be0',
  grn: 'd697e3',
  delivadrinks: 'e22dd6',
  myRide: 'f6fb25',
  getfix: '3065fd',
  slider: '3fea63',
  ICare: 'd3e178',
  dbairro: 'f3a0f7',
  delivery: 'd477fd',
  viversbox: 'aaa2b4',
  scootz: '760243',
  ola: 'e11f38',
  spliffnation: '1c98de',
  sourcesServices: '67f0c8',
  wer: 'fb5def',
  beachhop: '9199e7',
  qseek: 'a1ffe8',
  delvento: '6a617a',
  rideshare: 'd4997d',
  bua: '132c75',
  upstreet: '260629',
  newYorkMiniMart: '5e4b3b',
  airlinesRecruiter: 'deb34c',
  nineOneTwo: 'f92fea',
  trip: '89e246',
  aauJau: '326d8e',
  mediPick: 'b92261',
  meltivers: 'deca6f',
  ensoDigitalAgency: '419dc9',
  hiperAbasto: '50cb7f',
  redglee: '9e185e',
  dropItOffUsa: '9524c4',
  handyPickup: '530592',
  TJJHub: '41a3db',
  curblerLLC: '959ecf',
  cartnar: '7b87ed',
  uven: '9b8db5',
  pAS41: '200651',
  freshFarmz: 'eafe42',
  ryde: '309c33',
  waterTaxi: 'f0f44c',
  muvpod: '3cc883',
  smile: 'd3a41c',
  caronaTaxi: 'c12d06',
  arwin: '6a391a',
  marjMarketplace: 'aa4c64',
  eVSOnTheGo: '0fa442',
  kazakazi: 'ec3bf6',
  papiruki: '58e4d2',
  markSoublet: '2b77d8',
  amstaFood: '825037',
  toor: '0388b6',
  peerDeliveries: 'cd7768',
  swan: '0bd9cb',
  SCOOTUP: 'cf21cf',
  patrolNow: 'ad0c7d',
  butlerDelivery: '56086e',
  swatiRX: 'c7129e',
  chowHub: '57bab0',
  ginDeliver: 'ee3d33',
  orderFirst: 'd760c8',
  maiz: '3df0b6',
  dingDongEat: '2f2b60',
  medicab: 'b1f6f1',
  fazeiTeam: '0eca90',
  weTogether: '686b6c',
  jiffex: '67dcfd',
  clickService: 'cb17f2',
  amazingTaxi: '32e266',
  jazzyBug: '3441ec',
  myfarma: '612a45',
  valley: 'b1add5',
  kartAndKarry: '4eaab9',
  quickLube: '4ab432',
  keystoneDelivery: '87ad74',
  blueBundles: 'b245dd',
  busTaMove: '9d065e',
  atasktt: '9bbd4e',
  lunchboxSpecials: 'cfa64c',
  sorDelivery: '732007',
  grubHouse: 'd9c5ee',
  hitchDelivery: '3bc1d7',
  zoodMarket: 'b077a9',
  meow: '71f36c',
  dingDongDelivers: '380c49',
  torunz: 'f23b31',
  kurs: '046761',
  spa: '9022c6',
  capitalDiagnostic: 'fd6dd6',
  abbeRides: '8501b6',
  nrsa: 'e9f97c',
  sadia: '312528',
  elentaMart: 'e084cc',
  exprexPro: 'cb98e8',
  fresHest: '7e43f5',
  servern: '1ba1e9',
  smokeRun: '545a71',
  myEvPlus: '1c7d9e',
  qdelo: '0fcc84',
  pawsee: 'bd2d83',
  hairRun: 'fabaaf',
  zuriRide: 'fa47e7',
  americanLuxury: '0015d5',
  smartMur: '780ecd',
  ouiSpeed: '089eee',
  getItSent: '9af7a9',
  easyDrink: '96eb54',
  iAmSelling: '7fd0dd',
  fifteenP: '016908',
  euodooTechnologies: 'c9d1ee',
  rota: 'e4b727',
  farmMeat: '371731',
  danielleBejjani: 'b47da2',
  yallaEat: '94679a',
  choizez: '05c28e',
  otto: 'd0121e',
  rescueRoadsideAssistance: '6355c5',
  tax_E: 'a7952f',
  baggageTaxi: '52bb0a',
  mersi: '1b308e',
  foodSpot: '1c67f3',
  karibaMart: 'c1ca39',
  sourceWith: '503079',
  apptFindr: 'ee3958',
  vdu: '181d99',
  laundroZone: '35a0ed',
  taxiolgy: '43d7df',
  swipe: '48c861',
  sheRyders: '058f37',
  kurrix: 'a11a9d',
  mrVeloz: '326609',
  greenCab: '20d107',
  axxi: 'bc1119',
  pets: '8e0436',
  getDress: '7d11ac',
  shelf: '245bae',
  baly: '3ae3ec',
  nuvoni: '0f3d8d',
  syloMart: 'f5358d',
  fairDeal: 'e5e082',
  hezniTaxi: 'fc1398',
  onTheWheel: '6b0c51',
  valleyMeats: '738e42',
  perucabs: '8b8156',
  hafizjwlry: '585d04',
  jana: '405d8d',
  myWayBill: '32f1ae',
  cattch: 'c399db',
  tezras: '424d92',
  eureka: '7feaa0',
  kaypee: 'ed9a42',
  hitaxi: 'fb240c',
  kwivar: '2037b0',
  parcel: '60277b',
  lex: 'a7f382',
  smokyKitchen: '8c4efa',
  flank: '3de814',
  zynoride: '958bb4',
  mealsarehere: 'c00a78',
  loamscape: 'ded864',
  delcolink: 'a2726b',
  youSmokeShops: '3f6e8e',
  doober: 'e8a1af',
  inmotion: '0e2db7',
  eatHalal: '607c84',
  jeevann: '31afbb',
  novamed: '3b5cd2',
  awamer: 'c6df5f',
  goTech: 'd87a1f',
  idrv: '07ba5d',
  qwiker: '9eeb4d',
  spryton: 'd0a063',
  nittosadai: '26662c',
  clickokart: 'f34c51',
  tiimo: 'aac5d5',
  verz: '2e1b4a',
  ragiomigo: '39c82e',
  jimsAutoRescue: '4fc57b',
  carryfood: '86d81e',
  nhazi: 'abaf70',
  petverse: '9d740f',
  clickndrop: '9536ba',
  lifehomefit: '191bdb',
  appi: 'e5e222',
  dbairro_: '2b7742',
  genee: '54f90f',
  speedyDelivery: '528728',
  holla: '4fe8db',
  stabex: '7678ee',
  uberWeeds: '3e90c0',
  cabPro: 'c672b6',
  pointoneExpediteDelivery: 'afd6cc',
  saamanshop: 'cedf8e',
  tdc: 'fd1259',
  giftyLeaf: 'c61dff',
  flyCommerce: '73cb91',
  pik: '970884',
  motina: 'a16093',
  hungry: '48b467',
  greenhippo: '2d6cda',
  mymeddy: 'dda7d5',
  uryd: 'dc8909',
  happySingh: '87b9fc',
  vital: 'db6f5a',
  parcelworks: '4b5376',
  usVetsDeliver: '4a533c',
  flybuilder: '7cd4bc',
  konectame: '1338c1',
  skyline: 'ce1ed6',
  bliss: 'ceeb2e',
  rentzy: 'd4fc07',
  todaysDeliverys: '6d055a',
  locate: 'f9f1f8',
  georgiacollective: '1d7bf7',
  otgWeeds: '2a3af8',
  rumbella: 'fd2e2f',
  lincshare: '9b8d33',
  lvlup: 'b2eb09',
  glavour: '620b19',
  shipmoe: '153a1f',
  bigBayong: '5c8f1a',
  efectibo: 'c1412b',
  sooq: 'c7824a',
  hectoHomes: '186e1d',
  zynoBidandRide: '958bb4',
  glamguide: 'e428fc',
  // solace: '6d065d',
  solace: "2b7742",
  superpana: '9242b4',
  kero: '776666',
  godamPAY: '2ae863',
  housingSubsidies: '428883',
  bocch: '987b45',
  potolo: '12ada8',
  earnApp: '8d7b4c',
  aredoo: 'e5e45b',
  bukam: '1a3404',
  dot: '64f6a4',
  wizSonic: '5e15fd',
  udkay: 'bfe4de',
  hattaFoodHub: 'be22d8',
  ondgoo: '70ae69',
  zonesso: '4f459b',
  junkerz: '09811d',
  shopcart: 'ae366e',
  viralClean: 'e3166f',
  stargaze: 'cc100d',
  messiaa: 'c326b3',
  superApp: '041795',
  nounou: '7ab01a',
  laith: 'f235c4',
  liverpoolEats: '08e554',
  oaks: 'db5f29',
  buzy: '5e7246',
  etaim: '4b3283',
  dotTaxiApp: 'ba540d',
  airvoltTaxi: '41ca60',
  melakPharmacy: '4dbfe1',
  wiEnergi: '39c65c',
  nannyAfrica: 'a7dbf8',
  whatchaGotPickUp: '2c23b0',
  goKart: 'd162a7',
  hqiStore: 'f949d8',
  tkaff: 'abae0e',
  nool: '5de7c7',
  rally: 'b860de',
  shipSmart: 'bbfdee',
  weemoov: '23808d',
  weedLomo: '7e6463',
  ngoal: 'c05ddc',
  livraiZoo: '007f7a',
  boozeBrothers: '8006b6',
  magicalBookings: 'e6bd3a',
  ebay: 'e82ca7',
  readyToRent: '3c5b8c',
  theGenie: 'f7d4a1',
  sultanCenter: '478879',
  reedas: 'de142d',
  onebasket: '58bec9',
  zozozi: '980515',
  ekobridge: '04468e',
  ambosSafariExpress: 'ec16dd',
  zulbrand: '873380',
  emart: '6ca3a4',
  oyeeRides:"634188",
  royoRides:'87406e',
  tempcorner:'84a472',
  autobox:'5db7c1',
  emiRates:'9ba443',
  detailPros:'1a1d3b',
  blink:'49ceca',
  incubit:'9bc5da',
  virgingates:'f5a75e',
  zuluCluch:'6347c6',
  ping:'17c374',
  chutneyeah:'85de17',
  ineeda:'aaabf3',  
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
    android: 'com.app.tranzit',
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
    android: 'com.order.ufood',
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
    ios: 'com.customer.snabbhem',
    android: 'com.customer.snabbhem',
  }),
  lastminutedress: Platform.select({
    ios: 'com.lastminutedress.order',
    android: 'com.lastminutedress.order',
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
    ios: 'com.glamsouq.customer',
    android: 'com.glamsouq.customer',
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
    ios: 'com.africanize.customer',
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
    ios: 'com.app.loopwhole',
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
    ios: 'com.yogolift.orders',
    android: 'com.yogolift.order',
  }),
  fleety: Platform.select({
    ios: 'com.fleety',
    android: 'com.feelty.userApp',
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
    ios: 'com.menus.customer',
    android: 'com.menus.customer',
  }),
  doorstep: Platform.select({
    ios: 'com.doorstepone',
    android: 'com.doorstep',
  }),
  sunshinerideshare: Platform.select({
    ios: 'com.app.sunshinerideshare',
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
    android: 'com.mobi.orders',
  }),
  yourlaundryapp: Platform.select({
    ios: 'com.yourlaundryapp',
    android: 'com.yourlaundryapp',
  }),
  hemptyfy: Platform.select({
    ios: 'com.hemptyfy.orders',
    android: 'com.hemptyfy.orders',
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
    ios: 'com.app.groupy',
    android: 'com.groupy',
  }),
  weeat: Platform.select({
    ios: 'com.weeat.customer',
    android: 'com.weeat.customer',
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
    ios: 'com.application.pickmeup',
    android: 'com.application.pickmeup',
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
    ios: 'com.application.empire',
    android: 'com.application.empire',
  }),
  expressdelivery: Platform.select({
    ios: 'com.expressdelivery.customer',
    android: 'com.expressdelivery',
  }),
  booziedoozie: Platform.select({
    ios: 'com.booziedoozie',
    android: 'com.booziedoozie',
  }),
  zestyclickz: Platform.select({
    ios: 'com.app.zestyclickz',
    android: 'com.app.zestyclickz',
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
    ios: 'com.driveree.orders',
    android: 'com.driveree.orders',
  }),
  rxnow: Platform.select({
    ios: 'com.app.rxnow',
    android: 'com.rxnow',
  }),
  seachangevending: Platform.select({
    ios: 'com.customer.seachangevending',
    android: 'com.seachangevending',
  }),
  ored: Platform.select({
    ios: 'com.ored.customer',
    android: 'com.ored.customer',
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
    ios: 'com.dishefsOrders',
    android: 'com.dishefsOrders',
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
    ios: 'com.click2deliver.customer',
    android: 'com.click2deliver',
  }),
  trucktirenow: Platform.select({
    ios: 'com.trucktirenow.customer',
    android: 'com.trucktirenow',
  }),
  yeboy: Platform.select({
    ios: 'com.app.yeboy',
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
    ios: 'com.blacnetwork.orders',
    android: 'com.blacnetwork.orders',
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
    android: 'com.ineed.userApplication',
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
    ios: 'com.app.samakeemart',
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
    ios: 'com.hokitch.orders',
    android: 'com.hokitch.orders',
  }),
  foodnests: Platform.select({
    ios: 'com.foodnests.orderapp',
    android: 'com.foodnests.orderapp',
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
    ios: 'com.movingwheelsdelivery.orderapp',
    android: 'com.movingwheelsdelivery.orderapp',
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
    ios: 'com.app.mml',
    android: 'com.app.mml',
  }),
  bimol: Platform.select({
    ios: 'com.bimol.user',
    android: 'com.bimol.user',
  }),
  vendorspot: Platform.select({
    ios: 'com.vendorspot',
    android: 'com.vendorspot',
  }),
  sxm2go: Platform.select({
    ios: 'com.sxm2go.userapp',
    android: 'com.sxm2go.userapp',
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
    ios: 'com.tmgShops.orders',
    android: 'com.tmgShops.orders',
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
    ios: 'com.fijieats.user',
    android: 'com.fijieats.customer',
  }),
  fastmikes: Platform.select({
    ios: 'com.fastmikes.customer',
    android: 'com.fastmikes.customer',
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
    ios: 'com.app.ritenow',
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
    android: 'com.ullazOrder',
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
    ios: 'com.fairex.orders',
    android: 'com.fairex.orders',
  }),
  everywhere: Platform.select({
    ios: 'com.app.everywhere',
    android: 'com.app.everywhere',
  }),
  cannabisClubSF: Platform.select({
    ios: 'com.cannabisClubSF',
    android: 'com.cannabisClubSF',
  }),
  halaTalabat: Platform.select({
    ios: 'com.halaTalabat',
    android: 'com.halaTalabat',
  }),
  palmettoplus: Platform.select({
    ios: 'com.palmettoplus.customer',
    android: 'com.palmettoplus.customer',
  }),
  allotaxi: Platform.select({
    ios: 'com.allotaxi',
    android: 'com.allotaxi',
  }),
  jadorDrive: Platform.select({
    ios: 'com.jadorDrive',
    android: 'com.jadorDrive',
  }),
  ubercann: Platform.select({
    ios: 'com.UCANN',
    android: 'com.UCANN',
  }),
  kongafood: Platform.select({
    ios: 'com.kongafood',
    android: 'com.kongafood',
  }),
  launch: Platform.select({
    ios: 'com.customer.launch',
    android: 'com.customer.launch',
  }),
  kampick: Platform.select({
    ios: 'com.kampick',
    android: 'com.kampick',
  }),
  cabio: Platform.select({
    ios: 'com.cabio',
    android: 'com.cabio',
  }),
  tumbak: Platform.select({
    ios: 'com.tumbak',
    android: 'com.tumbak',
  }),
  iPicknDrop: Platform.select({
    ios: 'com.iPicknDrop.order',
    android: 'com.iPicknDrop.orderApp',
  }),
  bluebolt: Platform.select({
    ios: 'com.app.bluebolt',
    android: 'com.app.bluebolt',
  }),
  onthego: Platform.select({
    ios: 'com.customer.onthego',
    android: 'com.customer.onthego',
  }),
  mylaglobal: Platform.select({
    ios: 'com.mylaglobal',
    android: 'com.mylaglobal',
  }),
  ambutap: Platform.select({
    ios: 'com.ambutap',
    android: 'com.ambutap.userapp',
  }),
  sabroson: Platform.select({
    ios: 'com.sabroson.orders',
    android: 'com.sabroson.orders',
  }),
  swiffyllc: Platform.select({
    ios: 'com.swiffyllc.customer',
    android: 'com.swiffyllc.customer',
  }),
  meatEasy: Platform.select({
    ios: 'com.meatEasy',
    android: 'com.meatEasy',
  }),
  boltDelivery: Platform.select({
    ios: 'com.boltDelivery',
    android: 'com.boltDelivery',
  }),
  gamaDelivery: Platform.select({
    ios: 'com.gamaDelivery',
    android: 'com.gamaDelivery',
  }),
  hivefair: Platform.select({
    ios: 'com.hivefair',
    android: 'com.hivefair',
  }),
  localdropoff: Platform.select({
    ios: 'com.app.localdropoff',
    android: 'com.app.localdropoff',
  }),
  ubi: Platform.select({
    ios: 'com.application.ubi',
    android: 'com.ubi',
  }),
  beakme: Platform.select({
    ios: 'com.beakme',
    android: 'com.beakme',
  }),
  onscart: Platform.select({
    ios: 'com.onscart',
    android: 'com.onscart',
  }),
  mandaExpress: Platform.select({
    ios: 'com.mandaExpress.customer',
    android: 'com.mandaExpress.customer',
  }),
  gO: Platform.select({
    ios: 'com.customer.gO',
    android: 'com.customer.gO',
  }),
  foodies: Platform.select({
    ios: 'com.app.foodies',
    android: 'com.app.foodies',
  }),
  bauBau: Platform.select({
    ios: 'com.bauBau.order',
    android: 'com.baubau.order',
  }),
  bookARyde: Platform.select({
    ios: 'com.bookARyde',
    android: 'com.bookARyde',
  }),
  petsChoice: Platform.select({
    ios: 'com.petsChoice',
    android: 'com.petsChoice',
  }),
  heyBuddy: Platform.select({
    ios: 'com.app.heyBuddy',
    android: 'com.app.heyBuddy',
  }),
  yoloSonic: Platform.select({
    ios: 'com.yoloSonic',
    android: 'com.yoloSonic',
  }),
  mrHealth: Platform.select({
    ios: 'com.mrHealth',
    android: 'com.mrHealth.customer',
  }),
  lopht: Platform.select({
    ios: 'com.lopht',
    android: 'com.lopht',
  }),
  yalary: Platform.select({
    ios: 'com.yalary',
    android: 'com.yalary',
  }),
  seratho: Platform.select({
    ios: 'com.seratho',
    android: 'com.seratho',
  }),
  xborne: Platform.select({
    ios: 'com.xborne.order',
    android: 'com.xborne.order',
  }),
  fawaz: Platform.select({
    ios: 'com.fawaz',
    android: 'com.fawaz',
  }),
  grn: Platform.select({
    ios: 'com.grn',
    android: 'com.grn',
  }),
  delivadrinks: Platform.select({
    ios: 'com.delivadrinks',
    android: 'com.delivadrinks',
  }),
  myRide: Platform.select({
    ios: 'com.app.myRide',
    android: 'com.app.myRide',
  }),
  getfix: Platform.select({
    ios: 'com.getfix.customer',
    android: 'com.getfix.customer',
  }),
  scoopaTechnologies: Platform.select({
    ios: 'com.scoopaTechnologies',
    android: 'com.app.scoopaTechnologies',
  }),
  dbairro: Platform.select({
    ios: 'com.app.dbairro',
    android: 'com.Dbairro.order',
  }),
  knockknock: Platform.select({
    ios: 'com.knockKnock.userApp',
    android: 'com.knockKnock.userApp',
  }),
  qrider: Platform.select({
    ios: 'com.qrider',
    android: 'com.app.qrider',
  }),
  dlvrd: Platform.select({
    ios: 'com.application.dlvrd',
    android: 'com.dlvrd',
  }),
  delivery: Platform.select({
    ios: 'com.gdotDelivery.user',
    android: 'com.gdotDelivery.user',
  }),
  timHomeServices: Platform.select({
    ios: 'com.timHomeServices',
    android: 'com.app.timHomeServices',
  }),
  slider: Platform.select({
    ios: 'com.app.slider',
    android: 'com.app.slider',
  }),
  ICare: Platform.select({
    ios: 'com.codebrew.ICare',
    android: 'com.codebrew.ICare',
  }),

  viversbox: Platform.select({
    ios: 'com.viversbox.user',
    android: 'com.viversbox.user',
  }),
  scootz: Platform.select({
    ios: 'com.scootz',
    android: 'com.scootz.userapp',
  }),
  ola: Platform.select({
    ios: 'com.application.ola',
    android: 'com.app.ola',
  }),
  spliffnation: Platform.select({
    ios: 'com.spliffnation',
    android: 'com.spliffnation',
  }),
  sourcesServices: Platform.select({
    ios: 'com.sourcesServices',
    android: 'com.sourcesServices',
  }),
  wer: Platform.select({
    ios: 'com.app.wer',
    android: 'com.wer',
  }),
  beachhop: Platform.select({
    ios: 'com.beachhop.customer',
    android: 'com.beachhop.customer',
  }),
  qseek: Platform.select({
    ios: 'com.qseek',
    android: 'com.qseek',
  }),
  delvento: Platform.select({
    ios: 'com.delvento',
    android: 'com.delvento',
  }),
  rideshare: Platform.select({
    ios: 'com.customer.rideshare',
    android: 'com.classiccab.userapp',
  }),
  bua: Platform.select({
    ios: 'com.bua',
    android: 'com.bua',
  }),
  upstreet: Platform.select({
    ios: 'com.app.upstreet',
    android: 'com.upstreet',
  }),
  newYorkMiniMart: Platform.select({
    ios: 'com.littlebird.order',
    android: 'com.littlebird.order',
  }),
  airlinesRecruiter: Platform.select({
    ios: 'com.airlinesRecruiter',
    android: 'com.airlinesRecruiter',
  }),
  nineOneTwo: Platform.select({
    ios: 'com.nineonetwo.order',
    android: 'com.nineonetwo.order',
  }),
  trip: Platform.select({
    ios: 'com.app.trip',
    android: 'com.trip',
  }),
  aauJau: Platform.select({
    ios: 'com.aauJau',
    android: 'com.app.aaujau',
  }),
  mediPick: Platform.select({
    ios: 'com.mediPick',
    android: 'com.mediPick',
  }),
  meltivers: Platform.select({
    ios: 'com.meltiverse.user',
    android: 'com.meltiverse.user',
  }),
  ensoDigitalAgency: Platform.select({
    ios: 'com.ensoDigitalAgency',
    android: 'com.ensoDigitalAgency',
  }),
  hiperAbasto: Platform.select({
    ios: 'com.hiperAbastoOrder',
    android: 'com.hiperAbastoOrder',
  }),
  redglee: Platform.select({
    ios: 'com.redglee',
    android: 'com.redglee',
  }),
  dropItOffUsa: Platform.select({
    ios: 'com.dropItOffUsa',
    android: 'com.dropItOffUsaOrder',
  }),
  handyPickup: Platform.select({
    ios: 'com.handyPickup.orderapp',
    android: 'com.handyPickup.orderapp',
  }),
  TJJHub: Platform.select({
    ios: 'com.TJJHub',
    android: 'com.TJJHub',
  }),
  curblerLLC: Platform.select({
    ios: 'com.curblerLLC',
    android: 'com.curblerLLC',
  }),
  cartnar: Platform.select({
    ios: 'com.cartnar',
    android: 'com.cartnar',
  }),
  uven: Platform.select({
    ios: 'com.uven',
    android: 'com.uven',
  }),
  pAS41: Platform.select({
    ios: 'com.pAS41',
    android: 'com.pAS41',
  }),
  freshFarmz: Platform.select({
    ios: 'com.freshFarmz',
    android: 'com.freshFarmz',
  }),
  ryde: Platform.select({
    ios: 'com.customer.ryde',
    android: 'com.customer.ryde',
  }),
  waterTaxi: Platform.select({
    ios: 'com.customer.waterTaxi',
    android: 'com.customer.waterTaxi',
  }),
  muvpod: Platform.select({
    ios: 'com.muvpod',
    android: 'com.muvpod',
  }),
  smile: Platform.select({
    ios: 'com.customer.smile',
    android: 'com.customer.smile',
  }),
  caronaTaxi: Platform.select({
    ios: 'com.caronaTaxi',
    android: 'com.caronaTaxi',
  }),
  arwin: Platform.select({
    ios: 'com.arwin',
    android: 'com.arwin',
  }),
  marjMarketplace: Platform.select({
    ios: 'com.marjMarketplace',
    android: 'com.marjMarketplace',
  }),
  eVSOnTheGo: Platform.select({
    ios: 'com.eVSOnTheGo',
    android: 'com.eVSOnTheGo',
  }),
  kazakazi: Platform.select({
    ios: 'com.kazakazi',
    android: 'com.kazakazi',
  }),
  papiruki: Platform.select({
    ios: 'com.papiruki.userApp',
    android: 'com.papiruki.userApp',
  }),
  markSoublet: Platform.select({
    ios: 'com.markSoublet',
    android: 'com.markSoublet',
  }),
  amstaFood: Platform.select({
    ios: 'com.amstaFood',
    android: 'com.amstaFood',
  }),
  toor: Platform.select({
    ios: 'com.toor.order',
    android: 'com.toor.order',
  }),
  peerDeliveries: Platform.select({
    ios: 'com.peerDeliveries',
    android: 'com.peerDeliveries',
  }),
  swan: Platform.select({
    ios: 'com.swan.userApp',
    android: 'com.swan.userApp',
  }),
  SCOOTUP: Platform.select({
    ios: 'com.SCOOTUP',
    android: 'com.SCOOTUP',
  }),
  patrolNow: Platform.select({
    ios: 'com.patrolNow',
    android: 'com.patrolNow',
  }),
  butlerDelivery: Platform.select({
    ios: 'com.order.butlerDelivery',
    android: 'com.order.butlerDelivery',
  }),
  swatiRX: Platform.select({
    ios: 'com.swatiRX',
    android: 'com.swatiRX',
  }),

  chowHub: Platform.select({
    ios: 'com.chowHub',
    android: 'com.chowHub',
  }),
  ginDeliver: Platform.select({
    ios: 'com.ginDeliver',
    android: 'com.ginDeliver',
  }),
  orderFirst: Platform.select({
    ios: 'com.orderFirst',
    android: 'com.orderFirst',
  }),
  maiz: Platform.select({
    ios: 'com.maiz',
    android: 'com.maiz',
  }),
  dingDongEat: Platform.select({
    ios: 'com.app.dingDongEat',
    android: 'com.dingDongEat',
  }),
  medicab: Platform.select({
    ios: 'com.medicab',
    android: 'com.medicab',
  }),
  fazeiTeam: Platform.select({
    ios: 'com.fazeiTeam',
    android: 'com.fazeiTeam',
  }),
  weTogether: Platform.select({
    ios: 'com.weTogether',
    android: 'com.weTogether',
  }),
  jiffex: Platform.select({
    ios: 'com.jiffex',
    android: 'com.jiffex.order',
  }),
  clickService: Platform.select({
    ios: 'com.clickService',
    android: 'com.clickService',
  }),
  amazingTaxi: Platform.select({
    ios: 'com.amazingTaxi.orders',
    android: 'com.amazingTaxi.orders',
  }),
  jazzyBug: Platform.select({
    ios: 'com.jazzyBugOrder',
    android: 'com.jazzyBugOrder',
  }),
  myfarma: Platform.select({
    ios: 'com.myfarma',
    android: 'com.myfarma',
  }),
  valley: Platform.select({
    ios: 'com.valleyOrder',
    android: 'com.valleyOrder',
  }),
  kartAndKarry: Platform.select({
    ios: 'com.kartandkarry',
    android: 'com.kartAndKarry',
  }),
  quickLube: Platform.select({
    ios: 'com.quickLube',
    android: 'com.quickLube',
  }),
  keystoneDelivery: Platform.select({
    ios: 'com.keystone.orders',
    android: 'com.keystone.orders',
  }),
  blueBundles: Platform.select({
    ios: 'com.bluebundles.customer',
    android: 'com.bluebundles.customer',
  }),
  busTaMove: Platform.select({
    ios: 'com.bustamove',
    android: 'com.bustamove',
  }),
  atasktt: Platform.select({
    ios: 'com.atasktt',
    android: 'com.atasktt',
  }),
  lunchboxSpecials: Platform.select({
    ios: 'com.mealtime.orderapp',
    android: 'com.mealtime.orderapp',
  }),
  sorDelivery: Platform.select({
    ios: 'com.sordelivery',
    android: 'com.sordelivery',
  }),
  grubHouse: Platform.select({
    ios: 'com.grubHouse',
    android: 'com.grubHouse',
  }),
  hitchDelivery: Platform.select({
    ios: 'com.hitchDelivery',
    android: 'com.hitchDelivery',
  }),
  zoodMarket: Platform.select({
    ios: 'com.zoodMarket',
    android: 'com.zoodMarket',
  }),
  meow: Platform.select({
    ios: 'com.meow.order',
    android: 'com.meow.order',
  }),
  dingDongDelivers: Platform.select({
    ios: 'com.dingdongdelivery.order',
    android: 'com.dingdongdelivery.order',
  }),
  torunz: Platform.select({
    ios: 'com.torunz.userapp',
    android: 'com.torunz.userapp',
  }),
  kurs: Platform.select({
    ios: 'com.app.kurs',
    android: 'com.app.kurs',
  }),
  spa: Platform.select({
    ios: 'com.customerApp.spa',
    android: 'com.customerApp.spa',
  }),

  capitalDiagnostic: Platform.select({
    ios: 'com.capitaldiagnostic',
    android: 'com.capitaldiagnostic',
  }),

  abbeRides: Platform.select({
    ios: 'com.abbeRides.Orders',
    android: 'com.abbeRides.Orders',
  }),
  nrsa: Platform.select({
    ios: 'com.nrsa',
    android: 'com.nrsa',
  }),
  sadia: Platform.select({
    ios: 'com.Sadia',
    android: 'com.Sadia',
  }),
  elentaMart: Platform.select({
    ios: 'com.ElentaMart',
    android: 'com.ElentaMart',
  }),
  exprexPro: Platform.select({
    ios: 'com.exprexPro',
    android: 'com.exprexPro',
  }),
  fresHest: Platform.select({
    ios: 'com.FresHest.royoOrder',
    android: 'com.FresHest.royoOrder',
  }),
  servern: Platform.select({
    ios: 'com.servern.orderapp',
    android: 'com.servern.orderapp',
  }),
  smokeRun: Platform.select({
    ios: 'com.smokeRun.order',
    android: 'com.smokerun.ordersapp',
  }),
  myEvPlus: Platform.select({
    ios: 'com.myEvPlus.order',
    android: 'com.myEvPlus.order',
  }),
  qdelo: Platform.select({
    ios: 'com.qdelo.order',
    android: 'com.qdeloorder',
  }),
  pawsee: Platform.select({
    ios: 'com.pawsee.order',
    android: 'com.pawsee.order',
  }),
  hairRun: Platform.select({
    ios: 'com.hairRun.order',
    android: 'com.hairRun.order',
  }),
  zuriRide: Platform.select({
    ios: 'com.zuriRide.order',
    android: 'com.zuriRide.order',
  }),
  americanLuxury: Platform.select({
    ios: 'com.americanLuxury.order',
    android: 'com.americanLuxury.order',
  }),
  smartMur: Platform.select({
    ios: 'com.smartMur.order',
    android: 'com.smartMur.order',
  }),
  ouiSpeed: Platform.select({
    ios: 'com.ouiSpeed.order',
    android: 'com.ouiSpeed.order',
  }),
  getItSent: Platform.select({
    ios: 'com.getItSent.order',
    android: 'com.getItSent.order',
  }),
  easyDrink: Platform.select({
    ios: 'com.easyDrink.order',
    android: 'com.easyDrink.order',
  }),
  iAmSelling: Platform.select({
    ios: 'com.iAmSelling.order',
    android: 'com.iAmSelling.order',
  }),
  fifteenP: Platform.select({
    ios: 'com.fifteenP.order',
    android: 'com.fifteenP.order',
  }),
  euodooTechnologies: Platform.select({
    ios: 'com.euodooTechnologies.order',
    android: 'com.euodooTechnologies.order',
  }),
  rota: Platform.select({
    ios: 'com.rota.order',
    android: 'com.rota.order',
  }),
  farmMeat: Platform.select({
    ios: 'com.farmMeat.order',
    android: 'com.farmMeat.order',
  }),
  danielleBejjani: Platform.select({
    ios: 'com.danielleBejjani',
    android: 'com.danielleBejjani',
  }),
  yallaEat: Platform.select({
    ios: 'com.yallaEat.order',
    android: 'com.yallaEat.order',
  }),
  choizez: Platform.select({
    ios: 'com.choizez.order',
    android: 'com.choizez.order',
  }),
  otto: Platform.select({
    ios: 'com.otto.order',
    android: 'com.otto.order',
  }),
  rescueRoadsideAssistance: Platform.select({
    ios: 'com.rescueRoadsideAssistance.order',
    android: 'com.rescueRoadsideAssistance.order',
  }),
  tax_E: Platform.select({
    ios: 'com.taxE.order',
    android: 'com.taxE.order',
  }),
  baggageTaxi: Platform.select({
    ios: 'com.baggageTaxi.order',
    android: 'com.baggageTaxi.order',
  }),
  mersi: Platform.select({
    ios: 'com.mersi.order',
    android: 'com.mersi.order',
  }),
  foodSpot: Platform.select({
    ios: 'com.foodSpot.order',
    android: 'com.foodSpot.order',
  }),
  karibaMart: Platform.select({
    ios: 'com.karibaMart.order',
    android: 'com.karibaMart.order',
  }),
  sourceWith: Platform.select({
    ios: 'com.sourceWith.order',
    android: 'com.sourceWith.order',
  }),
  apptFindr: Platform.select({
    ios: 'com.apptFindr.order',
    android: 'com.apptFindr.order',
  }),
  vdu: Platform.select({
    ios: 'com.vdu.order',
    android: 'com.vdu.order',
  }),
  laundroZone: Platform.select({
    ios: 'com.laundroZone.orderapplication',
    android: 'com.laundroZone.orderapplication',
  }),
  taxiolgy: Platform.select({
    ios: 'com.taxiolgy.order',
    android: 'com.taxiolgy.order',
  }),
  swipe: Platform.select({
    ios: 'com.swipe.order',
    android: 'com.swipe.order',
  }),
  sheRyders: Platform.select({
    ios: 'com.sheRyders',
    android: 'com.sheRyders',
  }),
  kurrix: Platform.select({
    ios: 'com.kurrix.order',
    android: 'com.goadeliv.userapp',
  }),
  mrVeloz: Platform.select({
    ios: 'com.mrVeloz.orderapp',
    android: 'com.mrVeloz.orderapp',
  }),
  greenCab: Platform.select({
    ios: 'com.greenCab.order',
    android: 'com.greenCab.order',
  }),
  axxi: Platform.select({
    ios: 'com.axxi.order',
    android: 'com.axxi.order',
  }),
  pets: Platform.select({
    ios: 'com.pets.order',
    android: 'com.pets.order',
  }),
  getDress: Platform.select({
    ios: 'com.getDress.order',
    android: 'com.getDress.order',
  }),
  shelf: Platform.select({
    ios: 'com.shelf.order',
    android: 'com.shelf.order',
  }),
  baly: Platform.select({
    ios: 'com.baly.orders',
    android: 'com.baly.orders',
  }),
  nuvoni: Platform.select({
    ios: 'com.nuvoni.orders',
    android: 'com.nuvoni.orders',
  }),
  syloMart: Platform.select({
    ios: 'com.syloMart.order',
    android: 'com.syloMart.order',
  }),
  fairDeal: Platform.select({
    ios: 'com.fairDeal.order',
    android: 'com.fairDeal.order',
  }),
  hezniTaxi: Platform.select({
    ios: 'com.heznitaxi.royoorders',
    android: 'com.heznitaxi.royoorders',
  }),
  onTheWheel: Platform.select({
    ios: 'com.onthewheel.royorders',
    android: 'com.onthewheel.royorders',
  }),
  valleyMeats: Platform.select({
    ios: 'com.valleymeats.royoorders',
    android: 'com.valleymeats.royoorders',
  }),
  perucabs: Platform.select({
    ios: 'com.perucabs.royoorders',
    android: 'com.perucabs.royoorders',
  }),
  hafizjwlry: Platform.select({
    ios: 'com.hafizjwlry.orderapp',
    android: 'com.hafizjwlry.orderapp',
  }),
  jana: Platform.select({
    ios: 'com.jana.royoordersapp',
    android: 'com.jana.royoordersapp',
  }),
  myWayBill: Platform.select({
    ios: 'com.mywaybill.royoorders',
    android: 'com.mywaybill.royoorders',
  }),
  cattch: Platform.select({
    ios: 'com.cattch.royoorders',
    android: 'com.cattch.royoorders',
  }),
  tezras: Platform.select({
    ios: 'com.tezras.royoorders',
    android: 'com.tezras.royoorders',
  }),
  eureka: Platform.select({
    ios: 'com.eureka.royoorders',
    android: 'com.eureka.royoorders',
  }),
  kaypee: Platform.select({
    ios: 'com.kaypee.orderapp',
    android: 'com.kaypee.orderapp',
  }),
  hitaxi: Platform.select({
    ios: 'com.hitaxi.royoorders',
    android: 'com.hitaxi.royoorders',
  }),
  kwivar: Platform.select({
    ios: 'com.kwivar.royoorders',
    android: 'com.kwivar.royoorders',
  }),
  parcel: Platform.select({
    ios: 'com.parcel.royoorders',
    android: 'com.parcel.royoorders',
  }),
  lex: Platform.select({
    ios: 'com.lex.royoorders',
    android: 'com.lex.royoorders',
  }),
  smokyKitchen: Platform.select({
    ios: 'com.smokyKitchen.royoorders',
    android: 'com.smokyKitchen.royoorders',
  }),
  flank: Platform.select({
    ios: 'com.flank.royoorders',
    android: 'com.flank.royoorders',
  }),
  zynoride: Platform.select({
    ios: 'com.zynoride.royoorders',
    android: 'com.zynoride.royoorders',
  }),
  mealsarehere: Platform.select({
    ios: 'com.mealsarehere.royoorders',
    android: 'com.mealsarehere.royoorders',
  }),
  loamscape: Platform.select({
    ios: 'com.loamscape.royoorders',
    android: 'com.loamscape.royoorders',
  }),
  delcolink: Platform.select({
    ios: 'com.delcolink.royoorders',
    android: 'com.delcolink.royoorders',
  }),
  youSmokeShops: Platform.select({
    ios: 'com.youSmokeShops.royoorders',
    android: 'com.youSmokeShops.royoorders',
  }),
  doober: Platform.select({
    ios: 'com.doober.royoorders',
    android: 'com.doober.royoorders',
  }),
  inmotion: Platform.select({
    ios: 'com.inmotion.royoorders',
    android: 'com.inmotion.royoorders',
  }),
  eatHalal: Platform.select({
    ios: 'com.eathalal.royoorders',
    android: 'com.eathalal.royoorders',
  }),
  jeevann: Platform.select({
    ios: 'com.jeevan.orders',
    android: 'com.jeevan.orders',
  }),
  novamed: Platform.select({
    ios: 'com.novamed.royoorders',
    android: 'com.novamed.royoorders',
  }),
  awamer: Platform.select({
    ios: 'com.awamer.royoorders',
    android: 'com.awamer.royoorders',
  }),
  goTech: Platform.select({
    ios: 'com.goTech.royoorders',
    android: 'com.goTech.royoorders',
  }),
  idrv: Platform.select({
    ios: 'com.idvr.royoorders',
    android: 'com.idvr.royoorders',
  }),
  qwiker: Platform.select({
    ios: 'com.qwiker.royoorders',
    android: 'com.qwiker.royoorders',
  }),
  spryton: Platform.select({
    ios: 'com.spryton.royoorders',
    android: 'com.spryton.royoorders',
  }),
  nittosadai: Platform.select({
    ios: 'com.nittosadai.orders',
    android: 'com.nittosadai.orders',
  }),
  clickokart: Platform.select({
    ios: 'com.clickokart.royoorders',
    android: 'com.clickokart.royoorders',
  }),
  tiimo: Platform.select({
    ios: 'com.tiimo.orderApp',
    android: 'com.tiimo.orderApp',
  }),
  verz: Platform.select({
    ios: 'com.verz.royoorders',
    android: 'com.verz.royoorders',
  }),
  ragiomigo: Platform.select({
    ios: 'com.ragiomigo.royoorders',
    android: 'com.ragiomigo.royoorders',
  }),
  jimsAutoRescue: Platform.select({
    ios: 'com.jimsautorescue.royoorders',
    android: 'com.jimsautorescue.royoorders',
  }),
  carryfood: Platform.select({
    ios: 'com.carryfood.royoorders',
    android: 'com.carryFood',
  }),
  nhazi: Platform.select({
    ios: 'com.nhazi.royoorders',
    android: 'com.nhazi.royoorders',
  }),
  petverse: Platform.select({
    ios: 'com.petverse.royoorders',
    android: 'com.petverse.royoorders',
  }),
  clickndrop: Platform.select({
    ios: 'com.clickndrop.royoorders',
    android: 'com.clickndrop.royoorders',
  }),
  lifehomefit: Platform.select({
    ios: 'com.lifehomefit.royoorders',
    android: 'com.lifehomefit.royoorders',
  }),
  appi: Platform.select({
    ios: 'com.appi.royoorders',
    android: 'com.appi.royoorders',
  }),
  dbairro_: Platform.select({
    ios: 'com.dbairroapp.royoorders',
    android: 'com.dbairroapp.royoorders',
  }),
  genee: Platform.select({
    ios: 'com.genee.royoorders',
    android: 'com.genee.royoorders',
  }),
  speedyDelivery: Platform.select({
    ios: 'com.speedydelivery.orders',
    android: 'com.speedydelivery.orders',
  }),
  holla: Platform.select({
    ios: 'com.holla.orders',
    android: 'com.holla.orders',
  }),
  stabex: Platform.select({
    ios: 'com.stabex.orders',
    android: 'com.stabex.orders',
  }),
  uberWeeds: Platform.select({
    ios: 'com.uberweeds',
    android: 'com.uberweeds',
  }),
  cabPro: Platform.select({
    ios: 'com.cabpro.royoorders',
    android: 'com.cabpro.royoorders',
  }),
  pointoneExpediteDelivery: Platform.select({
    ios: 'com.pointoneExpediteDelivery.royoorders',
    android: 'com.pointoneExpediteDelivery.royoorders',
  }),
  saamanshop: Platform.select({
    ios: 'my.saamanshop.royoorders',
    android: 'my.saamanshop.royoorders',
  }),
  tdc: Platform.select({
    ios: 'com.tdc.royoorders',
    android: 'com.tdc.royoorders',
  }),
  giftyLeaf: Platform.select({
    ios: 'com.giftyleaf.royoorders',
    android: 'com.giftyleaf.royoorders',
  }),
  flyCommerce: Platform.select({
    ios: 'com.flycommerce.royoorders',
    android: 'com.flycommerce.royoorders',
  }),
  pik: Platform.select({
    ios: 'com.pik.royoorders',
    android: 'com.pik.royoorders',
  }),
  motina: Platform.select({
    ios: 'com.motina.royoorders',
    android: 'com.motina.royoorders',
  }),
  hungry: Platform.select({
    ios: 'com.hungry.royoorders',
    android: 'com.hungry.royoorders',
  }),
  greenhippo: Platform.select({
    ios: 'com.greenhippo.royoorders',
    android: 'com.greenhippo.royoorders',
  }),
  mymeddy: Platform.select({
    ios: 'com.mymeddy.royoorders',
    android: 'com.mymeddy.royoorders',
  }),
  uryd: Platform.select({
    ios: 'com.uryd.royoorders',
    android: 'com.uryd.royoorders',
  }),
  happySingh: Platform.select({
    ios: 'com.happysingh.royoorders',
    android: 'com.happysingh.royoorders',
  }),
  vital: Platform.select({
    ios: 'com.vital.royoorders',
    android: 'com.vital.royoorders',
  }),
  parcelworks: Platform.select({
    ios: 'com.parcelworks.royoorders',
    android: 'com.parcelworks.royoorders',
  }),
  usVetsDeliver: Platform.select({
    ios: 'com.UsVetsDeliver.royoorders',
    android: 'com.UsVetsDeliver.royoorders',
  }),
  konectame: Platform.select({
    ios: 'com.konectame.royoorders',
    android: 'com.konectame.royoorders',
  }),
  flybuilder: Platform.select({
    ios: 'com.flybuilder.royoorders',
    android: 'com.flybuilder.royoorders',
  }),
  skyline: Platform.select({
    ios: 'com.skyline.royoorders',
    android: 'com.skyline',
  }),
  bliss: Platform.select({
    ios: 'com.order.bliss',
    android: 'com.order.bliss',
  }),
  rentzy: Platform.select({
    ios: 'com.rentzy.royoorders',
    android: 'com.rentzy',
  }),
  todaysDeliverys: Platform.select({
    ios: 'com.todaysDeliverys.royoorders',
    android: 'com.todaysDeliverys.royoorders',
  }),
  locate: Platform.select({
    ios: 'com.locate.royoorders',
    android: 'com.locate.royoorders',
  }),
  georgiacollective: Platform.select({
    ios: 'com.georgiacollective.royoorders',
    android: 'com.georgiacollective.royoorders',
  }),
  otgWeeds: Platform.select({
    ios: 'com.otgweeds.royoorders',
    android: 'com.otgweeds.royoorders',
  }),
  rumbella: Platform.select({
    ios: 'com.rumbella.royoorders',
    android: 'com.rumbella.royoorders',
  }),
  lincshare: Platform.select({
    ios: 'com.lincshare.royoorders',
    android: 'com.lincshare.royoorders',
  }),
  lvlup: Platform.select({
    ios: 'com.lvlup.royoorders',
    android: 'com.lvlup.royoorders',
  }),
  glavour: Platform.select({
    ios: 'com.glavour.royoorders',
    android: 'com.glavour.royoorders',
  }),
  shipmoe: Platform.select({
    ios: 'com.shipmoe.royoorders',
    android: 'com.shipmoe.royoorders',
  }),
  bigBayong: Platform.select({
    ios: 'com.bigBayong.royoorders',
    android: 'com.bigBayong.royoorders',
  }),
  efectibo: Platform.select({
    ios: 'com.efectibo.royoorders',
    android: 'com.efectibo.royoorders',
  }),
  sooq: Platform.select({
    ios: 'com.sooq.royoorders',
    android: 'com.sooq.royoorders',
  }),
  hectoHomes: Platform.select({
    ios: 'com.hectohomes.royoorders',
    android: 'com.hectohomes.royoorders',
  }),
  zynoBidandRide: Platform.select({
    ios: 'com.zynoapp.royoorders',
    android: 'com.zynoapp.royoorders',
  }),
  glamguide: Platform.select({
    ios: 'com.glamguide.royoorders',
    android: 'com.glamguide.royoorders',
  }),
  solace: Platform.select({
    ios: 'com.solace.royoorders',
    android: 'com.solace.royoorders',
  }),
  superpana: Platform.select({
    ios: 'com.superpana.royoorders',
    android: 'com.superpana.royoorders',
  }),
  kero: Platform.select({
    ios: 'com.kero.royoorders',
    android: 'com.kero.royoorders',
  }),
  godamPAY: Platform.select({
    ios: 'com.godamPAY.royoorders',
    android: 'com.godamPAY.royoorders',
  }),
  housingSubsidies: Platform.select({
    ios: 'com.housingSubsidies.royoorders',
    android: 'com.housingSubsidies.royoorders',
  }),
  bocch: Platform.select({
    ios: 'com.bocch.royoorders',
    android: 'com.bocch.royoorders',
  }),
  potolo: Platform.select({
    ios: 'com.potolo.royoorders',
    android: 'com.potolo.royoorders',
  }),
  earnApp: Platform.select({
    ios: 'com.earnapp.royoorders',
    android: 'com.earnapp.royoorders',
  }),
  aredoo: Platform.select({
    ios: 'com.aredoo.royoorders',
    android: 'com.aredoo.royoorders',
  }),
  bukam: Platform.select({
    ios: 'com.bukam.royoorders',
    android: 'com.bukam.order',
  }),
  dot: Platform.select({
    ios: 'com.dot.royoorders',
    android: 'com.dot.royoorders',
  }),
  wizSonic: Platform.select({
    ios: 'com.wizSonic.royoorders',
    android: 'com.wizSonic.royoorders',
  }),
  udkay: Platform.select({
    ios: 'com.udkay.royoorders',
    android: 'com.udkeyorder',
  }),
  hattaFoodHub: Platform.select({
    ios: 'com.hattafoodhub.orderapp',
    android: 'com.hattaFoodHub.order',
  }),
  ondgoo: Platform.select({
    ios: 'com.ondgoo.royoorders',
    android: 'com.ondgoo.royoorders'
  }),

  zonesso: Platform.select({
    ios: 'com.zonesso.royoorders',
    android: 'com.zonesso.royoorders',
  }),
  junkerz: Platform.select({
    ios: 'com.junkerz.royoOrders',
    android: 'com.junkerz.royoOrders',
  }),
  shopcart: Platform.select({
    ios: 'com.shopcart.royoorder',
    android: 'com.shopcart.royoorder',
  }),
  viralClean: Platform.select({
    ios: 'com.viralclean.royoorder',
    android: 'com.viralclean.royoorder',
  }),
  stargaze: Platform.select({
    ios: 'com.stargaze.royoorder',
    android: 'com.stargaze.royoorder',
  }),
  messiaa: Platform.select({
    ios: 'com.messiaa.orders',
    android: 'com.messiaa.orders',
  }),
  superApp: Platform.select({
    ios: 'com.superapp.royoorder',
    android: 'com.superapp.royoorder',
  }),
  nounou: Platform.select({
    ios: 'com.nounou.royoorder',
    android: 'com.nounou.royoorder',
  }),
  laith: Platform.select({
    ios: 'com.laith.royoorder',
    android: 'com.laith.royoorder',
  }),
  liverpoolEats: Platform.select({
    ios: 'com.liverpoolEats.royoorder',
    android: 'com.liverpoolEats.royoorder',
  }),
  oaks: Platform.select({
    ios: 'com.oaks.royoorder',
    android: 'com.oaks.royoorder',
  }),
  buzy: Platform.select({
    ios: 'com.buszy.royoorder',
    android: 'com.buszy.royoorder',
  }),
  etaim: Platform.select({
    ios: 'com.etaim.royoorder',
    android: 'com.etiam.orderApp',
  }),
  dotTaxiApp: Platform.select({
    ios: 'com.dotTaxiApp.royoorder',
    android: 'com.dotTaxiApp.royoorder',
  }),
  airvoltTaxi: Platform.select({
    ios: 'com.airvoltTaxi.royoorder',
    android: 'com.airvoltTaxi.royoorder',
  }),
  melakPharmacy: Platform.select({
    ios: 'com.melakPharmacy.royoorder',
    android: 'com.melakPharmacy.royoorder',
  }),
  wiEnergi: Platform.select({
    ios: 'com.wienergi.royoorder',
    android: 'com.wienergi.royoorder',
  }),
  nannyAfrica: Platform.select({
    ios: 'com.nannyafrica',
    android: 'com.nannyafrica',
  }),
  whatchaGotPickUp: Platform.select({
    ios: 'com.whatchaGotPickUp',
    android: 'com.whatchaGotPickUp',
  }),
  gokart: Platform.select({
    ios: 'com.gokart.order',
    android: 'com.gokart.order',
  }),
  hqiStore: Platform.select({
    ios: 'com.hqiStore.order',
    android: 'com.hqiStore.order',
  }),
  tkaff: Platform.select({
    ios: 'com.tkaff.order',
    android: 'com.tkaff.order',
  }),
  nool: Platform.select({
    ios: 'com.nool.order',
    android: 'com.nool.order',
  }),
  rally: Platform.select({
    ios: 'com.rally.order',
    android: 'com.rally.order',
  }),
  shipSmart: Platform.select({
    ios: 'com.shipSmart.order',
    android: 'com.shipSmart.order',
  }),
  weemoov: Platform.select({
    ios: 'com.weemoov.order',
    android: 'com.weemoov.order',
  }),
  weedLomo: Platform.select({
    ios: 'com.weedLomo.order',
    android: 'com.weedLomo.order',
  }),
  ngoal: Platform.select({
    ios: 'com.nGoal.orderApp',
    android: 'com.nGoal.order',
  }),
  livraiZoo: Platform.select({
    ios: 'com.liverso.order',
    android: 'com.liverso.order',
  }),
  boozeBrothers: Platform.select({
    ios: 'com.boozeBrother.order',
    android: 'com.boozeBrothers.order',
  }),
  magicalBookings: Platform.select({
    ios: 'com.magicalBookings.order',
    android: 'com.magicalBookings.order',
  }),
  ebay: Platform.select({
    ios: 'com.ebay.order',
    android: 'com.ebay.order',
  }),
  readyToRent: Platform.select({
    ios: 'com.readyToRent.order',
    android: 'com.readyToRent.order',
  }),
  theGenie: Platform.select({
    ios: 'com.theGenie.order',
    android: 'com.theGenie.order',
  }),
  sultanCenter: Platform.select({
    ios: 'com.sultanCenter.order',
    android: 'com.sultanCenter.order',
  }),
  reedas: Platform.select({
    ios: 'com.reedas.order',
    android: 'com.reedas.order',
  }),
  onebasket: Platform.select({
    ios: 'com.onerbasket.order',
    android: 'com.onerbasket.order',
  }),
  zozozi: Platform.select({
    ios: 'com.zozozi.order',
    android: 'com.zozozi.order',
  }),
  ekobridge: Platform.select({
    ios: 'com.ekobridge.order',
    android: 'com.ekobridge.order',
  }),
  ambosSafariExpress: Platform.select({
    ios: 'com.ambosSafariExpress.order',
    android: 'com.ambosSafariExpress.order',
  }),
  zulbrand: Platform.select({
    ios: 'com.zulbrand.order',
    android: 'com.zulbrand.order',
  }),
  emart: Platform.select({
    ios: 'com.emart.order',
    android: 'com.emart.order',
  }),
  oyeeRides: Platform.select({
    ios: 'com.oyeeRides.order',
    android: 'com.oyeeRides.order',
  }),
  royoRides: Platform.select({
    ios: 'com.royoRides.order',
    android: 'com.royoRides.order',
  }),
  tempcorner: Platform.select({
    ios: 'com.tempcorner.royoorder',
    android: 'com.tempcorner.royoorder',
  }),
  autobox: Platform.select({
    ios: 'com.autobox.royoorders',
    android: 'com.autobox.royoorders',
  }),
  emiRates: Platform.select({
    ios: 'com.emiRates.royoorder',
    android: 'com.emiRates.royoorder',
  }),
  detailPros: Platform.select({
    ios: 'com.detailPros.royoorder',
    android: 'com.detailPros.royoorder',
  }),
  blink: Platform.select({
    ios: 'com.blink.royoorder',
    android: 'com.blink.royoorder',
  }),
  incubit: Platform.select({
    ios: 'com.incubit.royoorder',
    android: 'com.incubit.royoorder',
  }),
  virgingates: Platform.select({
    ios: 'com.virgingates.royoorder',
    android: 'com.virgingates.royoorder',
  }),
  zuluCluch: Platform.select({
    ios: 'com.zuluCluch.royoorders',
    android: 'com.zuluCluch.royoorders',
  }),
    ping: Platform.select({
    ios: 'com.ping.royoorder',
    android: 'com.ping.royoorder',
  }),
  chutneyeah: Platform.select({
    ios: 'com.chutneyeah.royoorder',
    android: 'com.chutneyeah.royoorder',
  }),
  ineeda: Platform.select({
    ios: 'com.ineeda.royoorder',
    android: 'com.ineeda.royoorder',
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
