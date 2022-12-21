// import {useScrollToTop} from '@react-navigation/native';
// import _, {isEmpty} from 'lodash';
// import React, {useEffect, useState} from 'react';
// import {
//   FlatList,
//   Image,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   Text,
//   View,
//   TouchableOpacity,
// } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import {useDarkMode} from 'react-native-dark-mode';
// import DashedLine from 'react-native-dashed-line';
// import DeviceInfo, {getBundleId} from 'react-native-device-info';
// import RNExitApp from 'react-native-exit-app';
// import FastImage from 'react-native-fast-image';
// import {
//   Menu,
//   MenuOption,
//   MenuOptions,
//   MenuTrigger,
// } from 'react-native-popup-menu';
// import Carousel from 'react-native-snap-carousel';
// import {SvgUri} from 'react-native-svg';
// import {useSelector} from 'react-redux';
// import GradientButton from '../../../Components/GradientButton';
// import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
// import LaundryCategoryCard from '../../../Components/LaundryCategoryCard';
// import BannerLoader from '../../../Components/Loaders/BannerLoader';
// import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
// import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
// import MarketCard3 from '../../../Components/MarketCard3';
// import ProductsComp from '../../../Components/ProductsComp';
// import SubscriptionModal from '../../../Components/SubscriptionModal';
// import imagePath from '../../../constants/imagePath';
// import strings from '../../../constants/lang';
// import staticStrings from '../../../constants/staticStrings';
// import navigationStrings from '../../../navigation/navigationStrings';
// import colors from '../../../styles/colors';
// import LeftRightText from '../../../Components/LeftRightText';
// import {
//   height,
//   moderateScale,
//   moderateScaleVertical,
//   textScale,
//   width,
// } from '../../../styles/responsiveSize';
// import {MyDarkTheme} from '../../../styles/theme';
// import {appIds} from '../../../utils/constants/DynamicAppKeys';
// import {
//   getColorCodeWithOpactiyNumber,
//   getImageUrl,
// } from '../../../utils/helperFunctions';
// import {getItem, setItem} from '../../../utils/utils';
// import stylesFunc from '../styles';

// export default function DashBoardTen({
//   handleRefresh = () => {},
//   bannerPress = () => {},
//   isLoading = true,
//   isRefreshing = false,
//   onPressCategory = () => {},
//   navigation = {},
//   toggleData = {},
//   onVendorFilterSeletion = () => {},
//   tempCartData = null,
//   onPressVendor = () => {},
//   onPressAddLaundryItem = () => {},
//   isLoadingAddons = false,
//   selectedHomeCategory = {},
//   onClose = () => {},
//   onPressSubscribe = () => {},
//   isSubscription = false,
// }) {
//   const {appData, themeColors, appStyle, themeColor, themeToggle} = useSelector(
//     (state) => state?.initBoot,
//   );
//   const userData = useSelector((state) => state?.auth?.userData);

//   const darkthemeusingDevice = useDarkMode();
//   const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
//   const appMainData = useSelector((state) => state?.home?.appMainData);
//   let businessType = appData?.profile?.preferences?.business_type || null;
//   const allCategory = appMainData?.categories;
//   const checkForBrand =
//     allCategory &&
//     allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);

//   const isGetEstimation = appData?.profile?.preferences?.get_estimations;

//   const [isConfirmAgeModal, setIsConfirmAgeModal] = useState(true);
//   const [state, setState] = useState({
//     slider1ActiveSlide: 0,
//     newCategoryData: [],
//     isVendorColumnList: false,
//     vendorsData: [],
//     showMenu: false,
//     currSelectedFilter: null,
//     categoriesData: [],
//     seeMore: false,
//     isExpendBrands: true,
//   });

//   const {
//     slider1ActiveSlide,
//     vendorsData,
//     showMenu,
//     categoriesData,
//     seeMore,
//     isExpendBrands,
//   } = state;

//   const fontFamily = appStyle?.fontSizeData;
//   const styles = stylesFunc({themeColors, fontFamily});
//   console.log(appMainData, 'appMainDataappMainData');
//   //update state
//   const updateState = (data) => setState((state) => ({...state, ...data}));

//   useEffect(() => {
//     if (appMainData?.vendors && !isEmpty(appMainData?.vendors)) {
//       updateState({
//         vendorsData: _.values(appMainData?.vendors),
//       });
//       return;
//     }
//     updateState({
//       vendorsData: [],
//     });
//   }, [appMainData?.vendors]);
//   useEffect(() => {
//     if (!isEmpty(appMainData?.categories)) {
//       updateState({
//         categoriesData: appMainData?.categories,
//       });
//       return;
//     }
//     updateState({
//       categoriesData: [],
//     });
//   }, [appMainData?.categories]);

//   const {currSelectedFilter} = state;

//   const onViewAllData = (type, data) => {
//     updateState({
//       isExpendBrands: !isExpendBrands,
//     });
//   };

//   const onSelectedFilter = (selectedFilter) => {
//     updateState({showMenu: false, currSelectedFilter: selectedFilter});
//     onVendorFilterSeletion(selectedFilter);
//   };

//   const homeAllFilters = () => {
//     let homeFilter = [
//       {id: 1, type: strings.OPEN},
//       {id: 2, type: strings.CLOSE},
//       {id: 3, type: strings.BESTSELLER},
//     ];

//     return homeFilter;
//   };

//   const OnTakeMeOut = () => {
//     RNExitApp.exitApp();
//   };

//   const checkAgeModalPermission = async () => {
//     try {
//       const getIsUserCofirmedAgeModal = await getItem(
//         'isUserConfirmedAgeModal',
//       );
//       if (
//         getIsUserCofirmedAgeModal !== null &&
//         !!(userData && userData?.auth_token)
//       ) {
//         setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
//       } else {
//         setIsConfirmAgeModal(true);
//       }
//     } catch (error) {
//       console.log(error, 'error');
//     }
//   };

//   useEffect(() => {
//     checkAgeModalPermission();
//   }, []);

