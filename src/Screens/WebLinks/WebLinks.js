import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
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
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';
import HTMLView from 'react-native-htmlview';

export default function WebLinks({navigation, route}) {
  console.log(route, 'route>>>');
  const paramData = route?.params;
  const [state, setState] = useState({
    isLoading: false,
    htmlContent: null,
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

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.back}
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
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
