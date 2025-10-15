import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { loaderFour } from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import VendorModeHeader from '../../../Components/VendorModeHeader';
import imagePath from '../../../constants/imagePath';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import { height, moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize';
import { getColorSchema } from '../../../utils/utils';
import navigationStrings from '../../../navigation/navigationStrings';
import strings from '../../../constants/lang';
import { useNavigation } from '@react-navigation/native';
import actions from '../../../redux/actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const EcommerceHomePageLoader = ({ selcetedToggle }) => {
    const { themeColor, themeToggle, appData, themeColors } = useSelector(
        (state) => state?.initBoot,
    );
    const userData = useSelector(state => state?.auth?.userData);
    const { location } = useSelector((state) => state?.home);
    const { cartItemCount } = useSelector(state => state?.cart);
    const darkthemeusingDevice = getColorSchema();
    const insets = useSafeAreaInsets();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const navigation = useNavigation();

    // Ecommerce engaging quotes
    const ecommerceQuotes = useRef([
        'Style is a way to say who you are without having to speak.',
        'Fashion is what you buy, style is what you do with it.',
        'Shopping is cheaper than therapy.',
        'Life is too short to wear boring clothes.',
        "Dress like you're already famous",
        'Fashion fades, only style remains.',
        'When in doubt, overdress.',
        'Good style is timeless.',
    ]).current;

    const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * ecommerceQuotes.length));

    useEffect(() => {
        const id = setInterval(() => {
            setQuoteIndex(Math.floor(Math.random() * ecommerceQuotes.length));
        }, 5000);
        return () => clearInterval(id);
    }, [ecommerceQuotes.length]);

    return (
        <WrapperContainer isSafeArea={false} bgColor={isDarkMode ? colors.black : colors.white}>
            <StatusBar
                backgroundColor={themeColors?.primary_color}
                barStyle="light-content"
            />
            <View style={{
                paddingTop:
                    Platform.OS === 'android'
                        ? StatusBar.currentHeight
                        : insets.top,
                paddingHorizontal: moderateScale(16),
                paddingBottom: moderateScale(12),
                backgroundColor: themeColors?.primary_color,
            }}>
                {/* Vendor Mode Header */}
                <VendorModeHeader selectedToggle={selcetedToggle} />

                {/* Location and Icons Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: moderateScale(16) }}>
                    {/* Location Section */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            navigation.navigate(navigationStrings.LOCATION, {
                                type: 'Home1',
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                        <Image
                            source={imagePath.location2}
                            style={{
                                width: moderateScale(24),
                                height: moderateScale(24),
                                tintColor: colors.white,
                                marginRight: moderateScale(4),
                            }}
                            resizeMode="contain"
                        />
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: colors.white,
                                    fontFamily: fontFamily?.regular,
                                    fontSize: textScale(10),
                                }}>
                                {strings.YOUR_LOCATION}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: colors.white,
                                        fontFamily: fontFamily?.bold,
                                        fontSize: textScale(12),
                                    }}>
                                    {location?.address}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Icons Section */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(navigationStrings.NOTIFICATION)}
                            style={{ padding: moderateScale(8) }}>
                            <Image
                                source={imagePath.atlantic_notification}
                                style={{
                                    width: moderateScale(22),
                                    height: moderateScale(22),
                                    tintColor: colors.white,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(navigationStrings.WISHLISTPRODUCTS)}
                            style={{ marginLeft: moderateScale(4) }}>
                            <Image
                                source={imagePath.heart2}
                                style={{
                                    width: moderateScale(22),
                                    height: moderateScale(22),
                                    tintColor: colors.white,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(navigationStrings.CART)}
                            style={{ marginLeft: moderateScale(14) }}>
                            <Image
                                source={imagePath.cartIcon}
                                style={{
                                    width: moderateScale(22),
                                    height: moderateScale(22),
                                    tintColor: colors.white,
                                }}
                                resizeMode="contain"
                            />
                            {cartItemCount?.data > 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: moderateScale(4),
                                        right: moderateScale(4),
                                        backgroundColor: colors.redNew,
                                        borderRadius: moderateScale(10),
                                        minWidth: moderateScale(16),
                                        height: moderateScale(16),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: moderateScale(4),
                                    }}>
                                    <Text
                                        style={{
                                            color: colors.white,
                                            fontSize: textScale(10),
                                            fontFamily: fontFamily?.bold,
                                        }}>
                                        {cartItemCount?.data}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                    }
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.whiteOpacity22,
                        borderRadius: moderateScale(24),
                        paddingHorizontal: moderateScale(16),
                        paddingVertical: moderateScale(12),
                    }}>
                    <Image
                        source={imagePath.search1}
                        style={{
                            width: moderateScale(16),
                            height: moderateScale(16),
                            tintColor: colors.white,
                            marginRight: moderateScale(12),
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            flex: 1,
                            color: colors.white,
                            fontSize: textScale(12),
                            fontFamily: fontFamily?.regular,
                        }}>
                        {strings.SEARCH_HERE}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Loader and Quote */}
            <View style={{ alignItems: 'center', marginTop: height / 6, padding: moderateScaleVertical(24), flex: 1 }}>
                <LottieView
                    source={loaderFour}
                    autoPlay
                    loop
                    style={{ height: moderateScaleVertical(90), width: moderateScale(90) }}
                />
                <Text style={{
                    color: isDarkMode ? colors.white : colors.black,
                    fontSize: textScale(14),
                    fontFamily: fontFamily.medium,
                    marginTop: moderateScaleVertical(24),
                    textAlign: 'center',
                    paddingHorizontal: moderateScale(24),
                }}>
                    {ecommerceQuotes[quoteIndex]}
                </Text>
            </View>
        </WrapperContainer>
    );
};

export default React.memo(EcommerceHomePageLoader);