//   const onConfirmAge = async (userPermission) => {
//     try {
//       const getIsUserCofirmedAgeModal = await getItem(
//         'isUserConfirmedAgeModal',
//       );
//       console.log(getIsUserCofirmedAgeModal, 'checkkk');
//       if (
//         getIsUserCofirmedAgeModal !== null &&
//         !!(userData && userData?.auth_token)
//       ) {
//         setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
//       } else {
//         setIsConfirmAgeModal(false);
//         if (!!(userData && userData?.auth_token)) {
//           await setItem('isUserConfirmedAgeModal', userPermission);
//         }
//       }
//     } catch (error) {
//       console.log(error, 'error');
//     }
//   };
//   const _renderItem = ({item, index}) => {
//     return (
//       <View
//         style={{
//           width: 'auto',
//         }}>
//         <TouchableOpacity
//           activeOpacity={0.7}
//           style={{
//             flex: 1,
//             backgroundColor: !!themeColor ? colors.whiteOpacity15 : '#EFEFEF',
//             borderRadius: moderateScale(12),
//             height: moderateScale(100),
//             width: width / 3.5,
//             marginHorizontal: moderateScale(4),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//           onPress={() => onPressCategory(item)}>
//           <FastImage
//             source={{
//               uri: getImageUrl(
//                 item?.icon?.image_fit,
//                 item?.icon?.image_path,
//                 '200/200',
//               ),
//             }}
//             style={{
//               height: moderateScale(50),
//               width: moderateScale(50),
//             }}
//           />
//           <Text
//             style={{
//               fontFamily: fontFamily.regular,
//               marginTop: moderateScaleVertical(10),
//               color: themeColor ? colors.white : colors.black,
//               textAlign: 'center',
//             }}>
//             {item?.name || (item?.translation && item?.translation[0]?.name)}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const seeMoreCategories = () => {
//     updateState({
//       categoriesData: !seeMore
//         ? appMainData?.categories
//         : appMainData?.categories.filter((item, indx) => indx < 8),
//       seeMore: !seeMore,
//     });
//   };

//   const renderBanners = ({item}) => {
//     const imageUrl = getImageUrl(
//       item.image.image_fit,
//       item.image.image_path,
//       DeviceInfo.getBundleId() == appIds.masa ? '800/600' : '400/600',
//     );
//     return (
//       <TouchableOpacity
//         style={{flex: 1}}
//         activeOpacity={0.8}
//         onPress={() => bannerPress(item)}>
//         <FastImage
//           source={{
//             uri: imageUrl,
//             priority: FastImage.priority.high,
//             cache: FastImage.cacheControl.immutable,
//           }}
//           style={{
//             width: width / 1.1,
//             height: height / 6,
//             borderRadius: moderateScale(16),
//           }}
//           resizeMode={FastImage.resizeMode.cover}
//         />
//       </TouchableOpacity>
//     );
//   };

//   const renderLaundryBanners = ({item}) => {
//     const imageUrl = getImageUrl(
//       item?.image?.image_fit,
//       item?.image?.image_path,
//       '400/600',
//     );

//     return (
//       <TouchableOpacity activeOpacity={0.8} onPress={() => bannerPress(item)}>
//         <FastImage
//           source={{
//             uri: imageUrl,
//             priority: FastImage.priority.high,
//             cache: FastImage.cacheControl.immutable,
//           }}
//           style={{
//             height: moderateScaleVertical(160),
//             width: width - moderateScale(50),
//             borderRadius: moderateScale(16),
//           }}
//           resizeMode={FastImage.resizeMode.cover}
//         />
//       </TouchableOpacity>
//     );
//   };

//   const categoriesBanners = () => {
//     return (
//       <View style={{}}>
//         <View
//           style={{
//             paddingLeft: moderateScale(17),
//           }}>
//           {!isEmpty(appData?.mobile_banners) && (
//             <Carousel
//               autoplay={true}
//               loop={true}
//               autoplayInterval={2000}
//               data={appMainData?.mobile_banners || appData?.mobile_banners}
//               renderItem={renderBanners}
//               sliderWidth={width}
//               itemWidth={width}
//             />
//           )}
//         </View>
//         {appMainData &&
//           appMainData?.categories &&
//           !!appMainData?.categories?.length && (
//             <View
//               style={{
//                 flex: 1,
//                 marginVertical: moderateScaleVertical(16),
//                 marginHorizontal: moderateScale(16),
//               }}>
//               <View
//                 style={{
//                   flex: 1,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginVertical: moderateScale(12),
//                 }}>
//                 <Text
//                   style={{
//                     color: !!isDarkMode ? colors.white : colors.black,
//                     fontSize: 20,
//                     fontFamily: fontFamily.medium,
//                   }}>
//                   Top Categories
//                 </Text>
//                 {categoriesData?.length > 9 && (
//                   <TouchableOpacity activeOpacity={0.7} onPress={onViewAllData}>
//                     <Text
//                       style={{
//                         color: colors.orange,
//                         fontFamily: fontFamily.medium,
//                       }}>
//                       {isExpendBrands ? 'View all' : 'View less'}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//               <FlatList
//                 key={'6'}
//                 data={
//                   isExpendBrands ? categoriesData.slice(0, 9) : categoriesData
//                 }
//                 keyExtractor={(item) => item?.id?.toString()}
//                 showsHorizontalScrollIndicator={false}
//                 numColumns={3}
//                 renderItem={_renderItem}
//                 ItemSeparatorComponent={() => (
//                   <View style={{marginTop: moderateScale(24)}} />
//                 )}
//                 ListHeaderComponent={() => (
//                   <View style={{marginLeft: moderateScale(12)}} />
//                 )}
//                 ListFooterComponent={() => (
//                   <View style={{marginRight: moderateScale(12)}} />
//                 )}
//               />
//             </View>
//           )}
//       </View>
//     );
//   };

//   const moveToNewScreen =
//     (screenName, data = {}) =>
//     () => {
//       navigation.navigate(screenName, {data});
//     };
//   const renderBrands = ({item}) => {
//     // const imageUrl = getImageUrl(item.image.proxy_url, item.image.image_path, '800/600');
//     const imageURI = getImageUrl(
//       item.image.proxy_url,
//       item.image.image_path,
//       '800/600',
//     );
//     const isSVG = imageURI ? imageURI.includes('.svg') : null;
//     return (
//       <View
//         style={{
//           flex: 1,
//         }}>
//         <TouchableOpacity
//           activeOpacity={0.7}
//           style={{
//             flex: 1,

//             alignItems: 'center',
//           }}></TouchableOpacity>
//         <View style={{marginLeft: 8}}>
//           <Text
//             style={{
//               fontFamily: fontFamily.regular,
//               marginVertical: 6,

//               color: !!themeColor ? colors.white : colors.black,
//             }}>
//             Tata Tiago
//           </Text>
//           <LeftRightText
//             leftTextStyle={{
//               color: !!isDarkMode ? colors.white : colors.black,
//             }}
//             rightTextStyle={{
//               color: colors.orange,
//             }}
//             leftText={'AED 1,900,0'}
//           />
//         </View>
//       </View>
//     );
//   };

//   const onViewAll = (type, data) => {
//     console.log(data, 'type+++++', type);
//     navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
//       data: data,
//       type: type,
//     });
//   };

