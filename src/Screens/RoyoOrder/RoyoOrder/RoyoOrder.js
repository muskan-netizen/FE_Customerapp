import React, {useState, useCallback, useEffect} from 'react';
import {cloneDeep, debounce} from 'lodash';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import MultiScreen from '../../../Components/MultiScreen';
import OrderCard from '../../../Components/OrderCard';
import imagePath from '../../../constants/imagePath';
import {FlatList} from 'react-native';
import {
  customMarginBottom,
  customMarginLeftForBox,
  noOfColumn,
} from '../../../utils/constants/constants';
import navigationStrings from '../../../navigation/navigationStrings';
import Header from '../../../Components/Header';
import {useSelector} from 'react-redux';
import actions from '../../../redux/actions';
import strings from '../../../constants/lang';
import {RefreshControl} from 'react-native';
import staticStrings from '../../../constants/staticStrings';

const RoyoOrder = (props) => {
  const {navigation} = props;

  const selectedOrder = (index) => {
    updateState({activeIndex: index});
  };

  // new copy data

  const {storeSelectedVendor} = useSelector((state) => state?.order);

  const [state, setState] = useState({
    
    newOrder: [],
    completed: [],
    cancelled: [],
    confirmed: [],
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
    activeIndex: 0,
  });
  const {
    newOrder,
    completed,
    cancelled,
    confirmed,
    isLoadingB,
    isLoading,
    activeOrders,
    pageActive,
    limit,
    isRefreshing,
    vendor_list,
    selectedVendor,
    activeIndex,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const currentTheme = useSelector((state) => state.initBoot);
  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );

  const {themeColors, themeLayouts} = currentTheme;
  // const fontFamily = appStyle?.fontSizeData;
  // const commonStyles = commonStylesFun({fontFamily});
  useEffect(() => {
    // updateState({isLoading: true});
    if (isLoading) {
      _getListOfVendorOrders();
    }
  }, [isLoading]);

  useEffect(() => {
    updateState({
      newOrder: [],
      confirmed: [],
      cancelled: [],
      completed: [],
      selectedVendor: storeSelectedVendor,
      isLoading: true,
      pageActive: 1,
    });
  }, [storeSelectedVendor]);

  const _getListOfVendorOrders = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${limit}&page=${pageActive}&selected_vendor_id=${vendordId}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log('vendor orders res', res);
        const data = res.data.order_list.data;
        const newnewOrder = data.filter(
          (value, index) => value?.order_status?.current_status?.id == 1,
        );
        const newconfirmed = data.filter(
          (value, index) =>
            value?.order_status?.current_status?.id == 2 ||
            value?.order_status?.current_status?.id == 4 ||
            value?.order_status?.current_status?.id == 5,
        );
        const newcancelled = data.filter(
          (value, index) => value?.order_status?.current_status?.id == 3,
        );
        const newcompleted = data.filter(
          (value, index) => value?.order_status?.current_status?.id == 6,
        );
        updateState({
          newOrder: [...newOrder, ...newnewOrder],
          confirmed: [...confirmed,...newconfirmed],
          cancelled: [...cancelled, ...newcancelled],
          completed: [...completed, ...newcompleted],
          activeOrders:
            pageActive == 1
              ? res.data.order_list.data
              : [...activeOrders, ...res.data.order_list.data],
          vendor_list: res.data.vendor_list,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  //error handling
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isLoadingC: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const onPressViewEditAndReplace = (item) => {
    // navigation.navigate(navigationStrings.ORDER_DETAIL, {
    //   orderId: item?.id,
    //   fromVendorApp: true,
    //   showRating: false,
    //   selectedVendor: selectedVendor,
    // });
  };

  // const renderOrders = ({item, index}) => {
  //   return (
  //     <OrderCardVendorComponent
  //       data={item}
  //       // selectedTab={selectedTab}
  //       onPress={() => onPressViewEditAndReplace(item)}
  //       updateOrderStatus={(data, status) => updateOrderStatus(data, status)}
  //     />
  //   );
  // };

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
  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        // centerTitle="Orders | Foodies hub  "
        centerTitle={'Orders | ' + selectedVendor?.name || ''}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />
      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{marginTop: moderateScaleVertical(0)}}
          screenName={['new', 'confirmed', 'cancelled', 'completed']}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />
        {activeIndex == 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={newOrder}
            numColumns={noOfColumn}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginLeft: customMarginLeftForBox(index),
                  flex: 1,
                }}>
                <OrderCard
                  updateOrderStatus={updateOrderStatus}
                  onPress={() =>
                    navigation.navigate(navigationStrings.ORDER_DETAIL, {
                      data: item,
                      updateOrderStatus: updateOrderStatus,
                    })
                  }
                  item={item}
                />
              </View>
            )}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            // bounces={false}
            data={confirmed}
            numColumns={noOfColumn}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginLeft: customMarginLeftForBox(index),
                  flex: 1,
                }}>
                <OrderCard
                  onPress={() =>
                    navigation.navigate(navigationStrings.ORDER_DETAIL, {
                      data: item,
                      updateOrderStatus: updateOrderStatus,
                    })
                  }
                  updateOrderStatus={updateOrderStatus}
                  item={item}
                />
              </View>
            )}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 2 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            // bounces={false}
            data={cancelled}
            numColumns={noOfColumn}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginLeft: customMarginLeftForBox(index),
                  flex: 1,
                }}>
                <OrderCard
                  updateOrderStatus={updateOrderStatus}
                  onPress={() =>
                    navigation.navigate(navigationStrings.ORDER_DETAIL, {
                      data: item,
                      updateOrderStatus: updateOrderStatus,
                    })
                  }
                  item={item}
                />
              </View>
            )}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 3 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            // bounces={false}
            data={completed}
            numColumns={noOfColumn}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginLeft: customMarginLeftForBox(index),
                  flex: 1,
                }}>
                <OrderCard
                  updateOrderStatus={updateOrderStatus}
                  onPress={() =>
                    navigation.navigate(navigationStrings.ORDER_DETAIL, {
                      data: item,
                      updateOrderStatus: updateOrderStatus,
                    })
                  }
                  item={item}
                />
              </View>
            )}
            keyExtractor={(item, key) => key}
          />
        ) : null}
      </View>
    </WrapperContainer>
  );
};

export default RoyoOrder;

const styles = StyleSheet.create({
  container: {
    // marginTop: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
    marginBottom: customMarginBottom(),
    flex: 1,
  },
  emptyCartBody: {
    flex: 1,
    justifyContent: 'center',
    height: 400,
    alignItems: 'center',
  },
  textStyle: {
    color: colors.black,
    fontSize: 24,
    fontFamily: fontFamily.bold,
  },
  imageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(34),
    marginLeft: moderateScaleVertical(20),
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  font15Bold: {
    fontFamily: fontFamily.bold,
    fontSize: textScale(15),
    textAlign: 'center',
  },
});
