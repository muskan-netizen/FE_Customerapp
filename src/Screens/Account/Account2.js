import {useFocusEffect} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import ListItemHorizontal from '../../Components/ListItemHorizontalWithImage';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {getImageUrl} from '../../utils/helperFunctions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';

export default function Account2({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
  });
  const {shortCodeStatus, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const userData = useSelector((state) => state.auth.userData);
  const appMainData = useSelector((state) => state?.home?.appMainData);

  useFocusEffect(
    React.useCallback(() => {
      _scrollRef.current.scrollTo(0);
    }, []),
  );

  //Share your app
  const onShare = async () => {
    try {
      const result = await Share.share({
        url: 'https://play.google.com/store/apps/details?id=com.codebrew.customer',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };
  //Logout function
  const userlogout = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.LOGOUT_SURE_MSG, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: 'Confirm',
          onPress: () => {
            actions.userLogout();
            actions.cartItemQty('');
            moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
          },
        },
      ]);
    } else {
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };
  const _scrollRef = useRef();

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      {shortCodeStatus ? (
        <Header
          noLeftIcon={false}
          customLeft={() => (
            <Text
              onPress={() =>
                navigation.push(navigationStrings.SHORT_CODE, {
                  shortCodeParam: true,
                })
              }
              style={{
                color: themeColors.primary_color,
                fontFamily: fontFamily.bold,
              }}>
              {strings.EDITCODE}
            </Text>
          )}
          // rightIcon={imagePath.cartShop}
          centerTitle={strings.MY_ACCOUNT}
        />
      ) : (
        <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon={true} />
      )}

      <View style={{...commonStyles.headerTopLine}} />

      <ScrollView style={{flex: 1}} ref={_scrollRef}>
        {!!userData?.auth_token && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
              style={{
                marginHorizontal: moderateScale(23),
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScaleVertical(45),
              }}>
              <FastImage
                source={
                  userData?.source?.image_path
                    ? {
                        uri: getImageUrl(
                          userData?.source?.proxy_url,
                          userData?.source?.image_path,
                          '200/200',
                        ),
                      }
                    : userData?.source
                }
                style={{
                  height: moderateScale(60),
                  width: moderateScale(60),
                  borderRadius: moderateScale(60),
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  marginHorizontal: moderateScale(25),
                }}>
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(16),
                  }}>
                  {userData?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(14),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                    marginTop: moderateScaleVertical(5),
                  }}>
                  {userData?.email}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginTop: moderateScale(40),
              }}></View>
          </>
          // <ListItemHorizontal
          //   centerContainerStyle={{flexDirection: 'row'}}
          //   leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          //   onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
          //   iconLeft={imagePath.icProfile}
          //   centerHeading={strings.MY_PROFILE}
          //   containerStyle={styles.containerStyle}
          //   iconRight={imagePath.goRight}
          //   rightIconStyle={{tintColor: colors.textGreyLight}}
          //   centerHeadingStyle={{fontSize: textScale(15)}}
          // />
        )}
        {/* {!!userData?.auth_token && (
          <TouchableOpacity style={{flex: 0.1}}>
            <Image
              source={imagePath.myOrder}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </TouchableOpacity>
        )} */}
        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.MY_ORDERS)}
            iconLeft={imagePath.myOrder}
            centerHeading={strings.MY_ORDERS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
            iconLeft={imagePath.myOrder}
            centerHeading={strings.SUBSCRIPTION}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.LOYALTY)}
            iconLeft={imagePath.myOrder}
            centerHeading={strings.LOYALTYPOINTS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.NOTIFICATION)}
            iconLeft={imagePath.notifcation}
            centerHeading={strings.NOTIFICATION}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.WALLET)}
            iconLeft={imagePath.wallet}
            centerHeading={strings.WALLET}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}
        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.WISHLIST)}
            iconLeft={imagePath.fav}
            centerHeading={strings.WISHLIST}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        <ListItemHorizontal
          centerContainerStyle={{flexDirection: 'row'}}
          leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
          iconLeft={imagePath.about}
          centerHeading={strings.LINKS}
          containerStyle={styles.containerStyle2}
          centerHeadingStyle={{fontSize: textScale(15)}}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
        />
        {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={onShare}
            iconLeft={imagePath.share}
            centerHeading={strings.SHARE_APP}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        <ListItemHorizontal
          centerContainerStyle={{flexDirection: 'row'}}
          leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          onPress={moveToNewScreen(navigationStrings.SETTIGS)}
          iconLeft={imagePath.settings}
          centerHeading={strings.SETTINGS}
          containerStyle={styles.containerStyle2}
          centerHeadingStyle={{fontSize: textScale(15)}}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
        />
        {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            iconLeft={imagePath.payment}
            centerHeading={strings.PAYMENTS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
        <ListItemHorizontal
          centerContainerStyle={{flexDirection: 'row'}}
          leftIconStyle={{flex: 0.1, alignItems: 'center'}}
          onPress={moveToNewScreen(navigationStrings.CONTACT_US)}
          iconLeft={imagePath.message}
          centerHeading={strings.CONTACT_US}
          containerStyle={styles.containerStyle2}
          centerHeadingStyle={{fontSize: textScale(15)}}
          // iconRight={imagePath.goRight}
          // rightIconStyle={{tintColor: colors.textGreyLight}}
        />

        {!!userData?.auth_token && !!appMainData?.is_admin && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.TABROUTESVENDOR)}
            iconLeft={imagePath.myStoreIcon}
            centerHeading={strings.MYSTORES}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )}

        <View style={styles.loginView}>
          <TouchableOpacity
            onPress={userlogout}
            style={styles.touchAbleLoginVIew}>
            <Text style={styles.loginLogoutText}>
              {!!userData?.auth_token ? strings.LOGOUT : strings.LOGIN}
            </Text>
            <Image
              source={imagePath.rightBlue}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </WrapperContainer>
  );
}
