import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
//constants
import imagePath from '../../../constants/imagePath';
//custom components
import GradientButton from '../../../Components/GradientButton';
//styling
import colors from '../../../styles/colors';
import {height, width} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import styleFun from './styles';
//3rd party
import {useDarkMode} from 'react-native-dark-mode';
import Carousel from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import actions from '../../../redux/actions';
import {showError} from '../../../utils/helperFunctions';
import {isEmpty} from 'lodash';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    thumbnail: imagePath.nature,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    thumbnail: imagePath.nature,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    thumbnail: imagePath.nature,
  },
  {
    id: '8694a0f-3da1-471f-bd96-145571e29d72',
    thumbnail: imagePath.nature,
  },
  {
    id: '694a0f-3da1-471f-bd96-145571e29d72',
    thumbnail: imagePath.nature,
  },
];

const P2pProductDetail = ({navigation, route}) => {
  const paramData = route?.params;

  const {appData, currencies, languages, themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const styles = styleFun({themeColor, themeToggle});

  const [indexSelected, setIndexSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    getP2pProductDetail();
  }, []);

  const getP2pProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${paramData?.product_id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, '<===response getProductDetailByProductId');
        setIsLoading(false);
        setProductInfo(res?.data?.products);
      })
      .catch(errorMethod);
  };

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const errorMethod = (error) => {
    console.log(error, '<===error getProductDetailByProductId');
    setIsLoading(false);
    showError(error?.message || error?.error);
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <View style={styles.item}>
        <Image source={imagePath.nature} style={{backgroundColor: 'white'}} />
      </View>
    );
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.statusbarColor,
      }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
        <View style={{backgroundColor: colors.white}}>
          <Carousel
            sliderWidth={width}
            sliderHeight={height}
            itemWidth={width}
            data={DATA}
            renderItem={renderItem}
            onSnapToItem={(index) => onSelect(index)}
          />
        </View>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}>
          <Image source={imagePath.back1} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heart}>
          <Image source={imagePath.heart2} />
        </TouchableOpacity>
        <View style={styles.pagination}>
          {DATA.map((item, index) => {
            return (
              <View
                style={[
                  styles.dotStyle,
                  {
                    backgroundColor:
                      index === indexSelected ? colors.orange1 : colors.white,
                    width: index === indexSelected ? 20 : 8,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.view}>
          <GradientButton
            btnText={'AED 15000'}
            btnStyle={styles.btn}
            containerStyle={{alignItems: 'flex-start'}}
          />
          <Text style={styles.txt1}>
            {!isEmpty(productInfo?.translation)
              ? productInfo?.translation[0]?.title
              : ''}
          </Text>
          <Text style={styles.txt2}>
            {!isEmpty(productInfo?.translation)
              ? productInfo?.translation[0]?.body_html
              : ''}
          </Text>
          <Text style={styles.txt2}>
            Reliable Is the 2014 Land Rover Range Rover Sport? The 2014 Land
            Rover.
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={{...styles.txt1, fontSize: 13}}>Posted By</Text>
          <View style={styles.view2}>
            <Image source={imagePath.fb} />
            <Text
              style={{...styles.txt2, marginLeft: 8, color: colors.orange1}}>
              Martin Wallace
              <Text
                style={{
                  ...styles.txt2,
                  color: !!themeColor ? colors.white : colors.black,
                }}>
                {' '}
                Fazaa L.L.C
              </Text>
            </Text>
          </View>
          <View style={styles.view3}>
            <GradientButton
              btnText={'Chat'}
              textStyle={{...styles.chatBtn, color: colors.orange1}}
              btnStyle={styles.btn1}
              source={imagePath.message}
              containerStyle={{alignItems: 'flex-start'}}
              colorsArray={[colors.white, colors.white]}
            />
            <GradientButton
              btnText={'Call'}
              textStyle={styles.chatBtn}
              btnStyle={styles.btn2}
              source={imagePath.call}
              containerStyle={{alignItems: 'flex-start'}}
            />
          </View>
        </View>
        <View style={{...styles.view1, marginTop: 0}}>
          <Text style={{...styles.txt1, fontSize: 13}}>Description</Text>
          <Text style={styles.txt2}>
            2021 Red Abarth 595 Competizione 1.4L Convertible
          </Text>
          <Text style={styles.txt2}>
            With Full Abarth Service History and Warranty
          </Text>
          <Text style={styles.txt2}>Body condition : Perfect and out</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default P2pProductDetail;
