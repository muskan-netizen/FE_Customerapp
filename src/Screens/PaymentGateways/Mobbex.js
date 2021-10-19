import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import {useSelector} from 'react-redux';
import colors from '../../styles/colors';
import imagePath from '../../constants/imagePath';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import Header from '../../Components/Header';
import actions from '../../redux/actions';
import {useState} from 'react';
import {WebView} from 'react-native-webview';
import queryString from 'query-string';
import navigationStrings from '../../navigation/navigationStrings';
import {showError} from '../../utils/helperFunctions';
import {moderateScaleVertical} from '../../styles/responsiveSize';

export default function Mobbex({navigation, route}) {
  let paramsData = route?.params;
  console.log(paramsData, '===>paramsData');

  const {themeToggle, themeColor, appStyle, appData, currencies, languages} =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    webUrl: '',
  });

  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {webUrl} = state;

  useEffect(() => {
    apiHit();
  }, []);

  const apiHit = async () => {
    let queryData = `/${paramsData?.selectedPayment?.title?.toLowerCase()}?amount=${
      paramsData?.total_payable_amount
    }&payment_option_id=${
      paramsData?.payment_option_id
    }&action=cart&order_number=${paramsData?.orderDetail?.order_number}`;

    try {
      const res = await actions.openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );
      updateState({webUrl: res.data});
    } catch (error) {
      showError(error.message || error);
    }
  };
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onNavigationStateChange = (props) => {
    const {url} = props;
    const URL = queryString.parseUrl(url);
    const queryParams = URL.query;
    const nonQueryURL = URL.url;

    setTimeout(() => {
      if (queryParams.status === '200') {
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number: queryParams.order,
            id: paramsData?.orderDetail?.id,
          },
        })();
      } else if (queryParams.status === '0') {
        moveToNewScreen(navigationStrings.CART, {
          queryURL: url.replace(`${nonQueryURL}?`, ''),
        })();
      }
    }, 3000);
  };
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.transparent}
      statusBarColor={colors.white}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 ? imagePath.icBackb : imagePath.back
        }
        centerTitle={''}
      />
      {webUrl !== '' && (
        <WebView
          source={{uri: webUrl}}
          onNavigationStateChange={onNavigationStateChange}
        />
      )}
      <View
        style={{
          height: moderateScaleVertical(75),
          backgroundColor: colors.transparent,
        }}
      />
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
