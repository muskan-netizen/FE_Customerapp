import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  processColor,
  RefreshControl,
} from 'react-native';
import {useState} from 'react';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import fontFamily from '../../../styles/fontFamily';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {BarChart} from 'react-native-chart-kit';
import {FlatList} from 'react-native';
import OrderCard from '../../../Components/OrderCard';
import commonStyles from '../../../styles/commonStyles';
import {
  boxWidth,
  customMarginBottom,
  customMarginLeftForBox,
} from '../../../utils/constants/constants';
import Header from '../../../Components/Header';
import {useSelector} from 'react-redux';
import actions from '../../../redux/actions';
import moment from 'moment';
import {showError} from '../../../utils/helperFunctions';
import debounce from 'lodash.debounce';
import {cloneDeep} from 'lodash';
import {TouchableOpacity} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const commonStyle = commonStyles({
  fontFamily,
  buttonTextColor: colors.themeColor2,
});

const RoyoHome = (props) => {
  const {navigation} = props;

  const {storeSelectedVendor} = useSelector((state) => state?.order);
  const {appData, currencies, languages} = useSelector(
    (state) => state.initBoot,
  );
  const [state, setState] = useState({
    status: true,
    activeOrders: [],
    pastOrders: [],
    scheduledOrders: [],
    pageActive: 1,
    pagePastOrder: 1,
    pageScheduleOrder: 1,
    limit: 10,
    isLoading: true,
    isRefreshing: false,
    vendor_list: [],
    selectedVendor: null,
    startDate: null,
    endDate: null,
    displayedDate: moment(),
    totalPendingOrder: 0,
    totalActiveOrder: 0,
    totalCancelledOrder: 0,
    totalCompletedOrder: 0,
    selectedDate: null,
    labels: [],
    datasets: [],
    newOrder: [],
    totalRevenue,
    showRevenueDate: false,
    showOrderDate: false,
    revenueDate: new Date(),
    orderDate: new Date(),
  });

  const {
    totalRevenue,
    datasets,
    labels,
    status,
    isLoading,
    activeOrders,
    pageActive,
    limit,
    isRefreshing,
    vendor_list,
    selectedVendor,
    startDate,
    endDate,
    displayedDate,
    selectedDate,
    newOrder,
    totalPendingOrder,
    totalActiveOrder,
    totalCancelledOrder,
    totalCompletedOrder,
    showOrderDate,
    showRevenueDate,
    orderDate,
    revenueDate,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const _getListOfVendorOrders = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${200}&page=${1}&selected_vendor_id=${vendordId}`,
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
        updateState({
          activeOrders: res.data.order_list.data,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  useEffect(() => {
    const newnewOrder = activeOrders.filter(
      (value, index) => value?.order_status?.current_status?.id == 1,
    );
    const newconfirmed = activeOrders.filter(
      (value, index) =>
        value?.order_status?.current_status?.id == 2 ||
        value?.order_status?.current_status?.id == 4 ||
        value?.order_status?.current_status?.id == 5,
    );
    const newcancelled = activeOrders?.filter(
      (value, index) => value?.order_status?.current_status?.id == 3,
    );
    const newcompleted = activeOrders?.filter(
      (value, index) => value?.order_status?.current_status?.id == 6,
    );
    updateState({
      newOrder: newnewOrder,
      totalPendingOrder: newconfirmed.length,
      totalActiveOrder: newnewOrder.length,
      totalCancelledOrder: newcancelled.length,
      totalCompletedOrder: newcompleted.length,
    });
  }, [activeOrders]);

  useEffect(() => {
    _getListOfVendorOrders();
    if (selectedVendor != null) {
      _getRevnueData();
    }
  }, [selectedVendor, pageActive]);

  const toggleRevenueDate = () => {
    updateState({
      showRevenueDate: true,
    });
  };
  const toggleOrderDate = () => {
    updateState({
      showOrderDate: true,
    });
  };
  const onChangeOrderDate = (value, newDate) => {
    if (newDate)
      updateState({
        orderDate: newDate,
        showOrderDate: false,
      });
    else
      updateState({
        showOrderDate: false,
      });
  };
  const onChageRevenueDate = (value, newDate) => {
    if (newDate)
      updateState({
        revenueDate: newDate,
        showRevenueDate: false,
      });
    else
      updateState({
        showRevenueDate: false,
      });
  };
  const _getRevnueData = () => {
    let data = {};
    data['type'] = 'monthly';
    data['month'] = 'july';
    data['year'] = '2021'
    data['vendor_id'] = selectedVendor ? selectedVendor?.id : '';
    actions
      .getRevenueData(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res__getRevnueData>>>');
        if (res?.data?.dates.length) {
          let totalRevenue = res.data.revenue.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            parseFloat(0),
          );
          updateState({
            isRefreshing: false,
            isLoading: false,
            labels: res.data.dates,
            datasets: res.data.revenue,
            totalRevenue,
          });
        } else {
          updateState({
            isLoading: false,
            isRefreshing: false,
          });
        }
      })
      .catch(errorMethod);
  };

  //error handling
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
    });
    showError(error?.message || error?.error);
  };

  useEffect(() => {
    updateState({
      selectedVendor: storeSelectedVendor,
      isLoading: true,
      pageActive: 1,
    });
  }, [storeSelectedVendor]);

  const barData = {
    labels: labels,
    datasets: [
      {
        data: datasets,
        colors: [
          (opacity = 1) => `rgba(4, 14, 22, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(174, 44, 242, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(7, 14, 242, ${opacity})`,
          (opacity = 1) => `rgba(174, 144, 22, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(174, 44, 242, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(7, 14, 242, ${opacity})`,
        ],
      },
    ],
  };
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageActive: pageActive + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });
  const dashboardData = [
    {
      image: imagePath.timerRoyo,
      header: 'Pending order',
      text: `${totalPendingOrder} pending order`,
    },
    {
      image: imagePath.activeRoyo,
      header: 'Active order',
      text: `${totalActiveOrder} active orders`,
    },
    {
      image: imagePath.deliveredRoyo,
      header: 'Delivered order',
      text: `${totalCompletedOrder} orders delivered`,
    },
    {
      image: imagePath.cancelledRoyo,
      header: 'Cancelled order',
      text: `${totalCancelledOrder} orders cancelled`,
    },
  ];
  const chartConfig = {
    barRadius: moderateScale(2.5),
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    fillShadowGradientOpacity: 0,
    fillShadowGradient: colors.black,
    yAxisInterval: 2,
    barPercentage: 0.75,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
    labelColor: (opacity = 0.61) => `rgba(40, 62, 58, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '1',
      stroke: colors.themeColor2,
    },
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
  const toggleStatus = () => updateState({status: !status});

  const handleRefresh = () => {
    updateState({pageActive: 1, isRefreshing: true});
  };
  const dashboard = (item, index) => {
    const {image, header, text} = item;
    return (
      <View key={String(index)} style={styles.dashboardBox}>
        <View
          style={{
            shadowColor: 'rgba(242,96,97,0.23)',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            flexShrink: 1,
            shadowRadius: 3.84,

            elevation: 19,
          }}>
          <Image source={image} />
        </View>
        <Text
          style={{
            ...commonStyle.boldFont14,
            marginTop: moderateScaleVertical(18),
          }}>
          {header}
        </Text>
        <Text
          style={{
            ...styles.font14Regular,
            marginVertical: moderateScaleVertical(4),
          }}>
          {text}
        </Text>
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        onPressLeft={() => {
          navigation.navigate(navigationStrings.TAB_ROUTES);
        }}
        // leftIcon={imagePath.logoRoyo}
        leftIcon={imagePath.back}
        rightIcon={status ? imagePath.onlineRoyo : imagePath.offlineRoyo}
        onPressRight={toggleStatus}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.themeColor2}
          />
        }
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.dashboard}>{dashboardData.map(dashboard)}</View>
          <View style={styles.warningBox}>
            <Image
              source={imagePath.warningRoyo}
              style={{marginTop: moderateScaleVertical(5)}}
            />
            <View style={{flex: 1, marginLeft: moderateScale(16)}}>
              <Text
                style={{
                  ...commonStyle.boldFont16,
                  color: colors.black,
                }}>
                Complete your profile
              </Text>
              <Text
                style={{
                  ...commonStyle.regularFont13,
                  color: colors.black,
                  letterSpacing: 1,
                }}>
                you have missing profile imformation.{' '}
                <Text style={styles.span}>Tap here</Text> to complete.
              </Text>
            </View>
          </View>

          {/* chart */}
          <View style={styles.rowWrapSpace}>
            <View>
              <View style={styles.chartHeader}>
                <Text style={styles.font18Semibold}>Revenue</Text>
                <TouchableOpacity
                  onPress={toggleRevenueDate}
                  style={{flexDirection: 'row'}}>
                  <Text style={{...styles.font14Regular, color: '#2E3E3A5f'}}>
                    {String(revenueDate).slice(4, 7)}{' '}
                    {String(revenueDate).slice(11, 15)}
                  </Text>

                  <Image source={imagePath.dropdownTriangle} />
                </TouchableOpacity>
                {showRevenueDate && (
                  <MonthPicker
                    onChange={onChageRevenueDate}
                    value={revenueDate}
                    minimumDate={new Date(1999, 5)}
                    maximumDate={new Date(2025, 5)}
                    // locale="ko"
                  />
                )}
              </View>
              <View style={{...styles.graphContainer, zIndex: -1}}>
                <View style={styles.graphHeader}>
                  <Text style={{...styles.font13Regular, color: '#2E3E3A5f'}}>
                    Total revenue (Delivered order)
                  </Text>
                  <Text style={styles.font16Bold}>${totalRevenue}</Text>
                </View>
                <BarChart
                  withCustomBarColorFromData={true}
                  style={{margin: 0, padding: 0, flex: 1, marginLeft: 0}}
                  // yLabelsOffset={30}
                  data={barData}
                  width={boxWidth()}
                  height={moderateScaleVertical(220)}
                  yAxisLabel="$"
                  yAxisInterval={2}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  horizontalLabelRotation={0}
                  withInnerLines={false}
                  showBarTops={false}
                  fromZero={true}
                  flatColor={true}
                />
              </View>
            </View>
            <View>
              <View style={styles.chartHeader}>
                <Text style={styles.font18Semibold}>Revenue</Text>
                <TouchableOpacity
                  onPress={toggleOrderDate}
                  style={{flexDirection: 'row'}}>
                  <Text style={{...styles.font14Regular, color: '#2E3E3A5f'}}>
                    {String(orderDate).slice(4, 7)}{' '}
                    {String(orderDate).slice(11, 15)}
                  </Text>
                  <Image source={imagePath.dropdownTriangle} />
                </TouchableOpacity>
                {showOrderDate && (
                  <MonthPicker
                    onChange={onChangeOrderDate}
                    value={orderDate}
                    minimumDate={new Date(1999, 5)}
                    maximumDate={new Date(2025, 5)}
                    // locale="ko"
                  />
                )}
              </View>
              <View style={styles.graphContainer}>
                <View style={styles.graphHeader}>
                  <Text style={styles.font13Regular}>Total orders placed</Text>
                  <Text style={styles.font16Bold}>34565</Text>
                </View>
                <BarChart
                  withCustomBarColorFromData={true}
                  data={barData}
                  width={boxWidth()}
                  height={moderateScaleVertical(220)}
                  yAxisLabel="$"
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  horizontalLabelRotation={0}
                  withInnerLines={false}
                  showBarTops={false}
                  fromZero={true}
                  flatColor={true}
                />
              </View>
            </View>
          </View>

          {/* new Order */}
          <View>
            <Text
              style={{
                ...styles.font18Semibold,
                marginVertical: moderateScaleVertical(16),
              }}>
              New Order
            </Text>
            <FlatList
              onEndReached={onEndReachedDelayed}
              onEndReachedThreshold={0.5}
              data={newOrder}
              showsVerticalScrollIndicator={false}
              bounces={false}
              numColumns={width > 600 ? 2 : 1}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyCartBody}>
                    <Image source={imagePath.emptyCartRoyo} />
                  </View>
                );
              }}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      marginLeft: customMarginLeftForBox(index),
                      flex: 1,
                    }}>
                    <OrderCard
                      onPress={() =>
                        navigation.navigate(navigationStrings.ORDER_DETAIL, {
                          data: item,
                          selectedVendor,
                        })
                      }
                      updateOrderStatus={updateOrderStatus}
                      item={item}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, key) => key}
            />
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default RoyoHome;

