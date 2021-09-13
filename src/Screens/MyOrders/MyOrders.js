import {cloneDeep, debounce} from 'lodash';
import React, {createRef, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import CustomTopTabBar from '../../Components/CustomTopTabBar';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import OrderCardVendorComponent2 from '../../Components/OrderCardVendorComponent2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import Modal from 'react-native-modal';
import stylesFun from './styles';
import DatePicker from 'react-native-date-picker';
import FastImage from 'react-native-fast-image';
import GradientButton from '../../Components/GradientButton';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import * as RNLocalize from 'react-native-localize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';

export default function MyOrders({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    tabBarData: [
      {title: strings.ACTIVE_ORDERS, isActive: true},
      {title: strings.PAST_ORDERS, isActive: false},
      // {title: strings.SCHEDULED_ORDERS, isActive: false},
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
    isVisibleReturnOrderModal: false,
    selectedOrderForReturn: null,
    selectProductForRetrun: null,
    viewHeight: 0,
    reasons: [],
  });
  const {
    viewHeight,
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
    isVisibleReturnOrderModal,
    selectedOrderForReturn,
    selectProductForRetrun,
    reasons,
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
  const styles = stylesFun({fontFamily, themeColors});

  //Get list of all orders
  useEffect(() => {
    updateState({isLoading: true});
    _getListOfOrders();
  }, [selectedTab]);

  //Get list of all orders api
  console.log(RNLocalize.getTimeZone(), 'RNLocalize.getTimeZone()');
  const _getListOfOrders = () => {
    actions
      .getOrderListing(
        `?limit=${limit}&page=${pageActive}&type=${tabType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
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
    console.log(error, 'error>error');
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
          orderStatus: item?.order_status,
          selectedVendor: {id: item?.vendor_id},
          showRating:
            item?.order_status?.current_status?.id != 6 ? false : true,
        });

    // }
  };
  const rateYourOrder = () => {
    navigation.navigate(navigationStrings.RATEORDER);
  };

  const returnYourOrder = (item) => {
    console.log(item, 'item>item>');
    updateState({isLoading: true});
    actions
      .getReturnOrderDetailData(
        `?id=${item?.order_id}&vendor_id=${item?.vendor_id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'getReturnOrderDetailData>>>res>>>');

        updateState({
          isVisibleReturnOrderModal: true,
          selectedOrderForReturn: res?.data,
          selectProductForRetrun: null,
          isLoading: false,
        });
      })
      .catch(errorMethod);
  };

  const renderOrders = ({item, index}) => {
    // console.log(item,"item>>item")
    return (
      <OrderCardVendorComponent2
        data={item}
        selectedTab={selectedTab}
        onPress={() => onPressViewEditAndReplace(item)}
        onPressRateOrder={
          selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
        }
        navigation={navigation}
        onPressReturnOrder={
          selectedTab == strings.PAST_ORDERS
            ? () => returnYourOrder(item)
            : null
        }
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

  const onClose = () => {
    updateState({isVisibleReturnOrderModal: false});
  };

  useEffect(() => {
    console.log(selectedOrderForReturn, 'selectedOrderForReturn');
  }, [selectedOrderForReturn]);

  const selectProduct = (item) => {
    console.log(item, '>item>item');
    if (selectProductForRetrun && selectProductForRetrun?.id == item?.id) {
      updateState({
        selectProductForRetrun: null,
      });
    } else {
      updateState({
        selectProductForRetrun: item,
      });
    }
  };
  const returnOrder = () => {
    if (selectProductForRetrun) {
      console.log(
        selectProductForRetrun,
        'selectProductForRetrun>>selectProductForRetrun',
      );
      updateState({isVisibleReturnOrderModal: false, isLoading: true});
      actions
        .getReturnProductrDetailData(
          `?return_ids=${selectProductForRetrun?.id}&order_id=${selectProductForRetrun?.order_id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'getReturnProductrDetailData>>>res>>>');
          updateState({isLoading: false});
          setTimeout(() => {
            navigation.navigate(navigationStrings.RETURNORDER, {
              selectProductForRetrun: selectProductForRetrun,
              selectedOrderForReturn: res?.data?.order
                ? res?.data?.order
                : selectedOrderForReturn,
              reasons:
                res?.data?.reasons && res?.data?.reasons.length
                  ? res?.data?.reasons.map((item, index) => {
                      (item['value'] = item?.title),
                        (item['label'] = item?.title);
                      return item;
                    })
                  : [],
            });
          }, 500);
        })
        .catch(errorMethod);
    } else {
      showError('Please select the product to return');
    }
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={strings.MY_ORDERS}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />

      <View style={{...commonStyles.headerTopLine}} />

      <CustomTopTabBar
        scrollEnabled={true}
        tabBarItems={tabBarData}
        customContainerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
        onPress={(tabData) => changeTab(tabData)}
        customTextContainerStyle={{width: width / 2}}
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

      <Modal
        transparent={true}
        isVisible={isVisibleReturnOrderModal}
        animationIn={'pulse'}
        animationOut={'pulse'}
        style={[styles.modalContainer]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={imagePath.crossB} />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                  styles.modalMainViewContainer,
                  {backgroundColor: MyDarkTheme.colors.lightDark},
                ]
              : styles.modalMainViewContainer
          }
          onLayout={(event) => {
            updateState({viewHeight: event.nativeEvent.layout.height});
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={
              isDarkMode
                ? [
                    styles.modalMainViewContainer,
                    {backgroundColor: MyDarkTheme.colors.lightDark},
                  ]
                : styles.modalMainViewContainer
            }>
            <View
              style={{
                // flex: 0.6,
                // alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.carType, {color: MyDarkTheme.colors.text}]
                    : styles.carType
                }>
                {strings.DOYOUWANTTORETURNYOURORDER}
              </Text>
            </View>
            <View
              style={{
                marginVertical: moderateScaleVertical(10),
                marginBottom: moderateScale(20),
              }}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.selectItemToReturn,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.selectItemToReturn
                }>
                {strings.SELECTITEMSFORRETURN}
              </Text>
            </View>

            {selectedOrderForReturn &&
            selectedOrderForReturn?.vendors &&
            selectedOrderForReturn?.vendors[0]?.products
              ? selectedOrderForReturn?.vendors[0]?.products.map(
                  (item, index) => {
                    return (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: moderateScaleVertical(20),
                          }}>
                          {item?.product_return ? (
                            <View>
                              <Text
                                style={{
                                  fontFamily: fontFamily.medium,
                                  fontSize: moderateScale(14),
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.textGreyJ,
                                }}>
                                {item?.product_return?.status}
                              </Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => selectProduct(item)}>
                              <Image
                                source={
                                  selectProductForRetrun &&
                                  selectProductForRetrun?.product_id ==
                                    item?.product_id
                                    ? imagePath.radioActive
                                    : imagePath.radioInActive
                                }
                              />
                            </TouchableOpacity>
                          )}

                          <View style={styles.cartItemImage}>
                            <FastImage
                              source={
                                item?.image != '' && item?.image != null
                                  ? {
                                      uri: getImageUrl(
                                        item?.image?.proxy_url,
                                        item?.image?.image_path,
                                        '300/300',
                                      ),
                                      priority: FastImage.priority.high,
                                    }
                                  : imagePath.patternOne
                              }
                              style={styles.imageStyle}
                            />
                          </View>
                          <View style={{marginLeft: 10}}>
                            <View style={{overflow: 'hidden'}}>
                              <Text
                                numberOfLines={2}
                                style={
                                  isDarkMode
                                    ? [
                                        styles.priceItemLabel2,
                                        {
                                          opacity: 0.8,
                                          color: MyDarkTheme.colors.text,
                                        },
                                      ]
                                    : [styles.priceItemLabel2, {opacity: 0.8}]
                                }>
                                {item?.product_name}
                              </Text>
                            </View>

                            {item?.quantity && (
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={
                                    isDarkMode
                                      ? {color: MyDarkTheme.colors.text}
                                      : {color: colors.textGrey}
                                  }>
                                  {strings.QTY}
                                </Text>
                                <Text style={styles.cartItemWeight}>
                                  {item?.quantity}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </ScrollView>
                    );
                  },
                )
              : null}
            <View style={{height: 50}} />
          </ScrollView>
          <View
            style={[
              styles.bottomAddToCartView,
              {top: viewHeight - height / 12},
            ]}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              // textStyle={styles.textStyle}
              onPress={returnOrder}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.SELECT}
            />
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
