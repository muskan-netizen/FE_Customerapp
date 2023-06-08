import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    I18nManager,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import RNRestart from 'react-native-restart';
import { useSelector } from 'react-redux';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import SearchBar from '../../../Components/SearchBar';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings, { changeLaguage } from '../../../constants/lang/index';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFunc from '../../../styles/commonStyles';
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { setItem } from '../../../utils/utils';
import stylesFunc from './styles';
import { countryJSON } from '../../../constants/constants';
import { setCountryFlag } from '../../../redux/actions/home';


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
    const { data = {} } = route?.params || {}

    const { countryFlag } = useSelector((state) => state?.home || {});

    let renderType = data.type == "language" ? strings.LANGUAGES : data.type == 'country' ? strings.COUNTRY : strings.CURRENCIES


    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    console.log("appDataappData", appData)


    const flatListRef = useRef(null)


    const [serachText, setSearchText] = useState('')

    const initialState = {
        appCurrencies: currencies || [],
        appLanguages: languages || [],
    }

    const [state, setState] = useState({
        isLoading: false,
        initialCountries: [],
        ...initialState
    });

    const {
        isLoading,
        appCurrencies,
        appLanguages,
        countries,
        initialCountries
    } = state;
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors });
    const commonStyles = commonStylesFunc({ fontFamily });

    console.log("appLanguagesappLanguages", appLanguages)


    const updateCurrency = (item) => {
        const data = currencies.all_currencies.filter((x) => x.id == item.id)[0];
        if (data.iso_code !== currencies.primary_currency.iso_code) {
            let currenciesData = {
                ...currencies,
                primary_currency: data,
            };
            setItem('setPrimaryCurrent', currenciesData);
            actions.updateCurrency(data);
            updateState({ appCurrencies: currenciesData })
        }
    };

    //Update language
    const updateLanguage = (item) => {
        console.log(item, 'itemmmm');
        const data = languages.all_languages.filter((x) => x.id == item.id)[0];
        // console.log(data, "setLang")
        if (data.sort_code !== languages.primary_language.sort_code) {
            let languagesData = {
                ...languages,
                primary_language: data,
            };
            // updateState({isLoading: true});
            setItem('setPrimaryLanguage', languagesData);
            setTimeout(() => {
                updateState({ isLoading: false });
                actions.updateLanguage(data);
                onSubmitLang(data.sort_code, languagesData);
            }, 1000);
        }
    };

    //update language all over the app
    const onSubmitLang = async (lang) => {
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
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: moderateScaleVertical(12)
                }}
                activeOpacity={0.7}
                onPress={() => updateLanguage(item)}
            >
                <View>
                    <Text style={{
                        ...commonStyles.mediumFont14,
                        color: isDarkMode ? colors.white : colors.black,
                        textTransform: 'uppercase',
                        marginBottom: moderateScaleVertical(4)
                    }} >{item?.sort_code}</Text>
                    <Text style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode ? colors.white : colors.blackOpacity70,
                        fontFamily: fontFamily.regular
                    }}>{item?.name || item?.value}</Text>
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
                onPress={() => updateCurrency(item)}
            >
                <View>
                    <Text style={{
                        ...commonStyles.mediumFont14,
                        color: isDarkMode ? colors.white : colors.black,
                        textTransform: 'uppercase',
                        marginBottom: moderateScaleVertical(4)
                    }} >{item?.iso_code}</Text>
                    <Text style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode ? colors.white : colors.blackOpacity70,
                        fontFamily: fontFamily.regular
                    }}>{item?.name || item?.value}</Text>
                </View>
                {appCurrencies?.primary_currency?.id == item.id ? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
            </TouchableOpacity>
        )
    }



    const searchCountry = (array = [], searchText) => {
        let result = []
        array.filter(function (item) {
            console.log("itemitem", item)
            let searchFirstKey = item.country.name
            if (searchFirstKey?.toLowerCase().includes(searchText.toLowerCase())) {
                result.push(item)
            }
        });
        return result
    }

    const updateCountry = (data) => {
        console.log("data", data)
        setCountryFlag(data?.iso_code)
    }


    const renderCountries = useCallback(({ item, index }) => {
        let data = item?.country
        return (
            <View style={{height: 60}}>
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    marginBottom: moderateScaleVertical(12),
                    justifyContent: 'space-between',

                }}
                activeOpacity={0.7}
                onPress={() => updateCountry(data)}
            >
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <Text style={{
                        fontSize: textScale(30),
                        marginRight: moderateScale(8)
                    }} >{data?.emoji || ''}</Text>
                    <View>
                        <Text style={{
                            ...commonStyles.mediumFont14,
                            color: countryFlag == data?.iso_code ? themeColors?.primary_color : isDarkMode ? colors.white : colors.black,
                        }} >{data?.name}</Text>
                    </View>
                </View>
                {countryFlag == data?.iso_code ? <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.curLangCheck} /> : null}
            </TouchableOpacity>
            </View>
        )
    }, [countryFlag])





    useEffect(() => {
        const jsonObject = JSON.parse(countryJSON);
        const arrayObjects = Object.entries(jsonObject).map(([key, value]) => ({
            country: { ...value, iso_code: key },
        }));
        if (renderType.toLowerCase() == 'country') {
            updateState({ countries: arrayObjects, initialCountries: arrayObjects })

            if (!!flatListRef?.current) {
                // Find the index of the item in the data array
                const index = arrayObjects.findIndex((listItem) => listItem.country.iso_code == countryFlag);
                console.log("indexindex", index)
                if (index >= 0) {
                    setTimeout(() => {
                        flatListRef.current.scrollToIndex({ 
                            index:index,
                            viewPosition: 0.5
                         });
                    }, 700);
                }
            }
        }
    }, [])


    function searchObjects(array, searchText) {

        let type = data.type == "language" ? 'sort_code' : 'iso_code'
        let result = []

        array.filter(function (item) {

            console.log("itemitem", item)
            let searchFirstKey = item[`${type}`]
            let searchSecondKey = item?.value || item?.name
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
        if (renderType.toLowerCase() == "language") {
            let result = searchObjects(initialState.appLanguages.all_languages, text)
            console.log("language resultresult", result)
            updateState({ appLanguages: { ...initialState.appLanguages, all_languages: result } })
            return;
        }

        if (renderType.toLowerCase() == "language") {
            let result = searchObjects(initialState.appCurrencies.all_currencies, text)
            console.log("currency resultresult", result)
            updateState({ appCurrencies: { ...initialState.appCurrencies, all_currencies: result } })
            return
        }

        if (renderType.toLowerCase() == "country") {
            let result = searchCountry(initialCountries, text)
            updateState({ countries: result })
            return
        }

    }



    console.log("renderTyperenderType", renderType.toLowerCase())

 
       

    const getItemLayout = (data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      });
      

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
                centerTitle={renderType}
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
                    placeholder={`Search ${renderType}`}
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

                    {renderType.toLowerCase() == "language" ?
                        <FlatList
                            data={appLanguages?.all_languages || []}
                            extraData={appCurrencies.all_languages}
                            renderItem={renderLanguage}
                            keyExtractor={(item, index) => String(item?.id || index)}

                        />
                        : renderType.toLowerCase() == 'country' ?
                            <FlatList
                                ref={flatListRef}
                                data={countries}
                                extraData={countries}
                                renderItem={renderCountries}
                                keyExtractor={(item, index) => String(item?.id || index)}
                                onScrollToIndexFailed={() => console.log("failed")}
                                getItemLayout={getItemLayout}
                            /> :

                            <FlatList
                                data={appCurrencies?.all_currencies || []}
                                extraData={appCurrencies.all_currencies}
                                renderItem={renderCurrency}
                                keyExtractor={(item, index) => String(item?.id || index)}
                            />
                    }
                </View>

            </View>
        </WrapperContainer>
    );
}
