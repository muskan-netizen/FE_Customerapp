import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import OffersCard2 from '../../../Components/OffersCard2';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {showError} from '../../../utils/helperFunctions';
import stylesFun from './styles';

const PaymentOptions = ({navigation, route}) => {
  const [state, setState] = useState({
    pageNo: 1,
    limit: 12,
    apiPaymentOptions: [],
    walletPayment: {id: 2, title: strings.WALLET, off_site: 0},
  });
  const {appData, appStyle, themeColors} = useSelector(
    (state) => state.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const {pageNo, limit, apiPaymentOptions, walletPayment} = state;

  useEffect(() => {
    getAllPaymentOptions();
  }, []);

  useEffect(() => {
    getWalletData();
  }, [pageNo]);

  const getAllPaymentOptions = () => {
    actions
      .getListOfPaymentMethod(
        `/pickup_delivery`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'responseFromServer');
        updateState({
          apiPaymentOptions: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const getWalletData = () => {
    actions
      .walletHistory(
        `?page=${pageNo}&limit=${limit}`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'Wallet Responce');
        updateState({
          isRefreshing: false,
          isLoading: false,
          isLoadingB: false,
          wallet_amount: res?.data?.wallet_amount,
          walletHistory:
            pageNo == 1
              ? res.data.transactions.data
              : [...walletHistory, ...res.data.transactions.data],
        });
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    console.log(error, 'errorOccured');
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const _onPressWallet = () => {
    if (walletAmount >= 0) {
      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        selectedMethod: walletPayment,
      });
    } else {
      showError(strings.PLEASE_RECHARGE_WALLET);
    }
  };

  const _onPressPaymentOption = (item) => {
    navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
      selectedMethod: item,
    });
  };

  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => _onPressPaymentOption(item)}
        style={styles.renderItemStyle}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScale(20),
          }}>
          <Image source={imagePath.radioInActive} style={styles.imageStyle} />
          <Text
            style={[
              styles.textStyle,
              {color: isDarkMode ? MyDarkTheme.colors.text : '#1C1C1C'},
            ]}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>
      <Header
        rightViewStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.greyColor,
          alignItems: 'center',
          paddingVertical: moderateScaleVertical(8),
          borderRadius: 14,
          flex: 0.15,
        }}
        leftIcon={imagePath.backArrowCourier}
        centerTitle={strings.PAYMENT_OPTIONS}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginVertical: moderateScaleVertical(10),
          rightViewStyle: {backgroundColor: colors.greyColor},
        }}
      />
      <View style={styles.containerStyle}>
        <View style={{marginHorizontal: moderateScale(18)}}>
          <Text
            style={{
              opacity: 0.7,
              fontFamily: fontFamily.bold,
              fontSize: textScale(14),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginVertical: moderateScaleVertical(20),
            }}>
            {strings.PAYMENT_METHOD}
          </Text>
          {/* <TouchableOpacity
            onPress={_onPressWallet}
            style={{
              ...styles.renderItemStyle,
              flexDirection: 'row',
              marginBottom: moderateScale(20),
            }}>
            <Image source={imagePath.radioInActive} style={styles.imageStyle} />
            <Text
              style={[
                styles.textStyle,
                {color: isDarkMode ? MyDarkTheme.colors.text : '#1C1C1C'},
              ]}>
              {strings.WALLET}
            </Text>
          </TouchableOpacity> */}
          <FlatList
            data={apiPaymentOptions}
            renderItem={_renderItem}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default PaymentOptions;
