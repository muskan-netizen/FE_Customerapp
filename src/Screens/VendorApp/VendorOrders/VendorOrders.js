import {cloneDeep, debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import OrderCardComponent from '../../../Components/OrderCardComponent';
import OrderCardVendorComponent from '../../../Components/OrderCardVendorComponent';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {moderateScaleVertical} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';
// import OrderCardComponent from './OrderCardComponent';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';

export default function VendorOrders({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route.params;
  console.log(paramData, 'paramData');
  const [state, setState] = useState({
    tabBarData: [
      {title: strings.ACTIVE_ORDERS, isActive: true},
      {title: strings.PAST_ORDERS, isActive: false},
      {title: strings.SCHEDULED_ORDERS, isActive: false},
    ],
    selectedTab: strings.ACTIVE_ORDERS,
    activeOrders: [],
    pastOrders: [],
    scheduledOrders: [],
    pageActive: 1,
    pagePastOrder: 1,
    pageScheduleOrder: 1,
    limit: 10,
    isLoading: true,
    isLoadingB: false,
    isRefreshing: false,
    vendor_list: [],
    selectedVendor: null,
  });
  const {
    isLoadingB,
    selectedTab,
    isLoading,
    activeOrders,
    pageActive,
    limit,
    isRefreshing,
    vendor_list,
    selectedVendor,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const currentTheme = useSelector((state) => state.initBoot);
  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const {themeColors, themeLayouts} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  useEffect(() => {
    // updateState({isLoading: true});
    _getListOfVendorOrders();
  }, [isLoading]);

  const _getListOfVendorOrders = () => {
    actions
      ._getListOfVendorOrders(
        `?limit=${limit}&page=${pageActive}&selected_vendor_id=${
          selectedVendor?.id || ''
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'order listing data res>>>>');
        console.log(
          res.data.vendor_list.find((x) => x.is_selected),
          'slected vendior',
        );
        updateState({
          activeOrders:
            pageActive == 1
              ? res.data.order_list.data
              : [...activeOrders, ...res.data.order_list.data],
          vendor_list: res.data.vendor_list,
          selectedVendor: selectedVendor
            ? selectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  //error handling
  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isLoadingC: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.id,
      fromVendorApp: true,
      showRating: false,
      selectedVendor: selectedVendor,
    });
  };

  const renderOrders = ({item, index}) => {
    return (
      <OrderCardVendorComponent
        data={item}
        // selectedTab={selectedTab}
        onPress={() => onPressViewEditAndReplace(item)}
        updateOrderStatus={(data, status) => updateOrderStatus(data, status)}
      />
    );
  };

  const updateOrderStatus = (acceptRejectData, status) => {
    let data = {};
    data['order_id'] = acceptRejectData?.id;
    data['vendor_id'] = selectedVendor?.id;
    data['order_status_option_id'] = status;
    console.log(data, 'data>>data');

    updateState({isLoadingB: true});
    actions
      .updateOrderStatus(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res>>>acceptRejectOrder');
        if (res && res.status == 'success') {
          updateStatus(res, acceptRejectData);
        }
      })
      .catch(errorMethod);
  };

  const updateStatus = (res, acceptRejectData) => {
    let clonedArrayOrderList = cloneDeep(activeOrders);

    updateState({
      isLoadingB: false,
      activeOrders: clonedArrayOrderList.map((i, inx) => {
        if (i?.id == acceptRejectData?.id) {
          i.order_status = res.order_status;
          return i;
        } else {
          return i;
        }
      }),
    });
  };
  useEffect(() => {
    _getListOfVendorOrders();
  }, [pageActive, isRefreshing]);

  //Refresh screen

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageActive: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageActive: pageActive + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: staticStrings.ORDERS,
    });
  };
  useEffect(() => {
    updateState({
      selectedVendor: paramData?.selectedVendorFrom,
      isLoading: true,
      pageActive: 1,
    });
  }, [paramData?.selectedVendorFrom]);

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading || isLoadingB}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={selectedVendor?.name || ''}
        showImageAlongwithTitle={true}
        // rightIcon={imagePath.cartShop}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <FlatList
        data={activeOrders}
        extraData={activeOrders}
        // data={[1, 2, 3, 4]}
        renderItem={renderOrders}
        keyExtractor={(item, index) => String(index)}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          marginVertical: moderateScaleVertical(20),
        }}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        // ListEmptyComponent={<ListEmptyProduct />}
      />
    </WrapperContainer>
  );
}
