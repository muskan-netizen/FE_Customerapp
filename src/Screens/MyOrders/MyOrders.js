import {cloneDeep, debounce} from 'lodash';
import React, {createRef, useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import CustomTopTabBar from '../../Components/CustomTopTabBar';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import OrderCardVendorComponent from '../../Components/OrderCardVendorComponent';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {moderateScaleVertical, width} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';

export default function MyOrders({navigation}) {
  const [state, setState] = useState({
    tabBarData: [
      {title: strings.ACTIVE_ORDERS, isActive: true},
      {title: strings.PAST_ORDERS, isActive: false},
      {title: strings.SCHEDULED_ORDERS, isActive: false},
    ],
    selectedTab: strings.ACTIVE_ORDERS,
    orders: [],
    activeOrders: [],
    pastOrders: [],
    scheduledOrders: [],
    pageActive: 1,
    pagePastOrder: 1,
    pageScheduleOrder: 1,
    limit: 10,
    isLoading: false,
    isRefreshing: false,
    tabType: 'active',
  });
  const {
    tabBarData,
    selectedTab,
    isLoading,
    activeOrders,
    pastOrders,
    scheduledOrders,
    pageActive,
    pagePastOrder,
    pageScheduleOrder,
    limit,
    isRefreshing,
    tabType,
    orders,
  } = state;

  //Update state in screen
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const _scrollRef = createRef();
  //Reduc store data
  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  //Get list of all orders
  useEffect(() => {
    updateState({isLoading: true});
    _getListOfOrders();
  }, [selectedTab]);

  //Get list of all orders api
  const _getListOfOrders = () => {
    actions
      .getOrderListing(
        `?limit=${limit}&page=${pageActive}&type=${tabType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>');
        updateState({
          orders:
            pageActive == 1 ? res.data.data : [...orders, ...res.data.data],
          // activeOrders:
          //   pageActive == 1
          //     ? res.data.data
          //     : [...activeOrders, ...res.data.data],
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  //error handling of api
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isLoadingC: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  // changeTab function
  const changeTab = (tabData) => {
    let clonedArray = cloneDeep(tabBarData);

    updateState({
      tabBarData: clonedArray.map((item) => {
        if (item.title == tabData.title) {
          item.isActive = true;
          return item;
        } else {
          item.isActive = false;
          return item;
        }
      }),
      selectedTab: tabData.title,
      tabType:
        tabData.title == strings.ACTIVE_ORDERS
          ? staticStrings.ACTIVE
          : tabData.title == strings.PAST_ORDERS
          ? staticStrings.PAST
          : staticStrings.SCHEDULE,
      pageActive: 1,
      orders: selectedTab != tabData.title ? [] : orders,
    });
    _scrollRef.current.scrollToOffset({animated: true, offset: 0});
  };

  const onPressViewEditAndReplace = (item) => {
    item?.product_details[0]?.category_type == staticStrings.PICKUPANDDELIEVRY
      ? navigation.navigate(navigationStrings.PICKUPORDERDETAIL, {
          orderId: item?.order_id,
          fromVendorApp: true,
          selectedVendor: {id: item?.vendor_id},
          orderDetail: item,
        })
      : // if (selectedTab == strings.ACTIVE_ORDERS) {
        navigation.navigate(navigationStrings.ORDER_DETAIL, {
          orderId: item?.order_id,
          fromVendorApp: true,
          selectedVendor: {id: item?.vendor_id},
          showRating:
            item?.order_status?.current_status?.id != 6 ? false : true,
        });

    // }
  };
  const rateYourOrder = () => {
    navigation.navigate(navigationStrings.RATEORDER);
  };

  const renderOrders = ({item, index}) => {
    // console.log(item,"item>>item")
    return (
      <OrderCardVendorComponent
        data={item}
        selectedTab={selectedTab}
        onPress={() => onPressViewEditAndReplace(item)}
        onPressRateOrder={
          selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
        }
        navigation={navigation}
      />

      // <OrderCardComponent
      //   data={item}
      //   selectedTab={selectedTab}
      //   onPressRateOrder={
      //     selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
      //   }
      //   onPress={() => onPressViewEditAndReplace(item)}
      // />
    );
  };

  //Get list of all orders based on selected tab
  useEffect(() => {
    _getListOfOrders();
  }, [pageActive, pagePastOrder, pageScheduleOrder, isRefreshing]);

  //Refresh screen

  //Pull to refresh
  const handleRefresh = () => {
    if (selectedTab == strings.ACTIVE_ORDERS) {
      updateState({
        pageActive: 1,
        tabType: staticStrings.ACTIVE,
        isRefreshing: true,
      });
    }
    if (selectedTab == strings.PAST_ORDERS) {
      updateState({
        pageActive: 1,
        tabType: staticStrings.PAST,
        isRefreshing: true,
      });
    }
    if (selectedTab == strings.SCHEDULED_ORDERS) {
      updateState({
        pageActive: 1,
        tabType: staticStrings.SCHEDULE,
        isRefreshing: true,
      });
    }
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    if (selectedTab == strings.ACTIVE_ORDERS) {
      updateState({pageActive: pageActive + 1, tabType: staticStrings.ACTIVE});
    }
    if (selectedTab == strings.PAST_ORDERS) {
      updateState({pageActive: pagePastOrder + 1, tabType: staticStrings.PAST});
    }
    if (selectedTab == strings.SCHEDULED_ORDERS) {
      updateState({
        pageActive: pageScheduleOrder + 1,
        tabType: staticStrings.SCHEDULE,
      });
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  //Give Rating

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appData?.profile?.code === shortCodes.capcorp
            ? imagePath.backArrow
            : imagePath.back
        }
        centerTitle={strings.MY_ORDERS}
        headerStyle={{backgroundColor: colors.white}}
      />

      <View style={{...commonStyles.headerTopLine}} />

      <CustomTopTabBar
        scrollEnabled={true}
        tabBarItems={tabBarData}
        customContainerStyle={{backgroundColor: colors.white}}
        onPress={(tabData) => changeTab(tabData)}
        customTextContainerStyle={{width: width / 3}}
      />

      <FlatList
        ref={_scrollRef}
        data={orders}
        // data={activeOrders || pastOrders || scheduledOrders}
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