//   const listHeader = (type, data = [], isViewAll = false) => {
//     return (
//       <View style={styles.viewAllVeiw}>
//         <Text
//           style={{
//             ...styles.exploreStoresTxt,
//             color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
//             marginTop: 0,
//           }}>
//           {type}
//         </Text>

//         {!!isViewAll && !!vendorsData && vendorsData.length > 1 && (
//           <TouchableOpacity onPress={() => onViewAll(type, data)}>
//             <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderFeaturedProducts = ({item}) => {
//     return (
//       <View
//         style={{
//           flex: 1,
//         }}>
//         <TouchableOpacity
//           activeOpacity={0.7}
//           style={{
//             flex: 1,

//             alignItems: 'center',
//           }}>
//           <FastImage
//             source={imagePath.nature}
//             style={{
//               width: width / 2.3,
//               height: 120,
//               borderRadius: 8,
//             }}
//           />
//         </TouchableOpacity>
//         <View style={{marginLeft: 8}}>
//           <Text
//             style={{
//               fontFamily: fontFamily.regular,
//               marginVertical: 6,

//               color: !!themeColor ? colors.white : colors.black,
//             }}>
//             Tata Tiago
//           </Text>
//           <LeftRightText
//             leftTextStyle={{
//               color: !!isDarkMode ? colors.white : colors.black,
//             }}
//             rightTextStyle={{
//               color: colors.orange,
//             }}
//             leftText={'AED 1,900,0'}
//           />
//         </View>
//       </View>
//     );
//   };

//   const renderSale = ({item}) => {
//     return (
//       <ProductsComp
//         // isDiscount
//         item={item}
//         imageStyle={{height: moderateScale(186)}}
//         onPress={() =>
//           navigation.navigate(navigationStrings.PRODUCTDETAIL, {data: item})
//         }
//       />
//     );
//   };

//   const scrollRef = React.useRef(null);
//   useScrollToTop(scrollRef);

//   if (isLoading) {
//     return (
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{flexGrow: 1}}>
//         {!!isGetEstimation ? (
//           <BannerLoader />
//         ) : (
//           <CategoryLoader2 viewStyles={{marginVertical: moderateScale(16)}} />
//         )}

//         {!!isGetEstimation && (
//           <View>
//             <HeaderLoader
//               widthLeft={moderateScale(180)}
//               rectWidthLeft={moderateScale(180)}
//               rectHeightLeft={moderateScaleVertical(60)}
//               isRight={false}
//               rx={4}
//               ry={4}
//               viewStyles={{
//                 marginVertical: moderateScale(20),
//               }}
//             />
//             <BannerLoader homeLoaderHeight={moderateScaleVertical(80)} />
//             <BannerLoader
//               viewStyles={{marginTop: moderateScale(8)}}
//               homeLoaderHeight={moderateScaleVertical(80)}
//             />
//             <BannerLoader
//               viewStyles={{marginTop: moderateScale(8)}}
//               homeLoaderHeight={moderateScaleVertical(80)}
//             />
//             <BannerLoader
//               viewStyles={{
//                 marginTop: moderateScale(8),
//                 marginBottom: moderateScale(20),
//               }}
//               homeLoaderHeight={moderateScaleVertical(80)}
//             />
//           </View>
//         )}

//         <View style={{flexDirection: 'row'}}>
//           <HeaderLoader
//             viewStyles={{
//               marginTop: moderateScaleVertical(8),
//               marginBottom: moderateScaleVertical(16),
//             }}
//             widthLeft={moderateScale(150)}
//             rectWidthLeft={moderateScale(150)}
//             heightLeft={moderateScaleVertical(240)}
//             rectHeightLeft={moderateScaleVertical(240)}
//             isRight={false}
//             rx={15}
//             ry={15}
//           />
//           <HeaderLoader
//             viewStyles={{
//               marginTop: moderateScaleVertical(8),
//               marginBottom: moderateScaleVertical(16),
//             }}
//             widthLeft={moderateScale(150)}
//             rectWidthLeft={moderateScale(150)}
//             heightLeft={moderateScaleVertical(240)}
//             rectHeightLeft={moderateScaleVertical(240)}
//             isRight={false}
//             rx={15}
//             ry={15}
//           />
//           <HeaderLoader
//             viewStyles={{
//               marginTop: moderateScaleVertical(8),
//               marginBottom: moderateScaleVertical(16),
//             }}
//             widthLeft={moderateScale(150)}
//             rectWidthLeft={moderateScale(150)}
//             heightLeft={moderateScaleVertical(240)}
//             rectHeightLeft={moderateScaleVertical(240)}
//             isRight={false}
//             rx={15}
//             ry={15}
//           />
//         </View>

//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <HeaderLoader
//             widthLeft={moderateScale(180)}
//             rectWidthLeft={moderateScale(180)}
//             rectHeightLeft={moderateScaleVertical(60)}
//             isRight={false}
//             rx={4}
//             ry={4}
//           />
//           <HeaderLoader
//             widthLeft={moderateScale(100)}
//             rectWidthLeft={moderateScale(100)}
//             rectHeightLeft={moderateScaleVertical(60)}
//             isRight={false}
//             rx={4}
//             ry={4}
//           />
//         </View>

//         <BannerLoader
//           // isVendorLoader
//           viewStyles={{marginTop: moderateScale(12)}}
//         />
//         <BannerLoader
//           // isVendorLoader
//           viewStyles={{marginTop: moderateScale(12)}}
//         />
//         <BannerLoader
//           // isVendorLoader
//           viewStyles={{marginTop: moderateScale(12)}}
//         />
//       </ScrollView>
//     );
//   }

//   const vendorHeader = () => {
//     if (appData?.profile?.preferences?.single_vendor) {
//       return (
//         <View
//           style={{
//             marginBottom: moderateScaleVertical(24),
//             marginTop: moderateScaleVertical(8),
//           }}
//         />
//       );
//     }
//     return (
//       <View
//         key={Math.random()}
//         style={{
//           marginBottom:
//             getBundleId() == appIds.muvpod ? moderateScaleVertical(10) : 0,
//         }}>
//         {getBundleId() == appIds.muvpod ? null : (
//           <View style={{...styles.viewAllVeiw}}>
//             <Text
//               numberOfLines={1}
//               style={{
//                 ...styles.exploreStoresTxt,
//                 color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
//                 marginTop: 0,
//                 flex: 1,
//               }}>
//               {getBundleId() == appIds.quickLube
//                 ? vendorsData.length > 1
//                   ? `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`
//                   : strings.BOOK_HERE
//                 : `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
//               {/* {strings.EXPLORE_STORES}{' '}
//             {appData?.profile?.preferences?.vendors_nomenclature} */}
//             </Text>

