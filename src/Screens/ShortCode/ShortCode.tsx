import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import { getBundleId } from "react-native-device-info";
import { useDarkMode } from "react-native-dynamic";
import { MaterialIndicator } from "react-native-indicators";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import imagePath from "../../constants/imagePath";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import { moderateScale } from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { appIds } from "../../utils/constants/DynamicAppKeys";
import { showError } from "../../utils/helperFunctions";
import { getItem } from "../../utils/utils";

import { enableFreeze } from "react-native-screens";
import { getAppCode } from "./getAppCode";
import styles from "./styles";
enableFreeze(true);


interface initBootInterface {
  auth: object,
  themeToggle: boolean,
  themeColor:boolean,
  deepLinkUrl: string
}
interface IRootState {
  initBoot: initBootInterface,
  auth: userDataInterface,
}

interface userDataInterface{
  auth_token: string,
  userData: object
}


export default function ShortCode() {
  const { deepLinkUrl, auth, themeColor,themeToggle } = useSelector((state: IRootState) => state?.initBoot || {});
  


  const theme = themeColor;
  const toggleTheme = themeToggle
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const videoRef = useRef<any>(null);

  console.log("toggleThemetoggleThemetoggleTheme",toggleTheme)

  const [state, setState] = useState({
    LoadingScreen: true,
    videoDurationEnded: false,
    allAppData: null,
    initapiresponse: false,
  });
  

  const { LoadingScreen, videoDurationEnded, allAppData, initapiresponse } = state;
  const updateState = (data:object) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    initApiHit()
  }, []);


  const initApiHit = async () => {
    const res = await getItem("setPrimaryLanguage");
    const prevCode = await getItem("saveShortCode");
    const appCode = !!prevCode ? prevCode : getAppCode()

    console.log("appCodeappCodeappCodeappCode", appCode)
    let header = {};

    if (!!res?.primary_language?.id) {
      header = {
        code: appCode,
        language: res?.primary_language?.id,
      };
    } else {
      header = {
        code: appCode,
      };
    }

    actions.initApp({}, header, false, null, null, true)
      .then((res) => {
        console.log("header response--->", res);
        actions.saveShortCode(appCode);

        if (
          getBundleId() == appIds.masa ||
          getBundleId() == appIds.muvpod ||
          getBundleId() == appIds.hezniTaxi ||
          getBundleId() == appIds.flank
        ) {
          updateState({
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
        updateState({ shortCode: "" });
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };


  const navigateToNextScreen = (res:any) => {
    getItem("firstTime").then((el) => {
      if (!el && !isEmpty(res?.data?.dynamic_tutorial)) {
        actions.setAppSessionData("app_intro");
      } else {
        if (!!auth?.userData && !!auth?.userData?.auth_token) {
          actions.setAppSessionData("guest_login");
        } else if (deepLinkUrl && !auth?.userData?.auth_token) {
          actions.setAppSessionData("on_login");
        } else {
          actions.setAppSessionData("guest_login");
        }
      }
    });

  };

  const _renderSplash = useCallback(()=>{
    switch (getBundleId()) {
      case appIds.masa:
        return animatedSplash();
      case appIds.muvpod:
        return animatedSplash();
      case appIds.hezniTaxi:
        return animatedSplash();
      case appIds.flank:
        return animatedSplash();
      default:
        return imageSplash();
    } 
  },[])
  

  const imageSplash = useCallback(() => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.splashStyle}>
          <View style={{ position: "absolute", bottom: moderateScale(100) }}>
            {LoadingScreen && (<MaterialIndicator size={50} color={colors.greyMedium} />)}
          </View>
        </View>
        <Image source={{ uri: "Splash" }} style={{ flex: 1, zIndex: -1 }} />
      </View>
    )
  }, [LoadingScreen])


  const animationVideo = () => {
    switch (getBundleId()) {
      case appIds?.masa:
        return imagePath.masa;
      case appIds?.muvpod:
        return imagePath.muvpod;
      case appIds?.hezniTaxi:
        return imagePath.HezniSplash;
      case appIds?.flank:
        // return imagePath.flanksplash;
    }
  };

  const onVideoDurationEnded = () => {
    updateState({ videoDurationEnded: true });
    checkNavigationState(initapiresponse, true);
  };

  const animatedSplash = () => {
    return (
      <View style={styles.videoView}>
        <Video
          ref={videoRef}
          source={animationVideo()} // Can be a URL or a local file.
          style={styles.videoStyle}
          resizeMode={getBundleId() == appIds.muvpod ? "contain" : "cover"}
          onEnd={() => onVideoDurationEnded()}
          muted={true}
        />
      </View>
    );
  };

  const checkNavigationState = (apiRes:unknown, videoEnd:unknown) => {
    if (apiRes && videoEnd) { navigateToNextScreen(allAppData)}
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode? MyDarkTheme.colors.background: colors.white,
      }}
    >
      {_renderSplash()}
    </View>
  );
}
