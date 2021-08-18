import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import BrandCard from '../../Components/BrandCard';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import ListEmptyBrands from './ListEmptyBrands';

export default function Brand({navigation}) {
  const [state, setState] = useState({
    isLoading: true,
  });
  useEffect(() => {
    setTimeout(() => {
      updateState({isLoading: false});
    }, 500);
  }, []);
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const {isLoading} = state;
  //Redux store data
  const {appStyle, appData} = useSelector((state) => state.initBoot);
  const homePageLayout = appStyle?.homePageLayout;
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Brand data
  const _renderItem = ({item, index}) => {
    return (
      <BrandCard
        data={item}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      />
    );
  };
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <Header
        centerTitle={strings.BRANDS}
        leftIcon={
          appData?.profile?.code === shortCodes.capcorp
            ? imagePath.backArrow
            : imagePath.back
        }
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{height: 1, backgroundColor: colors.borderLight}} />

      <FlatList
        data={isLoading ? [] : appMainData.brands}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={{height: 10}} />}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={{flexGrow: 1}}
        ItemSeparatorComponent={() => (
          <View style={{height: moderateScaleVertical(10)}} />
        )}
        ListEmptyComponent={<ListEmptyBrands isLoading={isLoading} />}
        renderItem={_renderItem}
      />
    </WrapperContainer>
  );
}
