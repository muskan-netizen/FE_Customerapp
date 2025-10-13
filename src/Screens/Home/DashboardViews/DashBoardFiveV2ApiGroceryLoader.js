//import liraries
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { loaderFour } from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
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
import { MyDarkTheme } from '../../../styles/theme';
import VendorModeHeader from '../../../Components/VendorModeHeader';



const DashBoardFiveV2ApiLoader = ({categoryData = [], selcetedToggle}) => {
    const { themeColor, themeToggle, themeColors } = useSelector(
        (state) => state?.initBoot,
    );
    const userData = useSelector(state => state?.auth?.userData);
    const { location } = useSelector((state) => state?.home);
    const darkthemeusingDevice = getColorSchema();
    const insets = useSafeAreaInsets();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const navigation = useNavigation();
    // Random engaging quotes and lottie pool
    const groceryQuotes = useRef([
        'A well-stocked pantry is the secret to a happy kitchen.',
        'Good groceries are the start of great meals.',
        'Fill your basket with health, not just food.',
        'Fresh groceries, fresh start every day.',
        'A grocery list is a recipe for success.',
        'Grocery shopping is an investment in your well-being.',
        'The best memories start with fresh ingredients.',
        'Healthy outside starts from healthy inside — shop wisely.',
    ]).current;
    const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * groceryQuotes.length));

    useEffect(() => {
        const id = setInterval(() => {
            setQuoteIndex(Math.floor(Math.random() * groceryQuotes.length));
        }, 5000);
        return () => clearInterval(id);
    }, [groceryQuotes.length]);

    return (
        <WrapperContainer isSafeArea={false} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <View style={{
                paddingHorizontal: moderateScale(16),
            }}>
                {/* Location Header - Fixed at top, animates out */}
                <View
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                        }
                    ]}>
                    <View
                        style={{
                            paddingTop: insets.top,
                            paddingHorizontal: moderateScale(16),
                            backgroundColor: colors.black,
                        }}
                    >
                        <VendorModeHeader selectedToggle={selcetedToggle} />
                    </View>
                    <LinearGradient colors={[colors.black, colors.borderBlue]}>
                        {/* Location Section - Sticky */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginHorizontal: moderateScale(16),
                            marginBottom: moderateScale(8),
                        }}>
                            <TouchableOpacity
                                activeOpacity={1}
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
                                <View style={{ marginRight: moderateScale(10), flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{
                                                width: moderateScale(16),
                                                height: moderateScale(16),
                                                tintColor: colors.white,
                                                marginRight: moderateScale(10),
                                            }}
                                            source={imagePath.location1}
                                            resizeMode="contain"
                                        />
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: colors.white,
                                                fontFamily: fontFamily?.bold,
                                                fontSize: textScale(16),
                                            }}>
                                            {location?.type === 3
                                                ? location?.type_name || strings.UNKNOWN
                                                : location?.type === 2
                                                    ? strings.WORK
                                                    : strings.HOME}
                                        </Text>
                                        <Image
                                            tintColor={colors.white}
                                            source={imagePath.dropDownSingle}
                                            style={{
                                                width: moderateScale(16),
                                                height: moderateScale(16),
                                                marginLeft: moderateScale(4),
                                            }}
                                        />
                                    </View>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: colors.whiteOpacity85,
                                            fontFamily: fontFamily?.regular,
                                            fontSize: textScale(12),
                                            marginTop: moderateScale(2),
                                        }}>
                                        {location?.address}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (userData?.auth_token) {
                                        navigation.navigate(navigationStrings.ACCOUNTS)
                                    } else {
                                        actions.setAppSessionData('on_login')
                                    }
                                }}
                            >
                                <LinearGradient
                                    colors={[colors.yellowB, colors.white]}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    locations={[0, 1]}
                                    style={{
                                        width: moderateScale(36),
                                        height: moderateScale(36),
                                        borderRadius: moderateScale(20),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: moderateScale(1),
                                        borderColor: colors.yellowC,
                                    }}>
                                    <Text
                                        style={{
                                            color: '#B8860B',
                                            fontSize: textScale(14),
                                            lineHeight: textScale(18),
                                            fontFamily: fontFamily?.bold,
                                            textTransform: 'uppercase',
                                        }}>
                                        {!!userData?.name ? userData?.name?.charAt(0) : 'G'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar Section - Sticky */}
                        <View style={{
                            paddingHorizontal: moderateScale(16),
                            paddingBottom: moderateScale(12),
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                                }
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.greyNew,
                                    borderRadius: moderateScale(10),
                                    paddingHorizontal: moderateScale(16),
                                    paddingVertical: moderateScale(12),
                                }}>
                                <Image
                                    source={imagePath.search1}
                                    style={{
                                        width: moderateScale(20),
                                        height: moderateScale(20),
                                        tintColor: themeColors?.primary_color,
                                        marginRight: moderateScale(12),
                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        flex: 1,
                                        color: colors.textGreyLight,
                                        fontSize: moderateScale(16),
                                        fontFamily: fontFamily?.regular,
                                    }}>
                                    {categoryData?.length > 0
                                        ? `Search '${categoryData[currentCategoryIndex]?.name || 'food'}'`
                                        : 'Search groceries'}
                                </Text>
                                <View
                                    style={{
                                        width: 1,
                                        height: moderateScale(20),
                                        backgroundColor: colors.blackOpacity20,
                                        marginHorizontal: moderateScale(12),
                                    }}
                                />
                                <Image
                                    source={imagePath.icVoice}
                                    style={{
                                        width: moderateScale(20),
                                        height: moderateScale(20),
                                        tintColor: themeColors?.primary_color,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                    }
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.greyNew,
                        borderRadius: moderateScale(10),
                        paddingHorizontal: moderateScale(16),
                        paddingVertical: moderateScale(6),
                        margin: moderateScale(4),
                        shadowColor: colors.black,
                        borderWidth: moderateScale(1),
                        borderColor: colors.borderColorB,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                        elevation: 2,
                    }}>
                    <Image
                        source={imagePath.search1}
                        style={{
                            width: moderateScale(20),
                            height: moderateScale(20),
                            tintColor: colors.redNew,
                            marginRight: moderateScale(12),
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            flex: 1,
                            color: colors.textGreyLight,
                            fontSize: moderateScale(16),
                            fontFamily: fontFamily?.regular,
                        }}>
                        {categoryData?.length > 0
                            ? `Search '${categoryData[0]?.name || 'food'}'`
                            : 'Search groceries'}
                    </Text>
                    {/* Vertical Separator */}
                    <View
                        style={{
                            width: 1,
                            height: moderateScale(20),
                            backgroundColor: colors.blackOpacity20,
                            marginHorizontal: moderateScale(12),
                        }}
                    />

                    {/* Red Microphone Icon */}
                    <TouchableOpacity
                        disabled={true}
                        style={{
                            padding: moderateScale(4),
                        }}>
                        <Image
                            source={imagePath.icVoice}
                            style={{
                                width: moderateScale(20),
                                height: moderateScale(20),
                                tintColor: colors.redNew,
                            }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginTop: height / 3, padding: moderateScaleVertical(24), flex: 1 }}>
                <LottieView
                    source={loaderFour}
                    autoPlay
                    loop
                    style={{ height: moderateScaleVertical(90), width: moderateScale(90) }}
                />
                <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: textScale(14), fontFamily: fontFamily.medium, marginTop: moderateScaleVertical(24), textAlign: 'center' }}>
                    {groceryQuotes[quoteIndex]}
                </Text>
            </View>
        </WrapperContainer>
    );
};

export default React.memo(DashBoardFiveV2ApiLoader);
