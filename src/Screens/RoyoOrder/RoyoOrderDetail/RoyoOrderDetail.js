import moment from 'moment';
import React from 'react';
import {Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native';
import {FlatList} from 'react-native';
import {View, Text} from 'react-native';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {customMarginBottom} from '../../../utils/constants/constants';
import {getImageUrl} from '../../../utils/helperFunctions';

const RoyoOrderDetail = (props) => {
  const {navigation} = props;
  const {data, updateOrderStatus} = props.route.params;
  const updatedOrderStatus=(data, state)=>{
    updateOrderStatus(data, state);
    navigation.goBack()
  }
  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        leftIcon={imagePath.backRoyo}
        centerTitle="Order details"
      />
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {data?.order_status?.current_status.id != 1 ? (
          <View>
            <Text style={styles.jobStatus}>Job Status</Text>
            <View style={styles.preparingBox}>
              <Text style={{...styles.font16Semibold, color: colors.white}}>
                {data?.order_status.current_status.title}
              </Text>
              <Image source={imagePath.dropdownTriangle} />
            </View>
          </View>
        ) : null}
        <View style={styles.orderNumberBox}>
          <Text style={styles.orderNumber}>Order #{data.order_number}</Text>
          <Text style={styles.orderTime}>{`${moment(data?.date_time).format(
            'DD MMM,YYYY',
          )} ${moment(data?.date_time).format('LT')} `}</Text>
        </View>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={data?.product_details}
          keyExtractor={(val, index) => index}
          renderItem={({item, index}) => {
            console.log(item, 'item');
            return (
              <View style={styles.itemBox}>
                <Image
                  style={styles.itemImage}
                  source={{
                    uri: getImageUrl(
                      item?.image_path?.image_fit,
                      item?.image_path?.image_path,
                      '500/500',
                    ),
                  }}
                />
                <View style={{flex: 1, justifyContent: 'space-around'}}>
                  <Text style={styles.font16Medium}>Pizza</Text>
                  <Text style={styles.font13Regular}>{item.qty} Unit</Text>
                  <Text style={styles.font14Regular}>
                    $ {item.price} dollar
                  </Text>
                </View>
                <Text style={styles.font16Semibold}>
                  {`$ ${item.qty * item.price}`}{' '}
                </Text>
              </View>
            );
          }}
          contentContainerStyle={styles.orderBox}
          ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
        />

        <View style={{margin: moderateScaleVertical(16)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.font15Medium}>Subtotal</Text>
            <Text style={styles.font15Semibold}>${data.payable_amount}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.font15Medium}>Delivery fee</Text>
            <Text style={styles.font15Semibold}>$23</Text>
          </View>
          <View style={styles.dashLine} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.font15Medium}>Total</Text>
            <Text style={{...styles.font15Semibold, color: colors.themeColor2}}>
              {`$ ${data.payable_amount + 23}`}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: moderateScaleVertical(16),
            backgroundColor: colors.whiteSmokeColor,
          }}>
          <View style={styles.flexRow}>
            <Text style={styles.font14Semibold}>Delivery address</Text>
            <View style={{flexDirection: 'row'}}>
              <Image source={imagePath.callRoyo} />
              <Image
                style={{
                  marginLeft: moderateScaleVertical(10),
                  // ...styles.shareImage,
                }}
                source={imagePath.whatsAppRoyo}
              />
              <Image
                style={{
                  marginLeft: moderateScaleVertical(10),
                  // ...styles.shareImage,
                }}
                source={imagePath.shareRoyo}
              />
            </View>
          </View>

          <View style={styles.locationBox}>
            <Image
              style={styles.locationImage}
              source={{
                uri: 'https://cdn.britannica.com/q:60/08/177308-050-94D9D6BE/Food-Pizza-Basil-Tomato.jpg',
              }}
            />
            <View style={{justifyContent: 'space-evenly'}}>
              <Text style={{fontFamily: fontFamily.semiBold, fontSize: 16}}>
                {data.user_name}
              </Text>
              <Text
                style={{
                  ...styles.font13Regular,
                  marginTop: moderateScaleVertical(5),
                }}>
                this is my address
              </Text>
              <Text style={styles.font13Regular}>this is my address</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{...styles.font14Semibold}}>Payment method</Text>
            <Text style={{...styles.font14Semibold, color: colors.black}}>
              {data.payment_option_title}
            </Text>
          </View>
        </View>
        {data?.order_status?.current_status.id == 1 ? (
          <View style={styles.buttonBox}>
            <ButtonWithLoader
              btnText="Reject"
              btnTextStyle={styles.btnText}
              btnStyle={styles.btnContainer}
              onPress={() => updatedOrderStatus(data, 8)}
            />
            <ButtonWithLoader
              btnText="Confirm"
              btnTextStyle={{...styles.btnText, color: colors.white}}
              btnStyle={{
                ...styles.btnContainer,
                backgroundColor: colors.themeColor2,
                marginLeft: moderateScale(10),
              }}
              onPress={() => updatedOrderStatus(data, 7)}
            />
          </View>
        ) : null}
      </ScrollView>
    </WrapperContainer>
  );
};

