import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet, Image} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import moment from 'moment';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import ButtonWithLoader from './ButtonWithLoader';

const OrderCard = (props) => {
  
  const {item={},  onPress = () => {}, updateOrderStatus} = props;
  // console.log(item)
  let count=item.item_count-1;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.font13Regular}>Order {item?.order_number}</Text>
          <Text style={styles.date}>{`${moment(item?.date_time).format('DD MMM,YYYY')} ${moment(
                  item?.date_time,
                ).format('LT')} `}</Text>
        </View>
        <View
          style={styles.rowSapce}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: moderateScaleVertical(48),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: moderateScale(8)
              }}>
              {item?.product_details?.map((val, index) => (
                <Image
                key={index}
                source={{
                  uri: getImageUrl(
                    val?.image_path?.image_fit,
                    val?.image_path?.image_path,
                    '500/500',
                  ),
                }}
                style={{
                  ...styles.image,
                  zIndex: -index,
                  marginLeft: index!=0?-moderateScale(20):0,
                }}
              />
              ))}
            </View>
            <Text style={styles.font16Regular}>Salt {count==0?'':'x' +" "+count+" more"}</Text>
          </View>
          <Text
            style={{
              ...styles.font14Regular,
              color: '#35B300',
              textAlign: 'right',
            }}>
            {item?.payment_option_title}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
      <View
        style={{...styles.rowSapce,
          marginTop: moderateScaleVertical(12),
          
        }}>
        <View>
          <Text style={styles.orderText}>Order Total</Text>
          <Text style={styles.totalPrice}>${item?.payable_amount}</Text>
        </View>

        {item?.order_status?.current_status?.id != 1  ? (
          <View>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                fontSize: 11,
                color: '#8B8B8B',
              }}>
              Order Status
            </Text>
            <Text
              style={{
                ...styles.font14Regular,
                color: item?.order_status?.current_status?.id ==  3? '#E02020' : colors.black,
              }}>
              {item?.order_status?.current_status?.title}
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <ButtonWithLoader
              btnText="Reject"
              btnTextStyle={styles.btnText}
              btnStyle={styles.btnContainer}
              onPress={() => updateOrderStatus(item, 8)}
            />
            <ButtonWithLoader
              btnText="Confirm"
              btnTextStyle={{...styles.btnText, color: colors.white}}
              btnStyle={{
                ...styles.btnContainer,
                backgroundColor: colors.themeColor2,
                marginLeft: moderateScale(10),
              }}
              onPress={() => updateOrderStatus(item, 7)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  line: {
    borderWidth: 0.5,
    marginVertical: moderateScaleVertical(5),
    borderColor: '#9797972c',
  },
  font16Regular: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  font14Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: textScale(24),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity66,
  },
  container: {
    padding: moderateScale(16),
    backgroundColor: colors.whiteSmokeColor,
    marginBottom: moderateScaleVertical(16),
    borderRadius: moderateScale(6),
  },
  image: {
    backgroundColor: colors.white,
    // position: 'absolute',

    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(25),
  },
  date: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity66,
  },
  btnText: {
    color: colors.themeColor2,
    paddingHorizontal: moderateScale(8),
    textTransform: 'none',
  },
  btnContainer: {
    marginTop: 0,
    height: moderateScaleVertical(32),
    borderRadius: moderateScale(5),
    backgroundColor: colors.white,
    borderColor: colors.themeColor2,
  },
  orderText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#8B8B8B',
  },
  totalPrice: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.themeColor2,
    lineHeight: textScale(24),
  },
  rowSapce: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
