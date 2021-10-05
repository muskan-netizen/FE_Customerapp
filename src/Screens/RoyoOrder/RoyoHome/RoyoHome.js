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
import commonStyles from '../../../styles/commonStyles';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';

const RoyoHome = (props) => {
  const {navigation} = props;
  // const {product} = useSelector(state => state.product)
  const [state, setState] = useState(null);
  // console.log(product, 'product stored in store')
  const updateState = (data) =>
    setState((state) => {
      return {...state, ...data};
    });

  const data1 = '';
  const onPressAdd = () => {
    navigation.navigate(navigationStrings.AddProduct);
  };
  const dashboard = () => {
    return (
      <View style={styles.dashboardBox}>
        <Image source={imagePath.apple} />
        <Text>Pending Order</Text>
        <Text>117 order pending</Text>
      </View>
    );
  };
  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={styles.container}
        bounces={false}>
        <View style={styles.header}>
          <Text style={styles.royoShop}>Royo shop</Text>
          <View style={styles.toggle}>
            <Text
              style={{...commonStyles.font14Bold, color: colors.whiteColor}}>
              online
            </Text>
            <View style={styles.indicator} />
          </View>
        </View>
        {/* <Carousel
          data={data}
          sliderWidth={width}
          itemWidth={width - itemWidth}
          renderItem={carouselRender}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={2000}
          autoplayInterval={2000}
          // onSnapToItem={(index) => updateState({ activeCarouselIndex: index })}
        /> */}
        {data1 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
            }}>
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
            <View
              style={{
                flexWrap: 'wrap',
              flexDirection: "row",
              justifyContent: 'space-between',
                marginTop: moderateScaleVertical(16),
              }}>
              {dashboard()}
              {dashboard()}
              {dashboard()}
              {dashboard()}
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingVertical: moderateScaleVertical(16),
                backgroundColor: '#D8D8D81f',
              }}>
              <Image
                source={imagePath.warning}
                style={{marginTop: moderateScaleVertical(5)}}
              />
              <View style={{flex: 1, marginLeft: moderateScale(16)}}>
                <Text
                  style={{
                    ...commonStyles.font16Bold,
                    color: colors.blackColor,
                  }}>
                  Complete store profile
                </Text>
                <Text
                  style={{
                    ...commonStyles.font13Regular,
                    color: colors.blackColor,
                    letterSpacing: 1,
                  }}>
                  you have missing store imformation.{' '}
                  <Text style={styles.span}>Tap here</Text> to complete.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </WrapperContainer>
  );
};

export default RoyoHome;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  royoShop: {
    ...commonStyles.font18Bold,
    color: colors.blackColor,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.themeColor,
    // padding: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScaleVertical(5),
    borderRadius: moderateScale(28),
  },

  indicator: {
    width: moderateScale(17),
    height: moderateScale(17),
    borderRadius: moderateScale(70),
    backgroundColor: colors.white,
    marginLeft: moderateScale(8),
  },
  carousel: {
    marginVertical: moderateScaleVertical(27),
    // alignSelf: "center",
    // borderRadius: moderateScale(6),
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginLeft: -moderateScale(38),
    // marginRight: moderateScale(35),
    // backgroundColor: "rgba(192,85,35,0.14)",
    // padding: moderateScale(16),
  },
  caption: {
    fontSize: textScale(10),
    fontFamily: fontFamily.Urbanist_Regular,
    lineHeight: textScale(16),
    color: '#00000030',
  },
  btnContainer: {
    backgroundColor: colors.whiteColor,
    width: '100%',
  },
  btnText: {
    ...commonStyles.font16SemiBold,
    color: colors.themeColor,
  },
  emptyText: {
    ...commonStyles.font14Regular,
    color: colors.blackColor,
    marginVertical: moderateScaleVertical(40),
    textAlign: 'center',
  },
  span: {
    color: '#0091ff4a',
  },
  dashboardBox: {
    width: width > 600 ? width/4.5 : width/2.25,
    backgroundColor: '#F5F5F5',
    padding: moderateScale(16),
    borderRadius: moderateScaleVertical(6),
    marginBottom: moderateScaleVertical(16),
  },
});
