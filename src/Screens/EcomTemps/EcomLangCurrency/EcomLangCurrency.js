import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    I18nManager,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDarkMode } from 'react-native-dynamic';
import LinearGradient from 'react-native-linear-gradient';
import RNRestart from 'react-native-restart';
import { useSelector } from 'react-redux';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings, { changeLaguage } from '../../../constants/lang/index';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFunc from '../../../styles/commonStyles';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { setItem } from '../../../utils/utils';
import stylesFunc from './styles';
import SearchBar from '../../../Components/SearchBar';
import { countryJSON } from '../../../constants/constants';
import { Image } from 'react-native';

export default function EcomLangCurrency({ route, navigation }) {
    const {
        currencies,
        appData,
        languages,
        appStyle,
        themeColors,
        themeToggle,
        themeColor,
    } = useSelector((state) => state?.initBoot);

    const { userData } = useSelector((state) => state?.auth);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    console.log("appDataappData", appData)

    const { data = {} } = route?.params || {}

    const [serachText, setSearchText] = useState('')

    const initialState = {
        appCurrencies: appData?.currencies || [],
        appLanguages: appData?.languages || [],
    }

    const [state, setState] = useState({
        isLoading: false,
        ...initialState
    });

    const {
        isLoading,
        appCurrencies,
        appLanguages
    } = state;
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors });
    const commonStyles = commonStylesFunc({ fontFamily });


    const updateCurrency = (item) => {

        return;
        const data = currencies.all_currencies.filter((x) => x.id == item.id)[0];

        if (data.iso_code !== currencies.primary_currency.iso_code) {
            let currenciesData = {
                ...currencies,
                primary_currency: data,
            };
            setItem('setPrimaryCurrent', currenciesData);
            updateState({ isLoading: true });
            setTimeout(() => {
                updateState({ isLoading: false });
                actions.updateCurrency(data);
            }, 1000);
        }
    };

    //Update language
    const updateLanguage = (item) => {
        console.log(item, 'itemmmm');

        return;
        const data = appData.languages.filter((x) => x.id == item.id)[0];
        if (data?.sort_code !== languages.primary_language.sort_code) {
            let languagesData = {
                ...languages,
                primary_language: data,
            };
            setItem('setPrimaryLanguage', languagesData);
            setTimeout(() => {
                updateState({ isLoading: false });
                actions.updateLanguage(data);
                onSubmitLang(data.sort_code, languagesData);
            }, 1000);
        }
    };

    //update language all over the app
    const onSubmitLang = async (lang, languagesData) => {
        if (lang == '') {
            showAlertMessageError(strings.SELECT);
            return;
        } else {
            let btData = {};
            AsyncStorage.getItem('BleDevice').then(async (res) => {
                if (res !== null) {
                    btData = res;
                    await AsyncStorage.setItem('autoConnectEnabled', 'true');
                    await AsyncStorage.setItem('BleDevice2', btData);
                    console.log('++++++22', btData);
                    if (lang === 'ar' || lang === 'he') {
                        I18nManager.forceRTL(true);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    } else {
                        I18nManager.forceRTL(false);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    }
                    BluetoothManager.disconnect(JSON.parse(res).boundAddress).then(
                        (s) => { },
                    );
                } else {
                    if (lang === 'ar' || lang === 'he') {
                        I18nManager.forceRTL(true);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    } else {
                        I18nManager.forceRTL(false);
                        setItem('language', lang);
                        changeLaguage(lang);
                        RNRestart.Restart();
                    }
                }
            });
        }
    };

    const renderLanguage = ({ item }) => {
        console.log("itemitemitem", item)
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: moderateScaleVertical(12)
                }}
                activeOpacity={0.7}
                onPress={() => updateLanguage(item?.language)}
            >
                {/* <Text style={{
              fontSize: textScale(30)
             }} >{(JSON.parse(countryJSON)[`${item?.iso_code.split(0,1)}`])?.emoji}</Text>    */}
                <View>
                    <Text style={{
                        ...commonStyles.mediumFont14,
                        color: isDarkMode ? colors.white : colors.black,
                        textTransform: 'uppercase',
                        marginBottom: moderateScaleVertical(4)
                    }} >{item?.language?.sort_code}</Text>
                    <Text style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode ? colors.white : colors.blackOpacity70,
                        fontFamily: fontFamily.regular
                    }}>{item?.language?.name}</Text>
                </View>
                {appLanguages?.primary_language?.id == item?.id ? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
            </TouchableOpacity>
        )
    }

    const renderCurrency = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: moderateScaleVertical(12)
                }}
                activeOpacity={0.7}
                onPress={() => updateCurrency(item?.currency)}
            >
                {/* <Text style={{
              fontSize: textScale(30)
             }} >{(JSON.parse(countryJSON)[`${item?.iso_code.split(0,1)}`])?.emoji}</Text>    */}
                <View>
                    <Text style={{
                        ...commonStyles.mediumFont14,
                        color: isDarkMode ? colors.white : colors.black,
                        textTransform: 'uppercase',
                        marginBottom: moderateScaleVertical(4)
                    }} >{item?.currency?.iso_code}</Text>
                    <Text style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode ? colors.white : colors.blackOpacity70,
                        fontFamily: fontFamily.regular
                    }}>{item?.currency?.name}</Text>
                </View>
                {item?.is_primary ? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
            </TouchableOpacity>
        )
    }



    function searchObjects(array, searchText) {

        let type = data.type == "language" ? 'language' : 'currency'
        let result = []

        array.filter(function (item) {
            let searchFirstKey = item[`${type}`]?.name
            let searchSecondKey = item[`${type}`]?.sort_code || item[`${type}`]?.iso_code
            if (searchFirstKey?.toLowerCase().includes(searchText.toLowerCase())) {
                result.push(item)
            } else if (searchSecondKey?.toLowerCase().includes(searchText.toLowerCase())) {
                result.push(item)
            }
        });
        return result
    }
    const filterData = (text = '') => {
        console.log("texttext", text)
        setSearchText(text)
        if (data.type == "language") {
            let result = searchObjects(initialState.appLanguages, text)
            console.log("language resultresult", result)
            updateState({ appLanguages: result })
            return;
        } else {
            let result = searchObjects(initialState.appCurrencies, text)
            console.log("currency resultresult", result)
            updateState({ appCurrencies: result })
        }
    }
    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.white}
            source={loaderOne}
            isLoadingB={isLoading}>
            <Header
                leftIcon={
                    appStyle?.homePageLayout === 2
                        ? imagePath.backArrow
                        : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                            ? imagePath.icBackb
                            : imagePath.back
                }
                centerTitle={data.type == "language" ? strings.LANGUAGES : strings.CURRENCIES}
                // rightIcon={imagePath.cartShop}
                headerStyle={
                    isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white }
                }

            />

            <View style={{ ...commonStyles.headerTopLine }} />
            <View style={{
                flex: 1,
                paddingHorizontal: moderateScale(16),
                backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white
            }}>

                <SearchBar
                    containerStyle={{
                        marginVertical: moderateScaleVertical(8),
                        height: moderateScale(38),
                        backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10,
                        borderRadius: moderateScale(8)
                    }}
                    // showRightIcon={false}
                    showVoiceRecord={false}
                    placeholder={`Search ${data.type == "language" ? strings.LANGUAGES : strings.CURRENCIES}`}
                    onChangeText={(text) => filterData(text)}
                    searchValue={serachText}
                />

                <View
                    style={{
                        flex: 1,
                        backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : colors.white

                    }}>

                    {data.type == "language" ?

                        <FlatList
                            data={appLanguages || []}
                            renderItem={renderLanguage}
                        />
                        :
                        <FlatList
                            data={appCurrencies || []}
                            renderItem={renderCurrency}
                            keyExtractor={(item, index) => String(item?.id || index)}
                        />
                    }
                </View>

            </View>
        </WrapperContainer>
    );
}
