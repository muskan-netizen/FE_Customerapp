import {BluetoothManager} from '@brooons/react-native-bluetooth-escpos-printer';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import ListItemHorizontal from '../../Components/ListItemHorizontalWithImage';
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
import {MyDarkTheme} from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getRandomColor,
} from '../../utils/helperFunctions';
import stylesFun from './styles';
import ZendeskChat from '../../library/react-native-zendesk-chat';
import Share from 'react-native-share';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import DeviceInfo from 'react-native-device-info';
import SunmiV2Printer from 'react-native-sunmi-v2-printer';

export default function Account3({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, appStyle, appData, shortCodeStatus} = useSelector(
    (state) => state?.initBoot,
  );
  const businessType = appStyle?.homePageLayout;
  const [state, setState] = useState({
    isLoading: false,
  });

  const {preferences} = appData?.profile;

  // const profileInfo = appData?.profile;
  // console.log("account profile info",profileInfo)

  const [isVisible, setIsVisible] = useState(false);

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

  console.log(
    appData?.profile?.preferences?.customer_support_application_id,
    'userDAta',
  );
  // useFocusEffect(
  //   React.useCallback(() => {
  //     _scrollRef.current.scrollTo(0);
  //   }, []),
  // );

  //Share your app
  const onShare = () => {
    console.log('onShare', appData);
    if (!!appData?.domain_link) {
      let hyperLink = appData?.domain_link + '/share';
      let options = {url: hyperLink};
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
      return;
    }
    alert('link not found');
  };

  //Logout function
  const userlogout = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.LOGOUT_SURE_MSG, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
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

  // initalize Zendesk

  useEffect(() => {
    ZendeskChat.init(
      `${appData?.profile?.preferences?.customer_support_key}`,
      `${appData?.profile?.preferences?.customer_support_application_id}`,
    );
  }, []);

  const onStartSupportChat = () => {
    ZendeskChat.setVisitorInfo({
      name: userData?.name,
      phone: userData?.phone_number,
    });
    ZendeskChat.startChat({
      name: userData?.name,
      phone: userData?.phone_number,
      withChat: true,
      color: '#000',
    });
  };

  const usernameFirstlater = !!userData?.name && userData?.name?.charAt(0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        {/* <StatusBar
        backgroundColor={
          isDarkMode
            ? MyDarkTheme.colors.background
            : getColorCodeWithOpactiyNumber(
                themeColors.primary_color.substr(1),
                20,
              )
        }
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      /> */}
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
            //   centerTitle={strings.MY_ACCOUNT}
          />
        ) : (
          <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon={true} />
        )}

        {/* <View style={{...commonStyles.headerTopLine}} /> */}

        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {!!userData?.auth_token && (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
                style={{
                  marginHorizontal: moderateScale(24),
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: moderateScaleVertical(35),
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  paddingVertical: moderateScaleVertical(12),
                  borderRadius: 12,
                  // flex: 1,
                }}>
                {userData?.source ? (
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
                      height: moderateScale(46),
                      width: moderateScale(46),
                      borderRadius: moderateScale(12),
                      marginHorizontal: moderateScale(15),
                      backgroundColor: colors.blackOpacity10,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: getRandomColor(),
                      height: moderateScale(46),
                      width: moderateScale(46),
                      borderRadius: moderateScale(12),
                      marginHorizontal: moderateScale(15),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: textScale(20),
                        textTransform: 'uppercase',
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackB,
                      }}>
                      {usernameFirstlater}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyJ,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                      textAlign: 'left',
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
                      textAlign: 'left',
                    }}>
                    {userData?.email}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: moderateScale(30),
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
          {!!userData?.auth_token &&
            (businessType == 4 ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={moveToNewScreen(navigationStrings.MY_ORDERS)}
                iconLeft={imagePath.myOrder2}
                centerHeading={strings.MY_ORDERS}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

          {/* {DeviceInfo.getBundleId() == appIds.bharatMove ? (
            <View>
              {!userData?.auth_token && (
                <View>
                  <ListItemHorizontal
                    centerContainerStyle={{ flexDirection: 'row' }}
                    leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                    onPress={moveToNewScreen(navigationStrings.INVENTORY)}
                    iconLeft={imagePath.icInventory}
                    centerHeading={strings.INVENTORY}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.regular,
                    }}
                  // iconRight={imagePath.goRight}
                  // rightIconStyle={{tintColor: colors.textGreyLight}}
                  />
                  <ListItemHorizontal
                    centerContainerStyle={{ flexDirection: 'row' }}
                    leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                    onPress={moveToNewScreen(navigationStrings.UDHAARLEDGER)}
                    iconLeft={imagePath.icUdhaarl}
                    centerHeading={strings.UDHAARLEDGER}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.regular,
                    }}
                  // iconRight={imagePath.goRight}
                  // rightIconStyle={{tintColor: colors.textGreyLight}}
                  />
                  <ListItemHorizontal
                    centerContainerStyle={{ flexDirection: 'row' }}
                    leftIconStyle={{ flex: 0.1, alignItems: 'center' }}
                    onPress={moveToNewScreen(navigationStrings.SALES_EXPENSES)}
                    iconLeft={imagePath.icSales}
                    centerHeading={strings.SALES_EXPENSES}
                    containerStyle={styles.containerStyle2}
                    centerHeadingStyle={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.regular,
                    }}
                  // iconRight={imagePath.goRight}
                  // rightIconStyle={{tintColor: colors.textGreyLight}}
                  />
                </View>
              )}
            </View>
          ) : (
            <View></View>
          )} */}

          {!!userData?.auth_token &&
            !!appData &&
            !!appData?.profile &&
            appData?.profile?.preferences?.subscription_mode == 1 && (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
                iconLeft={imagePath.subscription}
                centerHeading={strings.SUBSCRIPTION}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

          {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.LOYALTY)}
              iconLeft={imagePath.loyalty}
              centerHeading={strings.LOYALTYPOINTS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
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
              iconLeft={imagePath.wallet3}
              centerHeading={strings.WALLET}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}
          {!!userData?.auth_token &&
            (businessType == 4 ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={moveToNewScreen(navigationStrings.WISHLIST)}
                iconLeft={imagePath.wishlist}
                centerHeading={strings.FAVOURITE}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
            iconLeft={imagePath.links}
            centerHeading={strings.LINKS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
          {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={onShare}
              iconLeft={imagePath.share1}
              centerHeading={strings.SHARE_APP}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.SETTIGS)}
            iconLeft={imagePath.settings1}
            centerHeading={strings.SETTINGS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
          {console.log('appMainDataappMainDataappMainData', appMainData)}
          {!!userData?.auth_token &&
            Platform.OS === 'android' &&
            !!appMainData?.is_admin &&
            (businessType == 'taxi' ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={() => {
                  BluetoothManager.checkBluetoothEnabled().then(
                    (enabled) => {
                      if (Boolean(enabled)) {
                        navigation.navigate(navigationStrings.ATTACH_PRINTER);
                      } else {
                        BluetoothManager.enableBluetooth()
                          .then(() => {
                            navigation.navigate(
                              navigationStrings.ATTACH_PRINTER,
                            );
                          })
                          .catch((err) => {});
                      }
                    },
                    (err) => {
                      err;
                    },
                  );
                }}
                iconLeft={imagePath.printer}
                centerHeading={strings.ATTACH_PRINTER}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

          {!!userData?.auth_token &&
            Platform.OS === 'android' &&
            SunmiV2Printer.hasPrinter &&
            __DEV__ &&
            (businessType == 'taxi' ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={() => {
                  BluetoothManager.checkBluetoothEnabled().then(
                    (enabled) => {
                      if (Boolean(enabled)) {
                        navigation.navigate(
                          navigationStrings.ATTACH_PRINTER + 'sunmi',
                        );
                      } else {
                        BluetoothManager.enableBluetooth()
                          .then(() => {
                            navigation.navigate(
                              navigationStrings.ATTACH_PRINTER + 'sunmi',
                            );
                          })
                          .catch((err) => {});
                      }
                    },
                    (err) => {
                      err;
                    },
                  );
                }}
                iconLeft={imagePath.printer}
                centerHeading={'Sunmi ' + SunmiV2Printer.printerModal}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}
          {console.log('check platform >>> ', Platform)}
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
            iconLeft={imagePath.contactUs}
            centerHeading={strings.CONTACT_US}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
          {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={() => onStartSupportChat()}
              iconLeft={imagePath.support}
              centerHeading={strings.SUPPORT}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}

          {!!userData?.auth_token &&
            !!appMainData?.is_admin &&
            businessType != 4 && (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={moveToNewScreen(navigationStrings.TABROUTESVENDOR)}
                iconLeft={imagePath.mystores2}
                centerHeading={strings.MYSTORES}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

          <View style={styles.loginView}>
            <TouchableOpacity
              // onPress={()=>actions.isVendorNotification(true)}
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
      </SafeAreaView>
    </View>
  );
}
