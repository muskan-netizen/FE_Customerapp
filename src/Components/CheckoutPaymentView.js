import {
  CardNumber,
  Cvv,
  ExpiryDate,
  Frames,
  SubmitButton,
} from 'frames-react-native';
import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';

export default function CheckoutPaymentView({
  cardTokenized = () => { },
  cardTokenizationFailed = () => { },
  onPressSubmit = () => { },
  btnTitle = '',
  isSubmitBtn = false,
  submitBtnStyle = {},
  renderCustomLeft = () => <></>,
  btnsMainView = {},
  mainContainer = {},
}) {
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });
  return (
    <View style={{ ...styles.container, ...mainContainer }}>
      <Frames
        config={{
          debug: true,
          publicKey: appData?.profile?.preferences?.checkout_public_key,
        }}
        cardTokenized={cardTokenized}
        cardTokenizationFailed={cardTokenizationFailed}
      >
        <CardNumber
          style={styles.cardNumber}
          placeholder="Card Details"
          placeholderTextColor={colors.greyD}


        />

        <View style={styles.dateAndCode}>
          <ExpiryDate
            style={styles.expiryDate}
            placeholderTextColor={colors.greyD}
          />
          <Cvv
            style={styles.cvv}
            placeholder="CVC"
            placeholderTextColor={colors.greyD}
          />
        </View>

        {isSubmitBtn ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              ...btnsMainView,
            }}>
            {renderCustomLeft()}

            <SubmitButton
              title={btnTitle}
              style={{ ...styles.button, ...submitBtnStyle }}
              textStyle={styles.buttonText}
              onPress={onPressSubmit}
            />
          </View>
        ) : (
          <></>
        )}
      </Frames>
    </View>
  );
}
export function stylesFunc({ fontFamily, themeColors }) {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: moderateScale(10),

    },
    dateAndCode: {
      marginTop: moderateScaleVertical(15),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardNumber: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      height: moderateScaleVertical(50),
      color: colors.black,
      backgroundColor: colors.white,
      borderRadius: moderateScale(5),
      borderWidth: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    expiryDate: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      height: moderateScaleVertical(50),
      width: '48%',
      color: colors.black,
      backgroundColor: colors.white,
      borderWidth: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    cvv: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      height: moderateScaleVertical(50),
      width: '48%',
      color: colors.black,
      backgroundColor: colors.white,
      borderWidth: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    button: {
      height: moderateScaleVertical(50),
      borderRadius: moderateScale(10),
      marginTop: moderateScaleVertical(20),
      backgroundColor: themeColors.primary_color,
    },
    buttonText: {
      color: colors.white,
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
    },
  });
  return styles;
}