//             {!!vendorsData && vendorsData.length > 1 && (
//               <TouchableOpacity
//                 style={{marginHorizontal: moderateScale(4)}}
//                 onPress={() => onViewAll('vendor', appMainData.vendors)}>
//                 <Text
//                   style={{
//                     ...styles.viewAllText,
//                     color: isDarkMode
//                       ? MyDarkTheme.colors.text
//                       : themeColors.primary_color,
//                   }}>
//                   {strings.VIEW_ALL}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             <Menu style={{alignSelf: 'flex-end'}}>
//               <MenuTrigger>
//                 <View style={styles.menuView}>
//                   <FastImage
//                     style={{
//                       height: moderateScaleVertical(16),
//                       width: moderateScale(16),
//                       tintColor: isDarkMode
//                         ? MyDarkTheme.colors.text
//                         : colors.black,
//                     }}
//                     resizeMode="contain"
//                     source={imagePath.sort}
//                   />
//                   <Text
//                     style={{
//                       fontSize: textScale(12),
//                       marginHorizontal: moderateScale(5),
//                       fontFamily: fontFamily.regular,
//                       color: isDarkMode
//                         ? MyDarkTheme.colors.text
//                         : colors.black,
//                     }}>
//                     {!currSelectedFilter
//                       ? strings.RELEVANCE
//                       : currSelectedFilter?.type}
//                   </Text>
//                 </View>
//               </MenuTrigger>
//               <MenuOptions
//                 customStyles={{
//                   optionsContainer: {
//                     marginTop: moderateScaleVertical(36),
//                     width: moderateScale(100),
//                   },
//                 }}>
//                 {homeAllFilters()?.map((item, index) => {
//                   return (
//                     <View key={index}>
//                       <MenuOption
//                         onSelect={() => onSelectedFilter(item)}
//                         key={String(index)}
//                         text={item?.type}
//                         style={{
//                           marginVertical: moderateScaleVertical(5),
//                         }}
//                       />
//                       <View
//                         style={{
//                           borderBottomWidth: 1,
//                           borderBottomColor: colors.greyColor,
//                         }}
//                       />
//                     </View>
//                   );
//                 })}
//               </MenuOptions>
//             </Menu>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const onPressViewEditAndReplace = (item) => {
//     navigation.navigate(navigationStrings.ORDER_DETAIL, {
//       orderId: item?.vendors[0].order_id,
//       // fromVendorApp: true,
//       orderDetail: {
//         dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
//       },
//       selectedVendor: {id: item?.vendors[0].vendor_id},
//     });
//   };

//   const showAllTempCartOrders = () => {
//     return (
//       <View>
//         {tempCartData && tempCartData.length
//           ? tempCartData.map((item, index) => {
//               return (
//                 <TouchableOpacity
//                   onPress={() => onPressViewEditAndReplace(item)}
//                   style={{
//                     padding: moderateScale(8),
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     // alignItems: 'center',
//                     backgroundColor: getColorCodeWithOpactiyNumber(
//                       themeColors?.primary_color.substr(1),
//                       20,
//                     ),
//                     marginHorizontal: moderateScale(15),
//                     marginTop: moderateScale(15),
//                     borderRadius: moderateScale(5),
//                     borderWidth: moderateScale(0.5),
//                     borderColor: themeColors?.primary_color,
//                   }}>
//                   <View style={{flex: 0.7}}>
//                     <Text
//                       style={{
//                         fontSize: textScale(12),
//                         fontFamily: fontFamily.medium,
//                       }}>
//                       {strings.YOURDRIVERHASMODIFIED}
//                     </Text>
//                     <Text
//                       style={{
//                         fontSize: textScale(12),
//                         paddingTop: moderateScale(5),
//                         fontFamily: fontFamily.bold,
//                       }}>
//                       {strings.VIEW_DETAIL}
//                     </Text>
//                   </View>
//                   <View style={{flex: 0.3, alignItems: 'flex-end'}}>
//                     <Text
//                       style={{
//                         fontSize: textScale(14),
//                         fontFamily: fontFamily.medium,
//                       }}>{`#${item?.order_number}`}</Text>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })
//           : null}
//       </View>
//     );
//   };

//   const _renderLaundryItem = ({item, index}) => {
//     return (
//       <LaundryCategoryCard
//         data={item}
//         onPress={() => onPressAddLaundryItem(item)}
//         isLoading={
//           selectedHomeCategory?.id == item?.id ? isLoadingAddons : false
//         }
//       />
//     );
//   };

//   const laundryCategoriesBanners = () => {
//     return (
//       <View>
//         {!!appData?.mobile_banners?.length && (
//           <View
//             style={{
//               marginTop: moderateScaleVertical(4),
//             }}>
//             <FlatList
//               horizontal
//               data={appData?.mobile_banners}
//               keyExtractor={(item) => item?.id?.toString()}
//               showsHorizontalScrollIndicator={false}
//               renderItem={renderLaundryBanners}
//               ItemSeparatorComponent={() => (
//                 <View style={{marginRight: moderateScale(12)}} />
//               )}
//               ListHeaderComponent={() => (
//                 <View style={{marginLeft: moderateScale(16)}} />
//               )}
//               ListFooterComponent={() => (
//                 <View style={{marginRight: moderateScale(16)}} />
//               )}
//             />
//           </View>
//         )}

//         {!isEmpty(appMainData?.categories) && (
//           <View style={{marginBottom: moderateScaleVertical(16)}}>
//             <Text
//               style={{
//                 ...styles.exploreStoresTxt,
//                 marginLeft: moderateScale(15),
//                 marginVertical: moderateScale(20),
//               }}>
//               Select Service
//             </Text>

