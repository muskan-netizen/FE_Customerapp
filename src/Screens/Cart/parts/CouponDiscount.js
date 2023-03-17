import React from 'react';
import {
    Text,
    View,
} from 'react-native';

import {
    moderateScale,
    moderateScaleVertical
  } from '../../../styles/responsiveSize';
  import DeviceInfo, { getBundleId } from 'react-native-device-info';

/**
 * CouponDiscount Part
 * @param {item ,tokenConverterPlusCurrencyNumberFormater,isDarkMode,colors,styles,FastImage,imagePath,appIds,digit_after_decimal,additional_preferences,MyDarkTheme,currencies,strings,preferences} props 
 * @returns 
 */

 function CouponDiscount(props) {
 
    const {item ,tokenConverterPlusCurrencyNumberFormater,isDarkMode,colors,styles,FastImage,imagePath,appIds,digit_after_decimal,additional_preferences,MyDarkTheme,currencies,strings,preferences} = props;
        return (
            <>
               <View
                    style={{
                    marginHorizontal: moderateScale(4),
                    marginTop: moderateScaleVertical(8),
                    }}>
                    {!!item?.discount_amount && (
                    <View style={styles.itemPriceDiscountTaxView}>
                        <Text
                        style={
                            isDarkMode
                            ? [
                                styles.priceItemLabel,
                                {
                                color: MyDarkTheme.colors.text,
                                },
                            ]
                            : styles.priceItemLabel
                        }>
                        {strings.COUPON_DISCOUNT}
                        </Text>
                        <Text
                        style={
                            isDarkMode
                            ? [
                                styles.priceItemLabel,
                                {
                                color: MyDarkTheme.colors.text,
                                },
                            ]
                            : styles.priceItemLabel
                        }>{`- ${tokenConverterPlusCurrencyNumberFormater(
                            Number(item?.discount_amount ? item?.discount_amount : 0),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}`}</Text>
                    </View>
                    )}

                    {!!(item?.vendor && item?.vendor?.fixed_fee) && (
                    <View style={styles.itemPriceDiscountTaxView}>
                        <Text
                        style={
                            isDarkMode
                            ? [
                                styles.priceItemLabel,
                                {
                                color: MyDarkTheme.colors.text,
                                },
                            ]
                            : styles.priceItemLabel
                        }>
                        {preferences?.fixed_fee_nomenclature != '' &&
                            preferences?.fixed_fee_nomenclature != null
                            ? preferences?.fixed_fee_nomenclature
                            : strings.FIXED_FEE}
                        </Text>
                        <Text
                        style={
                            isDarkMode
                            ? [
                                styles.priceItemLabel,
                                {
                                color: MyDarkTheme.colors.text,
                                },
                            ]
                            : styles.priceItemLabel
                        }>
                        {tokenConverterPlusCurrencyNumberFormater(
                            Number(
                            item?.vendor?.fixed_fee_amount
                                ? item?.vendor?.fixed_fee_amount
                                : 0,
                            ),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}
                        </Text>
                    </View>
                    )}

                    {appIds?.meatEasy == DeviceInfo.getBundleId() ? (
                    <View style={styles.itemPriceDiscountTaxView}>
                        {!!item?.delivery_types && item?.delivery_types?.length > 0 ? (
                        <Text
                            style={{
                            ...styles.priceItemLabel,
                            color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.textGreyB,
                            marginBottom: moderateScaleVertical(8),
                            }}>
                            {strings.DELIVERY_CHARGES}:
                        </Text>
                        ) : null}

                        {!!item?.delivery_types && item?.delivery_types.length > 0 ? (
                        <Text
                            style={
                            isDarkMode
                                ? [
                                styles.priceItemLabel,
                                {
                                    color: MyDarkTheme.colors.text,
                                },
                                ]
                                : styles.priceItemLabel
                            }>
                            {tokenConverterPlusCurrencyNumberFormater(
                            Number(
                                item?.delivery_types.filter(
                                (val2) =>
                                    (sel_types || item?.sel_types) == val2?.code,
                                )[0]?.rate,
                            ),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                            )}
                        </Text>
                        ) : null}
                    </View>
                    ) : (
                    <View
                        style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginVertical: moderateScaleVertical(6),
                        }}>
                        {!!item?.delivery_types && item?.delivery_types?.length > 0 ? (
                        <Text
                            style={{
                            ...styles.priceItemLabel,
                            color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.textGreyB,
                            }}>
                            {strings.DELIVERY_CHARGES}:
                        </Text>
                        ) : null}

                        {!!item?.delivery_types && item?.delivery_types.length == 1 ? (
                        <Text>{`${item?.delivery_types[0]?.courier_name
                            } ${tokenConverterPlusCurrencyNumberFormater(
                            Number(item?.delivery_types[0]?.rate),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                            )}`}</Text>
                        ) : !!item?.delivery_types &&
                        item?.delivery_types.length > 0 ? (
                        <ModalDropdown
                            multipleSelect={false}
                            options={item?.delivery_types}
                            renderRow={(val) => renderDropDown(val, item)}
                            dropdownStyle={{
                            minWidth: '40%',
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScaleVertical(12),
                            }}>
                            <View
                            style={{
                                ...styles.deliveryFeeDropDown,
                                borderColor: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                            }}>
                            {appIds.hokitch == getBundleId() ? (
                                <Text style={styles.dropDownTextStyle}>
                                {strings.CHARGES}
                                </Text>
                            ) : (
                                <Text
                                style={{
                                    ...styles.dropDownTextStyle,
                                    color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                }}>
                                {
                                    item?.delivery_types.filter(
                                    (val2) =>
                                        (sel_types || item?.sel_types) == val2?.code,
                                    )[0]?.courier_name
                                }
                                </Text>
                            )}
                            <Text
                                style={{
                                ...styles.dropDownTextStyle,
                                marginHorizontal: moderateScale(8),
                                color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                }}>
                                {
                                item?.delivery_types.filter(
                                    (val2) =>
                                    (sel_types || item?.sel_types) == val2?.code,
                                )[0]?.rate
                                }
                            </Text>
                            <FastImage
                                style={{
                                width: moderateScale(10),
                                height: moderateScale(10),
                                }}
                                source={imagePath.icDropdown4}
                                tintColor={
                                isDarkMode ? MyDarkTheme.colors.text : colors.black
                                }
                                resizeMode="contain"
                            />
                            </View>
                        </ModalDropdown>
                        ) : null}
                    </View>
                    )}
                </View>
            </>

        )

}
export default React.memo(CouponDiscount);