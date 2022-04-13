import React, {useEffect, useState} from 'react';
import {Image, Linking, Text, View} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import store from '../../redux/store';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {appIds, shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  getImageUrl,
  getUrlRoutes,
  showError,
} from '../../utils/helperFunctions';
import {getItem, setItem} from '../../utils/utils';
import styles from './styles';
import RNFetchBlob from 'rn-fetch-blob-v2';
import {MaterialIndicator} from 'react-native-indicators';
import * as NavigationService from '../../navigation/NavigationService';
import {enums} from '../../utils/enums';
import {MyDarkTheme} from '../../styles/theme';
import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';

const fs = RNFetchBlob.fs;

export default function ShortCode({route, navigation}) {
  const shortCodeParam = route?.params?.shortCodeParam;
  // alert(shortCodeParam)
  const [state, setState] = useState({
    email: '',
    password: '',
    shortCode: '',
    isShortcodePrefilled: true,
    isBtnDisabled: true,
    isLoading: false,
    changeInShortCode: false,
    LoadingScreen: true,
  });
  const {dispatch} = store;

  const {
    shortCode,
    changeInShortCode,
    isBtnDisabled,
    isLoading,
    isShortcodePrefilled,
    LoadingScreen,
  } = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const {themeColors} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const customColor = themeColors.primary_color;

  useEffect(() => {
    (async () => {
      const saveShortCode = await getItem('saveShortCode');
      switch (getBundleId()) {
        case appIds.royoorder:
          // if (shortCodeParam) {
          //   updateState({shortCode: '', isShortcodePrefilled: false});
          // } else {
          //   updateState({shortCode: '245bae', isShortcodePrefilled: true});
          // }

          if (saveShortCode && !shortCodeParam) {
            updateState({
              shortCode: saveShortCode,
              isShortcodePrefilled: true,
            });
          } else {
            state;
            //updateState({shortCode: 'd0a898', isShortcodePrefilled: true});
            if (shortCodeParam) {
              updateState({shortCode: '', isShortcodePrefilled: false});
            } else {
              updateState({shortCode: '245bae', isShortcodePrefilled: true});
            }
          }
          break;
        case appIds.tranzit:
          updateState({
            shortCode: shortCodes.tranzit,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.runrun:
          updateState({
            shortCode: shortCodes.runrun,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hmoobhub:
          updateState({
            shortCode: shortCodes.hmoobhub,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.capcorp:
          updateState({
            shortCode: shortCodes.capcorp,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.masa:
          updateState({shortCode: shortCodes.masa, isShortcodePrefilled: true});
          break;
        case appIds.yogofood:
          updateState({
            shortCode: shortCodes.yogofood,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.spidbi:
          updateState({
            shortCode: shortCodes.spidbi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.clicktoeat:
          updateState({
            shortCode: shortCodes.clicktoeat,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.instamobile:
          updateState({
            shortCode: shortCodes.instamobile,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bottomsup:
          // if (!firebase.apps.length) {
          //   firebase.initializeApp(bottomsUpConfig);
          // }
          updateState({
            shortCode: shortCodes.bottomsup,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.helpnowrightnow:
          // if (!firebase.apps.length) {
          //   firebase.initializeApp(iosConfig);
          // }
          updateState({
            shortCode: shortCodes.helpnowrightnow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.africanvillagemarket:
          updateState({
            shortCode: shortCodes.africanvillagemarket,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ufood:
          updateState({
            shortCode: shortCodes.ufood,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.martinionwheels:
          updateState({
            shortCode: shortCodes.martinionwheels,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.blip:
          updateState({
            shortCode: shortCodes.blip,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cannabus:
          updateState({
            shortCode: shortCodes.cannabus,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.govachow:
          updateState({
            shortCode: shortCodes.govachow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bustanfakieh:
          updateState({
            shortCode: shortCodes.bustanfakieh,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.shariff:
          updateState({
            shortCode: shortCodes.shariff,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gajamove:
          updateState({
            shortCode: shortCodes.gajamove,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.getme:
          updateState({
            shortCode: shortCodes.getme,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.orbit:
          updateState({
            shortCode: shortCodes.orbit,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.carlitoo:
          updateState({
            shortCode: shortCodes.carlitoo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.specialhalal:
          updateState({
            shortCode: shortCodes.specialhalal,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.thehouse:
          updateState({
            shortCode: shortCodes.thehouse,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.tasmeem:
          updateState({
            shortCode: shortCodes.tasmeem,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.snabbhem:
          updateState({
            shortCode: shortCodes.snabbhem,
            // shortCode: '98f085',
            isShortcodePrefilled: true,
          });
          break;
        case appIds.lastminutedress:
          updateState({
            shortCode: shortCodes.lastminutedress,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.rerak:
          updateState({
            shortCode: shortCodes.rerak,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yummiidash:
          updateState({
            shortCode: shortCodes.yummiidash,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yoho:
          updateState({
            shortCode: shortCodes.yoho,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.glamsouq:
          updateState({
            shortCode: shortCodes.glamsouq,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.doctatransportation:
          updateState({
            shortCode: shortCodes.doctatransportation,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.washvalley:
          updateState({
            shortCode: shortCodes.washvalley,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.equamd:
          updateState({
            shortCode: shortCodes.equamd,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hellodeliver:
          updateState({
            shortCode: shortCodes.hellodeliver,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hoganchef:
          updateState({
            shortCode: shortCodes.hoganchef,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.servze:
          updateState({
            shortCode: shortCodes.servze,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.travo:
          updateState({
            shortCode: shortCodes.travo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cabdelivr:
          updateState({
            shortCode: shortCodes.cabdelivr,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.drus:
          updateState({
            shortCode: shortCodes.drus,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yahu:
          updateState({
            shortCode: shortCodes.yahu,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.zuzuclean:
          updateState({
            shortCode: shortCodes.zuzuclean,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.towtrek:
          updateState({
            shortCode: shortCodes.towtrek,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.arenagrub:
          updateState({
            shortCode: shortCodes.arenagrub,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.jet:
          updateState({
            shortCode: shortCodes.jet,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.africanize:
          updateState({
            shortCode: shortCodes.africanize,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.markita:
          updateState({
            shortCode: shortCodes.markita,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sirvu:
          updateState({
            shortCode: shortCodes.sirvu,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.ublue:
          updateState({
            shortCode: shortCodes.ublue,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mstechy:
          updateState({
            shortCode: shortCodes.mstechy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.senshive:
          updateState({
            shortCode: shortCodes.senshive,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ridemate:
          updateState({
            shortCode: shortCodes.ridemate,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.codiner:
          updateState({
            shortCode: shortCodes.codiner,
            // shortCode: '245bae',
            isShortcodePrefilled: true,
          });
          break;

        case appIds.housekeeper:
          updateState({
            shortCode: shortCodes.housekeeper,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hairstonexpress:
          updateState({
            shortCode: shortCodes.hairstonexpress,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.diamonddashers:
          updateState({
            shortCode: shortCodes.diamonddashers,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.destinationOps:
          updateState({
            shortCode: shortCodes.destinationOps,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.loopwhole:
          updateState({
            shortCode: shortCodes.loopwhole,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.vici:
          updateState({
            shortCode: shortCodes.vici,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.carhop:
          updateState({
            shortCode: shortCodes.carhop,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.yogolift:
          updateState({
            shortCode: shortCodes.yogolift,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.fleety:
          updateState({
            shortCode: shortCodes.fleety,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.flyinghorse:
          updateState({
            shortCode: shortCodes.flyinghorse,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.errand:
          updateState({
            shortCode: shortCodes.errand,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.partnerproject:
          updateState({
            shortCode: shortCodes.partnerproject,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.menus:
          updateState({
            shortCode: shortCodes.menus,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.doorstep:
          updateState({
            shortCode: shortCodes.doorstep,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sunshinerideshare:
          updateState({
            shortCode: shortCodes.sunshinerideshare,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.autotek:
          updateState({
            shortCode: shortCodes.autotek,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.wegotit:
          updateState({
            shortCode: shortCodes.wegotit,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.survuhs:
          updateState({
            shortCode: shortCodes.survuhs,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.igolux:
          updateState({
            shortCode: shortCodes.igolux,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.toda:
          updateState({
            shortCode: shortCodes.toda,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mobi:
          updateState({
            shortCode: shortCodes.mobi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yourlaundryapp:
          updateState({
            shortCode: shortCodes.yourlaundryapp,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hemptyfy:
          updateState({
            shortCode: shortCodes.hemptyfy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sharu:
          updateState({
            shortCode: shortCodes.sharu,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.smcompany:
          updateState({
            shortCode: shortCodes.smcompany,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.totum4U:
          updateState({
            shortCode: shortCodes.totum4U,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hmc:
          updateState({
            shortCode: shortCodes.hmc,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.groupy:
          updateState({
            shortCode: shortCodes.groupy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.weeat:
          updateState({
            shortCode: shortCodes.weeat,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gorillas:
          updateState({
            shortCode: shortCodes.gorillas,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.baytukom:
          updateState({
            shortCode: shortCodes.baytukom,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.eboyo:
          updateState({
            shortCode: shortCodes.eboyo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.vecto:
          updateState({
            shortCode: shortCodes.vecto,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.share:
          updateState({
            shortCode: shortCodes.share,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.pickmeup:
          updateState({
            shortCode: shortCodes.pickmeup,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.taquick:
          updateState({
            shortCode: shortCodes.taquick,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.goody:
          updateState({
            shortCode: shortCodes.goody,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.grub:
          updateState({
            shortCode: shortCodes.grub,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gusto:
          updateState({
            shortCode: shortCodes.gusto,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.punnet:
          updateState({
            shortCode: shortCodes.punnet,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.homeric:
          updateState({
            shortCode: shortCodes.homeric,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.voltaic:
          updateState({
            shortCode: shortCodes.voltaic,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.zest:
          updateState({
            shortCode: shortCodes.zest,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gokab:
          updateState({
            shortCode: shortCodes.gokab,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.elixir:
          updateState({
            shortCode: shortCodes.elixir,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ace:
          updateState({
            shortCode: shortCodes.ace,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.suel:
          updateState({
            shortCode: shortCodes.suel,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.empire:
          updateState({
            shortCode: shortCodes.empire,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.expressdelivery:
          updateState({
            shortCode: shortCodes.expressdelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.booziedoozie:
          updateState({
            shortCode: shortCodes.booziedoozie,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.zestyclickz:
          updateState({
            shortCode: shortCodes.zestyclickz,
            isShortcodePrefilled: true,
          });
          break;
          break;
        case appIds.bakesale:
          updateState({
            shortCode: shortCodes.bakesale,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.elcheregio:
          updateState({
            shortCode: shortCodes.elcheregio,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yaawi:
          updateState({
            shortCode: shortCodes.yaawi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hosta:
          updateState({
            shortCode: shortCodes.hosta,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.somame:
          updateState({
            shortCode: shortCodes.somame,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.goodwheelz:
          updateState({
            shortCode: shortCodes.goodwheelz,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.tranznet:
          updateState({
            shortCode: shortCodes.tranznet,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sambiga:
          updateState({
            shortCode: shortCodes.sambiga,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.agrionline:
          updateState({
            shortCode: shortCodes.agrionline,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.quickquick:
          updateState({
            shortCode: shortCodes.quickquick,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.caribeclean:
          updateState({
            shortCode: shortCodes.caribeclean,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.stonses:
          updateState({
            shortCode: shortCodes.stonses,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.agbdeliveries:
          updateState({
            shortCode: shortCodes.agbdeliveries,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bookem:
          updateState({
            shortCode: shortCodes.bookem,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.twofinder:
          updateState({
            shortCode: shortCodes.twofinder,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.zip:
          updateState({
            shortCode: shortCodes.zip,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ridetci:
          updateState({
            shortCode: shortCodes.ridetci,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.noki:
          updateState({
            shortCode: shortCodes.noki,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.driveree:
          updateState({
            shortCode: shortCodes.driveree,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.rxnow:
          updateState({
            shortCode: shortCodes.rxnow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.seachangevending:
          updateState({
            shortCode: shortCodes.seachangevending,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ored:
          updateState({
            shortCode: shortCodes.ored,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.orderchekout:
          updateState({
            shortCode: shortCodes.orderchekout,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.maxisdelivery:
          updateState({
            shortCode: shortCodes.maxisdelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.donepacked:
          updateState({
            shortCode: shortCodes.donepacked,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.careworks:
          updateState({
            shortCode: shortCodes.careworks,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.thubaerides:
          updateState({
            shortCode: shortCodes.thubaerides,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.pinkjet:
          updateState({
            shortCode: shortCodes.pinkjet,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mokabfix:
          updateState({
            shortCode: shortCodes.mokabfix,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.botseats:
          updateState({
            shortCode: shortCodes.botseats,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gumastas:
          updateState({
            shortCode: shortCodes.gumastas,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.dishefs:
          updateState({
            shortCode: shortCodes.dishefs,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bilionza:
          updateState({
            shortCode: shortCodes.bilionza,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.doleypharmacy:
          updateState({
            shortCode: shortCodes.doleypharmacy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bezalio:
          updateState({
            shortCode: shortCodes.bezalio,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.youchillax:
          updateState({
            shortCode: shortCodes.youchillax,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.instashop:
          updateState({
            shortCode: shortCodes.instashop,
            isShortcodePrefilled: true,
          });
          s;
          break;
        case appIds.shoorafresh:
          updateState({
            shortCode: shortCodes.shoorafresh,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.click2deliver:
          updateState({
            shortCode: shortCodes.click2deliver,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.trucktirenow:
          updateState({
            shortCode: shortCodes.trucktirenow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yeboy:
          updateState({
            shortCode: shortCodes.yeboy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.kel360:
          updateState({
            shortCode: shortCodes.kel360,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.moboserrandsservice:
          updateState({
            shortCode: shortCodes.moboserrandsservice,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cabway:
          updateState({
            shortCode: shortCodes.cabway,
            isShortcodePrefilled: true,
          });
          break;
          break;
        case appIds.tajammul:
          updateState({
            shortCode: shortCodes.tajammul,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.carroai:
          updateState({
            shortCode: shortCodes.carroai,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ssuum:
          updateState({
            shortCode: shortCodes.ssuum,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.blacnetwork:
          updateState({
            shortCode: shortCodes.blacnetwork,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.threadagain:
          updateState({
            shortCode: shortCodes.threadagain,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ezmobilefuel:
          updateState({
            shortCode: shortCodes.ezmobilefuel,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.runaround:
          updateState({
            shortCode: shortCodes.runaround,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.swiftandvalu:
          updateState({
            shortCode: shortCodes.swiftandvalu,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.trucxi:
          updateState({
            shortCode: shortCodes.trucxi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.paysic:
          updateState({
            shortCode: shortCodes.paysic,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.chipetaxi:
          updateState({
            shortCode: shortCodes.chipetaxi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.laundryorders:
          updateState({
            shortCode: shortCodes.laundryorders,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ineed:
          updateState({
            shortCode: shortCodes.ineed,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.nadelivery:
          updateState({
            shortCode: shortCodes.nadelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.marasym:
          updateState({
            shortCode: shortCodes.marasym,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.silvestre:
          updateState({
            shortCode: shortCodes.silvestre,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.samakeemart:
          updateState({
            shortCode: shortCodes.samakeemart,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.seaeats:
          updateState({
            shortCode: shortCodes.seaeats,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.enext:
          updateState({
            shortCode: shortCodes.enext,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hokitch:
          updateState({
            shortCode: shortCodes.hokitch,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.foodnests:
          updateState({
            shortCode: shortCodes.foodnests,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sponge:
          updateState({
            shortCode: shortCodes.sponge,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gomeat:
          updateState({
            shortCode: shortCodes.gomeat,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.shopcentral:
          updateState({
            shortCode: shortCodes.shopcentral,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.skidoo:
          updateState({
            shortCode: shortCodes.skidoo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.admCourier:
          updateState({
            shortCode: shortCodes.admCourier,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.kurbsidekings:
          updateState({
            shortCode: shortCodes.kurbsidekings,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.movingwheelsdelivery:
          updateState({
            shortCode: shortCodes.movingwheelsdelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.safewalks:
          updateState({
            shortCode: shortCodes.safewalks,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.dimavega:
          updateState({
            shortCode: shortCodes.dimavega,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.skoop:
          updateState({
            shortCode: shortCodes.skoop,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.kudhyo:
          updateState({
            shortCode: shortCodes.kudhyo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bharatMove:
          updateState({
            shortCode: shortCodes.bharatMove,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sofia:
          updateState({
            shortCode: shortCodes.sofia,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mml:
          updateState({
            shortCode: shortCodes.mml,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bimol:
          updateState({
            shortCode: shortCodes.bimol,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.vendorspot:
          updateState({
            shortCode: shortCodes.vendorspot,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sxm2go:
          updateState({
            shortCode: shortCodes.sxm2go,
          });
          break;
        case appIds.pinkydeli:
          updateState({
            shortCode: shortCodes.pinkydeli,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gasgiant:
          updateState({
            shortCode: shortCodes.gasgiant,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.releezer:
          updateState({
            shortCode: shortCodes.releezer,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.vendoor:
          updateState({
            shortCode: shortCodes.vendoor,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.farmersouq:
          updateState({
            shortCode: shortCodes.farmersouq,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.tmgShops:
          updateState({
            shortCode: shortCodes.tmgShops,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.stitchesonsite:
          updateState({
            shortCode: shortCodes.stitchesonsite,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.easyu:
          updateState({
            shortCode: shortCodes.easyu,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mozmarcas:
          updateState({
            shortCode: shortCodes.mozmarcas,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.myfiji:
          updateState({
            shortCode: shortCodes.myfiji,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.fastmikes:
          updateState({
            shortCode: shortCodes.fastmikes,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.citysuds:
          updateState({
            shortCode: shortCodes.citysuds,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.homeTownDelivery:
          updateState({
            shortCode: shortCodes.homeTownDelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ritenow:
          updateState({
            shortCode: shortCodes.ritenow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.flit:
          updateState({
            shortCode: shortCodes.flit,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ihelp:
          updateState({
            shortCode: shortCodes.ihelp,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ullaz:
          updateState({
            shortCode: shortCodes.ullaz,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.privatepremiumpickups:
          updateState({
            shortCode: shortCodes.privatepremiumpickups,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.fidesDelivery:
          updateState({
            shortCode: shortCodes.fidesDelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bksTaxi:
          updateState({
            shortCode: shortCodes.bksTaxi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.oxo:
          updateState({
            shortCode: shortCodes.oxo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sijang:
          updateState({
            shortCode: shortCodes.sijang,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.fairex:
          updateState({
            shortCode: shortCodes.fairex,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.everywhere:
          updateState({
            shortCode: shortCodes.everywhere,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cannabisClubSF:
          updateState({
            shortCode: shortCodes.cannabisClubSF,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.halaTalabat:
          updateState({
            shortCode: shortCodes.halaTalabat,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.palmettoplus:
          updateState({
            shortCode: shortCodes.palmettoplus,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.allotaxi:
          updateState({
            shortCode: shortCodes.allotaxi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.jadorDrive:
          updateState({
            shortCode: shortCodes.jadorDrive,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ubercann:
          updateState({
            shortCode: shortCodes.ubercann,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.kongafood:
          updateState({
            shortCode: shortCodes.kongafood,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.launch:
          updateState({
            shortCode: shortCodes.launch,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.kampick:
          updateState({
            shortCode: shortCodes.kampick,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cabio:
          updateState({
            shortCode: shortCodes.cabio,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.tumbak:
          updateState({
            shortCode: shortCodes.tumbak,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.iPicknDrop:
          updateState({
            shortCode: shortCodes.iPicknDrop,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bluebolt:
          updateState({
            shortCode: shortCodes.bluebolt,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.onthego:
          updateState({
            shortCode: shortCodes.onthego,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mylaglobal:
          updateState({
            shortCode: shortCodes.mylaglobal,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ambutap:
          updateState({
            shortCode: shortCodes.ambutap,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sabroson:
          updateState({
            shortCode: shortCodes.sabroson,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.swiffyllc:
          updateState({
            shortCode: shortCodes.swiffyllc,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.meatEasy:
          updateState({
            shortCode: shortCodes.meatEasy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.boltDelivery:
          updateState({
            shortCode: shortCodes.boltDelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gamaDelivery:
          updateState({
            shortCode: shortCodes.gamaDelivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hivefair:
          updateState({
            shortCode: shortCodes.hivefair,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.localdropoff:
          updateState({
            shortCode: shortCodes.localdropoff,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ubi:
          updateState({
            shortCode: shortCodes.ubi,
            isShortcodePrefilled: true,
          });
        case appIds.beakme:
          updateState({
            shortCode: shortCodes.beakme,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.onscart:
          updateState({
            shortCode: shortCodes.onscart,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mandaExpress:
          updateState({
            shortCode: shortCodes.mandaExpress,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.foodies:
          updateState({
            shortCode: shortCodes.foodies,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gO:
          updateState({
            shortCode: shortCodes.gO,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bauBau:
          updateState({
            shortCode: shortCodes.bauBau,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bookARyde:
          updateState({
            shortCode: shortCodes.bookARyde,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.petsChoice:
          updateState({
            shortCode: shortCodes.petsChoice,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.heyBuddy:
          updateState({
            shortCode: shortCodes.heyBuddy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yoloSonic:
          updateState({
            shortCode: shortCodes.yoloSonic,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mrHealth:
          updateState({
            shortCode: shortCodes.mrHealth,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.lopht:
          updateState({
            shortCode: shortCodes.lopht,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yalary:
          updateState({
            shortCode: shortCodes.yalary,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.seratho:
          updateState({
            shortCode: shortCodes.seratho,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.xborne:
          updateState({
            shortCode: shortCodes.xborne,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.fawaz:
          updateState({
            shortCode: shortCodes.fawaz,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.grn:
          updateState({
            shortCode: shortCodes.grn,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.delivadrinks:
          updateState({
            shortCode: shortCodes.delivadrinks,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.myRide:
          updateState({
            shortCode: shortCodes.myRide,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.getfix:
          updateState({
            shortCode: shortCodes.getfix,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.scoopaTechnologies:
          updateState({
            shortCode: shortCodes.scoopaTechnologies,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.dbairro:
          updateState({
            shortCode: shortCodes.dbairro,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.knockknock:
          updateState({
            shortCode: shortCodes.knockknock,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.qrider:
          updateState({
            shortCode: shortCodes.qrider,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.dlvrd:
          updateState({
            shortCode: shortCodes.dlvrd,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.delivery:
          updateState({
            shortCode: shortCodes.delivery,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.timHomeServices:
          updateState({
            shortCode: shortCodes.timHomeServices,
            isShortcodePrefilled: true,
          });

          break;
        case appIds.slider:
          updateState({
            shortCode: shortCodes.slider,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ICare:
          updateState({
            shortCode: shortCodes.ICare,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.viversbox:
          updateState({
            shortCode: shortCodes.viversbox,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.scootz:
          updateState({
            shortCode: shortCodes.scootz,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ola:
          updateState({
            shortCode: shortCodes.ola,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.spliffnation:
          updateState({
            shortCode: shortCodes.spliffnation,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sourcesServices:
          updateState({
            shortCode: shortCodes.sourcesServices,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.wer:
          updateState({
            shortCode: shortCodes.wer,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.beachhop:
          updateState({
            shortCode: shortCodes.beachhop,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.qseek:
          updateState({
            shortCode: shortCodes.qseek,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.delvento:
          updateState({
            shortCode: shortCodes.delvento,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.rideshare:
          updateState({
            shortCode: shortCodes.rideshare,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bua:
          updateState({
            shortCode: shortCodes.bua,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.upstreet:
          updateState({
            shortCode: shortCodes.upstreet,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.newYorkMiniMart:
          updateState({
            shortCode: shortCodes.newYorkMiniMart,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.airlinesRecruiter:
          updateState({
            shortCode: shortCodes.airlinesRecruiter,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.nineOneTwo:
          updateState({
            shortCode: shortCodes.nineOneTwo,
            isShortcodePrefilled: true,
          });
          break;
           case appIds.trip:
            updateState({
              shortCode: shortCodes.trip,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.aauJau:
            updateState({
              shortCode: shortCodes.aauJau,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.mediPick:
            updateState({
              shortCode: shortCodes.mediPick,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.meltivers:
            updateState({
              shortCode: shortCodes.meltivers,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.ensoDigitalAgency:
            updateState({
              shortCode: shortCodes.ensoDigitalAgency,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.hiperAbasto:
            updateState({
              shortCode: shortCodes.hiperAbasto,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.redglee:
            updateState({
              shortCode: shortCodes.redglee,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.dropItOffUsa:
            updateState({
              shortCode: shortCodes.dropItOffUsa,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.handyPickup:
            updateState({
              shortCode: shortCodes.handyPickup,
              isShortcodePrefilled: true,
            });
          break;
          case appIds.TJJHub:
            updateState({
              shortCode: shortCodes.TJJHub,
              isShortcodePrefilled: true,
            });
          break;
      }
    })();
  }, []);

  useEffect(() => {
    if (shortCode && isShortcodePrefilled) {
      checkScreen();
    }
  }, [shortCode, isShortcodePrefilled]);

  const checkScreen = () => {
    initApiHit();
    updateState({isShortcodePrefilled: true});
  };

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {});
  };

  //i did added in this fun signup page replace with tabroutes
  const _onSubmitShortCode = () => {
    updateState({isLoading: true});
    setTimeout(() => {
      initApiHit();
    }, 1000);
  };

  const initApiHit = async () => {
    const res = await getItem('setPrimaryLanguage');

    let header = {};

    if (!!res?.primary_language?.id) {
      header = {
        // code: '2f3120',
        code: shortCode,
        language: res?.primary_language?.id,
      };
    } else {
      header = {
        // code: '2f3120',
        code: shortCode,
      };
    }
    console.log(header, 'header');
    actions
      .initApp({}, header, false, null, null, true)
      .then((res) => {
        console.log(res, '<====headerResponse');
        if (res.data.mobile_banners.length > 0) {
          let preLoadBanners = res.data.mobile_banners.map((item, inx) => {
            return {
              uri: getImageUrl(
                item.image.image_fit,
                item.image.image_path,
                '800/600',
              ),
            };
          });
          FastImage.preload(preLoadBanners); //preload banners
        }
        if (res.data.dynamic_tutorial.length > 0) {
          let preLoadTutorial = res.data.dynamic_tutorial.map((el, inx) => {
            return {
              uri: `${el.file_name.image_fit}800/1600${el.file_name.image_path}`,
            };
          });
          console.log('preload tutorial', preLoadTutorial[0]);
          FastImage.preload(preLoadTutorial); //preload tutorial images
        }

        updateState({changeInShortCode: false});
        if (getBundleId() == appIds.royoorder) {
          actions.saveShortCode(shortCode);
        }

        homeData(res.data);
      })
      .catch((error) => {
        console.log(error, 'error>>>error>>error');

        updateState({
          isLoading: false,
          changeInShortCode: false,
          shortCode: '',
        });
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };

  //get home data

  //Home data

  async function handleDynamicLink(deepLinkUrl) {
    console.log('checking deep link >>> ', decodeURI(deepLinkUrl));
    if (deepLinkUrl != null) {
      setItem('deepLinkUrl', deepLinkUrl);
      let routeName = getUrlRoutes(deepLinkUrl, 1);
      var data = deepLinkUrl?.split('=').pop();
      console.log('checking deep link data >>> ', data);
      let removePer = decodeURI(data);
      let sendingData = JSON.parse(removePer);

      let decodedUri = decodeURI(deepLinkUrl);
      let vendorName = decodedUri.split('?')[1].split('&')[1].split('=')[1];
      let vendorId = decodedUri.split('?')[1].split('&')[0].split('=')[1];

      // return;
      setTimeout(() => {
        NavigationService.navigate(navigationStrings.TAB_ROUTES, {
          screen: navigationStrings.HOMESTACK,
          params: {
            screen: navigationStrings.PRODUCT_LIST,
            params: {
              data: {
                category_slug: 'Restaurants',
                id: vendorId,
                name: vendorName,
                vendor: true,
                table_id: sendingData,
              },
            },
          },
        });
      }, 1800);
    } else {
      navigation.push(navigationStrings.TAB_ROUTES);
    }
  }

  const handleNotiRedirectionForVendorApp = (deepLinkUrl) => {
    if (deepLinkUrl != null) {
      navigation.navigate(navigationStrings.TABROUTESVENDORNEW, {
        screen: navigationStrings.ROYO_VENDOR_ORDER,
        params: {index: 1},
      });
    } else {
      navigation.navigate(navigationStrings.TABROUTESVENDORNEW);
    }
  };

  const navigateToNextScreen = (res, homeData) => {
    // return;
    if (enums.isVendorStandloneApp) {
      if (!!userData?.auth_token) {
        Linking.getInitialURL()
          .then((link) => {
            handleNotiRedirectionForVendorApp(link);
          })
          .catch((err) => {
            console.log('checking deep link >>> 3232sdsd', err);
          });
      } else {
        // navigation.navigate(navigationStrings.LOGIN);
        NavigationService.resetStackAndNavigate(
          navigation,
          navigationStrings.LOGIN,
        );
      }
    } else {
      getItem('firstTime').then((el) => {
        if (!el && res.dynamic_tutorial && res.dynamic_tutorial.length > 0) {
          navigation.push(navigationStrings.APP_INTRO, {
            images: res.dynamic_tutorial,
          });
        } else {
          // navigation.push(navigationStrings.TAB_ROUTES);
          Linking.getInitialURL()
            .then((link) => {
              handleDynamicLink(link);
            })
            .catch((err) => {
              console.log('checking deep link >>> 3232sdsd', err);
            });
        }
      });
    }
  };

  const homeData = (res) => {
    actions
      .homeData(
        {},
        {
          code: res?.profile?.code,
          currency: res?.currencies?.find((x) => x.is_primary).currency_id,
          language: res?.languages?.find((x) => x.is_primary).language_id,
        },
        true,
      )
      .then((homeData) => {
        updateState({isLoading: false, LoadingScreen: false});
        navigateToNextScreen(res, homeData.data);
      })
      .catch((error) => {
        updateState({isLoading: false});
        navigateToNextScreen(res, homeData.data);
      });
  };

  const onOtpInput = (code) => {
    (async () => {
      updateState({
        isLoading: true,
        shortCode: code,
        changeInShortCode: true,
      });
      //
    })();
  };

  useEffect(() => {
    (async () => {
      if (changeInShortCode) {
        const saveShortCode = await getItem('saveShortCode');
        if (saveShortCode && shortCode != saveShortCode) {
          actions.userLogout();
          actions.cartItemQty('');
          actions.saveAddress(null);
          actions.saveAllUserAddress([]);
        }
        initApiHit();
      }
    })();
  }, [changeInShortCode]);

  useEffect(() => {
    if (shortCode?.length === 6) {
      updateState({isBtnDisabled: false});
    } else {
      updateState({isBtnDisabled: true});
    }
  }, [shortCode, isLoading]);

  // let image = ''
  // if (Platform.OS === 'android') {
  //   image = require('../../../android/app/src/CareWorks/res/drawable-xxxhdpi/splash.png')
  // } else {
  //   image = require('../../../ios/Configs/CareWorks/Images.xcassets/Splash.imageset/ic_splash.png')
  //   // image = {uri: "file://" + fs.dirs.DocumentDir + '/Splash.png'}
  //   // image = {uri: "file:///Users/admin/Library/Developer/CoreSimulator/Devices/84EAA354-7A24-49DC-8CDC-8C02976A69B9/data/Containers/Data/Application/FE01C2A0-4CEA-44D5-B2D3-A052319D316E/Documents/Splash.png", scale: 1}
  //   image = { uri: 'Splash' }
  //   console.log('checking image >>>>>', image, themeColors)
  // }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      {isShortcodePrefilled ? (
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              position: 'absolute',
              zIndex: 99,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5',
            }}>
            <View style={{position: 'absolute', bottom: moderateScale(100)}}>
              {LoadingScreen && (
                <MaterialIndicator size={50} color={colors.greyMedium} />
              )}
            </View>
          </View>
          <Image source={{uri: 'Splash'}} style={{flex: 1, zIndex: -1}} />
        </View>
      ) : (
        <WrapperContainer
          statusBarColor={colors.white}
          bgColor={colors.white}
          isLoadingB={isLoading}
          source={loaderOne}>
          <View
            style={{
              paddingHorizontal: moderateScale(24),
              flex: 1,
              marginTop: width / 3,
            }}>
            <Image style={{alignSelf: 'center'}} source={imagePath.logo} />
            <View style={{height: moderateScaleVertical(50)}} />
            <Text style={styles.enterShortCode}>
              {strings.ENTER_SHORT_CODE}
            </Text>
            <View style={{height: 10}} />
            <Text style={styles.enterShortCode2}>
              {strings.ENTERSHORTCODEBELOW}
            </Text>

            <View style={{height: 10}} />
            <SmoothPinCodeInput
              containerStyle={{alignSelf: 'center'}}
              password
              mask={
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 25,
                    backgroundColor: 'blue',
                  }}></View>
              }
              cellSize={width / 10}
              codeLength={6}
              cellSpacing={10}
              editable={true}
              cellStyle={{
                borderBottomWidth: 1,
                borderColor: 'gray',
              }}
              cellStyleFocused={{
                borderColor: 'black',
              }}
              textStyle={{
                fontSize: 24,
                color: colors.textBlue,
              }}
              textStyleFocused={{
                color: colors.textBlue,
              }}
              // autoCapitalize={'none'}
              inputProps={{
                autoCapitalize: 'none',
              }}
              value={shortCode}
              autoFocus={false}
              keyboardType={'default'}
              onTextChange={(shortCode) => updateState({shortCode})}
              onFulfill={(code) => onOtpInput(code)}
            />

            <View style={{height: 20}} />

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <ButtonWithLoader
                // isLoading={isLoading}
                color={colors.black}
                disabled={isBtnDisabled}
                btnStyle={{
                  ...styles.guestBtn,
                  ...{
                    backgroundColor: isBtnDisabled
                      ? colors.blueBackGroudB
                      : colors.blueBackGroudB,
                  },
                }}
                onPress={_onSubmitShortCode}
                btnText={strings.SUBMIT}
                btnTextStyle={{
                  color: isBtnDisabled ? colors.white : colors.white,
                }}
              />
            </View>

            <View style={{height: 20}} />
          </View>
        </WrapperContainer>
        // </KeyboardAwareScrollView>
      )}

      {/* </ScrollView> */}
    </View>
  );
}
