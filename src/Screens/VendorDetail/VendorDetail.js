import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import VendorDetailLoader from '../../Components/Loaders/VendorDetailLoader';
import ThreeColumnCard from '../../Components/ThreeColumnCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {moderateScale} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import ListEmptyVendors from '../Vendors/ListEmptyVendors';

export default function VendorDetail({navigation, route}) {
  let vendorParams = route?.params?.data;
  console.log(vendorParams,"vendorParams>>>>>>>");

  const [state, setState] = useState({
    vendorId: vendorParams?.item?.id,
    vendorData: [],
    isLoading: true,
    limit: 12,
    pageNo: 1,
  });
  const {vendorId, vendorData, isLoading, limit, pageNo} = state;
  useEffect(() => {
    if (
      vendorParams &&
      vendorParams?.item &&
      vendorParams?.item?.redirect_to == staticStrings.SUBCATEGORY
    ) {
      getSubCategoryDetailData();
    } else {
      getVendorDetailData();
    }
  }, [vendorId]);

  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  /***********GET SUBCATEGORY  DETAIL DATA******** */

  const getSubCategoryDetailData = () => {
    // 
    actions
      .getProductByCategoryId(
        `/${vendorId}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        
        updateState({isLoading: false});
        if (res && res.data) {
          updateState({vendorData: res.data.listData});
        }
        
      })
      .catch(errorMethod);
  };
  /*********** */

  /*********GET VENDOR DETAIL********* */
  const getVendorDetailData = () => {
    let data = {};
    data['vendor_id'] = vendorId;
    
    actions
      .getVendorDetail(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({isLoading: false});
        if (res && res.data) {
          let newArray = res.data;
          
          // if (vendorParams?.rootProducts) {
          //   // console.log(
          //   //   newArray.filter((x) => x?.id != vendorParams?.categoryData?.id),
          //   //   'newArray>>>>',
          //   // );
          //   newArray= newArray.filter((x) => x?.id != vendorParams?.categoryData?.id)
          // }
          updateState({vendorData: newArray});
        }
        
      })
      .catch(errorMethod);
  };

  /********* */

  const errorMethod = (error) => {
    
    updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const _renderItem = ({item, index}) => {
    return (
      <ThreeColumnCard
        onPress={moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item.id,
          rootProducts: vendorParams?.rootProducts,
          // vendor: true,
          // rootProducts:
          name: item.name,
        })}
        // onPress={() => navigation.navigate(navigationStrings.PRODUCT_LIST)}
        data={item}
        withTextBG
        cardIndex={index}
      />
    );
  };

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={colors.backgroundGrey}>
      {/* <Header centerTitle={vendorParams?.item?.name} hideRight={false} /> */}

      <Header
        leftIcon={imagePath.back}
        centerTitle={vendorParams?.item?.name}
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{...commonStyles.headerTopLine}} />
      {isLoading ? (
        <View>
          <View style={{height: 10}} />
          <VendorDetailLoader listSize={5} isRow />
        </View>
      ) : (
        <FlatList
          data={vendorData}
          numColumns={3}
          ListHeaderComponent={<View style={{height: 10}} />}
          // columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{marginHorizontal: moderateScale(16)}}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          renderItem={_renderItem}
          ListEmptyComponent={
            <ListEmptyVendors
              isLoading={isLoading}
              emptyText={'No data found'}
            />
          }
          keyExtractor={(item, index) => String(index)}
        />
      )}
    </WrapperContainer>
  );
}
