import { isEmpty } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { dummyUser } from '../constants/constants';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { getImageUrl } from "../utils/helperFunctions";
import HTMLView from 'react-native-htmlview';
import { useDarkMode } from 'react-native-dynamic';
import navigationStrings from '../navigation/navigationStrings';


export default function P2pProductComp({
    item = {},
    isMoreDetails = false,
    isViewDetails = false,
    onViewDetails = () => { },
    onChatStart = () => { },
    isStartChat = false, selectedTab = {} }) {
    const {
        appData,
        themeColors,
        currencies,
        languages,
        appStyle,
        themeToggle,
        themeColor,
    } = useSelector((state) => state?.initBoot);
    const { userData } = useSelector((state) => state?.auth);

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors })
    const imageUrl =
        !isEmpty(item?.product_details)
            ? getImageUrl(
                item?.product_details[0]?.image_path?.image_fit,
                item?.product_details[0]?.image_path?.image_path,
                "300/300"
            )
            : dummyUser;

    const LeftImgRightTxt = ({ image, text, isViewDetails = false, isStartChat = false }) => <View style={{
        flexDirection: "row",
        marginTop: moderateScaleVertical(8),
        justifyContent: "space-between"
    }}>
        <View style={{ flexDirection: "row", padding: moderateScale(6) }}>

            <Image source={image} />
            <Text style={styles.rightTxt}>{text}</Text>
        </View>
        {!!isViewDetails && <TouchableOpacity
            onPress={onViewDetails}
            style={styles.viewDetailsBtn}>
            <Text style={{
                fontFamily: fontFamily?.regular,
                color: colors.white, textAlign: "center",
            }}>View Details</Text>
        </TouchableOpacity>}
        {!!isStartChat && <TouchableOpacity
            onPress={onChatStart}
            style={{ ...styles.viewDetailsBtn, }}
        >
            <Text style={{
                textAlign: "center",
                fontFamily: fontFamily?.regular,
                color: colors.white,
                // marginTop: moderateScaleVertical(4),
                textDecorationLine: "underline"
            }}>Start Chat</Text>
        </TouchableOpacity>}
    </View>

    return (
        <View style={{ ...styles.touchContainer, backgroundColor: colors.whiteSmokeColor, }}>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                {selectedTab?.id == 4 ? <Text style={{
                    marginBottom: moderateScaleVertical(4),
                    fontFamily: fontFamily?.regular
                }}>{"Cancelled by"} {item?.cancelled_by?.id == userData?.id ? "you" : item?.cancelled_by?.user_vendor?.vendor_id === item?.vendor?.id ? "lender" : "borrower"}</Text> : <View />}
                {/* <Text style={{
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(12)
                }}>#{item?.order_number}</Text> */}

            </View>

            <View style={{
                flexDirection: "row",

            }}>

                <FastImage
                    source={{ uri: imageUrl }}
                    style={styles.imgStyle}
                // resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.mainContainer}>
                    <View style={{ flex: 1, }}>

                        <View style={{
                            flexDirection: 'row', justifyContent: "space-between"
                        }}>
                            <Text style={{
                                fontFamily: fontFamily?.medium,
                                fontSize: textScale(14)
                            }}>{!isEmpty(item?.product_details) ? item?.product_details[0].title || item?.product_details[0]?.translation[0]?.title || '' : ''}</Text>
                            <Text style={{
                                fontFamily: fontFamily?.medium,
                                fontSize: textScale(12)
                            }}>#{item?.order_number}</Text>
                        </View>
                        <View style={{ width: width / 2 }}>

                            <HTMLView
                                value={
                                    !isEmpty(item?.product_details) ? item?.product_details[0]?.translation[0]?.body_html
                                        ? item?.product_details[0]?.translation[0]?.body_html
                                        : '' : ''
                                }
                            />
                        </View>
                    </View>

                </View>
            </View>

            {
                console.log(item?.products, "fasdfadsf")
            }

            {isMoreDetails && !isEmpty(item?.products) && <View>
                <LeftImgRightTxt image={imagePath.icTimeOrders} text={moment.utc(item?.products[0]?.start_date_time).local().format('DD MMM YYYY hh:mm:A')
                    + " - " + moment.utc(item?.products[0]?.end_date_time).local().format("MMM DD, YYYY hh:mm:A")} />
                {!isEmpty(item?.products) && !isEmpty(item?.products[0]?.product) && <LeftImgRightTxt image={imagePath.icLocationOrders} text={item?.products[0]?.product?.address} />}
                <LeftImgRightTxt image={imagePath.icProfileOrders}
                    isStartChat={isStartChat}
                    text={`Lent by ${item?.vendor?.name}`}
                />
                <LeftImgRightTxt image={imagePath.icProfileOrders}

                    text={`Borrowed by ${item?.user?.name}`}
                    isViewDetails={true} />
            </View>}
            {isViewDetails && <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                    onPress={onViewDetails}
                    style={styles.viewDetailsBtn}>
                    <Text style={{
                        fontFamily: fontFamily?.regular,
                        color: colors.white
                    }}>View Details</Text>
                </TouchableOpacity>
                {isStartChat && <TouchableOpacity
                    onPress={onChatStart}
                    style={{ ...styles.viewDetailsBtn, marginVertical: moderateScaleVertical(5) }}
                >
                    <Text style={{
                        textAlign: "center",
                        fontFamily: fontFamily?.regular,
                        color: colors.white,
                        marginTop: moderateScaleVertical(4),
                        textDecorationLine: "underline"
                    }}>Start Chat</Text>
                </TouchableOpacity>}
            </View>}
            {/* <Text>{"Cancelled by"} {item?.vendor_id === userData?.vendor_id ? "Lendor" : "Borrower"} </Text> */}
        </View>
    )
}

export function stylesFunc({ fontFamily, themeColors }) {
    const styles = StyleSheet.create({
        viewDetailsBtn: {
            padding: moderateScale(6),
            backgroundColor: "green",
            borderRadius: moderateScale(4),
            width: width / 4,
            backgroundColor: themeColors?.primary_color

        },
        descTxt: {
            fontFamily: fontFamily?.medium,
            fontSize: textScale(12),
            marginTop: moderateScaleVertical(8),
            color: colors.lightGreyText
        },
        mainContainer: {
            marginLeft: moderateScale(18),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
        },
        imgStyle: {
            height: moderateScale(65),
            width: moderateScale(65),
            borderRadius: moderateScale(12)
        },
        touchContainer: {
            marginHorizontal: moderateScale(16),
            padding: moderateScale(10),
            borderRadius: moderateScale(12)
        },
        rightTxt: {
            fontFamily: fontFamily?.regular,
            marginLeft: moderateScale(8),
            color: colors.textGreyN
        }
    })
    return styles
}