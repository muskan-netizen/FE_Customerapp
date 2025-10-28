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
import VendorModeHeader from '../../../Components/VendorModeHeader';



const DashBoardFiveV2ApiLoader = ({categoryData = [], selcetedToggle}) => {
    const { themeColor, themeToggle } = useSelector(
        (state) => state?.initBoot,
    );
    const userData = useSelector(state => state?.auth?.userData);
    const { location } = useSelector((state) => state?.home);
    const darkthemeusingDevice = getColorSchema();
    const insets = useSafeAreaInsets();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const navigation = useNavigation();
    // Random engaging quotes and lottie pool
    const foodQuotes = useRef([
        'Good food is the foundation of genuine happiness.',
        'You can’t live a full life on an empty stomach.',
        'First we eat, then we do everything else.',
        'People who love to eat are always the best people.',
        'There is no sincere love than the love of food.',
        'Life is uncertain. Eat dessert first.',
        'Food is symbolic of love when words are inadequate.',
        'Eat well, live simply, laugh often.',
    ]).current;
    const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * foodQuotes.length));

    useEffect(() => {
        const id = setInterval(() => {
            setQuoteIndex(Math.floor(Math.random() * foodQuotes.length));
        }, 5000);
        return () => clearInterval(id);
    }, [foodQuotes.length]);

    return (
        <WrapperContainer bgColor={isDarkMode ? colors.black : colors.white}>
            <VendorModeHeader containerStyle={{ marginHorizontal: moderateScale(16) }} selectedToggle={()=>{}}/>
            <View style={{
                paddingHorizontal: moderateScale(16),
            }}>
                {/* Location Header - Fixed at top, animates out */}
                <View
                    style={[
                        {
                            paddingBottom: moderateScale(12),
                        },
                    ]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Location Section */}
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
                                            tintColor: colors.black,
                                            marginRight: moderateScale(10),
                                        }}
                                        source={imagePath.location1}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: colors.black,
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
                                        tintColor={colors.black}
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
                                        color: colors.blackOpacity43,
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
                                        fontSize: moderateScale(16),
                                        fontFamily: fontFamily?.bold,
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                    }}>
                                    {!!userData?.name ? userData?.name?.charAt(0) : 'G'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
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
                            : 'Search food'}
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
            <View style={{ alignItems: 'center', marginTop: height / 6, padding: moderateScaleVertical(24), flex: 1 }}>
                <LottieView
                    source={loaderFour}
                    autoPlay
                    loop
                    style={{ height: moderateScaleVertical(90), width: moderateScale(90) }}
                />
                <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: textScale(14), fontFamily: fontFamily.medium, marginTop: moderateScaleVertical(24), textAlign: 'center' }}>
                    {foodQuotes[quoteIndex]}
                </Text>
            </View>
        </WrapperContainer>
    );
};

export default React.memo(DashBoardFiveV2ApiLoader);
