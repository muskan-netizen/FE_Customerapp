import React from 'react';
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
  const {data = [], mode = 'cash',} = props;
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.font13Regular}>Order #836372</Text>
        <Text style={styles.date}>9 oct; 11: 11 pm</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
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
            fontSize: 14,
            fontFamily: fontFamily.regular,
            color: '#35B300',
            textAlign: 'right',
          }}>
          {mode}
        </Text>
      </View>
      <View style={styles.line} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: moderateScaleVertical(12),
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.orderText}>Order Total</Text>
          <Text style={styles.totalPrice}>$ 40.00</Text>
        </View>
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
});
