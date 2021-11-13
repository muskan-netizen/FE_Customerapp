import React, {useEffect, useState} from 'react';
import {FlatList, View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import BrandCard2 from '../../Components/BrandCard2';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import CardLoader from '../../Components/Loaders/CardLoader';
import stylesFunc from './styles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import actions from '../../redux/actions';

export default function CategoryBrands({navigation, route}) {
  const {data} = route.params;
  console.log(data, 'paramsData');
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const location = useSelector((state) => state?.home?.location);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    categoryBrands: [],
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

  const {isLoading, categoryBrands} = state;
  //Redux store data
  const {appStyle, appData, themeColors, fontFamily} = useSelector(
    (state) => state.initBoot,
  );
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const styles = stylesFunc({themeColors, fontFamily});

  useEffect(() => {
    actions
      .getDataByCategoryId(
        `/${data.id}?type=${dine_In_Type}`,
        {},
        {
          code: appData.profile.code,
          latitude: location?.latitude.toString() || '',
          longitude: location?.longitude.toString() || '',
        },
      )
      .then((res) => {
        console.log(res?.data, 'brandsData');
        updateState({
          categoryBrandsData: res?.data,
        });
      })
      .catch((err) => console.log(err, 'errrrr'));
  }, []);
  //Brand data
  const _renderItem = ({item, index}) => {
    return (
      <BrandCard2
        data={item}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      />
    );
  };

  let renderShimmer = () => {
    return (
      <View
        style={{
          marginHorizontal: moderateScale(16),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <CardLoader cardWidth={'100%'} height={width / 3.5} />
        </View>

        <View style={{flex: 1, marginHorizontal: 10}}>
          <CardLoader cardWidth={'100%'} height={width / 3.5} />
        </View>
        <View style={{flex: 1}}>
          <CardLoader cardWidth={'100%'} height={width / 3.5} />
        </View>
      </View>
    );
  };
  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }>
        <Header
          centerTitle={strings.BRANDS}
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3
              ? imagePath.icBackb
              : imagePath.back
          }
          rightIcon={
            appStyle?.homePageLayout === 3
              ? imagePath.icSearchb
              : imagePath.search
          }
          onPressRight={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
        />

        <View style={{height: 1, backgroundColor: colors.borderLight}} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {[{}, {}, {}, {}, {}, {}].map((val, i) => {
            return (
              <View
                key={String(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: moderateScale(15),
                }}>
                <HeaderLoader
                  isRight={false}
                  widthLeft={(width - moderateScale(30)) / 3.25}
                  rectWidthLeft={(width - moderateScale(30)) / 3.25}
                  rectHeightLeft={moderateScaleVertical(100)}
                  heightLeft={moderateScaleVertical(100)}
                  viewStyles={{
                    marginHorizontal: 0,
                    marginTop: moderateScaleVertical(12),
                  }}
                  rx={3}
                  ry={3}
                />
                <HeaderLoader
                  isRight={false}
                  widthLeft={(width - moderateScale(30)) / 3.25}
                  rectWidthLeft={(width - moderateScale(30)) / 3.25}
                  rectHeightLeft={moderateScaleVertical(100)}
                  heightLeft={moderateScaleVertical(100)}
                  viewStyles={{
                    marginHorizontal: 0,
                    marginTop: moderateScaleVertical(12),
                  }}
                  rx={3}
                  ry={3}
                />
                <HeaderLoader
                  isRight={false}
                  widthLeft={(width - moderateScale(30)) / 3.25}
                  rectWidthLeft={(width - moderateScale(30)) / 3.25}
                  rectHeightLeft={moderateScaleVertical(100)}
                  heightLeft={moderateScaleVertical(100)}
                  viewStyles={{
                    marginHorizontal: 0,
                    marginTop: moderateScaleVertical(12),
                  }}
                  rx={3}
                  ry={3}
                />
              </View>
            );
          })}
          <View style={{height: width / 8}} />
        </ScrollView>
      </WrapperContainer>
    );
  }
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <Header
        centerTitle={strings.BRANDS}
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3
            ? imagePath.icBackb
            : imagePath.back
        }
        rightIcon={
          appStyle?.homePageLayout === 3
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{height: 1, backgroundColor: colors.borderLight}} />

      <FlatList
        data={isLoading ? [] : categoryBrands?.listData?.data}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={{height: 10}} />}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={{flexGrow: 1}}
        ItemSeparatorComponent={() => (
          <View style={{height: moderateScaleVertical(10)}} />
        )}
        numColumns={3}
        // ListEmptyComponent={<ListEmptyBrands isLoading={isLoading} />}
        renderItem={_renderItem}
      />
    </WrapperContainer>
  );
}
