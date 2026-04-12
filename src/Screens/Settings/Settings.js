import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import RNRestart from 'react-native-restart';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import { API_BASE_URL } from '../../config/urls';
import imagePath from '../../constants/imagePath';
import strings, { changeLaguage } from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  hapticEffects,
  playHapticEffect,
  showError,
} from '../../utils/helperFunctions';
import { getColorSchema, setItem } from '../../utils/utils';
import stylesFunc from './styles';

export default function Settings({ route, navigation }) {
  const {
    currencies,
    appData,
    languages,
    appStyle,
    themeColors,
    themeToggle,
    themeColor,
  } = useSelector(state => state?.initBoot);
  const { userData } = useSelector(state => state?.auth);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  console.log(languages, 'languageslanguages');

  const [count, setCount] = useState(0);

  const [state, setState] = useState({
    isLoading: false,
    country: 'uk',
    appCurrencies: currencies,
    appLanguages: languages,
    isOn: false,
    selectedThemeOptions: [
      {
        id: 1,
        image: imagePath.light,
        selectedImage: imagePath.checkbox,
        type: 'light',
        themeType: strings.LIGHT,
      },
      {
        id: 2,
        image: imagePath.dark,
        selectedImage: imagePath.checkbox,
        type: 'dark',
        themeType: strings.DARK,
      },
    ],
    selectedThemeOption: null,
  });

  const {
    isLoading,
    appCurrencies,
    appLanguages,
    isOn,
    selectedThemeOptions,
    selectedThemeOption,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors, isDarkMode, MyDarkTheme });
  const commonStyles = commonStylesFunc({ fontFamily });

  useFocusEffect(
    React.useCallback(() => {
      updateState({
        appCurrencies: currencies,
        appLanguages: languages,
      });
    }, [currencies, languages]),
  );

  useEffect(() => {
    updateState({
      isOn: !!themeToggle,
      selectedThemeOption: themeColor
        ? {
          id: 2,
          image: imagePath.dark,
          selectedImage: imagePath.done,
          type: 'dark',
        }
        : {
          id: 1,
          image: imagePath.light,
          selectedImage: imagePath.done,
          type: 'light',
        },
    });
  }, [currencies, languages]);
  //update state
  const updateState = data => setState(state => ({ ...state, ...data }));

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  //Update currency
  const updateCurrency = item => {
    const data = currencies.all_currencies.filter(x => x.id == item.id)[0];

    if (data.iso_code !== currencies.primary_currency.iso_code) {
      let currenciesData = {
        ...currencies,
        primary_currency: data,
      };
      setItem('setPrimaryCurrent', currenciesData);
      updateState({ isLoading: true });
      setTimeout(() => {
        updateState({ isLoading: false });
        actions.updateCurrency(data);
      }, 1000);
    }
  };

  //Update language
  const updateLanguage = item => {
    const data = languages.all_languages.filter(x => x.id == item.id)[0];
    if (data.sort_code == languages.primary_language.sort_code) {
      return;
    }
    Alert.alert(
      'Confirmation',
      'Are you sure you want to update the language?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            let languagesData = {
              ...languages,
              primary_language: data,
            };

            setItem('setPrimaryLanguage', languagesData);

            setTimeout(() => {
              updateState({ isLoading: false });
              actions.updateLanguage(data);
              onSubmitLang(data.sort_code, languagesData);
            }, 1000);
          },
        },
      ],
    );
  };

  //update language all over the app
  const onSubmitLang = async (lang, languagesData) => {
    if (lang == '') {
      showAlertMessageError(strings.SELECT);
      return;
    } else {
      let btData = {};
      AsyncStorage.getItem('BleDevice').then(async res => {
        if (res !== null) {
          btData = res;
          await AsyncStorage.setItem('autoConnectEnabled', 'true');
          await AsyncStorage.setItem('BleDevice2', btData);
          console.log('++++++22', btData);
          if (lang === 'ar' || lang === 'he') {
            I18nManager.forceRTL(true);
            setItem('language', lang);
            changeLaguage(lang);
            RNRestart.Restart();
          } else {
            I18nManager.forceRTL(false);
            setItem('language', lang);
            changeLaguage(lang);
            RNRestart.Restart();
          }
          BluetoothManager.disconnect(JSON.parse(res).boundAddress).then(
            s => { },
          );
        } else {
          if (lang === 'ar' || lang === 'he') {
            I18nManager.forceRTL(true);
            setItem('language', lang);
            changeLaguage(lang);
            RNRestart.Restart();
          } else {
            I18nManager.forceRTL(false);
            setItem('language', lang);
            changeLaguage(lang);
            RNRestart.Restart();
          }
        }
      });
      // await BackgroundService.removeAllListeners();
      // await BackgroundService.stop().then((res) => {});
      // await AsyncStorage.removeItem('BleDevice');
    }
  };

  const _toggleOnOff = isOn => {
    actions.setToggle(isOn);
    playHapticEffect(hapticEffects.rigid);
    updateState({
      isOn: isOn ? true : false,
    });
  };

  useEffect(() => {
    if (isOn) {
      if (darkthemeusingDevice) {
        let dark = {
          id: 2,
          image: imagePath.dark,
          selectedImage: imagePath.done,
          type: 'dark',
        };

        _setApperance(dark);
      } else {
        let light = {
          id: 1,
          image: imagePath.light,
          selectedImage: imagePath.done,
          type: 'light',
        };
        _setApperance(light);
      }
    }
  }, [isOn, darkthemeusingDevice]);

  const _setApperance = item => {
    actions.setAppTheme(item);

    if (item?.type == 'light') {
      actions.setAppTheme(false);
    } else if (item?.type == 'dark') {
      actions.setAppTheme(true);
    }

    {
      selectedThemeOption && selectedThemeOption?.id == item?.id
        ? null
        : updateState({
          selectedThemeOption: item,
        });
    }
  };

  // useEffect(()=>{
  //   API_BASE_URL
  //   console.log("API_BASE_URL")
  // },[])
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
            actions
              .logoutUser({}, { client: appData?.profile?.database_name, code: appData?.profile?.code })
              .then(async res => {
                actions.userLogout();
                actions.cartItemQty('');
                actions.saveAddress('');
                actions.addSearchResults('clear');
                actions.setAppSessionData('on_login');
              }).catch((err) => {
                showError(err?.message)
              })

          },
        },
      ]);
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const logoutView = () => {
    return (
      <TouchableOpacity
        // onPress={()=>actions.isVendorNotification(true)}
        onPress={userlogout}
        style={styles.touchAbleLoginVIew}>
        <Text
          style={{
            ...styles.loginLogoutText,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {!!userData?.auth_token ? strings.LOGOUT : strings.LOGIN}
        </Text>
        <Image
          source={imagePath.rightBlue}
          style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
        />
      </TouchableOpacity>
    );
  };

  const onDeleteAccount = () => {
    if (!!userData?.auth_token) {
      Alert.alert(strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, '', [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: deleleUserAccount,
        },
      ]);
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const deleleUserAccount = async () => {
    try {
      const res = await actions.deleteAccount(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );
      console.log('delete user account res', res);
      actions.userLogout();
      actions.cartItemQty('');
      actions.saveAddress('');
      actions.addSearchResults('clear');
      actions.setAppSessionData('on_login');
    } catch (error) {
      console.log('erro raised', error);
      showError(error?.message);
    }
  };

  const onDeveloperMode = () => {
    if (count == 5) {
      navigation.navigate(navigationStrings.DEVELOPER_MODE);
      return;
    }
    setCount(prev => prev + 1);
  };
  console.log('count incresase', count);

  const cardBg  = isDarkMode ? MyDarkTheme.colors.lightDark : colors.white;
  const pageBg  = isDarkMode ? MyDarkTheme.colors.background : '#F5F6FA';
  const textClr = isDarkMode ? MyDarkTheme.colors.text : '#0f172a';
  const subClr  = isDarkMode ? MyDarkTheme.colors.text : '#64748b';
  const divClr  = isDarkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
  const dropBg  = isDarkMode ? MyDarkTheme.colors.lightDark : '#F8FAFC';

  const sectionCard = {
    backgroundColor: cardBg,
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  };

  const sectionLabel = {
    fontSize: textScale(11),
    fontFamily: fontFamily.bold,
    color: subClr,
    letterSpacing: 0.6,
    marginHorizontal: moderateScale(20),
    marginTop: moderateScaleVertical(20),
    marginBottom: moderateScaleVertical(8),
    textTransform: 'uppercase',
  };

  const dropdownStyle = {
    backgroundColor: dropBg,
    borderColor: divClr,
    borderWidth: 1,
    borderRadius: moderateScale(8),
    flexDirection: 'row',
  };

  const dropdownContainerStyle = {
    height: moderateScale(44),
    marginTop: moderateScaleVertical(6),
  };

  const dropdownLabelStyle = {
    color: isDarkMode ? MyDarkTheme.colors.text : '#374151',
    textAlign: 'left',
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  };

  return (
    <WrapperContainer
      bgColor={pageBg}
      statusBarColor={isDarkMode ? MyDarkTheme.colors.background : '#F5F6FA'}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.SETTINGS}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: '#F5F6FA' }
        }
        customRight={logoutView}
      />

      <View style={{ ...commonStyles.headerTopLine }} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

        {/* ── Appearance ── */}
        <Text style={sectionLabel}>{strings.APPEARANCE}</Text>

        <View style={[sectionCard, { overflow: 'hidden' }]}>
          {/* Theme picker row */}
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: moderateScale(16),
            paddingTop: moderateScaleVertical(16),
            paddingBottom: moderateScaleVertical(12),
            justifyContent: 'space-around',
          }}>
            {selectedThemeOptions.map((i, inx) => {
              const isSelected = selectedThemeOption?.id == i.id;
              return (
                <TouchableOpacity
                  key={String(inx)}
                  activeOpacity={0.8}
                  onPress={() => {
                    _setApperance(i);
                    playHapticEffect(hapticEffects.rigid);
                  }}
                  style={{
                    alignItems: 'center',
                    borderWidth: isSelected ? 2 : 1.5,
                    borderColor: isSelected ? themeColors.primary_color : divClr,
                    borderRadius: moderateScale(10),
                    padding: moderateScale(8),
                    backgroundColor: isSelected
                      ? (isDarkMode ? 'rgba(249,115,22,0.1)' : '#FFF7ED')
                      : cardBg,
                    width: width * 0.38,
                  }}>
                  <Image source={i.image} style={{ borderRadius: moderateScale(6) }} />
                  <Text style={{
                    marginTop: moderateScaleVertical(8),
                    fontSize: textScale(12),
                    fontFamily: isSelected ? fontFamily.bold : fontFamily.regular,
                    color: isSelected ? themeColors.primary_color : textClr,
                  }}>
                    {i.themeType}
                  </Text>
                  <View style={{
                    marginTop: moderateScaleVertical(6),
                    width: moderateScale(20),
                    height: moderateScale(20),
                    borderRadius: moderateScale(10),
                    borderWidth: 2,
                    borderColor: isSelected ? themeColors.primary_color : divClr,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? themeColors.primary_color : 'transparent',
                  }}>
                    {isSelected && (
                      <Image
                        source={i.selectedImage}
                        style={{ width: 12, height: 12, tintColor: colors.white }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: divClr, marginHorizontal: moderateScale(16) }} />

          {/* Automatic toggle */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScaleVertical(14),
          }}>
            <View>
              <Text style={{ fontSize: textScale(13), fontFamily: fontFamily.medium, color: textClr }}>
                {strings.AUTOMATIC}
              </Text>
              <Text style={{ fontSize: textScale(10), color: subClr, marginTop: 2 }}>
                Follow system theme
              </Text>
            </View>
            <ToggleSwitch
              isOn={isOn}
              onColor={themeColors.primary_color}
              offColor={colors.textGreyB}
              size="medium"
              onToggle={isOn => _toggleOnOff(isOn)}
              animationSpeed={400}
            />
          </View>
        </View>

        {/* ── Preferences (Currency + Language) ── */}
        {appStyle.homePageLayout !== 10 ? (
          <View>
            <Text style={sectionLabel}>Preferences</Text>

            {/* Currency card — higher zIndex so its dropdown floats above language card */}
            <View style={[sectionCard, { zIndex: 5000, paddingHorizontal: moderateScale(16), paddingTop: moderateScaleVertical(16), paddingBottom: moderateScaleVertical(16) }]}>
              <Text style={{ fontSize: textScale(12), fontFamily: fontFamily.bold, color: textClr, marginBottom: moderateScaleVertical(4) }}>
                {strings.CURRENCIES}
              </Text>
              {Platform.OS === 'android' ? (
                <DropDownPicker
                  items={appCurrencies?.all_currencies || []}
                  defaultValue={appCurrencies?.primary_currency?.name || appCurrencies?.primary_currency?.label || ''}
                  containerStyle={dropdownContainerStyle}
                  style={dropdownStyle}
                  labelStyle={dropdownLabelStyle}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  dropDownStyle={{
                    backgroundColor: dropBg,
                    height: 120,
                    width: width - moderateScale(32),
                    alignSelf: 'center',
                    zIndex: 5000,
                    borderColor: divClr,
                    borderRadius: moderateScale(8),
                  }}
                  zIndex={5000}
                  arrowColor={isDarkMode ? MyDarkTheme.colors.text : '#64748b'}
                  onChangeItem={item => updateCurrency(item)}
                />
              ) : (
                <DropDownPicker
                  items={appCurrencies.all_currencies}
                  defaultValue={appCurrencies?.primary_currency?.name || appCurrencies?.primary_currency?.label || ''}
                  containerStyle={{ minHeight: moderateScale(44), marginTop: moderateScaleVertical(4) }}
                  style={dropdownStyle}
                  labelStyle={dropdownLabelStyle}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  dropDownStyle={styles.dropDownStyle}
                  zIndex={5000}
                  arrowColor={isDarkMode ? MyDarkTheme.colors.text : '#64748b'}
                  onChangeItem={item => updateCurrency(item)}
                />
              )}
            </View>

            {/* Language card — lower zIndex */}
            <View style={[sectionCard, { zIndex: 1000, marginTop: moderateScaleVertical(10), paddingHorizontal: moderateScale(16), paddingTop: moderateScaleVertical(16), paddingBottom: moderateScaleVertical(16) }]}>
              <Text style={{ fontSize: textScale(12), fontFamily: fontFamily.bold, color: textClr, marginBottom: moderateScaleVertical(4) }}>
                {strings.LANGUAGES}
              </Text>
              {Platform.OS === 'android' ? (
                <DropDownPicker
                  items={appLanguages?.all_languages || []}
                  defaultValue={appLanguages?.primary_language?.nativeName || appLanguages?.primary_language?.name || appLanguages?.primary_language?.label || ''}
                  containerStyle={dropdownContainerStyle}
                  zIndex={1000}
                  style={dropdownStyle}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  labelStyle={dropdownLabelStyle}
                  dropDownStyle={{
                    backgroundColor: dropBg,
                    minHeight: moderateScaleVertical(40),
                    maxHeight: moderateScaleVertical(145),
                    width: width - moderateScale(32),
                    alignSelf: 'center',
                    borderColor: divClr,
                    borderRadius: moderateScale(8),
                  }}
                  arrowColor={isDarkMode ? MyDarkTheme.colors.text : '#64748b'}
                  onChangeItem={item => updateLanguage(item)}
                />
              ) : (
                <DropDownPicker
                  items={appLanguages.all_languages}
                  defaultValue={appLanguages?.primary_language?.nativeName || appLanguages?.primary_language?.name || appLanguages?.primary_language?.label || ''}
                  containerStyle={{ height: moderateScale(44), marginTop: moderateScaleVertical(4) }}
                  zIndex={1000}
                  style={[dropdownStyle, { zIndex: 1000 }]}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  labelStyle={dropdownLabelStyle}
                  dropDownStyle={{
                    backgroundColor: dropBg,
                    minHeight: moderateScaleVertical(40),
                    maxHeight: moderateScaleVertical(145),
                    alignSelf: 'center',
                    borderColor: divClr,
                    borderRadius: moderateScale(8),
                  }}
                  arrowColor={isDarkMode ? MyDarkTheme.colors.text : '#64748b'}
                  onChangeItem={item => updateLanguage(item)}
                />
              )}
            </View>
          </View>
        ) : null}

        {/* ── Footer ── */}
        <View style={{
          zIndex: -1,
          alignItems: 'center',
          marginTop: moderateScaleVertical(28),
          marginBottom: moderateScaleVertical(40),
          paddingVertical: moderateScaleVertical(16),
          marginHorizontal: moderateScale(16),
          backgroundColor: cardBg,
          borderRadius: moderateScale(12),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}>
          <Text
            onPress={onDeveloperMode}
            style={{
              fontSize: textScale(11),
              color: subClr,
              fontFamily: fontFamily.regular,
            }}>
            App Version {`${DeviceInfo.getVersion()}`}{' '}
            {`(${DeviceInfo.getBuildNumber()})`}{' '}
            {API_BASE_URL == 'https://api.rostaging.com/api/v1' ? 'S' : ''}
          </Text>

          {!!userData?.auth_token ? (
            <TouchableOpacity
              onPress={onDeleteAccount}
              style={{
                marginTop: moderateScaleVertical(12),
                paddingHorizontal: moderateScale(20),
                paddingVertical: moderateScaleVertical(8),
                borderRadius: moderateScale(8),
                borderWidth: 1,
                borderColor: colors.redB,
              }}>
              <Text style={{
                fontSize: textScale(12),
                color: colors.redB,
                fontFamily: fontFamily.medium,
              }}>
                {strings.DELETE_ACCOUNT}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

      </ScrollView>
    </WrapperContainer>
  );
}
