import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Platform } from 'react-native';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import stylesFunc from './styles';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getBuildId } from 'react-native-device-info';
import actions from '../../redux/actions';
import { showError } from '../../utils/helperFunctions';
import { useFocusEffect } from '@react-navigation/native';
import ButtonWithLoader from '../../Components/ButtonWithLoader';

export default function OrderSuccess({ navigation, route }) {
  const paramData = route?.params?.data;

  const { appStyle, themeColors, themeColor, themeToggle, appData, currencies,
    languages, } = useSelector((state) => state?.initBoot);
  const { userData } = useSelector(state => state?.auth);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const { dineInType } = useSelector((state) => state?.home);
  const [isLoadingChat, setLoadingChat] = useState(false)


  const viewOrderDetail = () => {

    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: paramData?.orderDetail?.id,
      fromActive: true, // this value use for useInterval
      from: "cart"
    });
  };

  const androidBackButtonHandler = () => {

  }

  useEffect(() => {
    if(dineInType==='p2p'){
      createRoom("onFocus")
    } 
  }, [])

  const createRoom = async (type = '') => {

    if (!userData?.auth_token) {
      actions.setAppSessionData('on_login');
      return;
    }
    setLoadingChat(true);
    try {
      const apiData = {
        sub_domain: '192.168.101.88', //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: 'user_to_user',
        product_id: String(paramData?.product_id),
        vendor_id: String(paramData?.orderDetail?.vendors[0]?.vendor_id),
        order_number: paramData?.orderDetail?.order_number
      };


      console.log('sending api data', apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });

      if (!!res?.roomData) {
        type !== "onFocus" && onChat(res.roomData);
      }
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      console.log('error raised in start chat api', error);
      showError(error?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );



  const onChat = (item) => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, {
      data: {
        ...item, vendor_id_order: paramData?.orderDetail?.vendors[0]?.id
      }
    });
  };
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <KeyboardAwareScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: moderateScaleVertical(20) }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(navigationStrings.HOME)
          }}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
            source={imagePath.cross}
          />
        </TouchableOpacity>
        <View style={styles.doneIconView}>
          <Image
            source={imagePath.successfulIcon}
            style={{
              marginBottom: moderateScaleVertical(30),
              tintColor: 'green',
              opacity: 0.5,
            }}
          />
          <Text
            style={
              isDarkMode
                ? [styles.requestSubmitText, { color: MyDarkTheme.colors.text }]
                : styles.requestSubmitText
            }>
            {strings.YOUR_ORDER_HAS_BEEN_SUBMITTED} {''}
            {/* <Text style={
              isDarkMode
                ? [styles.thanksForyourPurchase, { color: MyDarkTheme.colors.text }]
                : styles.thanksForyourPurchase
            } >{ strings.THANKS_FOR_YOUR_PURCHASE}</Text> */}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.successfully, { color: MyDarkTheme.colors.text }]
                : styles.successfully
            }>
            {appIds.qdelo === getBuildId() ? strings.THANKS_FOR_ORDERING_WITH_US : strings.THANKS_FOR_YOUR_PURCHASE}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginVertical: moderateScaleVertical(50),
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.yourAWBText, { color: MyDarkTheme.colors.text }]
                : styles.yourAWBText
            }>
            {`${strings.YOUR_ORDER_NUMBER} ${paramData && paramData?.orderDetail
              ? paramData?.orderDetail?.order_number
              : ''
              }`}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginBottom: moderateScaleVertical(90),
          }}>
          <ButtonWithLoader
            isLoading={isLoadingChat}
            btnText={appStyle?.homePageLayout === 8 ? strings.START_CHAT : strings.VIEW_DETAIL}
            onPress={appStyle?.homePageLayout === 8 ? createRoom : viewOrderDetail}
            textStyle={{ color: themeColors.secondary_color }}
            borderRadius={moderateScale(13)}
            btnStyle={{
              backgroundColor: themeColors.primary_color,
              width: width / 1.2,
              borderWidth: 0
            }}
          />

        </View>
      </KeyboardAwareScrollView>

      {/* */}
    </WrapperContainer>
  );
}