//             <FlatList
//               key={'6'}
//               data={categoriesData}
//               keyExtractor={(item) => item?.id?.toString()}
//               showsHorizontalScrollIndicator={false}
//               renderItem={_renderLaundryItem}
//               contentContainerStyle={{
//                 paddingHorizontal: moderateScale(15),
//               }}
//               ItemSeparatorComponent={() => (
//                 <View style={{marginTop: moderateScale(10)}} />
//               )}
//               ListHeaderComponent={() => (
//                 <View style={{marginLeft: moderateScale(12)}} />
//               )}
//             />
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={{flex: 1}}>
//       <ScrollView
//         ref={scrollRef}
//         showsVerticalScrollIndicator={false}
//         style={{flex: 1}}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={handleRefresh}
//             tintColor={themeColors.primary_color}
//           />
//         }>
//         {showAllTempCartOrders()}
//         <Animatable.View animation={'fadeInUp'} delay={200}>
//           {!!isGetEstimation ? laundryCategoriesBanners() : categoriesBanners()}
//           {
//             <>
//               {/* <FlatList
//                 scrollEnabled={false}
//                 ListHeaderComponent={vendorHeader()}
//                 showsVerticalScrollIndicator={false}
//                 alwaysBounceVertical={true}
//                 // ref={ref}
//                 data={vendorsData}
//                 keyExtractor={(item) => item?.id?.toString()}
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={_renderVendors}
//                 ListEmptyComponent={() => (
//                   <View>
//                     <FastImage
//                       source={imagePath.noDataFound}
//                       resizeMode="contain"
//                       style={{
//                         width: moderateScale(140),
//                         height: moderateScale(140),
//                         alignSelf: 'center',
//                         marginTop: moderateScaleVertical(30),
//                       }}
//                     />
//                     <Text
//                       style={{
//                         textAlign: 'center',
//                         fontSize: textScale(11),
//                         fontFamily: fontFamily.regular,
//                         marginHorizontal: moderateScale(10),
//                         lineHeight: moderateScale(20),
//                         marginTop: moderateScale(5),
//                       }}>
//                       {businessType == 'home_service'
//                         ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
//                         : `${strings.SORRY_MSG}`}
//                     </Text>
//                   </View>
//                 )}
//                 ItemSeparatorComponent={() => (
//                   <View style={{height: moderateScale(10)}} />
//                 )}
//               /> */}

//               {checkForBrand && (
//                 <View style={{}}>
//                   {appMainData &&
//                     appMainData?.brands &&
//                     !!appMainData?.brands.length && (
//                       <>
//                         <View
//                           style={{
//                             flex: 1,
//                             marginVertical: moderateScaleVertical(16),
//                             marginHorizontal: moderateScale(16),
//                           }}>
//                           <LeftRightText
//                             leftText={'Top Sales'}
//                             // rightText={'View all'}
//                             leftTextStyle={{
//                               color: !!isDarkMode ? colors.white : colors.black,
//                               fontSize: 20,
//                               fontFamily: fontFamily.medium,
//                             }}
//                             rightTextStyle={{
//                               color: colors.orange,
//                               fontFamily: fontFamily.medium,
//                             }}
//                           />
//                           <FlatList
//                             // showsHorizontalScrollIndicator={false}
//                             // horizontal
//                             data={appMainData?.brands}
//                             renderItem={renderBrands}
//                             keyExtractor={(item) => item?.id?.toString()}
//                             ItemSeparatorComponent={() => (
//                               <View style={{marginRight: moderateScale(12)}} />
//                             )}
//                             ListHeaderComponent={() => (
//                               <View style={{marginLeft: moderateScale(16)}} />
//                             )}
//                             ListFooterComponent={() => (
//                               <View style={{marginRight: moderateScale(16)}} />
//                             )}
//                             numColumns={2}
//                           />
//                         </View>
//                       </>
//                     )}
//                 </View>
//               )}
//             </>
//           }

//           {businessType !== 'laundry' && (
//             <View style={{}}>
//               {appMainData &&
//                 appMainData?.featured_products &&
//                 !!appMainData?.featured_products.length && (
//                   <>
//                     <View
//                       style={{
//                         flex: 1,
//                         marginVertical: moderateScaleVertical(16),
//                         marginHorizontal: moderateScale(16),
//                       }}>
//                       <LeftRightText
//                         leftText={'Previous Searches'}
//                         // rightText={'View all'}
//                         leftTextStyle={{
//                           color: !!isDarkMode ? colors.white : colors.black,
//                           fontSize: 20,
//                           fontFamily: fontFamily.medium,
//                         }}
//                         rightTextStyle={{
//                           color: colors.orange,
//                           fontFamily: fontFamily.medium,
//                         }}
//                       />
//                       <FlatList
//                         // showsHorizontalScrollIndicator={false}
//                         // horizontal

//                         data={appMainData?.featured_products}
//                         renderItem={renderFeaturedProducts}
//                         keyExtractor={(item) => item?.id?.toString()}
//                         ItemSeparatorComponent={() => (
//                           <View style={{marginRight: moderateScale(16)}} />
//                         )}
//                         ListHeaderComponent={() => (
//                           <View style={{marginLeft: moderateScale(16)}} />
//                         )}
//                         ListFooterComponent={() => (
//                           <View style={{marginRight: moderateScale(16)}} />
//                         )}
//                         numColumns={2}
//                       />
//                     </View>
//                   </>
//                 )}
//             </View>
//           )}

//           {/* {businessType !== 'laundry' &&
//             appIds.orderchekout != DeviceInfo.getBundleId() && (
//               <View style={{}}>
//                 {appMainData &&
//                   appMainData?.new_products &&
//                   !!appMainData?.new_products.length && (
//                     <>
//                       <View>{listHeader(strings.NEW_PRODUCTS)}</View>
//                       <FlatList
//                         showsHorizontalScrollIndicator={false}
//                         horizontal
//                         data={appMainData?.new_products}
//                         renderItem={renderFeaturedProducts}
//                         keyExtractor={(item) => item?.id?.toString()}
//                         ItemSeparatorComponent={() => (
//                           <View style={{marginRight: moderateScale(16)}} />
//                         )}
//                         ListHeaderComponent={() => (
//                           <View style={{marginLeft: moderateScale(16)}} />
//                         )}
//                         ListFooterComponent={() => (
//                           <View style={{marginRight: moderateScale(16)}} />
//                         )}
//                       />
//                     </>
//                   )}
//               </View>
//             )} */}

//           {/* {appIds.orderchekout == DeviceInfo.getBundleId() ? (
//             <></>
//           ) : (
//             <View>
//               {appMainData &&
//                 appMainData?.on_sale_products &&
//                 !!appMainData?.on_sale_products.length && (
//                   <>
//                     <View>{listHeader(strings.ON_SALE)}</View>
//                     <FlatList
//                       showsHorizontalScrollIndicator={false}
//                       horizontal
//                       keyExtractor={(item) => item?.id.toString() || ''}
//                       data={appMainData?.on_sale_products}
//                       renderItem={renderSale}
//                       ItemSeparatorComponent={() => (
//                         <View style={{marginRight: moderateScale(16)}} />
//                       )}
//                       ListHeaderComponent={() => (
//                         <View style={{marginLeft: moderateScale(16)}} />
//                       )}
//                       ListFooterComponent={() => (
//                         <View style={{marginRight: moderateScale(16)}} />
//                       )}
//                     />
//                   </>
//                 )}
//             </View>
//           )} */}
//         </Animatable.View>
//         <View
//           style={{
//             height:
//               Platform.OS == 'ios' ? moderateScale(60) : moderateScale(90),
//           }}
//         />
//       </ScrollView>

