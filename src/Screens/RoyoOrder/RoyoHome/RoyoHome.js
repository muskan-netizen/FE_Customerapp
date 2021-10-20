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
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
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

const commonStyle = commonStyles({
  fontFamily,
  buttonTextColor: colors.themeColor2,
});

const RoyoHome = (props) => {
  const {navigation} = props;

  

  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        onPressLeft={() => {}}
        leftIcon={imagePath.logoRoyo}
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
                <View style={{flexDirection: 'row'}}>
                  <Text style={{...styles.font14Regular, color: '#2E3E3A5f'}}>
                    This month{' '}
                  </Text>
                  <Image source={imagePath.dropdownTriangle} />
                </View>
              </View>
              <View style={styles.graphContainer}>
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
                <View style={{flexDirection: 'row'}}>
                  <Text style={{...styles.font14Regular, color: '#2E3E3A5f'}}>
                    This month{' '}
                  </Text>
                  <Image source={imagePath.dropdownTriangle} />
                </View>
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
