import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import Header from '../../../Components/Header';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import {useSelector} from 'react-redux';
import colors from '../../../styles/colors';
import stylesFun from './styles';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import OffersCard2 from '../../../Components/OffersCard2';
import navigationStrings from '../../../navigation/navigationStrings';
import {showError} from '../../../utils/helperFunctions';
import actions from '../../../redux/actions';

const PaymentOptions = ({navigation, route}) => {
  const [state, setState] = useState({
    paymentMethods: [
      {id: 1, title: 'Cash On Delivery', image: imagePath.cash},
      {id: 2, title: 'Wallet', image: imagePath.card},
      // {id: 2, title: 'UPI', image: imagePath.upi},
    ],
    allAvailableCoupons: [
      {
        id: 0,
        title: 'FLAT20',
        expiry_date: '20 jan 2022',
        name: '78878',
      },
      {
        id: 1,
        title: 'FLAT50',
        expiry_date: '11 jan 2022',
        name: '78878',
      },
    ],
    pageNo: 1,
    limit: 12,
  });
  const {appData, appStyle, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );
  console.log(walletAmount, 'walletAmount');
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const vendorInfo = route?.params?.data;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const {paymentMethods, allAvailableCoupons, pageNo, limit} = state;

  const _onPressPaymentOption = (item) => {
    console.log(item, '_onPressPaymentOption');
    if (item?.id == 1) {
      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        selectedMethod: item,
      });
      // selectedMethod: selectedPaymentMethod,
    } else {
      if (walletAmount >= 0) {
        navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
          selectedMethod: item,
        });
      } else {
        showError('Please Recharge Your Wallet');
      }
    }
  };

  useEffect(() => {
    getWalletData();
  }, [pageNo]);

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
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
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
          <Image source={item.image} style={styles.imageStyle} />
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
  const _headerComponent = () => {
    return (
      <View style={{marginTop: moderateScale(18)}}>
        <Text
          style={{
            textTransform: 'uppercase',
            opacity: 0.7,
            fontFamily: fontFamily.reguler,
            fontSize: textScale(12),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginBottom: moderateScaleVertical(20),
          }}>
          {strings.PAYMENT_METHOD}
        </Text>
      </View>
    );
  };
  const _headerVouchers = () => {
    return (
      <View
        style={{
          marginHorizontal: moderateScale(18),
          marginTop: moderateScale(16),
          marginBottom: moderateScale(24),
        }}>
        <Text
          style={{
            textTransform: 'uppercase',
            opacity: 0.7,
            fontFamily: fontFamily.reguler,
            fontSize: textScale(12),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {strings.AVAILABLE_VOUCHERS}
        </Text>
      </View>
    );
  };

  const _renderPromoCodes = ({item}) => {
    return (
      <OffersCard2
        data={item}
        // onPress={() =>
        //   vendorInfo?.cabOrder
        //     ? _verifyPromoCodeForCab(item)
        //     : _verifyPromoCode(item)
        // }
      />
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
        leftIcon={imagePath.close2}
        centerTitle={strings.PAYMENT_OPTIONS}
        // rightIcon={imagePath.cartShop}
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
          <FlatList
            data={paymentMethods}
            renderItem={_renderItem}
            ListHeaderComponent={_headerComponent}
          />
        </View>
        {/* <View style={{marginTop: moderateScale(28)}}>
          <FlatList
            data={allAvailableCoupons}
            ListHeaderComponent={_headerVouchers}
            renderItem={_renderPromoCodes}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
          />
        </View> */}
      </View>
    </WrapperContainer>
  );
};

export default PaymentOptions;
