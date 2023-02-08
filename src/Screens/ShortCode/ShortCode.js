import { isEmpty } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { useDarkMode } from "react-native-dynamic";
import { getBundleId } from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { MaterialIndicator } from "react-native-indicators";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import ButtonWithLoader from "../../Components/ButtonWithLoader";
import { loaderOne } from "../../Components/Loaders/AnimatedLoaderFiles";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import * as NavigationService from "../../navigation/NavigationService";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import store from "../../redux/store";
import colors from "../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  width
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

import {
  getImageUrl,
  getUrlRoutes,
  showError
} from "../../utils/helperFunctions";
import { getItem, setItem } from "../../utils/utils";
import styles from "./styles";

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function ShortCode({ route, navigation }) {
  const shortCodeParam = route?.params?.shortCodeParam;

  const [state, setState] = useState({
    email: "",
    password: "",
    shortCode: "041795",
    isShortcodePrefilled: true,
    isBtnDisabled: true,
    isLoading: false,
    changeInShortCode: false,
    LoadingScreen: true,
    videoDurationEnded: false,
    allAppData: null,
    initapiresponse: false,
  });
  const { dispatch } = store;

  const {
    shortCode,
    changeInShortCode,
    isBtnDisabled,
    isLoading,
    isShortcodePrefilled,
    LoadingScreen,
    videoDurationEnded,
    allAppData,
    initapiresponse,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const {
    appStyle,
    currencies,
    languages,
    redirectedFrom,
    deepLinkUrl,
  } = useSelector((state) => state?.initBoot);
  const { userData, appSessionInfo } = useSelector((state) => state.auth || {});
  const { themeColors } = useSelector((state) => state?.initBoot || {});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const videoRef = useRef();

  const customColor = themeColors?.primary_color;

  console.log(redirectedFrom, "redirectedFromredirectedFromredirectedFrom");

  useEffect(() => {
    (async () => {
      const saveShortCode = await getItem("saveShortCode");

      switch (getBundleId()) {

        case appIds.royoorder:
          if (appSessionInfo == "show_shortcode") {
            updateState({ shortCode: "", isShortcodePrefilled: false });
          } else {
            updateState({
              shortCode: !!saveShortCode ? saveShortCode : shortCodes.royoorder,
              isShortcodePrefilled: true,
            });
          }
          return;

        case appIds.tranzit:
          updateState({
            shortCode: shortCodes.tranzit,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.runrun:
          updateState({
            shortCode: shortCodes.runrun,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.hmoobhub:
          updateState({
            shortCode: shortCodes.hmoobhub,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.capcorp:
          updateState({
            shortCode: shortCodes.capcorp,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.masa:
          updateState({
            shortCode: shortCodes.masa,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yogofood:
          updateState({
            shortCode: shortCodes.yogofood,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.spidbi:
          updateState({
            shortCode: shortCodes.spidbi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.clicktoeat:
          updateState({
            shortCode: shortCodes.clicktoeat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.instamobile:
          updateState({
            shortCode: shortCodes.instamobile,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bottomsup:
          updateState({
            shortCode: shortCodes.bottomsup,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.helpnowrightnow:
          updateState({
            shortCode: shortCodes.helpnowrightnow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.africanvillagemarket:
          updateState({
            shortCode: shortCodes.africanvillagemarket,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ufood:
          updateState({
            shortCode: shortCodes.ufood,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.martinionwheels:
          updateState({
            shortCode: shortCodes.martinionwheels,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.blip:
          updateState({
            shortCode: shortCodes.blip,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cannabus:
          updateState({
            shortCode: shortCodes.cannabus,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.govachow:
          updateState({
            shortCode: shortCodes.govachow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bustanfakieh:
          updateState({
            shortCode: shortCodes.bustanfakieh,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.shariff:
          updateState({
            shortCode: shortCodes.shariff,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gajamove:
          updateState({
            shortCode: shortCodes.gajamove,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.getme:
          updateState({
            shortCode: shortCodes.getme,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.orbit:
          updateState({
            shortCode: shortCodes.orbit,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.carlitoo:
          updateState({
            shortCode: shortCodes.carlitoo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.specialhalal:
          updateState({
            shortCode: shortCodes.specialhalal,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.thehouse:
          updateState({
            shortCode: shortCodes.thehouse,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.tasmeem:
          updateState({
            shortCode: shortCodes.tasmeem,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.snabbhem:
          updateState({
            shortCode: shortCodes.snabbhem,
            // shortCode: '98f085',
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lastminutedress:
          updateState({
            shortCode: shortCodes.lastminutedress,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rerak:
          updateState({
            shortCode: shortCodes.rerak,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yummiidash:
          updateState({
            shortCode: shortCodes.yummiidash,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yoho:
          updateState({
            shortCode: shortCodes.yoho,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.glamsouq:
          updateState({
            shortCode: shortCodes.glamsouq,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.doctatransportation:
          updateState({
            shortCode: shortCodes.doctatransportation,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.washvalley:
          updateState({
            shortCode: shortCodes.washvalley,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.equamd:
          updateState({
            shortCode: shortCodes.equamd,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hellodeliver:
          updateState({
            shortCode: shortCodes.hellodeliver,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hoganchef:
          updateState({
            shortCode: shortCodes.hoganchef,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.servze:
          updateState({
            shortCode: shortCodes.servze,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.travo:
          updateState({
            shortCode: shortCodes.travo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cabdelivr:
          updateState({
            shortCode: shortCodes.cabdelivr,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.drus:
          updateState({
            shortCode: shortCodes.drus,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yahu:
          updateState({
            shortCode: shortCodes.yahu,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zuzuclean:
          updateState({
            shortCode: shortCodes.zuzuclean,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.towtrek:
          updateState({
            shortCode: shortCodes.towtrek,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.arenagrub:
          updateState({
            shortCode: shortCodes.arenagrub,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jet:
          updateState({
            shortCode: shortCodes.jet,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.africanize:
          updateState({
            shortCode: shortCodes.africanize,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.markita:
          updateState({
            shortCode: shortCodes.markita,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sirvu:
          updateState({
            shortCode: shortCodes.sirvu,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.ublue:
          updateState({
            shortCode: shortCodes.ublue,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mstechy:
          updateState({
            shortCode: shortCodes.mstechy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.senshive:
          updateState({
            shortCode: shortCodes.senshive,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ridemate:
          updateState({
            shortCode: shortCodes.ridemate,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.codiner:
          updateState({
            shortCode: shortCodes.codiner,
            // shortCode: '245bae',
            isShortcodePrefilled: true,
          });
          return;

        case appIds.housekeeper:
          updateState({
            shortCode: shortCodes.housekeeper,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hairstonexpress:
          updateState({
            shortCode: shortCodes.hairstonexpress,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.diamonddashers:
          updateState({
            shortCode: shortCodes.diamonddashers,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.destinationOps:
          updateState({
            shortCode: shortCodes.destinationOps,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.loopwhole:
          updateState({
            shortCode: shortCodes.loopwhole,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.vici:
          updateState({
            shortCode: shortCodes.vici,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.carhop:
          updateState({
            shortCode: shortCodes.carhop,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.yogolift:
          updateState({
            shortCode: shortCodes.yogolift,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.fleety:
          updateState({
            shortCode: shortCodes.fleety,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.flyinghorse:
          updateState({
            shortCode: shortCodes.flyinghorse,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.errand:
          updateState({
            shortCode: shortCodes.errand,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.partnerproject:
          updateState({
            shortCode: shortCodes.partnerproject,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.menus:
          updateState({
            shortCode: shortCodes.menus,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.doorstep:
          updateState({
            shortCode: shortCodes.doorstep,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sunshinerideshare:
          updateState({
            shortCode: shortCodes.sunshinerideshare,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.autotek:
          updateState({
            shortCode: shortCodes.autotek,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.wegotit:
          updateState({
            shortCode: shortCodes.wegotit,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.survuhs:
          updateState({
            shortCode: shortCodes.survuhs,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.igolux:
          updateState({
            shortCode: shortCodes.igolux,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.toda:
          updateState({
            shortCode: shortCodes.toda,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mobi:
          updateState({
            shortCode: shortCodes.mobi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yourlaundryapp:
          updateState({
            shortCode: shortCodes.yourlaundryapp,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hemptyfy:
          updateState({
            shortCode: shortCodes.hemptyfy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sharu:
          updateState({
            shortCode: shortCodes.sharu,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.smcompany:
          updateState({
            shortCode: shortCodes.smcompany,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.totum4U:
          updateState({
            shortCode: shortCodes.totum4U,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hmc:
          updateState({
            shortCode: shortCodes.hmc,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.groupy:
          updateState({
            shortCode: shortCodes.groupy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.weeat:
          updateState({
            shortCode: shortCodes.weeat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gorillas:
          updateState({
            shortCode: shortCodes.gorillas,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.baytukom:
          updateState({
            shortCode: shortCodes.baytukom,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.eboyo:
          updateState({
            shortCode: shortCodes.eboyo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.vecto:
          updateState({
            shortCode: shortCodes.vecto,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.share:
          updateState({
            shortCode: shortCodes.share,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pickmeup:
          updateState({
            shortCode: shortCodes.pickmeup,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.taquick:
          updateState({
            shortCode: shortCodes.taquick,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.goody:
          updateState({
            shortCode: shortCodes.goody,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.grub:
          updateState({
            shortCode: shortCodes.grub,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gusto:
          updateState({
            shortCode: shortCodes.gusto,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.punnet:
          updateState({
            shortCode: shortCodes.punnet,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.homeric:
          updateState({
            shortCode: shortCodes.homeric,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.voltaic:
          updateState({
            shortCode: shortCodes.voltaic,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zest:
          updateState({
            shortCode: shortCodes.zest,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gokab:
          updateState({
            shortCode: shortCodes.gokab,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.elixir:
          updateState({
            shortCode: shortCodes.elixir,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ace:
          updateState({
            shortCode: shortCodes.ace,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.suel:
          updateState({
            shortCode: shortCodes.suel,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.empire:
          updateState({
            shortCode: shortCodes.empire,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.expressdelivery:
          updateState({
            shortCode: shortCodes.expressdelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.booziedoozie:
          updateState({
            shortCode: shortCodes.booziedoozie,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zestyclickz:
          updateState({
            shortCode: shortCodes.zestyclickz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bakesale:
          updateState({
            shortCode: shortCodes.bakesale,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.elcheregio:
          updateState({
            shortCode: shortCodes.elcheregio,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yaawi:
          updateState({
            shortCode: shortCodes.yaawi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hosta:
          updateState({
            shortCode: shortCodes.hosta,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.somame:
          updateState({
            shortCode: shortCodes.somame,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.goodwheelz:
          updateState({
            shortCode: shortCodes.goodwheelz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tranznet:
          updateState({
            shortCode: shortCodes.tranznet,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sambiga:
          updateState({
            shortCode: shortCodes.sambiga,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.agrionline:
          updateState({
            shortCode: shortCodes.agrionline,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.quickquick:
          updateState({
            shortCode: shortCodes.quickquick,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.caribeclean:
          updateState({
            shortCode: shortCodes.caribeclean,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.stonses:
          updateState({
            shortCode: shortCodes.stonses,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.agbdeliveries:
          updateState({
            shortCode: shortCodes.agbdeliveries,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bookem:
          updateState({
            shortCode: shortCodes.bookem,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.twofinder:
          updateState({
            shortCode: shortCodes.twofinder,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zip:
          updateState({
            shortCode: shortCodes.zip,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ridetci:
          updateState({
            shortCode: shortCodes.ridetci,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.noki:
          updateState({
            shortCode: shortCodes.noki,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.driveree:
          updateState({
            shortCode: shortCodes.driveree,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rxnow:
          updateState({
            shortCode: shortCodes.rxnow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.seachangevending:
          updateState({
            shortCode: shortCodes.seachangevending,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ored:
          updateState({
            shortCode: shortCodes.ored,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.orderchekout:
          updateState({
            shortCode: shortCodes.orderchekout,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.maxisdelivery:
          updateState({
            shortCode: shortCodes.maxisdelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.donepacked:
          updateState({
            shortCode: shortCodes.donepacked,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.careworks:
          updateState({
            shortCode: shortCodes.careworks,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.thubaerides:
          updateState({
            shortCode: shortCodes.thubaerides,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pinkjet:
          updateState({
            shortCode: shortCodes.pinkjet,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mokabfix:
          updateState({
            shortCode: shortCodes.mokabfix,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.botseats:
          updateState({
            shortCode: shortCodes.botseats,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gumastas:
          updateState({
            shortCode: shortCodes.gumastas,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dishefs:
          updateState({
            shortCode: shortCodes.dishefs,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bilionza:
          updateState({
            shortCode: shortCodes.bilionza,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.doleypharmacy:
          updateState({
            shortCode: shortCodes.doleypharmacy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bezalio:
          updateState({
            shortCode: shortCodes.bezalio,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.youchillax:
          updateState({
            shortCode: shortCodes.youchillax,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.instashop:
          updateState({
            shortCode: shortCodes.instashop,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.shoorafresh:
          updateState({
            shortCode: shortCodes.shoorafresh,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.click2deliver:
          updateState({
            shortCode: shortCodes.click2deliver,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.trucktirenow:
          updateState({
            shortCode: shortCodes.trucktirenow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yeboy:
          updateState({
            shortCode: shortCodes.yeboy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kel360:
          updateState({
            shortCode: shortCodes.kel360,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.moboserrandsservice:
          updateState({
            shortCode: shortCodes.moboserrandsservice,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cabway:
          updateState({
            shortCode: shortCodes.cabway,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tajammul:
          updateState({
            shortCode: shortCodes.tajammul,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.carroai:
          updateState({
            shortCode: shortCodes.carroai,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ssuum:
          updateState({
            shortCode: shortCodes.ssuum,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.blacnetwork:
          updateState({
            shortCode: shortCodes.blacnetwork,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.threadagain:
          updateState({
            shortCode: shortCodes.threadagain,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ezmobilefuel:
          updateState({
            shortCode: shortCodes.ezmobilefuel,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.runaround:
          updateState({
            shortCode: shortCodes.runaround,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.swiftandvalu:
          updateState({
            shortCode: shortCodes.swiftandvalu,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.trucxi:
          updateState({
            shortCode: shortCodes.trucxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.paysic:
          updateState({
            shortCode: shortCodes.paysic,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.chipetaxi:
          updateState({
            shortCode: shortCodes.chipetaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.laundryorders:
          updateState({
            shortCode: shortCodes.laundryorders,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ineed:
          updateState({
            shortCode: shortCodes.ineed,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nadelivery:
          updateState({
            shortCode: shortCodes.nadelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.marasym:
          updateState({
            shortCode: shortCodes.marasym,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.silvestre:
          updateState({
            shortCode: shortCodes.silvestre,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.samakeemart:
          updateState({
            shortCode: shortCodes.samakeemart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.seaeats:
          updateState({
            shortCode: shortCodes.seaeats,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.enext:
          updateState({
            shortCode: shortCodes.enext,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hokitch:
          updateState({
            shortCode: shortCodes.hokitch,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.foodnests:
          updateState({
            shortCode: shortCodes.foodnests,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sponge:
          updateState({
            shortCode: shortCodes.sponge,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gomeat:
          updateState({
            shortCode: shortCodes.gomeat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.shopcentral:
          updateState({
            shortCode: shortCodes.shopcentral,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.skidoo:
          updateState({
            shortCode: shortCodes.skidoo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.admCourier:
          updateState({
            shortCode: shortCodes.admCourier,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kurbsidekings:
          updateState({
            shortCode: shortCodes.kurbsidekings,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.movingwheelsdelivery:
          updateState({
            shortCode: shortCodes.movingwheelsdelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.safewalks:
          updateState({
            shortCode: shortCodes.safewalks,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dimavega:
          updateState({
            shortCode: shortCodes.dimavega,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.skoop:
          updateState({
            shortCode: shortCodes.skoop,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kudhyo:
          updateState({
            shortCode: shortCodes.kudhyo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bharatMove:
          updateState({
            shortCode: shortCodes.bharatMove,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sofia:
          updateState({
            shortCode: shortCodes.sofia,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mml:
          updateState({
            shortCode: shortCodes.mml,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bimol:
          updateState({
            shortCode: shortCodes.bimol,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.vendorspot:
          updateState({
            shortCode: shortCodes.vendorspot,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sxm2go:
          updateState({
            shortCode: shortCodes.sxm2go,
          });
          return;
        case appIds.pinkydeli:
          updateState({
            shortCode: shortCodes.pinkydeli,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gasgiant:
          updateState({
            shortCode: shortCodes.gasgiant,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.releezer:
          updateState({
            shortCode: shortCodes.releezer,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.vendoor:
          updateState({
            shortCode: shortCodes.vendoor,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.farmersouq:
          updateState({
            shortCode: shortCodes.farmersouq,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tmgShops:
          updateState({
            shortCode: shortCodes.tmgShops,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.stitchesonsite:
          updateState({
            shortCode: shortCodes.stitchesonsite,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.easyu:
          updateState({
            shortCode: shortCodes.easyu,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mozmarcas:
          updateState({
            shortCode: shortCodes.mozmarcas,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.myfiji:
          updateState({
            shortCode: shortCodes.myfiji,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fastmikes:
          updateState({
            shortCode: shortCodes.fastmikes,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.citysuds:
          updateState({
            shortCode: shortCodes.citysuds,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.homeTownDelivery:
          updateState({
            shortCode: shortCodes.homeTownDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ritenow:
          updateState({
            shortCode: shortCodes.ritenow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.flit:
          updateState({
            shortCode: shortCodes.flit,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ihelp:
          updateState({
            shortCode: shortCodes.ihelp,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ullaz:
          updateState({
            shortCode: shortCodes.ullaz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.privatepremiumpickups:
          updateState({
            shortCode: shortCodes.privatepremiumpickups,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fidesDelivery:
          updateState({
            shortCode: shortCodes.fidesDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bksTaxi:
          updateState({
            shortCode: shortCodes.bksTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.oxo:
          updateState({
            shortCode: shortCodes.oxo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sijang:
          updateState({
            shortCode: shortCodes.sijang,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fairex:
          updateState({
            shortCode: shortCodes.fairex,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.everywhere:
          updateState({
            shortCode: shortCodes.everywhere,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cannabisClubSF:
          updateState({
            shortCode: shortCodes.cannabisClubSF,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.halaTalabat:
          updateState({
            shortCode: shortCodes.halaTalabat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.palmettoplus:
          updateState({
            shortCode: shortCodes.palmettoplus,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.allotaxi:
          updateState({
            shortCode: shortCodes.allotaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jadorDrive:
          updateState({
            shortCode: shortCodes.jadorDrive,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ubercann:
          updateState({
            shortCode: shortCodes.ubercann,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kongafood:
          updateState({
            shortCode: shortCodes.kongafood,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.launch:
          updateState({
            shortCode: shortCodes.launch,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kampick:
          updateState({
            shortCode: shortCodes.kampick,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cabio:
          updateState({
            shortCode: shortCodes.cabio,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tumbak:
          updateState({
            shortCode: shortCodes.tumbak,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.iPicknDrop:
          updateState({
            shortCode: shortCodes.iPicknDrop,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bluebolt:
          updateState({
            shortCode: shortCodes.bluebolt,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.onthego:
          updateState({
            shortCode: shortCodes.onthego,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mylaglobal:
          updateState({
            shortCode: shortCodes.mylaglobal,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ambutap:
          updateState({
            shortCode: shortCodes.ambutap,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sabroson:
          updateState({
            shortCode: shortCodes.sabroson,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.swiffyllc:
          updateState({
            shortCode: shortCodes.swiffyllc,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.meatEasy:
          updateState({
            shortCode: shortCodes.meatEasy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.boltDelivery:
          updateState({
            shortCode: shortCodes.boltDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gamaDelivery:
          updateState({
            shortCode: shortCodes.gamaDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hivefair:
          updateState({
            shortCode: shortCodes.hivefair,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.localdropoff:
          updateState({
            shortCode: shortCodes.localdropoff,
            isShortcodePrefilled: true,
          });
          return;
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
          return;
        case appIds.onscart:
          updateState({
            shortCode: shortCodes.onscart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mandaExpress:
          updateState({
            shortCode: shortCodes.mandaExpress,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.foodies:
          updateState({
            shortCode: shortCodes.foodies,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.gO:
          updateState({
            shortCode: shortCodes.gO,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bauBau:
          updateState({
            shortCode: shortCodes.bauBau,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bookARyde:
          updateState({
            shortCode: shortCodes.bookARyde,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.petsChoice:
          updateState({
            shortCode: shortCodes.petsChoice,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.heyBuddy:
          updateState({
            shortCode: shortCodes.heyBuddy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yoloSonic:
          updateState({
            shortCode: shortCodes.yoloSonic,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mrHealth:
          updateState({
            shortCode: shortCodes.mrHealth,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lopht:
          updateState({
            shortCode: shortCodes.lopht,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yalary:
          updateState({
            shortCode: shortCodes.yalary,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.seratho:
          updateState({
            shortCode: shortCodes.seratho,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.xborne:
          updateState({
            shortCode: shortCodes.xborne,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fawaz:
          updateState({
            shortCode: shortCodes.fawaz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.grn:
          updateState({
            shortCode: shortCodes.grn,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.delivadrinks:
          updateState({
            shortCode: shortCodes.delivadrinks,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.myRide:
          updateState({
            shortCode: shortCodes.myRide,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.getfix:
          updateState({
            shortCode: shortCodes.getfix,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.scoopaTechnologies:
          updateState({
            shortCode: shortCodes.scoopaTechnologies,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dbairro:
          updateState({
            shortCode: shortCodes.dbairro,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.knockknock:
          updateState({
            shortCode: shortCodes.knockknock,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.qrider:
          updateState({
            shortCode: shortCodes.qrider,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dlvrd:
          updateState({
            shortCode: shortCodes.dlvrd,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.delivery:
          updateState({
            shortCode: shortCodes.delivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.timHomeServices:
          updateState({
            shortCode: shortCodes.timHomeServices,
            isShortcodePrefilled: true,
          });

          return;
        case appIds.slider:
          updateState({
            shortCode: shortCodes.slider,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ICare:
          updateState({
            shortCode: shortCodes.ICare,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.viversbox:
          updateState({
            shortCode: shortCodes.viversbox,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.scootz:
          updateState({
            shortCode: shortCodes.scootz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ola:
          updateState({
            shortCode: shortCodes.ola,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.spliffnation:
          updateState({
            shortCode: shortCodes.spliffnation,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sourcesServices:
          updateState({
            shortCode: shortCodes.sourcesServices,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.wer:
          updateState({
            shortCode: shortCodes.wer,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.beachhop:
          updateState({
            shortCode: shortCodes.beachhop,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.qseek:
          updateState({
            shortCode: shortCodes.qseek,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.delvento:
          updateState({
            shortCode: shortCodes.delvento,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rideshare:
          updateState({
            shortCode: shortCodes.rideshare,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bua:
          updateState({
            shortCode: shortCodes.bua,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.upstreet:
          updateState({
            shortCode: shortCodes.upstreet,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.newYorkMiniMart:
          updateState({
            shortCode: shortCodes.newYorkMiniMart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.airlinesRecruiter:
          updateState({
            shortCode: shortCodes.airlinesRecruiter,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nineOneTwo:
          updateState({
            shortCode: shortCodes.nineOneTwo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.trip:
          updateState({
            shortCode: shortCodes.trip,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.aauJau:
          updateState({
            shortCode: shortCodes.aauJau,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mediPick:
          updateState({
            shortCode: shortCodes.mediPick,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.meltivers:
          updateState({
            shortCode: shortCodes.meltivers,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ensoDigitalAgency:
          updateState({
            shortCode: shortCodes.ensoDigitalAgency,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hiperAbasto:
          updateState({
            shortCode: shortCodes.hiperAbasto,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.redglee:
          updateState({
            shortCode: shortCodes.redglee,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dropItOffUsa:
          updateState({
            shortCode: shortCodes.dropItOffUsa,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.handyPickup:
          updateState({
            shortCode: shortCodes.handyPickup,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.TJJHub:
          updateState({
            shortCode: shortCodes.TJJHub,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.curblerLLC:
          updateState({
            shortCode: shortCodes.curblerLLC,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cartnar:
          updateState({
            shortCode: shortCodes.cartnar,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.uven:
          updateState({
            shortCode: shortCodes.uven,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pAS41:
          updateState({
            shortCode: shortCodes.pAS41,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.freshFarmz:
          updateState({
            shortCode: shortCodes.freshFarmz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ryde:
          updateState({
            shortCode: shortCodes.ryde,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.waterTaxi:
          updateState({
            shortCode: shortCodes.waterTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.muvpod:
          updateState({
            shortCode: shortCodes.muvpod,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.smile:
          updateState({
            shortCode: shortCodes.smile,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.caronaTaxi:
          updateState({
            shortCode: shortCodes.caronaTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.arwin:
          updateState({
            shortCode: shortCodes.arwin,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.marjMarketplace:
          updateState({
            shortCode: shortCodes.marjMarketplace,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.eVSOnTheGo:
          updateState({
            shortCode: shortCodes.eVSOnTheGo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kazakazi:
          updateState({
            shortCode: shortCodes.kazakazi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.papiruki:
          updateState({
            shortCode: shortCodes.papiruki,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.markSoublet:
          updateState({
            shortCode: shortCodes.markSoublet,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.amstaFood:
          updateState({
            shortCode: shortCodes.amstaFood,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.toor:
          updateState({
            shortCode: shortCodes.toor,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.peerDeliveries:
          updateState({
            shortCode: shortCodes.peerDeliveries,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.swan:
          updateState({
            shortCode: shortCodes.swan,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.SCOOTUP:
          updateState({
            shortCode: shortCodes.SCOOTUP,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.patrolNow:
          updateState({
            shortCode: shortCodes.patrolNow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.butlerDelivery:
          updateState({
            shortCode: shortCodes.butlerDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.swatiRX:
          updateState({
            shortCode: shortCodes.swatiRX,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.chowHub:
          updateState({
            shortCode: shortCodes.chowHub,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ginDeliver:
          updateState({
            shortCode: shortCodes.ginDeliver,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.orderFirst:
          updateState({
            shortCode: shortCodes.orderFirst,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.maiz:
          updateState({
            shortCode: shortCodes.maiz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dingDongEat:
          updateState({
            shortCode: shortCodes.dingDongEat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.medicab:
          updateState({
            shortCode: shortCodes.medicab,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fazeiTeam:
          updateState({
            shortCode: shortCodes.fazeiTeam,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.weTogether:
          updateState({
            shortCode: shortCodes.weTogether,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jiffex:
          updateState({
            shortCode: shortCodes.jiffex,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.clickService:
          updateState({
            shortCode: shortCodes.clickService,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.amazingTaxi:
          updateState({
            shortCode: shortCodes.amazingTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jazzyBug:
          updateState({
            shortCode: shortCodes.jazzyBug,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.myfarma:
          updateState({
            shortCode: shortCodes.myfarma,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.valley:
          updateState({
            shortCode: shortCodes.valley,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kartAndKarry:
          updateState({
            shortCode: shortCodes.kartAndKarry,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.quickLube:
          updateState({
            shortCode: shortCodes.quickLube,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.keystoneDelivery:
          updateState({
            shortCode: shortCodes.keystoneDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.blueBundles:
          updateState({
            shortCode: shortCodes.blueBundles,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.busTaMove:
          updateState({
            shortCode: shortCodes.busTaMove,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.atasktt:
          updateState({
            shortCode: shortCodes.atasktt,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lunchboxSpecials:
          updateState({
            shortCode: shortCodes.lunchboxSpecials,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sorDelivery:
          updateState({
            shortCode: shortCodes.sorDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.grubHouse:
          updateState({
            shortCode: shortCodes.grubHouse,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hitchDelivery:
          updateState({
            shortCode: shortCodes.hitchDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zoodMarket:
          updateState({
            shortCode: shortCodes.zoodMarket,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.meow:
          updateState({
            shortCode: shortCodes.meow,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dingDongDelivers:
          updateState({
            shortCode: shortCodes.dingDongDelivers,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.torunz:
          updateState({
            shortCode: shortCodes.torunz,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.kurs:
          updateState({
            shortCode: shortCodes.kurs,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.spa:
          updateState({
            shortCode: shortCodes.spa,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.capitalDiagnostic:
          updateState({
            shortCode: shortCodes.capitalDiagnostic,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.abbeRides:
          updateState({
            shortCode: shortCodes.abbeRides,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nrsa:
          updateState({
            shortCode: shortCodes.nrsa,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sadia:
          updateState({
            shortCode: shortCodes.sadia,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.elentaMart:
          updateState({
            shortCode: shortCodes.elentaMart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.exprexPro:
          updateState({
            shortCode: shortCodes.exprexPro,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fresHest:
          updateState({
            shortCode: shortCodes.fresHest,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.servern:
          updateState({
            shortCode: shortCodes.servern,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.smokeRun:
          updateState({
            shortCode: shortCodes.smokeRun,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.myEvPlus:
          updateState({
            shortCode: shortCodes.myEvPlus,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.qdelo:
          updateState({
            shortCode: shortCodes.qdelo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pawsee:
          updateState({
            shortCode: shortCodes.pawsee,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hairRun:
          updateState({
            shortCode: shortCodes.hairRun,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zuriRide:
          updateState({
            shortCode: shortCodes.zuriRide,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.americanLuxury:
          updateState({
            shortCode: shortCodes.americanLuxury,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.smartMur:
          updateState({
            shortCode: shortCodes.smartMur,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ouiSpeed:
          updateState({
            shortCode: shortCodes.ouiSpeed,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.getItSent:
          updateState({
            shortCode: shortCodes.getItSent,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.easyDrink:
          updateState({
            shortCode: shortCodes.easyDrink,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.iAmSelling:
          updateState({
            shortCode: shortCodes.iAmSelling,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fifteenP:
          updateState({
            shortCode: shortCodes.fifteenP,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.euodooTechnologies:
          updateState({
            shortCode: shortCodes.euodooTechnologies,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rota:
          updateState({
            shortCode: shortCodes.rota,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.farmMeat:
          updateState({
            shortCode: shortCodes.farmMeat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.danielleBejjani:
          updateState({
            shortCode: shortCodes.danielleBejjani,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.yallaEat:
          updateState({
            shortCode: shortCodes.yallaEat,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.choizez:
          updateState({
            shortCode: shortCodes.choizez,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.otto:
          updateState({
            shortCode: shortCodes.otto,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rescueRoadsideAssistance:
          updateState({
            shortCode: shortCodes.rescueRoadsideAssistance,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tax_E:
          updateState({
            shortCode: shortCodes.tax_E,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.baggageTaxi:
          updateState({
            shortCode: shortCodes.baggageTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mersi:
          updateState({
            shortCode: shortCodes.mersi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.foodSpot:
          updateState({
            shortCode: shortCodes.foodSpot,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.karibaMart:
          updateState({
            shortCode: shortCodes.karibaMart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sourceWith:
          updateState({
            shortCode: shortCodes.sourceWith,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.apptFindr:
          updateState({
            shortCode: shortCodes.apptFindr,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.vdu:
          updateState({
            shortCode: shortCodes.vdu,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.laundroZone:
          updateState({
            shortCode: shortCodes.laundroZone,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.taxiolgy:
          updateState({
            shortCode: shortCodes.taxiolgy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.swipe:
          updateState({
            shortCode: shortCodes.swipe,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sheRyders:
          updateState({
            shortCode: shortCodes.sheRyders,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kurrix:
          updateState({
            shortCode: shortCodes.kurrix,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mrVeloz:
          updateState({
            shortCode: shortCodes.mrVeloz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.greenCab:
          updateState({
            shortCode: shortCodes.greenCab,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.axxi:
          updateState({
            shortCode: shortCodes.axxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pets:
          updateState({
            shortCode: shortCodes.pets,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.getDress:
          updateState({
            shortCode: shortCodes.getDress,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.shelf:
          updateState({
            shortCode: shortCodes.shelf,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.baly:
          updateState({
            shortCode: shortCodes.baly,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nuvoni:
          updateState({
            shortCode: shortCodes.nuvoni,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.syloMart:
          updateState({
            shortCode: shortCodes.syloMart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.fairDeal:
          updateState({
            shortCode: shortCodes.fairDeal,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hezniTaxi:
          updateState({
            shortCode: shortCodes.hezniTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.onTheWheel:
          updateState({
            shortCode: shortCodes.onTheWheel,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.valleyMeats:
          updateState({
            shortCode: shortCodes.valleyMeats,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.perucabs:
          updateState({
            shortCode: shortCodes.perucabs,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hafizjwlry:
          updateState({
            shortCode: shortCodes.hafizjwlry,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jana:
          updateState({
            shortCode: shortCodes.jana,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.myWayBill:
          updateState({
            shortCode: shortCodes.myWayBill,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cattch:
          updateState({
            shortCode: shortCodes.cattch,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tezras:
          updateState({
            shortCode: shortCodes.tezras,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.eureka:
          updateState({
            shortCode: shortCodes.eureka,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kaypee:
          updateState({
            shortCode: shortCodes.kaypee,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hitaxi:
          updateState({
            shortCode: shortCodes.hitaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kwivar:
          updateState({
            shortCode: shortCodes.kwivar,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.parcel:
          updateState({
            shortCode: shortCodes.parcel,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lex:
          updateState({
            shortCode: shortCodes.lex,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.smokyKitchen:
          updateState({
            shortCode: shortCodes.smokyKitchen,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.flank:
          updateState({
            shortCode: shortCodes.flank,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zynoride:
          updateState({
            shortCode: shortCodes.zynoride,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mealsarehere:
          updateState({
            shortCode: shortCodes.mealsarehere,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.loamscape:
          updateState({
            shortCode: shortCodes.loamscape,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.delcolink:
          updateState({
            shortCode: shortCodes.delcolink,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.youSmokeShops:
          updateState({
            shortCode: shortCodes.youSmokeShops,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.doober:
          updateState({
            shortCode: shortCodes.doober,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.inmotion:
          updateState({
            shortCode: shortCodes.inmotion,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.eatHalal:
          updateState({
            shortCode: shortCodes.eatHalal,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jeevann:
          updateState({
            shortCode: shortCodes.jeevann,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.novamed:
          updateState({
            shortCode: shortCodes.novamed,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.awamer:
          updateState({
            shortCode: shortCodes.awamer,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.goTech:
          updateState({
            shortCode: shortCodes.goTech,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.idrv:
          updateState({
            shortCode: shortCodes.idrv,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.qwiker:
          updateState({
            shortCode: shortCodes.qwiker,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.spryton:
          updateState({
            shortCode: shortCodes.spryton,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nittosadai:
          updateState({
            shortCode: shortCodes.nittosadai,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.clickokart:
          updateState({
            shortCode: shortCodes.clickokart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tiimo:
          updateState({
            shortCode: shortCodes.tiimo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.verz:
          updateState({
            shortCode: shortCodes.verz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ragiomigo:
          updateState({
            shortCode: shortCodes.ragiomigo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.jimsAutoRescue:
          updateState({
            shortCode: shortCodes.jimsAutoRescue,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.carryfood:
          updateState({
            shortCode: shortCodes.carryfood,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nhazi:
          updateState({
            shortCode: shortCodes.nhazi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.petverse:
          updateState({
            shortCode: shortCodes.petverse,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.clickndrop:
          updateState({
            shortCode: shortCodes.clickndrop,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lifehomefit:
          updateState({
            shortCode: shortCodes.lifehomefit,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.appi:
          updateState({
            shortCode: shortCodes.appi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dbairro_:
          updateState({
            shortCode: shortCodes.dbairro_,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.genee:
          updateState({
            shortCode: shortCodes.genee,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.speedyDelivery:
          updateState({
            shortCode: shortCodes.speedyDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.holla:
          updateState({
            shortCode: shortCodes.holla,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.stabex:
          updateState({
            shortCode: shortCodes.stabex,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.uberWeeds:
          updateState({
            shortCode: shortCodes.uberWeeds,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.cabPro:
          updateState({
            shortCode: shortCodes.cabPro,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pointoneExpediteDelivery:
          updateState({
            shortCode: shortCodes.pointoneExpediteDelivery,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.saamanshop:
          updateState({
            shortCode: shortCodes.saamanshop,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.tdc:
          updateState({
            shortCode: shortCodes.tdc,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.giftyLeaf:
          updateState({
            shortCode: shortCodes.giftyLeaf,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.flyCommerce:
          updateState({
            shortCode: shortCodes.flyCommerce,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.pik:
          updateState({
            shortCode: shortCodes.pik,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.motina:
          updateState({
            shortCode: shortCodes.motina,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hungry:
          updateState({
            shortCode: shortCodes.hungry,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.greenhippo:
          updateState({
            shortCode: shortCodes.greenhippo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.mymeddy:
          updateState({
            shortCode: shortCodes.mymeddy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.uryd:
          updateState({
            shortCode: shortCodes.uryd,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.happySingh:
          updateState({
            shortCode: shortCodes.happySingh,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.vital:
          updateState({
            shortCode: shortCodes.vital,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.parcelworks:
          updateState({
            shortCode: shortCodes.parcelworks,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.usVetsDeliver:
          updateState({
            shortCode: shortCodes.usVetsDeliver,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.flybuilder:
          updateState({
            shortCode: shortCodes.flybuilder,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.konectame:
          updateState({
            shortCode: shortCodes.konectame,
            isShortcodePrefilled: true,
          });
          return;

        case appIds.skyline:
          updateState({
            shortCode: shortCodes.skyline,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bliss:
          updateState({
            shortCode: shortCodes.bliss,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rentzy:
          updateState({
            shortCode: shortCodes.rentzy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.todaysDeliverys:
          updateState({
            shortCode: shortCodes.todaysDeliverys,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.locate:
          updateState({
            shortCode: shortCodes.locate,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.georgiacollective:
          updateState({
            shortCode: shortCodes.georgiacollective,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.otgWeeds:
          updateState({
            shortCode: shortCodes.otgWeeds,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.rumbella:
          updateState({
            shortCode: shortCodes.rumbella,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lincshare:
          updateState({
            shortCode: shortCodes.lincshare,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.lvlup:
          updateState({
            shortCode: shortCodes.lvlup,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.glavour:
          updateState({
            shortCode: shortCodes.glavour,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.shipmoe:
          updateState({
            shortCode: shortCodes.shipmoe,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bigBayong:
          updateState({
            shortCode: shortCodes.bigBayong,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.efectibo:
          updateState({
            shortCode: shortCodes.efectibo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.sooq:
          updateState({
            shortCode: shortCodes.sooq,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hectoHomes:
          updateState({
            shortCode: shortCodes.hectoHomes,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.zynoBidandRide:
          updateState({
            shortCode: shortCodes.zynoBidandRide,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.glamguide:
          updateState({
            shortCode: shortCodes.glamguide,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.solace:
          updateState({
            shortCode: shortCodes.solace,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.superpana:
          updateState({
            shortCode: shortCodes.superpana,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.kero:
          updateState({
            shortCode: shortCodes.kero,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.godamPAY:
          updateState({
            shortCode: shortCodes.godamPAY,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.housingSubsidies:
          updateState({
            shortCode: shortCodes.housingSubsidies,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bocch:
          updateState({
            shortCode: shortCodes.bocch,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.potolo:
          updateState({
            shortCode: shortCodes.potolo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.earnApp:
          updateState({
            shortCode: shortCodes.earnApp,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.aredoo:
          updateState({
            shortCode: shortCodes.aredoo,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.bukam:
          updateState({
            shortCode: shortCodes.bukam,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dot:
          updateState({
            shortCode: shortCodes.dot,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.wizSonic:
          updateState({
            shortCode: shortCodes.wizSonic,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.udkay:
          updateState({
            shortCode: shortCodes.udkay,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.hattaFoodHub:
          updateState({
            shortCode: shortCodes.hattaFoodHub,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.ondgoo:
          updateState({
            shortCode: shortCodes.ondgoo,
            isShortcodePrefilled: true,
          })

        case appIds.zonesso:
          updateState({
            shortCode: shortCodes.zonesso,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.junkerz:
          updateState({
            shortCode: shortCodes.junkerz,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.shopcart:
          updateState({
            shortCode: shortCodes.shopcart,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.viralClean:
          updateState({
            shortCode: shortCodes.viralClean,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.stargaze:
          updateState({
            shortCode: shortCodes.stargaze,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.messiaa:
          updateState({
            shortCode: shortCodes.messiaa,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.superApp:
          updateState({
            shortCode: shortCodes.superApp,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nounou:
          updateState({
            shortCode: shortCodes.nounou,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.laith:
          updateState({
            shortCode: shortCodes.laith,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.liverpoolEats:
          updateState({
            shortCode: shortCodes.liverpoolEats,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.oaks:
          updateState({
            shortCode: shortCodes.oaks,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.buzy:
          updateState({
            shortCode: shortCodes.buzy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.etaim:
          updateState({
            shortCode: shortCodes.etaim,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.dotTaxiApp:
          updateState({
            shortCode: shortCodes.dotTaxiApp,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.airvoltTaxi:
          updateState({
            shortCode: shortCodes.airvoltTaxi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.melakPharmacy:
          updateState({
            shortCode: shortCodes.melakPharmacy,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.wiEnergi:
          updateState({
            shortCode: shortCodes.wiEnergi,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.nannyAfrica:
          updateState({
            shortCode: shortCodes.nannyAfrica,
            isShortcodePrefilled: true,
          });
          return;
        case appIds.whatchaGotPickUp:
          updateState({
            shortCode: shortCodes.whatchaGotPickUp,
            isShortcodePrefilled: true,
          });
          return;

      }
    })();
  }, []);



  useEffect(() => {
    if (shortCode && isShortcodePrefilled) {
      checkScreen();
    }
  }, [shortCode, isShortcodePrefilled]);

  // useEffect(() => {
  //   checkScreen();
  // }, [shortCode, isShortcodePrefilled]);

  const checkScreen = () => {
    initApiHit();
    updateState({ isShortcodePrefilled: true });
  };


  const _onSubmitShortCode = () => {
    updateState({ isLoading: true });
    setTimeout(() => {
      initApiHit();
    }, 1000);
  };

  const initApiHit = async () => {
    const res = await getItem("setPrimaryLanguage");
    let header = {};

    if (!!res?.primary_language?.id) {
      header = {
        // code: 'd162a7',
        code: '607c84',
        language: res?.primary_language?.id,
      };
    } else {
      header = {
        // code: 'd162a7',
        code: '607c84',
      };
    }

    actions
      .initApp({}, header, false, null, null, true)
      .then((res) => {
        console.log("header response--->", res);


        updateState({ changeInShortCode: false });
        if (getBundleId() == appIds.royoorder) {
          actions.saveShortCode(shortCode);
        }

        if (
          getBundleId() == appIds.masa ||
          getBundleId() == appIds.muvpod ||
          getBundleId() == appIds.hezniTaxi ||
          getBundleId() == appIds.flank
        ) {
          updateState({
            isLoading: false,
            LoadingScreen: false,
            allAppData: res,
            initapiresponse: true,
          });
          checkNavigationState(true, videoDurationEnded);
        } else {
          updateState({ isLoading: false, LoadingScreen: false });
          navigateToNextScreen(res);
        }
      })
      .catch((error) => {
        console.log(error, "error>>>>>error");
        updateState({
          isLoading: false,
          changeInShortCode: false,
          shortCode: "",
        });
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };

  const _onSetNavigationTypeForVideoAndImageSplash = (res) => {
    switch (getBundleId()) {
      case appIds.masa:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        return;
      case appIds.iPicknDrop:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        return;

      case appIds.muvpod:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        return;

      case appIds.hezniTaxi:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        return;

      case appIds.flank:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        return;

      default:
        updateState({ isLoading: false, LoadingScreen: false });
        navigateToNextScreen(res);
        return;
    }
  };


  console.log(deepLinkUrl, "deepLinkUrl");

  const navigateToNextScreen = (res) => {
    getItem("firstTime").then((el) => {
      if (!el && !isEmpty(res?.data?.dynamic_tutorial)) {
        actions.setAppSessionData("app_intro");
      } else {
        if (userData?.auth_token) {
          actions.setAppSessionData("guest_login");
        } else if (deepLinkUrl && !userData?.auth_token) {
          actions.setAppSessionData("on_login");
        } else {
          actions.setAppSessionData("guest_login");
        }
      }
    });

  };

  const onOtpInput = (code) => {
    (async () => {
      updateState({
        isLoading: true,
        shortCode: code,
        changeInShortCode: true,
      });
    })();
  };

  useEffect(() => {
    (async () => {
      if (changeInShortCode) {
        const saveShortCode = await getItem("saveShortCode");
        if (saveShortCode && shortCode != saveShortCode) {
          actions.userLogout();
          actions.cartItemQty("");
          actions.saveAddress(null);
          actions.saveAllUserAddress([]);
        }
        initApiHit();
      }
    })();
  }, [changeInShortCode]);

  useEffect(() => {
    if (shortCode?.length === 6) {
      updateState({ isBtnDisabled: false });
    } else {
      updateState({ isBtnDisabled: true });
    }
  }, [shortCode, isLoading]);

  const _renderSplash = () => {

    console.log("getBundleIdgetBundleIdgetBundleId", getBundleId())
    switch (getBundleId()) {
      case appIds.masa:
        return animatedSplash();
      // case appIds.iPicknDrop:
      //   return animatedSplash();
      case appIds.muvpod:
        return animatedSplash();
      case appIds.hezniTaxi:
        return animatedSplash();
      case appIds.flank:
        return animatedSplash();
      // case appIds.zonesso:
      //   return animatedSplash();
      default:
        return imageSplash();
    }
  };

  const imageSplash = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            position: "absolute",
            zIndex: 99,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ position: "absolute", bottom: moderateScale(100) }}>
            {LoadingScreen && (
              <MaterialIndicator size={50} color={colors.greyMedium} />
            )}
          </View>
        </View>
        <Image source={{ uri: "Splash" }} style={{ flex: 1, zIndex: -1 }} />
      </View>
    );
  };

  const animationVideo = () => {
    switch (getBundleId()) {
      case appIds?.masa:
        return imagePath.masa;
      // case appIds?.iPicknDrop:
      //   return imagePath.ipd;
      case appIds?.muvpod:
        return imagePath.muvpod;
      case appIds?.hezniTaxi:
        return imagePath.HezniSplash;
      case appIds?.flank:
        return imagePath.flanksplash;
      // case appIds?.zonesso:
      //   return imagePath.zonessoSplash;
      // case appIds?.sabroson:
      //   return imagePath.sabroson
    }
  };

  const onVideoDurationEnded = () => {
    // navigateToNextScreen(allAppData);
    updateState({
      videoDurationEnded: true,
    });
    checkNavigationState(initapiresponse, true);
  };

  const animatedSplash = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <Video
          ref={videoRef}
          source={animationVideo()} // Can be a URL or a local file.
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode={getBundleId() == appIds.muvpod ? "contain" : "cover"}
          onEnd={() => onVideoDurationEnded()}
          muted={true}
        />
      </View>
    );
  };

  const checkNavigationState = (apiRes, videoEnd) => {
    console.log("api res+++++++", apiRes);
    console.log("videoEnd res+++++++", videoEnd);
    if (apiRes && videoEnd) {
      navigateToNextScreen(allAppData);
    }
  };
  // useEffect(() => {

  //   if (initapiresponse && videoDurationEnded) {

  //     navigateToNextScreen(allAppData);
  //   }
  // }, [videoDurationEnded, initapiresponse]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}
    >

      {/* <Text>Im short code file here</Text> */}
      {_renderSplash()}
      {/* {isShortcodePrefilled ? (
        _renderSplash()
      ) : (
        <WrapperContainer
          statusBarColor={colors.white}
          bgColor={colors.white}
          isLoadingB={isLoading}
          source={loaderOne}
        >
          <View
            style={{
              paddingHorizontal: moderateScale(24),
              flex: 1,
              marginTop: width / 3,
            }}
          >
            <Image style={{ alignSelf: "center" }} source={imagePath.logo} />
            <View style={{ height: moderateScaleVertical(50) }} />
            <Text style={styles.enterShortCode}>
              {strings.ENTER_SHORT_CODE}
            </Text>
            <View style={{ height: 10 }} />
            <Text style={styles.enterShortCode2}>
              {strings.ENTERSHORTCODEBELOW}
            </Text>

            <View style={{ height: 10 }} />
            <SmoothPinCodeInput
              containerStyle={{ alignSelf: "center" }}
              password
              mask={
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 25,
                    backgroundColor: "blue",
                  }}
                ></View>
              }
              cellSize={width / 10}
              codeLength={6}
              cellSpacing={10}
              editable={true}
              cellStyle={{
                borderBottomWidth: 1,
                borderColor: "gray",
              }}
              cellStyleFocused={{
                borderColor: "black",
              }}
              textStyle={{
                fontSize: 24,
                color: colors.textBlue,
              }}
              textStyleFocused={{
                color: colors.textBlue,
              }}
              inputProps={{
                autoCapitalize: "none",
              }}
              value={shortCode}
              autoFocus={false}
              keyboardType={"default"}
              onTextChange={(shortCode) => updateState({ shortCode })}
              onFulfill={(code) => onOtpInput(code)}
            />

            <View style={{ height: 20 }} />

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <ButtonWithLoader
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

            <View style={{ height: 20 }} />
          </View>
        </WrapperContainer>
      )} */}
    </View>
  );
}
