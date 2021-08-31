import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';

import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import strings from '../../constants/lang';

export default function WebLinks({navigation, route}) {
  console.log(route, 'route>>>');
  const paramData = route?.params;
  const [state, setState] = useState({
    isLoading: false,
    htmlContent: null,
    callingCode: '91',
    cca2: 'IN',
    phoneNumber: '',
    fullname: '',
    email: '',
    title: '',
    password: '',
    confirm_password: '',
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  const {isLoading, htmlContent} = state;

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useEffect(() => {
    updateState({isLoading: true});
    getCmsPageDetail();
  }, []);

  //Get list of all payment method
  const getCmsPageDetail = () => {
    let data = {};
    data['page_id'] = paramData && paramData?.id;
    actions
      .getCmsPageDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log('Cms page detail', res);
        updateState({isLoadingB: false, isLoading: false, isRefreshing: false});
        if (res && res?.data?.description) {
          updateState({htmlContent: res?.data?.description});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };
  const {cca2, phoneNumber} = state;
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={
          appData?.profile?.code === shortCodes.capcorp
            ? imagePath.backArrow
            : imagePath.back
        }
        centerTitle={(paramData && paramData?.title) || ''}
        headerStyle={{backgroundColor: Colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />

      <ScrollView>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {/* {!!(paramData && paramData?.url) && (
              <WebView source={{uri: paramData?.url}} />
            )} */}
            {htmlContent && <HTMLView value={htmlContent} />}
          </View>
          <View
            style={{
              marginTop: moderateScaleVertical(40),
              marginHorizontal: moderateScale(24),
            }}>
            <BorderTextInput
              placeholder={strings.YOUR_NAME}
              onChangeText={_onChangeText('fullname')}
            />

            <BorderTextInput
              placeholder={strings.YOUR_EMAIL}
              onChangeText={_onChangeText('email')}
            />
            <BorderTextInput
              placeholder={strings.ENTER_TITLE}
              label={'Title'}
              onChangeText={_onChangeText('title')}
            />
            <PhoneNumberInput
              onCountryChange={_onCountryChange}
              onChangePhone={(phoneNumber) =>
                updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
              }
              cca2={cca2}
              phoneNumber={phoneNumber}
              callingCode={state.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              keyboardType={'phone-pad'}
            />
            <View style={{height: moderateScaleVertical(20)}} />
            <BorderTextInput
              secureTextEntry={true}
              placeholder={strings.ENTER_PASSWORD}
              onChangeText={_onChangeText('password')}
            />
            <BorderTextInput
              secureTextEntry={true}
              placeholder={strings.CONFIRM_PASSWORD}
              onChangeText={_onChangeText('confirm_password')}
            />
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