export default RoyoOrderDetail;

const styles = StyleSheet.create({
  font15Medium: {
    fontSize: textScale(15),
    fontFamily: fontFamily.medium,
    color: colors.blackOpacity43,
  },
  font15Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(15),
    color: colors.black,
  },
  font16Medium: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    color: colors.blackOpacity40,
    fontSize: 13,
  },
  font14Regular: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  font14Semibold: {
    color: colors.blackOpacity43,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  header: {
    marginBottom: moderateScaleVertical(32),
    marginHorizontal: moderateScaleVertical(16),
  },
  container: {
    flex: 1,
    // marginTop: moderateScaleVertical(24),
    paddingBottom: moderateScaleVertical(10),
    // marginBottom: moderateScaleVertical(16),
    marginBottom: customMarginBottom(),
  },
  jobStatus: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    marginHorizontal: moderateScaleVertical(16),
    // marginTop: moderateScaleVertical(16),
  },
  preparingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScaleVertical(15),
    borderRadius: moderateScale(5),
    backgroundColor: colors.themeColor2,
    margin: moderateScaleVertical(16),
    alignItems: 'center',
  },
  orderNumberBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(4),
    marginHorizontal: moderateScaleVertical(16),
  },
  orderNumber: {
    color: colors.blackOpacity66,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  orderTime: {
    color: colors.blackOpacity66,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  itemBox: {
    flexDirection: 'row',
    padding: moderateScale(16),
  },
  itemImage: {
    width: moderateScale(65),
    height: moderateScale(65),
    borderRadius: moderateScale(5),
    marginRight: moderateScale(16),
  },
  orderBox: {
    borderRadius: moderateScale(8),
    backgroundColor: colors.whiteSmokeColor,
    margin: moderateScaleVertical(16),
  },
  itemSeperator: {
    borderBottomColor: colors.lightGreyBgColor,
    borderBottomWidth: 1,
    marginHorizontal: moderateScale(16),
  },
  dashLine: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
    flex: 1,
    marginVertical: moderateScaleVertical(16),
    borderColor: colors.lightGreyBgColor,
  },
  shareImage: {
    height: moderateScaleVertical(23),
    width: moderateScaleVertical(23),
  },
  locationBox: {
    flexDirection: 'row',
    marginVertical: moderateScale(16),
    borderRadius: moderateScale(6),
  },
  locationImage: {
    width: moderateScale(65),
    height: moderateScale(65),
    borderRadius: moderateScale(5),
    marginRight: moderateScaleVertical(16),
  },
  btnText: {
    color: colors.themeColor2,
    // paddingHorizontal: moderateScale(16),
    textTransform: 'none',
    fontSize: textScale(14),
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: moderateScaleVertical(16),
  },
  btnContainer: {
    borderRadius: moderateScale(5),
    backgroundColor: colors.white,
    borderColor: colors.themeColor2,
    paddingHorizontal: moderateScale(20),
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
