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

  //   order_number: "53349553"
  // payment_option_id: 7

  useEffect(() => {
    apiHit();
  }, []);

  const apiHit = async () => {
    let queryData = `/${paramsData?.selectedPayment?.title?.toLowerCase()}?amount=${
      paramsData?.total_payable_amount
    }&payment_option_id=${
      paramsData?.payment_option_id
    }&action=cart&order_number=${paramsData?.order_number}`;

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
      console.log(res, '<===response mobbex');
      updateState({webUrl: res.data});
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const onNavigationStateChange = (props) => {
    const {url} = props;

    // let queryString = new URL(url);
    // let urlParams = queryString.searchParams;

    console.log(props, 'urlParams');
    // if((urlParams.has('gateway')) && (urlParams.get('gateway') == 'paystack')) {

    // }
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
        // <ScrollView contentContainerStyle={{paddingBottom: 60, flexGrow: 1}}>
        <WebView
          source={{uri: webUrl}}
          onNavigationStateChange={onNavigationStateChange}
        />
        // </ScrollView>
      )}
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
