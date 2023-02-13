    import React from 'react';
    import {
    Animated,
    Image,
    Text,
    TouchableOpacity,
    View,
    } from 'react-native';

    import Swipeable from 'react-native-gesture-handler/Swipeable';
    import { UIActivityIndicator } from 'react-native-indicators';
    import {
    getImageUrl
  } from '../../../utils/helperFunctions';
  import {
    height,
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
  } from '../../../styles/responsiveSize';
  import { getBundleId } from 'react-native-device-info';
/**
 * SwipeableSection Part
 * @param {item ,deleteItem,addDeleteCartItems,tokenConverterPlusCurrencyNumberFormater,getHourAndMinutes,swipeRef,swipeKey,swipeBtns,isDarkMode,colors,styles,FastImage,imagePath,fontFamily,appIds,btnLoadrId,btnLoader,digit_after_decimal,additional_preferences,MyDarkTheme,currencies,cartData} props 
 * @returns 
 */

 function SwipeableSection(props) {
 
    const {item ,deleteItem,addDeleteCartItems,tokenConverterPlusCurrencyNumberFormater,getHourAndMinutes,swipeRef,swipeKey,swipeBtns,isDarkMode,colors,styles,FastImage,imagePath,fontFamily,appIds,btnLoadrId,btnLoader,digit_after_decimal,additional_preferences,MyDarkTheme,currencies,cartData} = props;
    return (
            <>
            {item?.vendor_products.length > 0
                ? item?.vendor_products.map((i, inx) => {
                return (
                    <Swipeable
                    ref={swipeRef}
                    key={swipeKey + Math.random()}
                    renderRightActions={swipeBtns}
                    onSwipeableOpen={() => deleteItem(i, index)}
                    rightThreshold={width / 1.4}
                    // overshootFriction={8}
                    >
                    <Animated.View
                        style={{
                        backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.lightDark
                            : colors.transactionHistoryBg,
                        marginBottom: moderateScaleVertical(12),
                        // marginRight: moderateScale(8),
                        borderRadius: moderateScale(10),
                        transform: [],
                        // minHeight: height * 0.125,
                        }}
                        key={inx}>
                        <View
                        style={{
                            ...styles.cartItemMainContainer,
                        }}>
                        <View
                            style={[
                            styles.cartItemImage,
                            {
                                backgroundColor: isDarkMode
                                ? MyDarkTheme.colors.lightDark
                                : colors.white,
                            },
                            ]}
                        >
                            <FastImage
                            source={
                                i?.cartImg != "" && i?.cartImg != null
                                ? {
                                    uri: getImageUrl(
                                    i?.cartImg?.path?.proxy_url,
                                    i?.cartImg?.path?.image_path,
                                    "300/300"
                                    ),
                                    priority: FastImage.priority.high,
                                    cache: FastImage.cacheControl.immutable,
                                }
                                : imagePath.patternOne
                            }
                            style={styles.imageStyle}
                            />
                        </View>

                        <View style={styles.cartItemDetailsCon}>
                            <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ flex: 1 }}>
                                {i?.luxury_option_id !== 4 ? (
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    flex: 1,
                                    }}>
                                    <View>
                                    {!!i?.product?.category_name?.name && (
                                        <Text
                                        numberOfLines={1}
                                        style={{
                                            ...styles.priceItemLabel2,
                                            color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.textGreyB,
                                            fontSize: textScale(12),
                                            fontFamily: fontFamily.medium,
                                            width: width / 2.1,
                                        }}>
                                        {i?.product?.category_name.name},
                                        </Text>
                                    )}
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                        ...styles.priceItemLabel2,
                                        color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.blackOpacity86,
                                        fontSize: textScale(12),
                                        fontFamily: fontFamily.medium,
                                        width: width / 2.1,
                                        }}>
                                        {i?.product?.translation[0]?.title},
                                    </Text>
                                    </View>

                                    {getBundleId() !== appIds.rentzy &&
                                    <View
                                        pointerEvents={btnLoader ? 'none' : 'auto'}
                                        style={{ minWidth: moderateScale(74) }}>
                                        <View style={styles.incDecBtnContainer}>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center' }}
                                            onPress={() =>
                                            addDeleteCartItems(i, inx, 2)
                                            }>
                                            <Text style={styles.cartItemValueBtn}>
                                            -
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                            alignItems: 'center',
                                            // width: moderateScale(20),
                                            height: moderateScale(20),
                                            justifyContent: 'center',
                                            }}>
                                            {btnLoadrId === i.id && btnLoader ? (
                                            <UIActivityIndicator
                                                size={moderateScale(16)}
                                                color={colors.white}
                                            />
                                            ) : (
                                            <Text style={styles.cartItemValue}>
                                                {i?.quantity}
                                            </Text>
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center' }}
                                            onPress={() =>
                                            addDeleteCartItems(i, inx, 1)
                                            }>
                                            <Text style={styles.cartItemValueBtn}>
                                            +
                                            </Text>
                                        </TouchableOpacity>
                                        </View>
                                    </View>}
                                </View>
                                ) : null}

                                <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                    ...styles.priceItemLabel2,
                                    fontSize: textScale(12),
                                    color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyOpcaity7,
                                    marginTop: moderateScaleVertical(4),
                                    fontFamily: fontFamily.regular,
                                    }}>
                                    {i?.quantity} X{' '}
                                </Text>
                                <Text
                                    style={{
                                    color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyOpcaity7,
                                    }}>
                                    {tokenConverterPlusCurrencyNumberFormater(
                                    Number(i?.variants?.price),
                                    digit_after_decimal,
                                    additional_preferences,
                                    currencies?.primary_currency?.symbol,
                                    )}
                                </Text>
                                <Text> = </Text>
                                <Text
                                    style={{
                                    color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.black,
                                    }}>
                                    {tokenConverterPlusCurrencyNumberFormater(
                                    Number(i?.variants?.quantity_price),
                                    digit_after_decimal,
                                    additional_preferences,
                                    currencies?.primary_currency?.symbol,
                                    )}
                                </Text>
                                </View>

                                {i?.variant_options.length > 0
                                ? i?.variant_options.map((j, jnx) => {
                                    return (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text
                                        style={
                                            isDarkMode
                                            ? [
                                                styles.cartItemWeight2,
                                                {
                                                color:
                                                    MyDarkTheme.colors.text,
                                                },
                                            ]
                                            : styles.cartItemWeight2
                                        }
                                        numberOfLines={1}>
                                        {j.title}{' '}
                                        </Text>
                                        <Text
                                        style={
                                            isDarkMode
                                            ? [
                                                styles.cartItemWeight2,
                                                {
                                                color:
                                                    MyDarkTheme.colors.text,
                                                },
                                            ]
                                            : styles.cartItemWeight2
                                        }
                                        numberOfLines={
                                            1
                                        }>{`(${j.option})`}</Text>
                                    </View>
                                    );
                                })
                                : null}
                            </View>
                            </View>

                            <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <View
                                style={{
                                flex: 1,
                                justifyContent: 'center',
                                }}>
                                {!!i?.product_addons.length > 0 ? (
                                <View>
                                    <Text
                                    style={{
                                        ...styles.cartItemWeight2,
                                        color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyOpcaity7,
                                        marginBottom: moderateScale(2),
                                        marginTop: moderateScaleVertical(6),
                                        fontFamily: fontFamily.bold,
                                    }}>
                                    {strings.EXTRA}
                                    </Text>
                                </View>
                                ) : (
                                <View />
                                )}

                                <View>
                                {i?.product_addons.length > 0
                                    ? i?.product_addons.map((j, jnx) => {
                                    return (
                                        <View
                                        style={{
                                            marginBottom:
                                            moderateScaleVertical(4),
                                        }}>
                                        <View
                                            style={{
                                            marginRight: moderateScale(10),
                                            }}>
                                            <Text
                                            style={
                                                isDarkMode
                                                ? [
                                                    styles.cartItemWeight2,
                                                    {
                                                    color:
                                                        MyDarkTheme.colors
                                                        .text,
                                                    },
                                                ]
                                                : styles.cartItemWeight2
                                            }
                                            // numberOfLines={1}
                                            >
                                            {j.addon_title}{" "}
                                            {`(${j.option_title})`} ={" "}
                                            {
                                                tokenConverterPlusCurrencyNumberFormater(
                                                Number(j.price),
                                                digit_after_decimal,
                                                additional_preferences,
                                                currencies?.primary_currency?.symbol,
                                                )
                                            }
                                            </Text >
                                        </View >
                                        </View >
                                    );
                                    })
                                    : null}
                                </View >
                                {!!(
                                !!i?.pvariant &&
                                Number(i?.pvariant?.container_charges)
                                ) && (
                                    <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: moderateScale(2),
                                    }}>
                                    <View>
                                        <Text
                                        style={{
                                            ...styles.cartItemWeight2,
                                            color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.textGreyB,
                                            marginBottom: moderateScale(2),
                                            // marginTop: moderateScaleVertical(6),
                                        }}>
                                        {`${strings.CONTAINERCHARGES} : `}
                                        </Text>
                                    </View>
                                    {!!(
                                        !!i?.pvariant &&
                                        Number(i?.pvariant?.container_charges)
                                    ) && (
                                        <View
                                            style={{
                                            marginBottom: moderateScaleVertical(2),
                                            }}>
                                            <View
                                            style={{
                                                marginRight: moderateScale(10),
                                            }}>
                                            <Text
                                                style={
                                                isDarkMode
                                                    ? [
                                                    styles.cartItemWeight2,
                                                    {
                                                        color:
                                                        MyDarkTheme.colors.text,
                                                    },
                                                    ]
                                                    : styles.cartItemWeight2
                                                }
                                            // numberOfLines={1}
                                            >
                                                {tokenConverterPlusCurrencyNumberFormater(
                                                Number(
                                                    i?.pvariant?.container_charges
                                                ) * Number(i?.quantity),
                                                digit_after_decimal,
                                                additional_preferences,
                                                currencies?.primary_currency?.symbol
                                                )}
                                            </Text>
                                            </View>
                                        </View>
                                        )}
                                    </View>
                                )}
                            </View>

                            <View
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                marginTop: moderateScale(6),
                                }}>
                                {!!(
                                i?.faq_count &&
                                i?.user_product_order_form == null
                                ) && (
                                    <>
                                    <TouchableOpacity
                                        style={{
                                        marginRight: moderateScale(14),
                                        }}
                                        onPress={() => getProductFAQs(i)}>
                                        <FastImage
                                        source={imagePath.edit1Royo}
                                        resizeMode="contain"
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                        }}
                                        />
                                    </TouchableOpacity>
                                    </>
                                )}
                                <View>
                                {!!i?.product?.pharmacy_check && (
                                    <TouchableOpacity
                                    onPress={() => openPickerForPrescription(i)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: moderateScaleVertical(24),
                                    }}>
                                    {/* <Image source={imagePath.icAddPlaceholder} /> */}
                                    <Image source={imagePath.icPrescription} />
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    onPress={() => openDeleteView(i)}>
                                    <FastImage
                                    source={imagePath.deleteRed}
                                    resizeMode="contain"
                                    style={{
                                        width: moderateScale(16),
                                        height: moderateScale(16),
                                    }}
                                    />
                                </TouchableOpacity>
                                </View>
                            </View>
                            </View >
                        </View >
                        {!!cartData?.delay_date && (
                            <Text
                            style={{
                                fontSize: moderateScale(12),
                                fontFamily: fontFamily.medium,
                                color: colors.redFireBrick,
                                marginBottom: moderateScale(3),
                            }}>{`${i?.product.delay_order_hrs > 0 ||
                                i?.product.delay_order_min > 0
                                ? strings.PREPARATION_TIME_IS
                                : ''
                                }${i?.product.delay_order_hrs > 0
                                ? ` ${i?.product.delay_order_hrs} hrs`
                                : ''
                                }${i?.product.delay_order_min > 0
                                ? ` ${i?.product.delay_order_min} mins`
                                : ''
                                }`}</Text>
                        )}
                        </View >
                        {!!i?.is_processor_enable && (
                        <View>
                            <Text
                            style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.regular,
                                color: colors.black,
                            }}>
                            {'Processor Name : '} {i?.processor_name}{' '}
                            </Text>
                            <Text
                            style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.regular,
                                color: colors.black,
                            }}>
                            {'Date : '} {i?.processor_date}{' '}
                            </Text>
                        </View>
                        )}
                        {
                        i?.luxury_option_id == 4 ? (
                            <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: moderateScale(20),
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text style={styles.startEndDateTitle}>
                                {strings.START_DATE}
                                </Text>
                                <Text style={styles.startEndDateValueTxt}>
                                {i?.start_date_time}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.startEndDateTitle}>
                                {strings.END_DATE}
                                </Text >
                                <Text style={styles.startEndDateValueTxt}>
                                {i?.end_date_time}
                                </Text>
                            </View >
                            <View>
                                <Text style={styles.startEndDateTitle}>
                                {strings.DURATION}
                                </Text >
                                <Text style={styles.startEndDateValueTxt}>
                                {getHourAndMinutes(Number(i?.total_booking_time))}
                                </Text>
                            </View >
                            </View >
                        ) : null
                        }
                        {
                        !!i?.delivery_date ? (
                            <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: moderateScale(20),
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 3,
                            }}>
                            <View>
                                <Text style={styles.startEndDateTitle}>
                                {strings.DELIVERY_DATE}
                                </Text>
                                <Text style={styles.startEndDateValueTxt}>
                                {i?.delivery_date}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.startEndDateTitle}>
                                {strings.DELIVERY_SLOT}
                                </Text>
                                <Text style={styles.startEndDateValueTxt}>
                                {`${i?.product_delivery_slot?.title} (${i?.product_delivery_slot?.start_time} - ${i?.product_delivery_slot?.end_time})`}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.startEndDateTitle}>
                                {strings.SLOT_PRICE}
                                </Text>
                                <Text style={styles.startEndDateValueTxt}>
                                {tokenConverterPlusCurrencyNumberFormater(
                                    Number(i?.product_delivery_slot?.price || 0),
                                    digit_after_decimal,
                                    additional_preferences,
                                    currencies?.primary_currency?.symbol,
                                )}
                                </Text>
                            </View>
                            </View>
                        ) : null
                        }
                        {/* <View style={styles.dashedLine} /> */}
                    </Animated.View >
                    </Swipeable >
                    );
                })
                : null}
            </>

        )

}
export default React.memo(SwipeableSection);