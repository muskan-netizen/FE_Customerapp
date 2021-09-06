import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {I18nManager, Text, View, Image, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings, {changeLaguage} from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {setItem} from '../../utils/utils';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import ToggleSwitch from 'toggle-switch-react-native';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';

export default function Settings({route, navigation}) {
  // const appData = useSelector(state => state?.initBoot?.appData);

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const isDarkMode = useDarkMode();
  const isDarkMode = theme;
  const {currencies, appData, languages, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );

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
        selectedImage: imagePath.done,
        type: 'light',
      },
      {
        id: 2,
        image: imagePath.dark,
        selectedImage: imagePath.done,
        type: 'dark',
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
  const styles = stylesFunc({fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});

  useFocusEffect(
    React.useCallback(() => {
      updateState({
        appCurrencies: currencies,
        appLanguages: languages,
        isOn: toggleTheme,
        selectedThemeOption: theme
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
    }, [currencies, languages]),
  );

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Update currency
  const updateCurrency = (item) => {
    const data = currencies.all_currencies.filter((x) => x.id == item.id)[0];

    if (data.iso_code !== currencies.primary_currency.iso_code) {
      let currenciesData = {
        ...currencies,
        primary_currency: data,
      };
      setItem('setPrimaryCurrent', currenciesData);
      updateState({isLoading: true});
      setTimeout(() => {
        updateState({isLoading: false});
        actions.updateCurrency(data);
      }, 1000);
    }
  };

  //Update language
  const updateLanguage = (item) => {
    const data = languages.all_languages.filter((x) => x.id == item.id)[0];

    if (data.sort_code !== languages.primary_language.sort_code) {
      let languagesData = {
        ...languages,
        primary_language: data,
      };

      updateState({isLoading: true});
      setItem('setPrimaryLanguage', languagesData);
      setTimeout(() => {
        updateState({isLoading: false});
        actions.updateLanguage(data);
        onSubmitLang(data.sort_code, languagesData);
      }, 1000);
    }
  };

  //update language all over the app
  const onSubmitLang = async (lang, languagesData) => {
    if (lang == '') {
      showAlertMessageError(strings.SELECT);
      return;
    } else {
      if (lang === 'ar') {
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
  };

  const _toggleOnOff = (isOn) => {
    actions.setToggle(isOn);
    setTimeout(() => {
      updateState({
        isOn: isOn ? true : false,
      });
    }, 0);
  };

  const _setApperance = (item) => {
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

  console.log(appCurrencies.all_currencies, 'll_currencies');
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={strings.SETTINGS}
        // rightIcon={imagePath.cartShop}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />

      <View style={{...commonStyles.headerTopLine}} />
      {/* <KeyboardAwareScrollView bounces={false}> */}

      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(20),
          marginTop: moderateScaleVertical(20),
          justifyContent: 'space-between',
          ...commonStyles.shadowStyle,
          paddingVertical: moderateScaleVertical(10),
          paddingHorizontal: moderateScale(5),
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.white,
        }}>
        <Text
          style={
            isDarkMode
              ? [
                  styles.darkAppearanceTextStyle,
                  {color: MyDarkTheme.colors.text},
                ]
              : styles.darkAppearanceTextStyle
          }>
          {strings.DARK_APPEARANCE}
        </Text>
        <ToggleSwitch
          isOn={isOn}
          onColor={themeColors.primary_color}
          offColor={colors.textGreyB}
          size="medium"
          onToggle={(isOn) => _toggleOnOff(isOn)}
        />
      </View>

      {isOn ? (
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(20),
            marginTop: moderateScaleVertical(20),
            justifyContent: 'space-around',
            paddingVertical: moderateScaleVertical(10),
            paddingHorizontal: moderateScale(20),
            height: moderateScaleVertical(height - height + 60),
            marginVertical: moderateScaleVertical(20),
          }}>
          {selectedThemeOptions.map((i, inx) => {
            return (
              <TouchableOpacity onPress={() => _setApperance(i)}>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1000,
                    end: -15,
                    marginTop: -12,
                  }}>
                  {selectedThemeOption && selectedThemeOption?.id == i.id ? (
                    <Image source={i.selectedImage} />
                  ) : null}
                </View>
                <Image
                  style={{
                    height: moderateScaleVertical(70),
                    width: moderateScale(70),
                  }}
                  source={i.image}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <View style={{flexDirection: 'row', marginHorizontal: moderateScale(20)}}>
        <Text
          style={
            isDarkMode
              ? [styles.currency, {color: MyDarkTheme.colors.text}]
              : styles.currency
          }>
          {strings.CURRENCIES}
        </Text>
      </View>
      <DropDownPicker
        items={appCurrencies.all_currencies}
        defaultValue={
          appCurrencies?.primary_currency?.name ||
          appCurrencies?.primary_currency?.label ||
          ''
        }
        containerStyle={{height: 40, marginTop: moderateScaleVertical(5)}}
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : '#fafafa',
          zIndex: 5000,
          marginHorizontal: moderateScale(20),
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
        labelStyle={
          isDarkMode ? {color: MyDarkTheme.colors.text} : {color: null}
        }
        itemStyle={{
          justifyContent: 'flex-start',
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
        zIndex={5000}
        dropDownStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : '#fafafa',
          height: 120,
          width: width - moderateScale(40),
          alignSelf: 'center',
        }}
        onChangeItem={(item) => updateCurrency(item)}
      />

      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(20),
          marginTop: moderateScaleVertical(10),

          zIndex: 4000,
        }}>
        <Text
          style={
            isDarkMode
              ? [styles.currency, {color: MyDarkTheme.colors.text}]
              : styles.currency
          }>
          {strings.LANGUAGES}
        </Text>
      </View>
      <DropDownPicker
        items={appLanguages.all_languages}
        defaultValue={
          appLanguages?.primary_language?.name ||
          appLanguages?.primary_language?.label ||
          ''
        }
        containerStyle={{height: 40, marginTop: moderateScaleVertical(5)}}
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : '#fafafa',
          zIndex: 4000,
          marginHorizontal: moderateScale(20),
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
        itemStyle={{
          justifyContent: 'flex-start',
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
        labelStyle={{
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
        labelStyle={
          isDarkMode ? {color: MyDarkTheme.colors.text} : {color: null}
        }
        zIndex={4000}
        dropDownStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : '#fafafa',
          height: 120,
          width: width - moderateScale(40),
          alignSelf: 'center',
        }}
        onChangeItem={(item) => updateLanguage(item)}
      />

      {/* </KeyboardAwareScrollView> */}
    </WrapperContainer>
  );
}
