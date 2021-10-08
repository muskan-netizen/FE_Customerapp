import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
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

const commonStyle = commonStyles({
  fontFamily,
  buttonTextColor: colors.themeColor2,
});

const RoyoHome = (props) => {
  const {navigation} = props;
  const [state, setState] = useState(null);
  const updateState = (data) =>
    setState((state) => {
      return {...state, ...data};
    });

  const dashboardData = [
    {
      image: imagePath.timerRoyo,
      header: 'Pending order',
      text: '117 pending order',
    },
    {
      image: imagePath.activeRoyo,
      header: 'Active order',
      text: '17 active orders',
    },
    {
      image: imagePath.deliveredRoyo,
      header: 'Delivered order',
      text: '4 orders delivered',
    },
    {
      image: imagePath.cancelledRoyo,
      header: 'Cancelled order',
      text: '7 orders cancelled',
    },
  ];
  const data1 = '';
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [100, 45, 58, 80, 99, 43, 100],
        colors: [
          (opacity = 1) => `rgba(4, 14, 22, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(174, 44, 242, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
          (opacity = 1) => `rgba(7, 14, 242, ${opacity})`,
          (opacity = 1) => `rgba(174, 144, 22, ${opacity})`,
          (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
        ],
      },
    ],
  };
  const orderData = [
    imagePath.cabImage,
    imagePath.contactIllustration,
    imagePath.listViewIcon,
    imagePath.icoTimeOrder,
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

  const onPressAdd = () => {
    navigation.navigate(navigationStrings.AddProduct);
  };

  const dashboard = (item, index) => {
    const {image, header, text} = item;
    return (
      <View style={styles.dashboardBox}>
        <Image
          style={{
            shadowColor: 'rgba(242,96,97,0.23)',
            elevation: 19,
          }}
          source={image}
        />
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
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.header}>
          <Image source={imagePath.logoRoyo} />
          <View style={styles.toggle}>
            <Text style={{...commonStyle.boldFont14, color: colors.white}}>
              online
            </Text>
            <View style={styles.indicator} />
          </View>
        </View>

        {data1 ? (
          <View style={styles.center}>
            <Image source={imagePath.emptyPackage} style={{}} />
            <Text style={styles.emptyText}>
              No product added. plaease add new product sto create digital
              catalogue
            </Text>
            <ButtonWithLoader
              btnText="+   Add a product"
              btnTextStyle={styles.btnText}
              btnStyle={styles.btnContainer}
              //   onPress={onPressAdd}
            />
          </View>
        ) : (
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
                  Complete store profile
                </Text>
                <Text
                  style={{
                    ...commonStyle.regularFont13,
                    color: colors.black,
                    letterSpacing: 1,
                  }}>
                  you have missing store imformation.{' '}
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
                      This month
                    </Text>
                    <Image source={imagePath.dropdownTriangle} />
                  </View>
                </View>
                <View style={styles.graphContainer}>
                  <View style={styles.graphHeader}>
                    <Text style={{...styles.font13Regular, color: '#2E3E3A5f'}}>
                      Total revenue (Delivered order)
                    </Text>
                    <Text style={styles.font16Bold}>$123456</Text>
                  </View>
                  <BarChart
                    withCustomBarColorFromData={true}
                    style={{margin: 0, padding: 0, flex: 1, marginLeft: 0}}
                    // yLabelsOffset={30}
                    data={data}
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
                      This month
                    </Text>
                    <Image source={imagePath.dropdownTriangle} />
                  </View>
                </View>
                <View style={styles.graphContainer}>
                  <View style={styles.graphHeader}>
                    <Text style={styles.font13Regular}>
                      Total revenue (Delivered order)
                    </Text>
                    <Text style={styles.font16Bold}>$123456</Text>
                  </View>
                  <BarChart
                    withCustomBarColorFromData={true}
                    data={data}
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
                data={['Cash', 'Card', 'Cash', 'Cash']}
                numColumns={width > 600 ? 2 : 1}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        marginLeft: customMarginLeftForBox(index),
                        flex: 1,
                      }}>
                      <OrderCard
                        onPress={() =>
                          navigation.navigate(
                            navigationStrings.ROYO_ORDER_DETAIL,
                          )
                        }
                        data={orderData}
                        index={index}
                        mode={item}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, key) => key}
              />
            </View>
          </View>
        )}
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
    paddingVertical: moderateScaleVertical(24),
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
    backgroundColor: '#F5F5F5',
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
});