const styles = StyleSheet.create({
  font14Regular: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#2E3E3A6d',
  },
  font18Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: '#2E3E3A',
  },
  font16Bold: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.themeColor2,
    marginVertical: moderateScaleVertical(4),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#2E3E3A5f',
  },
  container: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScaleVertical(24),
    marginBottom: customMarginBottom(18, 86),
    backgroundColor: 'transparent',
    backfaceVisibility: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(18),
  },
  royoShop: {
    ...commonStyle.regularFont16,
    color: colors.black,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.themeColor2,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScaleVertical(8),
    borderRadius: moderateScale(28),
  },

  indicator: {
    width: moderateScale(17),
    height: moderateScale(17),
    borderRadius: moderateScale(70),
    backgroundColor: colors.white,
    marginLeft: moderateScale(8),
  },
  warningBox: {
    marginBottom: moderateScaleVertical(16),
    flexDirection: 'row',
    paddingVertical: moderateScaleVertical(16),
    backgroundColor: '#D8D8D81f',
  },
  btnContainer: {
    backgroundColor: colors.white,
    width: '100%',
    borderColor: colors.themeColor2,
  },
  btnText: {
    ...commonStyle.mediumFont16,
    color: colors.themeColor2,
  },
  emptyText: {
    ...commonStyle.mediumFont16,
    color: colors.black,
    marginVertical: moderateScaleVertical(40),
    textAlign: 'center',
  },
  span: {
    color: '#0091ff',
  },
  dashboard: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScaleVertical(16),
  },
  dashboardBox: {
    width: width > 600 ? width / 4.5 : width / 2.25,
    backgroundColor: '#F3F9F7',
    padding: moderateScale(16),
    borderRadius: moderateScaleVertical(6),
    marginBottom: moderateScaleVertical(16),
  },
  graphContainer: {
    padding: moderateScale(15),
    borderWidth: 1,
    borderRadius: moderateScale(6),
    borderColor: 'rgba(151,151,151,0.15)',
    marginBottom: moderateScaleVertical(16),
  },
  graphHeader: {
    backgroundColor: '#F3F9F7',
    padding: moderateScaleVertical(16),
    borderRadius: moderateScaleVertical(5),
    marginBottom: moderateScaleVertical(16),
  },

  rowWrapSpace: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScaleVertical(16),
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  emptyCartBody: {
    flex: 1,
    justifyContent: 'center',
    height: 400,
    alignItems: 'center',
  },
});
