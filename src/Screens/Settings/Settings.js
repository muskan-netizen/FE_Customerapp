import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {I18nManager, Text, View} from 'react-native';
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
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {setItem} from '../../utils/utils';
import stylesFunc from './styles';

export default function Settings({route, navigation}) {
  // const appData = useSelector(state => state?.initBoot?.appData);
  const {currencies, appData, languages, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const [state, setState] = useState({
    isLoading: false,
    country: 'uk',
    appCurrencies: currencies,
    appLanguages: languages,
  });

  const {isLoading, appCurrencies, appLanguages} = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});

  useFocusEffect(
    React.useCallback(() => {
      console.log(currencies, 'currencies-updated');
      console.log(languages, 'languages-updated');
      updateState({
        appCurrencies: currencies,
        appLanguages: languages,
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

  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appData?.profile?.code === shortCodes.capcorp
            ? imagePath.backArrow
            : imagePath.back
        }
        centerTitle={strings.SETTINGS}
        // rightIcon={imagePath.cartShop}
        headerStyle={{backgroundColor: colors.white}}
      />

      <View style={{...commonStyles.headerTopLine}} />
      {/* <KeyboardAwareScrollView bounces={false}> */}
      <View style={{flexDirection: 'row', marginHorizontal: moderateScale(20)}}>
        <Text style={styles.currency}>{strings.CURRENCIES}</Text>
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
          backgroundColor: '#fafafa',
          zIndex: 5000,
          marginHorizontal: moderateScale(20),
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
        itemStyle={{
          justifyContent: 'flex-start',
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
        zIndex={5000}
        dropDownStyle={{
          backgroundColor: '#fafafa',
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
        <Text style={styles.currency}>{strings.LANGUAGES}</Text>
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
          backgroundColor: '#fafafa',
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
        zIndex={4000}
        dropDownStyle={{
          backgroundColor: '#fafafa',
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