//       {getBundleId() == appIds.easyDrink && isConfirmAgeModal && (
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={isConfirmAgeModal}
//             // onRequestClose={() => {
//             //   Alert.alert("Modal has been closed.");
//             //   setModalVisible(!modalVisible);
//             // }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: 'rgba(0,0,0,0.5)',
//               }}>
//               <View style={styles.innerAgeModaleView}>
//                 <TouchableOpacity
//                   style={{
//                     alignSelf: 'center',
//                     marginBottom: moderateScale(10),
//                   }}>
//                   <Image
//                     style={{
//                       height: moderateScaleVertical(25),
//                       width: moderateScale(25),
//                     }}
//                     source={imagePath.icCross18}
//                   />
//                 </TouchableOpacity>
//                 <Text
//                   style={[
//                     styles.ageModalText,
//                     {color: isDarkMode ? colors.white : colors.black},
//                   ]}>
//                   {strings.AGE_VERIFICATION}
//                 </Text>
//                 {/* <View style={styles.horizontalLine} /> */}
//                 <View style={styles.horizontalLine}>
//                   <DashedLine
//                     dashLength={5}
//                     dashThickness={1}
//                     dashGap={2}
//                     dashColor={colors.black}
//                     style={{marginTop: moderateScale(7)}}
//                   />
//                 </View>
//                 <Text style={styles.ageConfirmationText}>
//                   {strings.YOU_MUST_BE_18}
//                 </Text>
//                 <View
//                   style={{
//                     marginVertical: moderateScaleVertical(10),
//                     width: '70%',
//                   }}>
//                   <GradientButton
//                     colorsArray={[
//                       themeColors.primary_color,
//                       themeColors.primary_color,
//                     ]}
//                     textStyle={{
//                       fontFamily: fontFamily.medium,
//                       color: colors.white,
//                     }}
//                     onPress={() => {
//                       onConfirmAge(false);
//                     }}
//                     borderRadius={moderateScale(5)}
//                     btnText={strings.YES_I_AM_ABOVE_18}
//                     containerStyle={{
//                       width: '100%',
//                     }}
//                   />
//                 </View>

//                 <Text onPress={OnTakeMeOut} style={styles.takeMeOutStyle}>
//                   {strings.TAKE_ME_OUT}
//                 </Text>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       )}
//       {!!userData?.auth_token &&
//         !!appData?.profile?.preferences?.show_subscription_plan_popup && (
//           <SubscriptionModal
//             isVisible={isSubscription}
//             onClose={onClose}
//             onPressSubscribe={onPressSubscribe}
//           />
//         )}
//     </View>
//   );
// }

