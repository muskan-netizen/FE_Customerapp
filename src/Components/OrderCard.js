import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet, Image} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import ButtonWithLoader from './ButtonWithLoader';

const OrderCard = (props) => {
  const {data = [], mode = 'cash', status = '', onPress = () => {}} = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.font13Regular}>Order #836372</Text>
          <Text style={styles.date}>9 oct; 11: 11 pm</Text>
        </View>
        <View
          style={styles.rowSapce}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                minWidth: moderateScale(30 + data?.length * 8),
                height: moderateScaleVertical(48),
                justifyContent: 'center',
              }}>
              {data?.map((val, index) => (
                <Image
                  key={index}
                  source={val}
                  style={{
                    ...styles.image,
                    zIndex: -index,
                    marginLeft: moderateScale(8 * index),
                  }}
                />
              ))}
            </View>
            <Text style={styles.font16Regular}>Salt x 3 more</Text>
          </View>
          <Text
            style={{
              ...styles.font14Regular,
              color: '#35B300',
              textAlign: 'right',
            }}>
            {mode}
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
          <Text style={styles.totalPrice}>$ 40.00</Text>
        </View>

        {status ? (
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
                color: status == 'Cancelled' ? '#E02020' : colors.black,
              }}>
              {status}
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <ButtonWithLoader
              btnText="Reject"
              btnTextStyle={styles.btnText}
              btnStyle={styles.btnContainer}
              //   onPress={onPressAdd}
            />
            <ButtonWithLoader
              btnText="Confirm"
              btnTextStyle={{...styles.btnText, color: colors.white}}
              btnStyle={{
                ...styles.btnContainer,
                backgroundColor: colors.themeColor2,
                marginLeft: moderateScale(10),
              }}
              //   onPress={onPressAdd}
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
    backgroundColor: '#F5F5F5',
    marginBottom: moderateScaleVertical(16),
    borderRadius: moderateScale(6),
  },
  image: {
    backgroundColor: colors.white,
    position: 'absolute',

    width: moderateScale(25),
    height: moderateScale(25),
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
