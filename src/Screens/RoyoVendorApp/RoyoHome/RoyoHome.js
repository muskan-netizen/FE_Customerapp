import {cloneDeep, isEmpty} from 'lodash';
import debounce from 'lodash.debounce';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import Modal from 'react-native-modal';
import MonthPicker from 'react-native-month-year-picker';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import OrderCard from '../../../Components/OrderCard';
import SelectVendorListModal from '../../../Components/SelectVendorListModal';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStyles from '../../../styles/commonStyles';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import {
  boxWidth,
  customMarginBottom,
  customMarginLeftForBox,
} from '../../../utils/constants/constants';
import {enums} from '../../../utils/enums';
import {showError} from '../../../utils/helperFunctions';

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
    vendorList: [],
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
    isVendorSelectModal: false,
    selectedVendorData: {},
    sales: [],
    isProfileCompleted: 0,
  });

  const {
    totalRevenue,
    datasets,
    labels,
    status,
    activeOrders,
    pageActive,
    isRefreshing,
    selectedVendor,
    newOrder,
    totalPendingOrder,
    totalActiveOrder,
    totalCancelledOrder,
    totalCompletedOrder,
    showOrderDate,
    showRevenueDate,
    orderDate,
    revenueDate,
    isVendorSelectModal,
    vendorList,
    isLoading,
    selectedVendorData,
    sales,
    isProfileCompleted,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    _getListOfVendorOrders();
  }, [storeSelectedVendor]);

  console.log(isLoading, 'isLoading>>>');

  const _getListOfVendorOrders = () => {
    updateState({
      isLoading: true,
    });
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
        },
      )
      .then((res) => {
        console.log('vendor orders res', res);

        let selectedVendorData = res.data.vendor_list.find(
          (x) => x.is_selected,
        );
        if (!storeSelectedVendor?.id)
          actions.savedSelectedVendor(selectedVendorData);
        updateState({
          activeOrders: res.data.order_list.data,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          vendorList: res.data.vendor_list,
          isLoading: false,
          isRefreshing: false,
          selectedVendorData: selectedVendorData,
        });
        // _getRevnueData(selectedVendorData, new Date());
        _getAllOrdersData(selectedVendorData);
        _getRevenueDashboardData(selectedVendorData, new Date(), 0);
        _getVendorProfile(selectedVendorData);
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
      totalPendingOrder: newnewOrder.length,
      totalActiveOrder: newconfirmed.length,
      totalCancelledOrder: newcancelled.length,
      totalCompletedOrder: newcompleted.length,
    });
  }, [activeOrders]);

  // useEffect(() => {
  //   if (selectedVendor != null) {
  //     console.log();
  //     _getRevnueData();
  //   }
  // }, [selectedVendor, pageActive]);

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
    if (newDate) {
      updateState({
        orderDate: newDate,
        showOrderDate: false,
      });
      _getRevenueDashboardData(selectedVendorData, newDate, 2);
    } else
      updateState({
        showOrderDate: false,
      });
  };
  const onChageRevenueDate = (value, newDate) => {
    console.log('new datae', moment(newDate).startOf('month').format('MMMM'));

    if (newDate) {
      updateState({
        revenueDate: newDate,
        showRevenueDate: false,
      });
      // _getRevnueData(selectedVendorData, newDate);
      _getRevenueDashboardData(selectedVendorData, newDate, 1);
    } else
      updateState({
        showRevenueDate: false,
      });
  };

  const _getAllOrdersData = (selectedVendorData) => {
    let data = {};
    data['vendor_id'] = selectedVendorData ? selectedVendorData?.id : '';
    actions
      .getRevenueDashboardData(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log('_getAllOrdersData >>> _getAllOrdersData >>>', data);
        console.log('_getAllOrdersData >>> _getAllOrdersData >>>', res?.data);
        if (res?.data) {
          updateState({
            isRefreshing: false,
            isLoading: false,
            // totalPendingOrder: res.data.total_pending_order,
            // totalCancelledOrder: res.data.total_rejected_order,
            // totalActiveOrder: res.data.total_active_order,
            // totalCompletedOrder: res.data.total_delivered_order,
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

  const _getRevnueData = (selectedVendorData, date) => {
    let data = {};
    data['type'] = 'monthly';
    data['month'] = moment(date).startOf('month').format('MMMM');
    data['year'] = moment().startOf('year').format('YYYY');
    data['vendor_id'] = selectedVendorData ? selectedVendorData?.id : '';
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
          const dates = res.data.dates.map((el) => el);
          updateState({
            isRefreshing: false,
            isLoading: false,
            labels: dates,
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

  const _getVendorProfile = (selectedVendorData) => {
    let data = {};
    data['vendor_id'] = selectedVendorData ? selectedVendorData?.id : '';
    actions
      .getVendorProfile(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res__getRevnueData>>>profile');

        updateState({
          isRefreshing: false,
          isLoading: false,
          isProfileCompleted: res?.data?.profile_status,
        });
      })
      .catch(errorMethod);
  };

  const _getRevenueDashboardData = (selectedVendorData, date, ...params) => {
    let data = {};
    data['type'] = 'monthly';
    data['vendor_id'] = selectedVendorData ? selectedVendorData?.id : '';
    data['start_date'] = `${moment(date)
      .startOf('year')
      .format('YYYY')}-${moment(date).startOf('month').format('MM')}-01`;
    data['end_date'] = `${moment(date).startOf('year').format('YYYY')}-${moment(
      date,
    )
      .startOf('month')
      .format('MM')}-${moment(date).endOf('month').format('DD')}`;

    actions
      .getRevenueDashboardData(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res__getRevnueData>>>dashboard', params);

        const dates = res.data.dates.map(
          (el) =>
            `${moment(el).startOf('month').format('MMM')}-${el.slice(8, 11)}`,
        );
        console.log('checking selected vendor data', dates);
        if (res?.data?.dates.length) {
          let totalRevenue = res.data.revenue.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            parseFloat(0),
          );
          updateState({
            isRefreshing: false,
            isLoading: false,
            labels: dates,
            datasets: params[0] == 2 ? datasets : res.data.revenue,
            totalRevenue,
            sales:
              params[0] == 1
                ? sales
                : res.data.sales.map((el) => el.toString()),
            // totalPendingOrder: res.data.total_pending_order,
            // totalCancelledOrder: res.data.total_rejected_order,
            // totalActiveOrder: res.data.total_active_order,
            // totalCompletedOrder: res.data.total_delivered_order,
          });
        } else {
          updateState({
            isLoading: false,
            isRefreshing: false,
            labels: dates,
            datasets: params[0] == 2 ? datasets : res.data.revenue,
            sales:
              params[0] == 1
                ? sales
                : res.data.sales.map((el) => el.toString()),
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

  // useEffect(() => {
  //   updateState({
  //     selectedVendor: storeSelectedVendor,
  //     isLoading: true,
  //     pageActive: 1,
  //   });
  // }, [storeSelectedVendor]);

  const barData = {
    labels: labels,
    datasets: [
      {
        // data: [
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        // ],
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
  console.log('salessales', sales);
  const salesBarData = {
    labels: labels,
    datasets: [
      {
        // data: [
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        //   Math.random() * 100,
        // ],
        data: sales,
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
      header: strings.PENDING_ORDERS,
      text: `${totalPendingOrder} ${strings.PENDING_ORDERS}`,
    },
    {
      image: imagePath.activeRoyo,
      header: strings.ACTIVE_ORDERS,
      text: `${totalActiveOrder} ${strings.ACTIVE_ORDERS}`,
    },

    {
      image: imagePath.cancelledRoyo,
      header: strings.CANCELLED_ORDER,
      text: `${totalCancelledOrder} ${strings.CANCELLED_ORDER}`,
    },
    {
      image: imagePath.deliveredRoyo,
      header: strings.DELIVERED_ORDERS,
      text: `${totalCompletedOrder} ${strings.DELIVERED_ORDERS}`,
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
    updateState({isLoading: true});
    actions
      .updateOrderStatus(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({
          isLoading: false,
        });
        if (res && res.status == 'success') {
          updateStatus(res, acceptRejectData);
        }
      })
      .catch(errorMethod);
  };

  const updateStatus = (res, acceptRejectData) => {
    let clonedArrayOrderList = cloneDeep(activeOrders);

    updateState({
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
  const toggleStatus = () => {
    updateState({status: !status});
  };

  const handleRefresh = () => {
    updateState({pageActive: 1, isRefreshing: false});
  };
  const dashboard = (item, index) => {
    const {image, header, text} = item;
    return (
      <TouchableOpacity
        onPress={() =>
          // navigation.navigate(navigationStrings.VENDOR_ORDER, {index: index})
          navigation.navigate(navigationStrings.ROYO_VENDOR_ORDER, {
            screen: navigationStrings.VENDOR_ORDER,
            params: {index: index},
          })
        }
        key={String(index)}
        style={styles.dashboardBox}>
        <View style={styles.dashboardImage}>
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
      </TouchableOpacity>
    );
  };
  const _reDirectToVendorList = () => {
    updateState({
      isVendorSelectModal: true,
    });
  };

  const onVendorSelect = (item) => {
    updateState({
      selectedVendor: item,
      isVendorSelectModal: false,
      pageNo: 1,
    });
    setTimeout(() => {
      actions.savedSelectedVendor(item);
    }, 500);
  };

  const BarWidth = () => moderateScale(labels.length * 65);

  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        centerTitle={`${
          !isEmpty(selectedVendor)
            ? `${selectedVendor?.name}`
            : strings.SELECT_VENDOR
        } `}
        onPressLeft={() => {
          navigation.navigate(navigationStrings.TAB_ROUTES);
        }}
        noLeftIcon={enums.isVendorStandloneApp}
        leftIcon={imagePath.backRoyo}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
        // rightIcon={status ? imagePath.onlineRoyo : imagePath.offlineRoyo}
        // onPressRight={toggleStatus}
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
          {/* {isProfileCompleted ? (
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
          ) : null} */}

          <View style={styles.rowWrapSpace}>
            <View>
              <View style={styles.chartHeader}>
                <Text style={styles.font18Semibold}>{strings.REVENUE}</Text>
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
                    {strings.TOTAL_REVENUE}
                  </Text>
                  <Text style={styles.font16Bold}>
                    {currencies?.primary_currency?.symbol}
                    {!!totalRevenue
                      ? Number(totalRevenue).toFixed(
                          appData?.profile?.preferences?.digit_after_decimal,
                        )
                      : 0}
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    withCustomBarColorFromData={true}
                    style={{margin: 0, padding: 0, flex: 1, marginLeft: 0}}
                    // yLabelsOffset={30}
                    data={barData}
                    width={labels.length > 6 ? BarWidth() : boxWidth()}
                    height={moderateScaleVertical(250)}
                    yAxisLabel={currencies?.primary_currency?.symbol}
                    yAxisInterval={2}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    horizontalLabelRotation={0}
                    withInnerLines={false}
                    showBarTops={false}
                    fromZero={true}
                    flatColor={true}
                  />
                </ScrollView>
              </View>
            </View>
            <View>
              <View style={styles.chartHeader}>
                <Text style={styles.font18Semibold}>{strings.REVENUE}</Text>
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
                  <Text style={styles.font13Regular}>
                    {strings.TOTAL_ORDER_PLACED}
                  </Text>
                  <Text style={styles.font16Bold}>34565</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    withCustomBarColorFromData={true}
                    data={salesBarData}
                    width={labels.length > 6 ? BarWidth() : boxWidth()}
                    height={moderateScaleVertical(220)}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    horizontalLabelRotation={0}
                    withInnerLines={false}
                    showBarTops={false}
                    fromZero={true}
                    flatColor={true}
                  />
                </ScrollView>
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
              {strings.NEW_ORDER}
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
              keyExtractor={(item, key) => key.toString()}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={isVendorSelectModal}
        style={{
          margin: 0,
        }}>
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <SelectVendorListModal
            vendorList={vendorList}
            onCloseModal={() => updateState({isVendorSelectModal: false})}
            onVendorSelect={onVendorSelect}
            selectedVendor={selectedVendor}
          />
        </View>
      </Modal>
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
  dashboardImage: {
    shadowColor: 'rgba(242,96,97,0.23)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    flexShrink: 1,
    shadowRadius: 3.84,

    elevation: 19,
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
    width: width - moderateScale(30),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(15),
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
