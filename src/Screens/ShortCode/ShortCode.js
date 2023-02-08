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
    shortCode: "b6e6e8",
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

  // useEffect(() => {
  //   (async () => {
  //     const saveShortCode = await getItem("saveShortCode");
  //     switch (getBundleId()) {
  //       case appIds.royoorder:
  //         if (appSessionInfo == "show_shortcode") {
  //           updateState({ shortCode: "", isShortcodePrefilled: false });
  //         } else {
  //           updateState({
  //             shortCode: !!saveShortCode ? saveShortCode : shortCodes.royoorder,
  //             isShortcodePrefilled: true,
  //           });
  //         }
  //         break;
  //       case appIds.tranzit:
  //         updateState({
  //           shortCode: shortCodes.tranzit,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.runrun:
  //         updateState({
  //           shortCode: shortCodes.runrun,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hmoobhub:
  //         updateState({
  //           shortCode: shortCodes.hmoobhub,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.capcorp:
  //         updateState({
  //           shortCode: shortCodes.capcorp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.masa:
  //         updateState({
  //           shortCode: shortCodes.masa,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yogofood:
  //         updateState({
  //           shortCode: shortCodes.yogofood,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.spidbi:
  //         updateState({
  //           shortCode: shortCodes.spidbi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.clicktoeat:
  //         updateState({
  //           shortCode: shortCodes.clicktoeat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.instamobile:
  //         updateState({
  //           shortCode: shortCodes.instamobile,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bottomsup:
  //         updateState({
  //           shortCode: shortCodes.bottomsup,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.helpnowrightnow:
  //         updateState({
  //           shortCode: shortCodes.helpnowrightnow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.africanvillagemarket:
  //         updateState({
  //           shortCode: shortCodes.africanvillagemarket,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ufood:
  //         updateState({
  //           shortCode: shortCodes.ufood,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.martinionwheels:
  //         updateState({
  //           shortCode: shortCodes.martinionwheels,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.blip:
  //         updateState({
  //           shortCode: shortCodes.blip,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cannabus:
  //         updateState({
  //           shortCode: shortCodes.cannabus,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.govachow:
  //         updateState({
  //           shortCode: shortCodes.govachow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bustanfakieh:
  //         updateState({
  //           shortCode: shortCodes.bustanfakieh,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.shariff:
  //         updateState({
  //           shortCode: shortCodes.shariff,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gajamove:
  //         updateState({
  //           shortCode: shortCodes.gajamove,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.getme:
  //         updateState({
  //           shortCode: shortCodes.getme,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.orbit:
  //         updateState({
  //           shortCode: shortCodes.orbit,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.carlitoo:
  //         updateState({
  //           shortCode: shortCodes.carlitoo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.specialhalal:
  //         updateState({
  //           shortCode: shortCodes.specialhalal,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.thehouse:
  //         updateState({
  //           shortCode: shortCodes.thehouse,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.tasmeem:
  //         updateState({
  //           shortCode: shortCodes.tasmeem,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.snabbhem:
  //         updateState({
  //           shortCode: shortCodes.snabbhem,
  //           // shortCode: '98f085',
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lastminutedress:
  //         updateState({
  //           shortCode: shortCodes.lastminutedress,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rerak:
  //         updateState({
  //           shortCode: shortCodes.rerak,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yummiidash:
  //         updateState({
  //           shortCode: shortCodes.yummiidash,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yoho:
  //         updateState({
  //           shortCode: shortCodes.yoho,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.glamsouq:
  //         updateState({
  //           shortCode: shortCodes.glamsouq,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.doctatransportation:
  //         updateState({
  //           shortCode: shortCodes.doctatransportation,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.washvalley:
  //         updateState({
  //           shortCode: shortCodes.washvalley,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.equamd:
  //         updateState({
  //           shortCode: shortCodes.equamd,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hellodeliver:
  //         updateState({
  //           shortCode: shortCodes.hellodeliver,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hoganchef:
  //         updateState({
  //           shortCode: shortCodes.hoganchef,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.servze:
  //         updateState({
  //           shortCode: shortCodes.servze,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.travo:
  //         updateState({
  //           shortCode: shortCodes.travo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cabdelivr:
  //         updateState({
  //           shortCode: shortCodes.cabdelivr,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.drus:
  //         updateState({
  //           shortCode: shortCodes.drus,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yahu:
  //         updateState({
  //           shortCode: shortCodes.yahu,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zuzuclean:
  //         updateState({
  //           shortCode: shortCodes.zuzuclean,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.towtrek:
  //         updateState({
  //           shortCode: shortCodes.towtrek,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.arenagrub:
  //         updateState({
  //           shortCode: shortCodes.arenagrub,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jet:
  //         updateState({
  //           shortCode: shortCodes.jet,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.africanize:
  //         updateState({
  //           shortCode: shortCodes.africanize,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.markita:
  //         updateState({
  //           shortCode: shortCodes.markita,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sirvu:
  //         updateState({
  //           shortCode: shortCodes.sirvu,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.ublue:
  //         updateState({
  //           shortCode: shortCodes.ublue,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mstechy:
  //         updateState({
  //           shortCode: shortCodes.mstechy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.senshive:
  //         updateState({
  //           shortCode: shortCodes.senshive,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ridemate:
  //         updateState({
  //           shortCode: shortCodes.ridemate,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.codiner:
  //         updateState({
  //           shortCode: shortCodes.codiner,
  //           // shortCode: '245bae',
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.housekeeper:
  //         updateState({
  //           shortCode: shortCodes.housekeeper,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hairstonexpress:
  //         updateState({
  //           shortCode: shortCodes.hairstonexpress,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.diamonddashers:
  //         updateState({
  //           shortCode: shortCodes.diamonddashers,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.destinationOps:
  //         updateState({
  //           shortCode: shortCodes.destinationOps,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.loopwhole:
  //         updateState({
  //           shortCode: shortCodes.loopwhole,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.vici:
  //         updateState({
  //           shortCode: shortCodes.vici,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.carhop:
  //         updateState({
  //           shortCode: shortCodes.carhop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.yogolift:
  //         updateState({
  //           shortCode: shortCodes.yogolift,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.fleety:
  //         updateState({
  //           shortCode: shortCodes.fleety,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.flyinghorse:
  //         updateState({
  //           shortCode: shortCodes.flyinghorse,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.errand:
  //         updateState({
  //           shortCode: shortCodes.errand,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.partnerproject:
  //         updateState({
  //           shortCode: shortCodes.partnerproject,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.menus:
  //         updateState({
  //           shortCode: shortCodes.menus,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.doorstep:
  //         updateState({
  //           shortCode: shortCodes.doorstep,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sunshinerideshare:
  //         updateState({
  //           shortCode: shortCodes.sunshinerideshare,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.autotek:
  //         updateState({
  //           shortCode: shortCodes.autotek,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.wegotit:
  //         updateState({
  //           shortCode: shortCodes.wegotit,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.survuhs:
  //         updateState({
  //           shortCode: shortCodes.survuhs,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.igolux:
  //         updateState({
  //           shortCode: shortCodes.igolux,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.toda:
  //         updateState({
  //           shortCode: shortCodes.toda,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mobi:
  //         updateState({
  //           shortCode: shortCodes.mobi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yourlaundryapp:
  //         updateState({
  //           shortCode: shortCodes.yourlaundryapp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hemptyfy:
  //         updateState({
  //           shortCode: shortCodes.hemptyfy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sharu:
  //         updateState({
  //           shortCode: shortCodes.sharu,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.smcompany:
  //         updateState({
  //           shortCode: shortCodes.smcompany,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.totum4U:
  //         updateState({
  //           shortCode: shortCodes.totum4U,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hmc:
  //         updateState({
  //           shortCode: shortCodes.hmc,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.groupy:
  //         updateState({
  //           shortCode: shortCodes.groupy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.weeat:
  //         updateState({
  //           shortCode: shortCodes.weeat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gorillas:
  //         updateState({
  //           shortCode: shortCodes.gorillas,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.baytukom:
  //         updateState({
  //           shortCode: shortCodes.baytukom,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.eboyo:
  //         updateState({
  //           shortCode: shortCodes.eboyo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.vecto:
  //         updateState({
  //           shortCode: shortCodes.vecto,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.share:
  //         updateState({
  //           shortCode: shortCodes.share,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pickmeup:
  //         updateState({
  //           shortCode: shortCodes.pickmeup,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.taquick:
  //         updateState({
  //           shortCode: shortCodes.taquick,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.goody:
  //         updateState({
  //           shortCode: shortCodes.goody,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.grub:
  //         updateState({
  //           shortCode: shortCodes.grub,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gusto:
  //         updateState({
  //           shortCode: shortCodes.gusto,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.punnet:
  //         updateState({
  //           shortCode: shortCodes.punnet,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.homeric:
  //         updateState({
  //           shortCode: shortCodes.homeric,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.voltaic:
  //         updateState({
  //           shortCode: shortCodes.voltaic,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zest:
  //         updateState({
  //           shortCode: shortCodes.zest,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gokab:
  //         updateState({
  //           shortCode: shortCodes.gokab,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.elixir:
  //         updateState({
  //           shortCode: shortCodes.elixir,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ace:
  //         updateState({
  //           shortCode: shortCodes.ace,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.suel:
  //         updateState({
  //           shortCode: shortCodes.suel,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.empire:
  //         updateState({
  //           shortCode: shortCodes.empire,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.expressdelivery:
  //         updateState({
  //           shortCode: shortCodes.expressdelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.booziedoozie:
  //         updateState({
  //           shortCode: shortCodes.booziedoozie,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zestyclickz:
  //         updateState({
  //           shortCode: shortCodes.zestyclickz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bakesale:
  //         updateState({
  //           shortCode: shortCodes.bakesale,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.elcheregio:
  //         updateState({
  //           shortCode: shortCodes.elcheregio,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yaawi:
  //         updateState({
  //           shortCode: shortCodes.yaawi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hosta:
  //         updateState({
  //           shortCode: shortCodes.hosta,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.somame:
  //         updateState({
  //           shortCode: shortCodes.somame,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.goodwheelz:
  //         updateState({
  //           shortCode: shortCodes.goodwheelz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tranznet:
  //         updateState({
  //           shortCode: shortCodes.tranznet,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sambiga:
  //         updateState({
  //           shortCode: shortCodes.sambiga,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.agrionline:
  //         updateState({
  //           shortCode: shortCodes.agrionline,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.quickquick:
  //         updateState({
  //           shortCode: shortCodes.quickquick,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.caribeclean:
  //         updateState({
  //           shortCode: shortCodes.caribeclean,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.stonses:
  //         updateState({
  //           shortCode: shortCodes.stonses,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.agbdeliveries:
  //         updateState({
  //           shortCode: shortCodes.agbdeliveries,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bookem:
  //         updateState({
  //           shortCode: shortCodes.bookem,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.twofinder:
  //         updateState({
  //           shortCode: shortCodes.twofinder,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zip:
  //         updateState({
  //           shortCode: shortCodes.zip,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ridetci:
  //         updateState({
  //           shortCode: shortCodes.ridetci,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.noki:
  //         updateState({
  //           shortCode: shortCodes.noki,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.driveree:
  //         updateState({
  //           shortCode: shortCodes.driveree,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rxnow:
  //         updateState({
  //           shortCode: shortCodes.rxnow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.seachangevending:
  //         updateState({
  //           shortCode: shortCodes.seachangevending,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ored:
  //         updateState({
  //           shortCode: shortCodes.ored,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.orderchekout:
  //         updateState({
  //           shortCode: shortCodes.orderchekout,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.maxisdelivery:
  //         updateState({
  //           shortCode: shortCodes.maxisdelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.donepacked:
  //         updateState({
  //           shortCode: shortCodes.donepacked,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.careworks:
  //         updateState({
  //           shortCode: shortCodes.careworks,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.thubaerides:
  //         updateState({
  //           shortCode: shortCodes.thubaerides,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pinkjet:
  //         updateState({
  //           shortCode: shortCodes.pinkjet,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mokabfix:
  //         updateState({
  //           shortCode: shortCodes.mokabfix,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.botseats:
  //         updateState({
  //           shortCode: shortCodes.botseats,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gumastas:
  //         updateState({
  //           shortCode: shortCodes.gumastas,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dishefs:
  //         updateState({
  //           shortCode: shortCodes.dishefs,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bilionza:
  //         updateState({
  //           shortCode: shortCodes.bilionza,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.doleypharmacy:
  //         updateState({
  //           shortCode: shortCodes.doleypharmacy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bezalio:
  //         updateState({
  //           shortCode: shortCodes.bezalio,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.youchillax:
  //         updateState({
  //           shortCode: shortCodes.youchillax,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.instashop:
  //         updateState({
  //           shortCode: shortCodes.instashop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.shoorafresh:
  //         updateState({
  //           shortCode: shortCodes.shoorafresh,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.click2deliver:
  //         updateState({
  //           shortCode: shortCodes.click2deliver,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.trucktirenow:
  //         updateState({
  //           shortCode: shortCodes.trucktirenow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yeboy:
  //         updateState({
  //           shortCode: shortCodes.yeboy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kel360:
  //         updateState({
  //           shortCode: shortCodes.kel360,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.moboserrandsservice:
  //         updateState({
  //           shortCode: shortCodes.moboserrandsservice,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cabway:
  //         updateState({
  //           shortCode: shortCodes.cabway,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tajammul:
  //         updateState({
  //           shortCode: shortCodes.tajammul,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.carroai:
  //         updateState({
  //           shortCode: shortCodes.carroai,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ssuum:
  //         updateState({
  //           shortCode: shortCodes.ssuum,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.blacnetwork:
  //         updateState({
  //           shortCode: shortCodes.blacnetwork,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.threadagain:
  //         updateState({
  //           shortCode: shortCodes.threadagain,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ezmobilefuel:
  //         updateState({
  //           shortCode: shortCodes.ezmobilefuel,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.runaround:
  //         updateState({
  //           shortCode: shortCodes.runaround,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.swiftandvalu:
  //         updateState({
  //           shortCode: shortCodes.swiftandvalu,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.trucxi:
  //         updateState({
  //           shortCode: shortCodes.trucxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.paysic:
  //         updateState({
  //           shortCode: shortCodes.paysic,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.chipetaxi:
  //         updateState({
  //           shortCode: shortCodes.chipetaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.laundryorders:
  //         updateState({
  //           shortCode: shortCodes.laundryorders,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ineed:
  //         updateState({
  //           shortCode: shortCodes.ineed,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nadelivery:
  //         updateState({
  //           shortCode: shortCodes.nadelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.marasym:
  //         updateState({
  //           shortCode: shortCodes.marasym,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.silvestre:
  //         updateState({
  //           shortCode: shortCodes.silvestre,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.samakeemart:
  //         updateState({
  //           shortCode: shortCodes.samakeemart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.seaeats:
  //         updateState({
  //           shortCode: shortCodes.seaeats,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.enext:
  //         updateState({
  //           shortCode: shortCodes.enext,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hokitch:
  //         updateState({
  //           shortCode: shortCodes.hokitch,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.foodnests:
  //         updateState({
  //           shortCode: shortCodes.foodnests,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sponge:
  //         updateState({
  //           shortCode: shortCodes.sponge,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gomeat:
  //         updateState({
  //           shortCode: shortCodes.gomeat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.shopcentral:
  //         updateState({
  //           shortCode: shortCodes.shopcentral,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.skidoo:
  //         updateState({
  //           shortCode: shortCodes.skidoo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.admCourier:
  //         updateState({
  //           shortCode: shortCodes.admCourier,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kurbsidekings:
  //         updateState({
  //           shortCode: shortCodes.kurbsidekings,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.movingwheelsdelivery:
  //         updateState({
  //           shortCode: shortCodes.movingwheelsdelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.safewalks:
  //         updateState({
  //           shortCode: shortCodes.safewalks,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dimavega:
  //         updateState({
  //           shortCode: shortCodes.dimavega,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.skoop:
  //         updateState({
  //           shortCode: shortCodes.skoop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kudhyo:
  //         updateState({
  //           shortCode: shortCodes.kudhyo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bharatMove:
  //         updateState({
  //           shortCode: shortCodes.bharatMove,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sofia:
  //         updateState({
  //           shortCode: shortCodes.sofia,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mml:
  //         updateState({
  //           shortCode: shortCodes.mml,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bimol:
  //         updateState({
  //           shortCode: shortCodes.bimol,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.vendorspot:
  //         updateState({
  //           shortCode: shortCodes.vendorspot,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sxm2go:
  //         updateState({
  //           shortCode: shortCodes.sxm2go,
  //         });
  //         break;
  //       case appIds.pinkydeli:
  //         updateState({
  //           shortCode: shortCodes.pinkydeli,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gasgiant:
  //         updateState({
  //           shortCode: shortCodes.gasgiant,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.releezer:
  //         updateState({
  //           shortCode: shortCodes.releezer,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.vendoor:
  //         updateState({
  //           shortCode: shortCodes.vendoor,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.farmersouq:
  //         updateState({
  //           shortCode: shortCodes.farmersouq,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tmgShops:
  //         updateState({
  //           shortCode: shortCodes.tmgShops,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.stitchesonsite:
  //         updateState({
  //           shortCode: shortCodes.stitchesonsite,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.easyu:
  //         updateState({
  //           shortCode: shortCodes.easyu,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mozmarcas:
  //         updateState({
  //           shortCode: shortCodes.mozmarcas,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.myfiji:
  //         updateState({
  //           shortCode: shortCodes.myfiji,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fastmikes:
  //         updateState({
  //           shortCode: shortCodes.fastmikes,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.citysuds:
  //         updateState({
  //           shortCode: shortCodes.citysuds,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.homeTownDelivery:
  //         updateState({
  //           shortCode: shortCodes.homeTownDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ritenow:
  //         updateState({
  //           shortCode: shortCodes.ritenow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.flit:
  //         updateState({
  //           shortCode: shortCodes.flit,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ihelp:
  //         updateState({
  //           shortCode: shortCodes.ihelp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ullaz:
  //         updateState({
  //           shortCode: shortCodes.ullaz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.privatepremiumpickups:
  //         updateState({
  //           shortCode: shortCodes.privatepremiumpickups,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fidesDelivery:
  //         updateState({
  //           shortCode: shortCodes.fidesDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bksTaxi:
  //         updateState({
  //           shortCode: shortCodes.bksTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.oxo:
  //         updateState({
  //           shortCode: shortCodes.oxo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sijang:
  //         updateState({
  //           shortCode: shortCodes.sijang,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fairex:
  //         updateState({
  //           shortCode: shortCodes.fairex,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.everywhere:
  //         updateState({
  //           shortCode: shortCodes.everywhere,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cannabisClubSF:
  //         updateState({
  //           shortCode: shortCodes.cannabisClubSF,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.halaTalabat:
  //         updateState({
  //           shortCode: shortCodes.halaTalabat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.palmettoplus:
  //         updateState({
  //           shortCode: shortCodes.palmettoplus,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.allotaxi:
  //         updateState({
  //           shortCode: shortCodes.allotaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jadorDrive:
  //         updateState({
  //           shortCode: shortCodes.jadorDrive,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ubercann:
  //         updateState({
  //           shortCode: shortCodes.ubercann,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kongafood:
  //         updateState({
  //           shortCode: shortCodes.kongafood,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.launch:
  //         updateState({
  //           shortCode: shortCodes.launch,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kampick:
  //         updateState({
  //           shortCode: shortCodes.kampick,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cabio:
  //         updateState({
  //           shortCode: shortCodes.cabio,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tumbak:
  //         updateState({
  //           shortCode: shortCodes.tumbak,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.iPicknDrop:
  //         updateState({
  //           shortCode: shortCodes.iPicknDrop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bluebolt:
  //         updateState({
  //           shortCode: shortCodes.bluebolt,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.onthego:
  //         updateState({
  //           shortCode: shortCodes.onthego,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mylaglobal:
  //         updateState({
  //           shortCode: shortCodes.mylaglobal,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ambutap:
  //         updateState({
  //           shortCode: shortCodes.ambutap,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sabroson:
  //         updateState({
  //           shortCode: shortCodes.sabroson,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.swiffyllc:
  //         updateState({
  //           shortCode: shortCodes.swiffyllc,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.meatEasy:
  //         updateState({
  //           shortCode: shortCodes.meatEasy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.boltDelivery:
  //         updateState({
  //           shortCode: shortCodes.boltDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gamaDelivery:
  //         updateState({
  //           shortCode: shortCodes.gamaDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hivefair:
  //         updateState({
  //           shortCode: shortCodes.hivefair,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.localdropoff:
  //         updateState({
  //           shortCode: shortCodes.localdropoff,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ubi:
  //         updateState({
  //           shortCode: shortCodes.ubi,
  //           isShortcodePrefilled: true,
  //         });
  //       case appIds.beakme:
  //         updateState({
  //           shortCode: shortCodes.beakme,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.onscart:
  //         updateState({
  //           shortCode: shortCodes.onscart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mandaExpress:
  //         updateState({
  //           shortCode: shortCodes.mandaExpress,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.foodies:
  //         updateState({
  //           shortCode: shortCodes.foodies,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.gO:
  //         updateState({
  //           shortCode: shortCodes.gO,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bauBau:
  //         updateState({
  //           shortCode: shortCodes.bauBau,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bookARyde:
  //         updateState({
  //           shortCode: shortCodes.bookARyde,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.petsChoice:
  //         updateState({
  //           shortCode: shortCodes.petsChoice,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.heyBuddy:
  //         updateState({
  //           shortCode: shortCodes.heyBuddy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yoloSonic:
  //         updateState({
  //           shortCode: shortCodes.yoloSonic,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mrHealth:
  //         updateState({
  //           shortCode: shortCodes.mrHealth,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lopht:
  //         updateState({
  //           shortCode: shortCodes.lopht,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yalary:
  //         updateState({
  //           shortCode: shortCodes.yalary,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.seratho:
  //         updateState({
  //           shortCode: shortCodes.seratho,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.xborne:
  //         updateState({
  //           shortCode: shortCodes.xborne,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fawaz:
  //         updateState({
  //           shortCode: shortCodes.fawaz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.grn:
  //         updateState({
  //           shortCode: shortCodes.grn,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.delivadrinks:
  //         updateState({
  //           shortCode: shortCodes.delivadrinks,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.myRide:
  //         updateState({
  //           shortCode: shortCodes.myRide,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.getfix:
  //         updateState({
  //           shortCode: shortCodes.getfix,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.scoopaTechnologies:
  //         updateState({
  //           shortCode: shortCodes.scoopaTechnologies,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dbairro:
  //         updateState({
  //           shortCode: shortCodes.dbairro,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.knockknock:
  //         updateState({
  //           shortCode: shortCodes.knockknock,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.qrider:
  //         updateState({
  //           shortCode: shortCodes.qrider,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dlvrd:
  //         updateState({
  //           shortCode: shortCodes.dlvrd,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.delivery:
  //         updateState({
  //           shortCode: shortCodes.delivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.timHomeServices:
  //         updateState({
  //           shortCode: shortCodes.timHomeServices,
  //           isShortcodePrefilled: true,
  //         });

  //         break;
  //       case appIds.slider:
  //         updateState({
  //           shortCode: shortCodes.slider,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ICare:
  //         updateState({
  //           shortCode: shortCodes.ICare,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.viversbox:
  //         updateState({
  //           shortCode: shortCodes.viversbox,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.scootz:
  //         updateState({
  //           shortCode: shortCodes.scootz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ola:
  //         updateState({
  //           shortCode: shortCodes.ola,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.spliffnation:
  //         updateState({
  //           shortCode: shortCodes.spliffnation,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sourcesServices:
  //         updateState({
  //           shortCode: shortCodes.sourcesServices,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.wer:
  //         updateState({
  //           shortCode: shortCodes.wer,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.beachhop:
  //         updateState({
  //           shortCode: shortCodes.beachhop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.qseek:
  //         updateState({
  //           shortCode: shortCodes.qseek,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.delvento:
  //         updateState({
  //           shortCode: shortCodes.delvento,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rideshare:
  //         updateState({
  //           shortCode: shortCodes.rideshare,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bua:
  //         updateState({
  //           shortCode: shortCodes.bua,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.upstreet:
  //         updateState({
  //           shortCode: shortCodes.upstreet,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.newYorkMiniMart:
  //         updateState({
  //           shortCode: shortCodes.newYorkMiniMart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.airlinesRecruiter:
  //         updateState({
  //           shortCode: shortCodes.airlinesRecruiter,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nineOneTwo:
  //         updateState({
  //           shortCode: shortCodes.nineOneTwo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.trip:
  //         updateState({
  //           shortCode: shortCodes.trip,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.aauJau:
  //         updateState({
  //           shortCode: shortCodes.aauJau,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mediPick:
  //         updateState({
  //           shortCode: shortCodes.mediPick,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.meltivers:
  //         updateState({
  //           shortCode: shortCodes.meltivers,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ensoDigitalAgency:
  //         updateState({
  //           shortCode: shortCodes.ensoDigitalAgency,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hiperAbasto:
  //         updateState({
  //           shortCode: shortCodes.hiperAbasto,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.redglee:
  //         updateState({
  //           shortCode: shortCodes.redglee,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dropItOffUsa:
  //         updateState({
  //           shortCode: shortCodes.dropItOffUsa,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.handyPickup:
  //         updateState({
  //           shortCode: shortCodes.handyPickup,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.TJJHub:
  //         updateState({
  //           shortCode: shortCodes.TJJHub,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.curblerLLC:
  //         updateState({
  //           shortCode: shortCodes.curblerLLC,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cartnar:
  //         updateState({
  //           shortCode: shortCodes.cartnar,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.uven:
  //         updateState({
  //           shortCode: shortCodes.uven,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pAS41:
  //         updateState({
  //           shortCode: shortCodes.pAS41,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.freshFarmz:
  //         updateState({
  //           shortCode: shortCodes.freshFarmz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ryde:
  //         updateState({
  //           shortCode: shortCodes.ryde,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.waterTaxi:
  //         updateState({
  //           shortCode: shortCodes.waterTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.muvpod:
  //         updateState({
  //           shortCode: shortCodes.muvpod,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.smile:
  //         updateState({
  //           shortCode: shortCodes.smile,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.caronaTaxi:
  //         updateState({
  //           shortCode: shortCodes.caronaTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.arwin:
  //         updateState({
  //           shortCode: shortCodes.arwin,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.marjMarketplace:
  //         updateState({
  //           shortCode: shortCodes.marjMarketplace,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.eVSOnTheGo:
  //         updateState({
  //           shortCode: shortCodes.eVSOnTheGo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kazakazi:
  //         updateState({
  //           shortCode: shortCodes.kazakazi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.papiruki:
  //         updateState({
  //           shortCode: shortCodes.papiruki,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.markSoublet:
  //         updateState({
  //           shortCode: shortCodes.markSoublet,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.amstaFood:
  //         updateState({
  //           shortCode: shortCodes.amstaFood,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.toor:
  //         updateState({
  //           shortCode: shortCodes.toor,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.peerDeliveries:
  //         updateState({
  //           shortCode: shortCodes.peerDeliveries,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.swan:
  //         updateState({
  //           shortCode: shortCodes.swan,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.SCOOTUP:
  //         updateState({
  //           shortCode: shortCodes.SCOOTUP,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.patrolNow:
  //         updateState({
  //           shortCode: shortCodes.patrolNow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.butlerDelivery:
  //         updateState({
  //           shortCode: shortCodes.butlerDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.swatiRX:
  //         updateState({
  //           shortCode: shortCodes.swatiRX,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.chowHub:
  //         updateState({
  //           shortCode: shortCodes.chowHub,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ginDeliver:
  //         updateState({
  //           shortCode: shortCodes.ginDeliver,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.orderFirst:
  //         updateState({
  //           shortCode: shortCodes.orderFirst,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.maiz:
  //         updateState({
  //           shortCode: shortCodes.maiz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dingDongEat:
  //         updateState({
  //           shortCode: shortCodes.dingDongEat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.medicab:
  //         updateState({
  //           shortCode: shortCodes.medicab,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fazeiTeam:
  //         updateState({
  //           shortCode: shortCodes.fazeiTeam,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.weTogether:
  //         updateState({
  //           shortCode: shortCodes.weTogether,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jiffex:
  //         updateState({
  //           shortCode: shortCodes.jiffex,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.clickService:
  //         updateState({
  //           shortCode: shortCodes.clickService,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.amazingTaxi:
  //         updateState({
  //           shortCode: shortCodes.amazingTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jazzyBug:
  //         updateState({
  //           shortCode: shortCodes.jazzyBug,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.myfarma:
  //         updateState({
  //           shortCode: shortCodes.myfarma,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.valley:
  //         updateState({
  //           shortCode: shortCodes.valley,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kartAndKarry:
  //         updateState({
  //           shortCode: shortCodes.kartAndKarry,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.quickLube:
  //         updateState({
  //           shortCode: shortCodes.quickLube,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.keystoneDelivery:
  //         updateState({
  //           shortCode: shortCodes.keystoneDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.blueBundles:
  //         updateState({
  //           shortCode: shortCodes.blueBundles,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.busTaMove:
  //         updateState({
  //           shortCode: shortCodes.busTaMove,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.atasktt:
  //         updateState({
  //           shortCode: shortCodes.atasktt,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lunchboxSpecials:
  //         updateState({
  //           shortCode: shortCodes.lunchboxSpecials,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sorDelivery:
  //         updateState({
  //           shortCode: shortCodes.sorDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.grubHouse:
  //         updateState({
  //           shortCode: shortCodes.grubHouse,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hitchDelivery:
  //         updateState({
  //           shortCode: shortCodes.hitchDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zoodMarket:
  //         updateState({
  //           shortCode: shortCodes.zoodMarket,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.meow:
  //         updateState({
  //           shortCode: shortCodes.meow,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dingDongDelivers:
  //         updateState({
  //           shortCode: shortCodes.dingDongDelivers,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.torunz:
  //         updateState({
  //           shortCode: shortCodes.torunz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.kurs:
  //         updateState({
  //           shortCode: shortCodes.kurs,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.spa:
  //         updateState({
  //           shortCode: shortCodes.spa,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.capitalDiagnostic:
  //         updateState({
  //           shortCode: shortCodes.capitalDiagnostic,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.abbeRides:
  //         updateState({
  //           shortCode: shortCodes.abbeRides,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nrsa:
  //         updateState({
  //           shortCode: shortCodes.nrsa,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sadia:
  //         updateState({
  //           shortCode: shortCodes.sadia,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.elentaMart:
  //         updateState({
  //           shortCode: shortCodes.elentaMart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.exprexPro:
  //         updateState({
  //           shortCode: shortCodes.exprexPro,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fresHest:
  //         updateState({
  //           shortCode: shortCodes.fresHest,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.servern:
  //         updateState({
  //           shortCode: shortCodes.servern,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.smokeRun:
  //         updateState({
  //           shortCode: shortCodes.smokeRun,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.myEvPlus:
  //         updateState({
  //           shortCode: shortCodes.myEvPlus,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.qdelo:
  //         updateState({
  //           shortCode: shortCodes.qdelo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pawsee:
  //         updateState({
  //           shortCode: shortCodes.pawsee,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hairRun:
  //         updateState({
  //           shortCode: shortCodes.hairRun,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zuriRide:
  //         updateState({
  //           shortCode: shortCodes.zuriRide,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.americanLuxury:
  //         updateState({
  //           shortCode: shortCodes.americanLuxury,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.smartMur:
  //         updateState({
  //           shortCode: shortCodes.smartMur,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ouiSpeed:
  //         updateState({
  //           shortCode: shortCodes.ouiSpeed,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.getItSent:
  //         updateState({
  //           shortCode: shortCodes.getItSent,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.easyDrink:
  //         updateState({
  //           shortCode: shortCodes.easyDrink,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.iAmSelling:
  //         updateState({
  //           shortCode: shortCodes.iAmSelling,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fifteenP:
  //         updateState({
  //           shortCode: shortCodes.fifteenP,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.euodooTechnologies:
  //         updateState({
  //           shortCode: shortCodes.euodooTechnologies,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rota:
  //         updateState({
  //           shortCode: shortCodes.rota,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.farmMeat:
  //         updateState({
  //           shortCode: shortCodes.farmMeat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.danielleBejjani:
  //         updateState({
  //           shortCode: shortCodes.danielleBejjani,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.yallaEat:
  //         updateState({
  //           shortCode: shortCodes.yallaEat,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.choizez:
  //         updateState({
  //           shortCode: shortCodes.choizez,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.otto:
  //         updateState({
  //           shortCode: shortCodes.otto,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rescueRoadsideAssistance:
  //         updateState({
  //           shortCode: shortCodes.rescueRoadsideAssistance,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tax_E:
  //         updateState({
  //           shortCode: shortCodes.tax_E,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.baggageTaxi:
  //         updateState({
  //           shortCode: shortCodes.baggageTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mersi:
  //         updateState({
  //           shortCode: shortCodes.mersi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.foodSpot:
  //         updateState({
  //           shortCode: shortCodes.foodSpot,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.karibaMart:
  //         updateState({
  //           shortCode: shortCodes.karibaMart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sourceWith:
  //         updateState({
  //           shortCode: shortCodes.sourceWith,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.apptFindr:
  //         updateState({
  //           shortCode: shortCodes.apptFindr,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.vdu:
  //         updateState({
  //           shortCode: shortCodes.vdu,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.laundroZone:
  //         updateState({
  //           shortCode: shortCodes.laundroZone,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.taxiolgy:
  //         updateState({
  //           shortCode: shortCodes.taxiolgy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.swipe:
  //         updateState({
  //           shortCode: shortCodes.swipe,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sheRyders:
  //         updateState({
  //           shortCode: shortCodes.sheRyders,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kurrix:
  //         updateState({
  //           shortCode: shortCodes.kurrix,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mrVeloz:
  //         updateState({
  //           shortCode: shortCodes.mrVeloz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.greenCab:
  //         updateState({
  //           shortCode: shortCodes.greenCab,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.axxi:
  //         updateState({
  //           shortCode: shortCodes.axxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pets:
  //         updateState({
  //           shortCode: shortCodes.pets,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.getDress:
  //         updateState({
  //           shortCode: shortCodes.getDress,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.shelf:
  //         updateState({
  //           shortCode: shortCodes.shelf,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.baly:
  //         updateState({
  //           shortCode: shortCodes.baly,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nuvoni:
  //         updateState({
  //           shortCode: shortCodes.nuvoni,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.syloMart:
  //         updateState({
  //           shortCode: shortCodes.syloMart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.fairDeal:
  //         updateState({
  //           shortCode: shortCodes.fairDeal,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hezniTaxi:
  //         updateState({
  //           shortCode: shortCodes.hezniTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.onTheWheel:
  //         updateState({
  //           shortCode: shortCodes.onTheWheel,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.valleyMeats:
  //         updateState({
  //           shortCode: shortCodes.valleyMeats,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.perucabs:
  //         updateState({
  //           shortCode: shortCodes.perucabs,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hafizjwlry:
  //         updateState({
  //           shortCode: shortCodes.hafizjwlry,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jana:
  //         updateState({
  //           shortCode: shortCodes.jana,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.myWayBill:
  //         updateState({
  //           shortCode: shortCodes.myWayBill,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cattch:
  //         updateState({
  //           shortCode: shortCodes.cattch,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tezras:
  //         updateState({
  //           shortCode: shortCodes.tezras,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.eureka:
  //         updateState({
  //           shortCode: shortCodes.eureka,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kaypee:
  //         updateState({
  //           shortCode: shortCodes.kaypee,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hitaxi:
  //         updateState({
  //           shortCode: shortCodes.hitaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kwivar:
  //         updateState({
  //           shortCode: shortCodes.kwivar,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.parcel:
  //         updateState({
  //           shortCode: shortCodes.parcel,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lex:
  //         updateState({
  //           shortCode: shortCodes.lex,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.smokyKitchen:
  //         updateState({
  //           shortCode: shortCodes.smokyKitchen,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.flank:
  //         updateState({
  //           shortCode: shortCodes.flank,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zynoride:
  //         updateState({
  //           shortCode: shortCodes.zynoride,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mealsarehere:
  //         updateState({
  //           shortCode: shortCodes.mealsarehere,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.loamscape:
  //         updateState({
  //           shortCode: shortCodes.loamscape,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.delcolink:
  //         updateState({
  //           shortCode: shortCodes.delcolink,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.youSmokeShops:
  //         updateState({
  //           shortCode: shortCodes.youSmokeShops,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.doober:
  //         updateState({
  //           shortCode: shortCodes.doober,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.inmotion:
  //         updateState({
  //           shortCode: shortCodes.inmotion,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.eatHalal:
  //         updateState({
  //           shortCode: shortCodes.eatHalal,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jeevann:
  //         updateState({
  //           shortCode: shortCodes.jeevann,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.novamed:
  //         updateState({
  //           shortCode: shortCodes.novamed,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.awamer:
  //         updateState({
  //           shortCode: shortCodes.awamer,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.goTech:
  //         updateState({
  //           shortCode: shortCodes.goTech,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.idrv:
  //         updateState({
  //           shortCode: shortCodes.idrv,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.qwiker:
  //         updateState({
  //           shortCode: shortCodes.qwiker,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.spryton:
  //         updateState({
  //           shortCode: shortCodes.spryton,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nittosadai:
  //         updateState({
  //           shortCode: shortCodes.nittosadai,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.clickokart:
  //         updateState({
  //           shortCode: shortCodes.clickokart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tiimo:
  //         updateState({
  //           shortCode: shortCodes.tiimo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.verz:
  //         updateState({
  //           shortCode: shortCodes.verz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ragiomigo:
  //         updateState({
  //           shortCode: shortCodes.ragiomigo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.jimsAutoRescue:
  //         updateState({
  //           shortCode: shortCodes.jimsAutoRescue,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.carryfood:
  //         updateState({
  //           shortCode: shortCodes.carryfood,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nhazi:
  //         updateState({
  //           shortCode: shortCodes.nhazi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.petverse:
  //         updateState({
  //           shortCode: shortCodes.petverse,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.clickndrop:
  //         updateState({
  //           shortCode: shortCodes.clickndrop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lifehomefit:
  //         updateState({
  //           shortCode: shortCodes.lifehomefit,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.appi:
  //         updateState({
  //           shortCode: shortCodes.appi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dbairro_:
  //         updateState({
  //           shortCode: shortCodes.dbairro_,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.genee:
  //         updateState({
  //           shortCode: shortCodes.genee,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.speedyDelivery:
  //         updateState({
  //           shortCode: shortCodes.speedyDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.holla:
  //         updateState({
  //           shortCode: shortCodes.holla,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.stabex:
  //         updateState({
  //           shortCode: shortCodes.stabex,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.uberWeeds:
  //         updateState({
  //           shortCode: shortCodes.uberWeeds,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.cabPro:
  //         updateState({
  //           shortCode: shortCodes.cabPro,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pointoneExpediteDelivery:
  //         updateState({
  //           shortCode: shortCodes.pointoneExpediteDelivery,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.saamanshop:
  //         updateState({
  //           shortCode: shortCodes.saamanshop,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.tdc:
  //         updateState({
  //           shortCode: shortCodes.tdc,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.giftyLeaf:
  //         updateState({
  //           shortCode: shortCodes.giftyLeaf,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.flyCommerce:
  //         updateState({
  //           shortCode: shortCodes.flyCommerce,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.pik:
  //         updateState({
  //           shortCode: shortCodes.pik,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.motina:
  //         updateState({
  //           shortCode: shortCodes.motina,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hungry:
  //         updateState({
  //           shortCode: shortCodes.hungry,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.greenhippo:
  //         updateState({
  //           shortCode: shortCodes.greenhippo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.mymeddy:
  //         updateState({
  //           shortCode: shortCodes.mymeddy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.uryd:
  //         updateState({
  //           shortCode: shortCodes.uryd,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.happySingh:
  //         updateState({
  //           shortCode: shortCodes.happySingh,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.vital:
  //         updateState({
  //           shortCode: shortCodes.vital,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.parcelworks:
  //         updateState({
  //           shortCode: shortCodes.parcelworks,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.usVetsDeliver:
  //         updateState({
  //           shortCode: shortCodes.usVetsDeliver,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.flybuilder:
  //         updateState({
  //           shortCode: shortCodes.flybuilder,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.konectame:
  //         updateState({
  //           shortCode: shortCodes.konectame,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //       case appIds.skyline:
  //         updateState({
  //           shortCode: shortCodes.skyline,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bliss:
  //         updateState({
  //           shortCode: shortCodes.bliss,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rentzy:
  //         updateState({
  //           shortCode: shortCodes.rentzy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.todaysDeliverys:
  //         updateState({
  //           shortCode: shortCodes.todaysDeliverys,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.locate:
  //         updateState({
  //           shortCode: shortCodes.locate,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.georgiacollective:
  //         updateState({
  //           shortCode: shortCodes.georgiacollective,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.otgWeeds:
  //         updateState({
  //           shortCode: shortCodes.otgWeeds,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.rumbella:
  //         updateState({
  //           shortCode: shortCodes.rumbella,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lincshare:
  //         updateState({
  //           shortCode: shortCodes.lincshare,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.lvlup:
  //         updateState({
  //           shortCode: shortCodes.lvlup,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.glavour:
  //         updateState({
  //           shortCode: shortCodes.glavour,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.shipmoe:
  //         updateState({
  //           shortCode: shortCodes.shipmoe,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bigBayong:
  //         updateState({
  //           shortCode: shortCodes.bigBayong,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.efectibo:
  //         updateState({
  //           shortCode: shortCodes.efectibo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.sooq:
  //         updateState({
  //           shortCode: shortCodes.sooq,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hectoHomes:
  //         updateState({
  //           shortCode: shortCodes.hectoHomes,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.zynoBidandRide:
  //         updateState({
  //           shortCode: shortCodes.zynoBidandRide,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.glamguide:
  //         updateState({
  //           shortCode: shortCodes.glamguide,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.solace:
  //         updateState({
  //           shortCode: shortCodes.solace,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.superpana:
  //         updateState({
  //           shortCode: shortCodes.superpana,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.kero:
  //         updateState({
  //           shortCode: shortCodes.kero,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.godamPAY:
  //         updateState({
  //           shortCode: shortCodes.godamPAY,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.housingSubsidies:
  //         updateState({
  //           shortCode: shortCodes.housingSubsidies,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bocch:
  //         updateState({
  //           shortCode: shortCodes.bocch,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.potolo:
  //         updateState({
  //           shortCode: shortCodes.potolo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.earnApp:
  //         updateState({
  //           shortCode: shortCodes.earnApp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.aredoo:
  //         updateState({
  //           shortCode: shortCodes.aredoo,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.bukam:
  //         updateState({
  //           shortCode: shortCodes.bukam,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dot:
  //         updateState({
  //           shortCode: shortCodes.dot,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.wizSonic:
  //         updateState({
  //           shortCode: shortCodes.wizSonic,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.udkay:
  //         updateState({
  //           shortCode: shortCodes.udkay,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.hattaFoodHub:
  //         updateState({
  //           shortCode: shortCodes.hattaFoodHub,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.ondgoo:
  //         updateState({
  //           shortCode: shortCodes.ondgoo,
  //           isShortcodePrefilled: true,
  //         })

  //       case appIds.zonesso:
  //         updateState({
  //           shortCode: shortCodes.zonesso,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.junkerz:
  //         updateState({
  //           shortCode: shortCodes.junkerz,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.shopcart:
  //         updateState({
  //           shortCode: shortCodes.shopcart,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.viralClean:
  //         updateState({
  //           shortCode: shortCodes.viralClean,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.stargaze:
  //         updateState({
  //           shortCode: shortCodes.stargaze,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.messiaa:
  //         updateState({
  //           shortCode: shortCodes.messiaa,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.superApp:
  //         updateState({
  //           shortCode: shortCodes.superApp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nounou:
  //         updateState({
  //           shortCode: shortCodes.nounou,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.laith:
  //         updateState({
  //           shortCode: shortCodes.laith,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.liverpoolEats:
  //         updateState({
  //           shortCode: shortCodes.liverpoolEats,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.oaks:
  //         updateState({
  //           shortCode: shortCodes.oaks,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.buzy:
  //         updateState({
  //           shortCode: shortCodes.buzy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.etaim:
  //         updateState({
  //           shortCode: shortCodes.etaim,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.dotTaxiApp:
  //         updateState({
  //           shortCode: shortCodes.dotTaxiApp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.airvoltTaxi:
  //         updateState({
  //           shortCode: shortCodes.airvoltTaxi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.melakPharmacy:
  //         updateState({
  //           shortCode: shortCodes.melakPharmacy,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.wiEnergi:
  //         updateState({
  //           shortCode: shortCodes.wiEnergi,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.nannyAfrica:
  //         updateState({
  //           shortCode: shortCodes.nannyAfrica,
  //           isShortcodePrefilled: true,
  //         });
  //         break;
  //       case appIds.whatchaGotPickUp:
  //         updateState({
  //           shortCode: shortCodes.whatchaGotPickUp,
  //           isShortcodePrefilled: true,
  //         });
  //         break;

  //     }
  //   })();
  // }, []);




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
        code: shortCode,
        language: res?.primary_language?.id,
      };
    } else {
      header = {
        code: shortCode,
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
        break;
      case appIds.iPicknDrop:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        break;

      case appIds.muvpod:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        break;

      case appIds.hezniTaxi:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        break;

      case appIds.flank:
        updateState({
          isLoading: false,
          LoadingScreen: false,
          allAppData: res,
          initapiresponse: true,
        });
        break;

      default:
        updateState({ isLoading: false, LoadingScreen: false });
        navigateToNextScreen(res);
        break;
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
