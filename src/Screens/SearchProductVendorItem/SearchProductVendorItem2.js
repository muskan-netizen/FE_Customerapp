import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {
  loaderOne,
  searchLoader,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import SearchBar from '../../Components/SearchBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import LottieView from 'lottie-react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MarketCard3 from '../../Components/MarketCard3';
import { setItem } from '../../utils/utils';
import RoundImg from '../../Components/RoundImg';


export default function SearchProductVendorItem2({navigation, route}) {
  const [state, setState] = useState({
    isLoading: true,
    searchInput: '',
    searchData: [],
    showRightIcon: false,
  });
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const previousSearches = useSelector((state) => state?.initBoot?.searchText);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {
    isLoading,
    searchInput,
    searchData,
    showRightIcon,
    recentlySearched,
    trendingNearYou,
  } = state;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);

  //route params
  const paramData = route?.params?.data;
  console.log("param data", paramData)
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onChangeText = (value) => {
    updateState({
      searchInput: value,
      isLoading: false,
    });
  };
  console.log(paramData, 'paramData');
  //Global searching of data
  const globalSearch = () => {
    let data = {};
    data['keyword'] = searchInput;
    let query = '';
    let searchAction = null;
    if (paramData?.type == staticStrings.CATEGORY) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByCategory;
    } else if (paramData?.type == staticStrings.VENDOR) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByVendor;
    } else if (paramData?.type == staticStrings.BRAND) {
      query = `/${paramData.id}`;
      searchAction = actions.onSearchByBrand;
    } else {
      searchAction = actions.onGlobalSearch;
    }
    searchAction(query, data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((response) => {
        updateState({
          searchData: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        updateState({
          searchData: [],
          isLoading: false,
        });
      });
  };

  useEffect(() => {
    if (searchInput != '') {
      updateState({showRightIcon: true});
      globalSearch();
    } else {
      updateState({searchData: [], showRightIcon: false, isLoading: false});
    }
  }, [searchInput]);

  const _onclickSearchItem = (item) => {
    const searchResultExists = previousSearches?.some(
      (recent) => recent.id === item.id,
    );
    if (searchResultExists) {
    } else {
      actions.addSearchResults(item);
      const lastSearch = [...previousSearches, item];
      setItem('searchResult', lastSearch);
    }

    if (item.response_type == 'category') {
      if (item?.type?.redirect_to == staticStrings.VENDOR) {
        navigation.push(navigationStrings.VENDOR, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      } else if (item?.type?.redirect_to == staticStrings.PRODUCT) {
        navigation.push(navigationStrings.PRODUCT_LIST, {
          data: {
            id: item.id,
            name: item.dataname,
          },
        });
      } else {
        moveToNewScreen(navigationStrings.DELIVERY, item)();
      }
    }
    if (item.response_type == 'brand') {
      navigation.push(navigationStrings.BRANDDETAIL, {
        data: {
          id: item.id,
          name: item.dataname,
        },
      });
    }
    if (item.response_type == 'vendor') {
      navigation.push(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          vendor: true,
          name: item.dataname,
        },
      });
    }
    if (item.response_type == 'product') {
      navigation.push(navigationStrings.PRODUCTDETAIL, {data: {id: item.id}});
    }
  };

  const onPressRecommendedVendors = (item) => {
    if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item?.id,
            vendor: true,
            name: item?.name,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const _clearRecentSearches = () => {
    actions.deleteSearchResults();
  };

  const recentlyData = (data) => {
    // console.log(data, 'data');
    return (
      <View
        style={{
          marginVertical: moderateScaleVertical(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}>
          {data && data.length
            ? data.map((item, index) => {
                console.log(item, 'itemitem');
                return (
                  <View>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        borderColor: colors.textGreyB,
                        borderWidth: 0.5,
                        borderRadius: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: moderateScale(5),
                        paddingHorizontal: moderateScale(5),
                        paddingVertical: moderateScaleVertical(7),
                        marginVertical: moderateScaleVertical(5),
                      }}
                      onPress={() => _onclickSearchItem(item)}
                      key={index}>
                      <View>
                        <Image
                          style={
                            isDarkMode
                              ? {
                                  tintColor: MyDarkTheme.colors.text,
                                  opacity: 0.7,
                                  marginHorizontal: moderateScale(5),
                                }
                              : {
                                  opacity: 0.7,
                                  marginHorizontal: moderateScale(5),
                                }
                          }
                          source={imagePath.recently_search}
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: fontFamily.medium,
                            color: colors.greyLight,
                          }}>
                          {item.dataname}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    );
  };

  const renderProduct = ({item}) => {
    console.log(item, 'itemitem');
    return (
      <TouchableOpacity
        onPress={() => _onclickSearchItem(item)}
        style={{ flex: 1, flexDirection: 'row', alignItems:'center' }}>

        <RoundImg
          img={'https://image.freepik.com/free-vector/burger-logo_18228-1173.jpg'}
          size={35}
          isDarkMode={isDarkMode}
          MyDarkTheme={MyDarkTheme}
        />
        <View style={{ marginLeft: moderateScale(12) }}>
          <Text
            style={{
              fontSize: textScale(10),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {item.dataname || item.title}
          </Text>
          <Text
            style={{
              fontSize: textScale(9),
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.grayOpacity51,
              marginTop:moderateScaleVertical(5)
            }}>
            Dish
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendedVendors = ({item}) => {
    return (
      <View
        style={{
          width: moderateScale(width / 2),
          marginHorizontal: moderateScale(10),
        }}>
        <MarketCard3
          data={item}
          onPress={() => onPressCategory(item)}
          fastImageStyle={{
            height: moderateScaleVertical(110),
          }}
          imageResizeMode="contain"
          onPress={() => onPressRecommendedVendors(item)}
        />
      </View>
    );
  };

  const _listEmptyComponent = () => {
    return (
      <View>
        {searchInput ? null : (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                width: width - 16,
              }}>
              {previousSearches?.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width - 16,
                  }}>
                  <Text
                    style={{
                      fontSize: textScale(16),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {strings.RECENTLY_SEARCH}
                  </Text>
                  <TouchableOpacity onPress={() => _clearRecentSearches()}>
                    <Text
                      style={{
                        paddingHorizontal: moderateScale(30),
                        fontSize: textScale(12),
                        fontFamily: fontFamily.regular,
                        color: themeColors.primary_color,
                      }}>
                      {strings.CLEAR}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View>{recentlyData(previousSearches)}</View>
            <View>
              <Text
                style={{
                  fontSize: textScale(16),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.RECOMMENDED_FOR_YOU}
              </Text>


              <FlatList
                horizontal
                data={recommendedVendorsdata}
                renderItem={renderRecommendedVendors}
                keyExtractor={(item, index) => item?.id.toString()}
                keyboardShouldPersistTaps="always"
                showsHorizontalScrollIndicator={false}
                style={{
                  flex: 1,
                  marginVertical: moderateScaleVertical(10),

                  // backgroundColor: 'black',
                }}
                ListEmptyComponent={_listEmptyComponent}
                ItemSeparatorComponent={() => <View style={{ height: 30 }} />}

              />
            </View>
          </>
        )}
      </View>
    );
  };
  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: moderateScale(8),
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              flex: 0.1,
            }}
            hitSlop={hitSlopProp}>
            <Image
              source={
                appStyle?.homePageLayout === 3
                  ? imagePath.icBackb
                  : imagePath.back
              }
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            />
          </TouchableOpacity>

          <SearchBar
            containerStyle={{
              marginHorizontal: moderateScale(18),
              borderRadius: 8,
              width: width / 1.2,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              height: moderateScaleVertical(37),
            }}
            searchValue={searchInput}
            placeholder={strings.SEARCH_PRODUCT_VENDOR_ITEM}
            onChangeText={(value) => onChangeText(value)}
            showRightIcon={showRightIcon}
            rightIconPress={() =>
              updateState({searchInput: '', isLoading: false})
            }
          />
        </View>

        <FlatList
          data={searchData}
          renderItem={renderProduct}
          keyExtractor={(item, index) => String(index)}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginVertical: moderateScaleVertical(10),
            marginHorizontal: moderateScale(20),
            // backgroundColor: 'black',
          }}
          ListEmptyComponent={_listEmptyComponent}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          ListHeaderComponent={() => <View style={{ height: moderateScale(16) }} />}
        />
      </View>
    </WrapperContainer>
  );
}
