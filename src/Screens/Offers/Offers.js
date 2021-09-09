import React, {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import OffersCard from '../../Components/OffersCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptyOffers from './ListEmptyOffers';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';

export default function Offer({route, navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    allAvailableCoupons: [],
    isLoadingB: false,
  });

  const vendorInfo = route?.params?.data;
  console.log(vendorInfo, '>>>>>>>>>>>>>>>>>>>');
  const {appData, appStyle, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state.initBoot);

  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    if (vendorInfo?.cabOrder) {
      _getAllPromoCodesForCabs();
    } else {
      _getAllPromoCodes();
    }
  }, []);

  //Get all promo codes for cab booking
  const _getAllPromoCodesForCabs = () => {
    let data = {};
    data['vendor_id'] = vendorInfo?.vendor?.vendor_id;
    data['product_id'] = vendorInfo?.vendor?.id;
    data['amount'] = vendorInfo?.vendor?.tags_price;
    console.log(data, 'data>>>>>>>>');
    actions
      .getAllPromoCodesForCaB(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({isLoading: false});

        if (res && res.data) {
          updateState({allAvailableCoupons: res.data});
        }
      })
      .catch(errorMethod);
  };
  //Get all promo codes
  const _getAllPromoCodes = () => {
    let data = {};
    data['vendor_id'] = vendorInfo.vendor.id;
    data['cart_id'] = vendorInfo.cartId;
    console.log(data, 'vendor_id');
    actions
      .getAllPromoCodes(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({isLoading: false});

        if (res && res.data) {
          updateState({allAvailableCoupons: res.data});
        }
      })
      .catch(errorMethod);
  };

  //Verify your promo code
  const _verifyPromoCode = (item) => {
    let data = {};
    data['vendor_id'] = vendorInfo.vendor.id;
    data['cart_id'] = vendorInfo.cartId;
    data['coupon_id'] = item.id;
    console.log(data, 'data-verify-promo');
    updateState({isLoadingB: true});
    actions
      .verifyPromocode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({isLoadingB: false});
        if (res) {
          showSuccess(res?.message || res?.error);
          navigation.navigate(navigationStrings.CART, {
            promocodeDetail: {
              couponInfo: item,
              vendorInfo: vendorInfo,
            },
          });
        }
      })
      .catch(errorMethod);
  };

  //Verify your promo code
  const _verifyPromoCodeForCab = (item) => {
    let data = {};
    data['vendor_id'] = vendorInfo?.vendor?.vendor_id;
    data['product_id'] = vendorInfo?.vendor?.id;
    data['coupon_id'] = item.id;
    data['amount'] = vendorInfo?.vendor?.tags_price;
    console.log(data, 'data-verify-promo');
    updateState({isLoadingB: true});
    actions
      .verifyPromocodeForCabOrders(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({isLoadingB: false});
        if (res) {
          showSuccess(res?.message || res?.error);
          if (vendorInfo?.pickUp) {
            navigation.navigate(navigationStrings.SHIPPING_DETAILS, {
              promocodeDetail: {
                couponInfo: res?.data,
                vendorInfo: vendorInfo,
              },
            });
          } else {
            navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIME, {
              promocodeDetail: {
                couponInfo: res?.data,
                vendorInfo: vendorInfo,
              },
            });
          }
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const rightHeader = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity>
          <Image source={imagePath.search} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={{marginLeft: 10}} source={imagePath.cartShop} />
        </TouchableOpacity>
      </View>
    );
  };

  const _renderItem = ({item, index}) => {
    return (
      <OffersCard
        data={item}
        onPress={() =>
          vendorInfo?.cabOrder
            ? _verifyPromoCodeForCab(item)
            : _verifyPromoCode(item)
        }
      />
    );
  };

  const {isLoading, allAvailableCoupons, isLoadingB} = state;
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      <Header
        centerTitle={strings.OFFERS}
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View style={{flex: 1}}>
        <FlatList
          data={isLoading ? [] : allAvailableCoupons}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{height: 20}} />}
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={<ListEmptyOffers isLoading={isLoading} />}
          ListFooterComponent={() => <View style={{height: 20}} />}
          renderItem={_renderItem}
        />
      </View>
    </WrapperContainer>
  );
}