import {useScrollToTop} from '@react-navigation/native';
import _, {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo, {getBundleId} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Carousel from 'react-native-snap-carousel';
import {SvgUri} from 'react-native-svg';
import {useSelector} from 'react-redux';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import SubscriptionModal from '../../../Components/SubscriptionModal';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {appIds} from '../../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import LeftRightText from '../../../Components/LeftRightText';

export default function DashBoardFive({
  handleRefresh = () => {},
  bannerPress = () => {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  navigation = {},
  toggleData = {},
  onVendorFilterSeletion = () => {},
  tempCartData = null,
  onPressVendor = () => {},
  onPressAddLaundryItem = () => {},
  isLoadingAddons = false,
  selectedHomeCategory = {},
  onClose = () => {},
  onPressSubscribe = () => {},
  isSubscription = false,
}) {
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const {appData, themeColors, appStyle, themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot,
  );
  const {userData} = useSelector((state) => state?.auth);
  const {appMainData} = useSelector((state) => state?.home);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});

  let businessType = appData?.profile?.preferences?.business_type || null;

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
    showMenu: false,
    currSelectedFilter: null,
    categoriesData: [],
    seeMore: false,
    isViewAllCategories: false,
  });
  const {seeMore, currSelectedFilter, isViewAllCategories} = state;

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    if (!!appMainData?.categories && appMainData?.categories.length) {
      if (appStyle?.homePageLayout == 5) {
        updateState({
          categoriesData: appMainData?.categories.filter(
            (item, indx) => indx < 8,
          ),
        });
      } else {
        updateState({
          categoriesData: appMainData?.categories,
        });
      }
      return;
    }
    updateState({
      categoriesData: [],
    });
  }, [appMainData?.categories]);

  const onSelectedFilter = (selectedFilter) => {
    updateState({showMenu: false, currSelectedFilter: selectedFilter});
    onVendorFilterSeletion(selectedFilter);
  };

  const homeAllFilters = () => {
    let homeFilter = [
      {id: 1, type: strings.OPEN},
      {id: 2, type: strings.CLOSE},
      {id: 3, type: strings.BESTSELLER},
    ];

    return homeFilter;
  };

  const seeMoreCategories = () => {
    updateState({
      categoriesData: !seeMore
        ? appMainData?.categories
        : appMainData?.categories.filter((item, indx) => indx < 8),
      seeMore: !seeMore,
    });
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onViewAll = (type, data) => {
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  };

  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      // fromVendorApp: true,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: {id: item?.vendors[0].vendor_id},
    });
  };

  const _renderCategories = ({item, index}) => {
    let imageURI = getImageUrl(
      item?.icon?.image_fit,
      item?.icon?.image_path,
      '500/500',
    );
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <View
        style={{
          width: 'auto',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: !!themeColor ? colors.whiteOpacity15 : '#EFEFEF',
            borderRadius: moderateScale(12),
            height: moderateScale(100),
            width: width / 3.5,
            marginHorizontal: moderateScale(4),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => onPressCategory(item)}>
          {isSVG ? (
            <SvgUri
              height={moderateScale(50)}
              width={moderateScale(50)}
              uri={imageURI}
            />
          ) : (
            <FastImage
              source={{
                uri: imageURI,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              resizeMode={'contain'}
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
              }}
            />
          )}
          <Text
            style={{
              fontFamily: fontFamily.regular,
              marginTop: moderateScaleVertical(5),
              color: themeColor ? colors.white : colors.black,
              textAlign: 'center',
            }}>
            {item?.name || (item?.translation && item?.translation[0]?.name)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const _renderVendors = ({item, index}) => (
    <View
      style={{
        width: width - width / 3.5,
      }}>
      <MarketCard3
        data={item}
        onPress={() => onPressVendor(item)}
        extraStyles={{margin: 2}}
      />
    </View>
  );

  const _renderBrands = ({item}) => {
    const imageURI = item?.image?.proxy_url
      ? getImageUrl(item.image.proxy_url, item.image.image_path, '800/600')
      : item?.image_url;
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(96)}
            width={moderateScale(96)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{uri: imageURI, priority: FastImage.priority.high}}
            style={{
              height: moderateScale(96),
              width: moderateScale(96),
              borderRadius: moderateScale(10),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const vendorHeader = (item) => {
    if (appData?.profile?.preferences?.single_vendor) {
      return (
        <View
          style={{
            marginBottom: moderateScaleVertical(24),
            marginTop: moderateScaleVertical(8),
          }}
        />
      );
    }
    return (
      <View key={Math.random()}>
        {getBundleId() == appIds.muvpod ? null : (
          <View style={{...styles.viewAllVeiw}}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.exploreStoresTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginTop: 0,
                flex: 1,
              }}>
              {getBundleId() == appIds.quickLube
                ? item?.data?.length > 1
                  ? `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`
                  : strings.BOOK_HERE
                : `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
            </Text>

            {item?.data?.length > 1 && (
              <TouchableOpacity
                style={{marginHorizontal: moderateScale(4)}}
                onPress={() => onViewAll('vendor', appMainData.vendors)}>
                <Text
                  style={{
                    ...styles.viewAllText,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : themeColors.primary_color,
                  }}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            )}
            <Menu style={{alignSelf: 'flex-end'}}>
              <MenuTrigger>
                <View style={styles.menuView}>
                  <FastImage
                    style={{
                      height: moderateScaleVertical(16),
                      width: moderateScale(16),
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}
                    resizeMode="contain"
                    source={imagePath.sort}
                  />
                  <Text
                    style={{
                      fontSize: textScale(12),
                      marginHorizontal: moderateScale(5),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {!currSelectedFilter
                      ? strings.RELEVANCE
                      : currSelectedFilter?.type}
                  </Text>
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    marginTop: moderateScaleVertical(36),
                    width: moderateScale(100),
                  },
                }}>
                {homeAllFilters()?.map((item, index) => {
                  return (
                    <View key={index}>
                      <MenuOption
                        onSelect={() => onSelectedFilter(item)}
                        key={String(index)}
                        text={item?.type}
                        style={{
                          marginVertical: moderateScaleVertical(5),
                        }}
                      />
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: colors.greyColor,
                        }}
                      />
                    </View>
                  );
                })}
              </MenuOptions>
            </Menu>
          </View>
        )}
      </View>
    );
  };

  const showAllTempCartOrders = () => {
    return (
      <View>
        {tempCartData && tempCartData.length
          ? tempCartData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onPressViewEditAndReplace(item)}
                  style={{
                    padding: moderateScale(8),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color.substr(1),
                      20,
                    ),
                    marginHorizontal: moderateScale(15),
                    marginTop: moderateScale(15),
                    borderRadius: moderateScale(5),
                    borderWidth: moderateScale(0.5),
                    borderColor: themeColors?.primary_color,
                  }}>
                  <View style={{flex: 0.7}}>
                    <Text
                      style={{
                        fontSize: textScale(12),
                        fontFamily: fontFamily.medium,
                      }}>
                      {strings.YOURDRIVERHASMODIFIED}
                    </Text>
                    <Text
                      style={{
                        fontSize: textScale(12),
                        paddingTop: moderateScale(5),
                        fontFamily: fontFamily.bold,
                      }}>
                      {strings.VIEW_DETAIL}
                    </Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    <Text
                      style={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.medium,
                      }}>{`#${item?.order_number}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          : null}
      </View>
    );
  };

  const _renderProducts = ({item, index}) => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (item?.categoryDetail?.type_id == 13) {
              navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
                data: item,
              });
            } else {
              navigation.navigate(navigationStrings.PRODUCTDETAIL, {
                data: item,
              });
            }
          }}
          activeOpacity={0.7}
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <FastImage
            source={{uri: item?.image_url}}
            style={{
              width: width / 2.3,
              height: 120,
              borderRadius: 8,
            }}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 8}}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              marginVertical: 6,

              color: !!themeColor ? colors.white : colors.black,
            }}>
            {item?.title}
          </Text>
          <LeftRightText
            leftTextStyle={{
              color: !!isDarkMode ? colors.white : colors.black,
              fontFamily: fontFamily.bold,
            }}
            rightTextStyle={{
              color: colors.orange,
            }}
            leftText={item?.price}
          />
        </View>
      </View>
    );
  };

  const productsThemeView = (item) => {
    return !isEmpty(item?.data) ? (
      <View>
        {titleViewHome(item)}
        <FlatList
          showsHorizontalScrollIndicator={false}
          numColumns={2}
          data={item?.data}
          renderItem={_renderProducts}
          keyExtractor={(item) => String(item?.id)}
          ItemSeparatorComponent={() => (
            <View style={{marginRight: moderateScale(16)}} />
          )}
          ListHeaderComponent={() => (
            <View style={{marginLeft: moderateScale(16)}} />
          )}
          ListFooterComponent={() => (
            <View style={{marginRight: moderateScale(16)}} />
          )}
        />
      </View>
    ) : (
      <></>
    );
  };

  const categoriesView = (item) => {
    return !isEmpty(item?.data) ? (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(16),
            marginVertical: moderateScaleVertical(15),
          }}>
          <Text
            style={{
              ...styles.exploreStoresTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {item?.translations[0]?.title || item?.title}
          </Text>

          {item?.data.length > 9 && (
            <TouchableOpacity
              onPress={() =>
                updateState({isViewAllCategories: !isViewAllCategories})
              }>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(12),
                  color: themeColors.primary_color,
                }}>
                {isViewAllCategories ? 'View less' : 'View all'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {
          <View
            style={{
              marginHorizontal: moderateScale(15),
            }}>
            <FlatList
              key={'6'}
              numColumns={3}
              data={isViewAllCategories ? item?.data : item?.data?.slice(0, 9)}
              keyExtractor={(item) => String(item?.id)}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderCategories}
              ItemSeparatorComponent={() => (
                <View style={{marginTop: moderateScale(24)}} />
              )}
            />
          </View>
        }
      </View>
    ) : (
      <></>
    );
  };

  const vendorsView = (item) => {
    return !isEmpty(item?.data) ? (
      <View>
        {vendorHeader(item)}
        <FlatList
          horizontal
          alwaysBounceVertical={true}
          data={item?.data}
          keyExtractor={(item) => String(item?.id)}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderVendors}
          ListHeaderComponent={() => (
            <View style={{marginLeft: moderateScale(16)}} />
          )}
          ListFooterComponent={() => (
            <View style={{marginLeft: moderateScale(16)}} />
          )}
          ListEmptyComponent={() => (
            <View>
              <FastImage
                source={imagePath.noDataFound}
                resizeMode="contain"
                style={{
                  width: moderateScale(140),
                  height: moderateScale(140),
                  alignSelf: 'center',
                  marginTop: moderateScaleVertical(30),
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: textScale(11),
                  fontFamily: fontFamily.regular,
                  marginHorizontal: moderateScale(10),
                  lineHeight: moderateScale(20),
                  marginTop: moderateScale(5),
                }}>
                {businessType == 'home_service'
                  ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
                  : `${strings.SORRY_MSG}`}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{width: moderateScale(10)}} />
          )}
        />
      </View>
    ) : (
      <></>
    );
  };

  const _renderBestVendors = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressVendor(item)}
        activeOpacity={0.7}
        style={{
          height: moderateScaleVertical(140),
          width: width - width / 3.5,
          borderRadius: moderateScale(10),
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          source={{uri: item?.logo?.image_s3_url}}
          style={{
            ...StyleSheet.absoluteFill,
            height: moderateScaleVertical(140),
            width: width - width / 3.5,
          }}
        />
        <View
          style={{
            ...StyleSheet.absoluteFill,
            height: moderateScaleVertical(140),
            width: width - width / 3.5,
            backgroundColor: colors.blackOpacity43,
          }}
        />
        {!!item?.rating !== '0.0' && (
          <View
            style={{...styles.hdrRatingTxtView, position: 'absolute', top: 0}}>
            <Text
              style={{
                ...styles.ratingTxt,
                fontFamily: fontFamily.medium,
              }}>
              {Number(item?.rating).toFixed(1)}
            </Text>
            <Image
              style={styles.starImg}
              source={imagePath.star}
              resizeMode="contain"
            />
          </View>
        )}
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(18),
            color: colors.white,
          }}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const bestSellersView = (item) => {
    return !isEmpty(item?.data) ? (
      <View>
        {titleViewHome(item)}
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBestVendors}
          keyExtractor={(item) => String(item?.id)}
          ItemSeparatorComponent={() => (
            <View style={{marginRight: moderateScale(16)}} />
          )}
          ListHeaderComponent={() => (
            <View style={{marginLeft: moderateScale(16)}} />
          )}
          ListFooterComponent={() => (
            <View style={{marginRight: moderateScale(16)}} />
          )}
        />
      </View>
    ) : (
      <></>
    );
  };

  const brandsView = (item) => {
    return !isEmpty(item?.data) ? (
      <View>
        {titleViewHome(item)}

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBrands}
          keyExtractor={(item) => String(item?.id)}
          ItemSeparatorComponent={() => (
            <View style={{marginRight: moderateScale(12)}} />
          )}
          ListHeaderComponent={() => (
            <View style={{marginLeft: moderateScale(16)}} />
          )}
          ListFooterComponent={() => (
            <View style={{marginRight: moderateScale(16)}} />
          )}
        />
      </View>
    ) : (
      <></>
    );
  };

  const titleViewHome = (item, isViewAll = false) => {
    return (
      <Text
        style={{
          ...styles.exploreStoresTxt,
          marginHorizontal: moderateScale(16),
          marginVertical: moderateScaleVertical(15),
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
        }}>
        {item?.translations[0]?.title || item?.title}
      </Text>
    );
  };

  const spotlightDealsView = (item) => {
    return !isEmpty(item?.data) ? (
      <View>
        {titleViewHome(item)}
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSpotlightDeals}
          keyExtractor={(item) => String(item?.id)}
          ItemSeparatorComponent={() => (
            <View style={{marginRight: moderateScale(12)}} />
          )}
          ListHeaderComponent={() => (
            <View style={{marginLeft: moderateScale(16)}} />
          )}
          ListFooterComponent={() => (
            <View style={{marginRight: moderateScale(16)}} />
          )}
        />
      </View>
    ) : (
      <></>
    );
  };

  const renderHomePageItems = ({item, index}) => {
    return (
      <View>
        {item?.slug == 'new_products' ||
        item?.slug == 'featured_products' ||
        item?.slug == 'on_sale' ||
        item?.slug == 'most_popular_products' ||
        item?.slug == 'single_category_products' ||
        item?.slug == 'spotlight_deals' ? (
          <View>{productsThemeView(item)}</View>
        ) : item?.slug == 'vendors' ? (
          <View>{vendorsView(item)}</View>
        ) : item?.slug == 'nav_categories' ? (
          <View>{categoriesView(item)}</View>
        ) : item?.slug == 'best_sellers' ? (
          <View>{bestSellersView(item)}</View>
        ) : item?.slug == 'brands' ? (
          <View>{brandsView(item)}</View>
        ) : (
          //  : item?.slug == 'spotlight_deals' ? (
          //   <View>{spotlightDealsView(item)}</View>
          // )
          <></>
        )}
      </View>
    );
  };

  const renderBanners = ({item}) => {
    const imageUrl = getImageUrl(
      item.image.image_fit,
      item.image.image_path,
      '400/600',
    );
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => bannerPress(item)}>
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height: moderateScale(160),
            width: width - moderateScale(30),
            borderRadius: moderateScale(16),
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <CategoryLoader2 viewStyles={{marginBottom: moderateScale(16)}} />

        <View style={{flexDirection: 'row'}}>
          <HeaderLoader
            viewStyles={{
              marginTop: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(16),
            }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{
              marginTop: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(16),
            }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{
              marginTop: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(16),
            }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <HeaderLoader
            widthLeft={moderateScale(180)}
            rectWidthLeft={moderateScale(180)}
            rectHeightLeft={moderateScaleVertical(60)}
            isRight={false}
            rx={4}
            ry={4}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            rectHeightLeft={moderateScaleVertical(60)}
            isRight={false}
            rx={4}
            ry={4}
          />
        </View>

        <BannerLoader
          // isVendorLoader
          viewStyles={{marginTop: moderateScale(12)}}
        />
        <BannerLoader
          // isVendorLoader
          viewStyles={{marginTop: moderateScale(12)}}
        />
        <BannerLoader
          // isVendorLoader
          viewStyles={{marginTop: moderateScale(12)}}
        />
      </ScrollView>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }>
        {showAllTempCartOrders()}
        <Animatable.View animation={'fadeInUp'}>
          <View style={{}}>
            {!isEmpty(appData?.mobile_banners) && (
              <Carousel
                autoplay={true}
                loop={true}
                autoplayInterval={2000}
                data={appMainData?.mobile_banners || appData?.mobile_banners}
                renderItem={renderBanners}
                sliderWidth={width}
                itemWidth={width - moderateScale(30)}
                style={{
                  marginHorizontal: moderateScale(15),
                  backgroundColor: 'green',
                }}
              />
            )}
          </View>
          <FlatList
            keyExtractor={(item, index) => String(index)}
            data={appMainData?.homePageLabels}
            renderItem={renderHomePageItems}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </Animatable.View>
        <View
          style={{
            height:
              Platform.OS == 'ios' ? moderateScale(60) : moderateScale(90),
          }}
        />
      </ScrollView>

      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </View>
  );
}
