import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//custom components
import GradientButton from '../../../Components/GradientButton';
import SearchBar2 from '../../../Components/NewComponents/SearchBar2';
import TopHeader from '../../../Components/NewComponents/TopHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
//styling
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import styleFun from './styles';
//constants
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
//3rd party
import {isEmpty} from 'lodash';
import {useDarkMode} from 'react-native-dark-mode';
import deviceInfoModule from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import Header from '../../../Components/Header';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import {getImageUrl, showError} from '../../../utils/helperFunctions';

import {MultiSelect} from 'react-native-element-dropdown';
import {checkValueExistInAry} from '../../../utils/commonFunction';
import {UIActivityIndicator} from 'react-native-indicators';

const P2pProducts = ({route, navigation}) => {
  const paramData = route?.params?.data;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    themeColors,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const {userData} = useSelector((state) => state?.auth);

  const darkthemeusingDevice = useDarkMode();
  const fontFamily = appStyle?.fontSizeData;
  const showModal = true;
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const styles = styleFun({themeColor, themeToggle, fontFamily});

  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = React.useState([]);
  const [p2pProducts, setP2pProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [isAttributeFilterModal, setIsAttributeFilterModal] = useState(false);
  const [isLoadMore, setLoadMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    getP2pProductsByCategoryId();
    getListOfAvailableAttributes();
  }, []);

  const getListOfAvailableAttributes = () => {
    actions
      .getAvailableAttributes(
        `?category_id=${paramData?.id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===response getListOfAvailableAttributes');
        setAttributeInfo(res?.data || []);
      })
      .catch((error) => showError(error?.message || error?.error));
  };

  const getP2pProductsByCategoryId = (pageNo = 1) => {
    actions
      .getProductByP2pCategoryId(
        `/${paramData?.id}?page=${pageNo}&product_list=true&type=p2p`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, '<===response getP2pProductsByCategoryId');
        if (
          res?.data?.listData?.current_page == res?.data?.listData?.last_page
        ) {
          setLoadMore(false);
        }
        setP2pProducts(
          pageNo == 1
            ? res?.data?.listData?.data
            : [...p2pProducts, ...res?.data?.listData?.data],
        );
        setIsLoading(false);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    setIsLoading(false);
    showError(error?.message || error?.error);
  };

  const onChangeDropDownOption = (value, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = value;
    setAttributeInfo(attributeInfoData);
  };

  const onPressRadioButton = (item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.attribute_id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [item?.id];
    setAttributeInfo(attributeInfoData);
  };

  const onChangeText = (text, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [text];
    setAttributeInfo(attributeInfoData);
  };

  const onPressCheckBoxes = (value, data) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == value?.attribute_id,
    );
    if (!isEmpty(data?.values)) {
      let existingItmIndx = data?.values.findIndex((itm) => itm == value.id);
      if (existingItmIndx == -1) {
        attributeInfoData[indexOfAttributeToUpdate].values = [
          ...data?.values,
          value?.id,
        ];
      } else {
        let index = attributeInfoData[indexOfAttributeToUpdate].values.indexOf(
          value?.id,
        );
        if (index >= 0) {
          attributeInfoData[indexOfAttributeToUpdate].values.splice(index, 1);
        }
      }
    } else {
      attributeInfoData[indexOfAttributeToUpdate].values = [value?.id];
    }
    setAttributeInfo(attributeInfoData);
  };

  const onFilterPress = () => {
    if (!!userData?.auth_token) {
      setIsAttributeFilterModal(true);
    } else {
      actions.setRedirection('');
      actions.setAppSessionData('on_login');
    }
  };

  const onResetFilter = () => {
    const attributeInfoData = [...attributeInfo];
    attributeInfoData.map((itm) => {
      delete itm['values'];
    });
    setAttributeInfo(attributeInfoData);
  };

  const renderP2pProducts = useCallback(
    ({item, index}) => {
      const getImage = (quality) =>
        !isEmpty(item?.media)
          ? getImageUrl(
              item?.media[0]?.image?.path.image_fit,
              item?.media[0]?.image?.path.image_path,
              quality,
            )
          : item?.product_image;

      return (
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(navigationStrings.LISTDETAIL)}>
            <ImageBackground
              style={styles.imgBack}
              source={{uri: getImage('200/200')}}
              imageStyle={{borderRadius: moderateScale(10)}}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  alignSelf: 'flex-end',
                  margin: moderateScale(10),
                }}>
                <Image source={imagePath.heart4} />
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
          <Text style={styles.txt1}>
            {item?.translation[0]?.title || item?.title || item?.sku}
          </Text>

          <View style={{}}>
            {!!item?.translation_description ||
            !!item?.translation[0]?.translation_description ? (
              <View style={{}}>
                <Text
                  numberOfLines={3}
                  style={{
                    fontSize: textScale(10),
                    fontFamily: fontFamily.regular,
                    lineHeight: moderateScale(14),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity66,
                    textAlign: 'left',
                  }}>
                  {!!item?.translation_description
                    ? item?.translation_description.toString()
                    : !!item?.translation[0]?.translation_description
                    ? item?.translation[0]?.translation_description
                    : ''}
                </Text>
              </View>
            ) : null}
          </View>
          <GradientButton
            btnText={`AED ${Number(item?.variant[0]?.price).toFixed(2)}`}
            btnStyle={styles.btn}
            containerStyle={{alignItems: 'flex-start'}}
          />
        </View>
      );
    },
    [p2pProducts],
  );

  const renderRadioBtns = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressRadioButton(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
          }}>
          <Image
            source={
              !isEmpty(data?.values) && data?.values[0] == item?.id
                ? imagePath.icActiveRadio
                : imagePath.icInActiveRadio
            }
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderCheckBoxes = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressCheckBoxes(item, data)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
            marginBottom: moderateScaleVertical(10),
          }}>
          <Image
            source={
              checkValueExistInAry(item, data?.values)
                ? imagePath.checkBox2Active
                : imagePath.checkBox2InActive
            }
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderAttributeOptions = useCallback(
    ({item, index}) => {
      return (
        <View>
          <Text
            style={{
              ...styles.attributeTitle,
              marginBottom: moderateScaleVertical(6),
            }}>
            {item?.title}
          </Text>
          {item?.type == 1 ? (
            <MultiSelect
              style={styles.multiSelect}
              labelField="title"
              valueField="id"
              value={!isEmpty(item?.values) ? item?.values : []}
              data={item?.option}
              onChange={(value) => onChangeDropDownOption(value, item)}
              placeholder={'Select value'}
              fontFamily={fontFamily.regular}
              placeholderStyle={styles.multiSelectPlaceholder}
            />
          ) : item?.type == 3 ? (
            <View style={styles.radioBtn}>
              {item?.option?.map((itm, indx) =>
                renderRadioBtns(itm, item, indx),
              )}
            </View>
          ) : item?.type == 4 ? (
            <TextInput
              placeholder="Type here..."
              onChangeText={(text) => onChangeText(text, item)}
              style={styles.textInput}
            />
          ) : (
            <View style={styles.checkBox}>
              {item?.option?.map((itm, index) =>
                renderCheckBoxes(itm, item, index),
              )}
            </View>
          )}
        </View>
      );
    },
    [attributeInfo],
  );

  const onEndReached = () => {
    if (isLoadMore) {
      setPageNo(pageNo + 1);
      getP2pProductsByCategoryId(pageNo + 1);
    }
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.statusbarColor
      }
      isLoading={isLoading}>
      <Header
        leftIcon={imagePath.back2}
        centerTitle={''}
        headerStyle={{
          marginVertical: moderateScaleVertical(8),
        }}
      />

      <SearchBar2
        navigation={navigation}
        placeHolderTxt={'Search here.....'}
        showFilter={true}
        modalPress={onFilterPress}
        mainContainer={{
          flex: 0,
        }}
      />
      {console.log(isLoading, 'sflkflksdjlfkjs')}
      <View
        style={{
          flex: 1,
          paddingHorizontal: moderateScale(15),
        }}>
        <FlatList
          data={p2pProducts}
          renderItem={renderP2pProducts}
          keyExtractor={(itm, indx) => String(indx)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() =>
            !isLoading && (
              <View>
                <Image
                  source={imagePath.noDataFound}
                  style={{
                    marginTop: height / 4.5,
                    height: moderateScaleVertical(200),
                    width: moderateScale(200),
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(17),
                    textAlign: 'center',
                  }}>
                  {strings.NODATAFOUND}
                </Text>
              </View>
            )
          }
          ListFooterComponent={() => (
            <View>
              {isLoadMore ? (
                <View style={{height: moderateScale(60)}}>
                  {!isLoading && <UIActivityIndicator />}
                </View>
              ) : (
                <></>
              )}
            </View>
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        style={{
          overflow: 'hidden',
          marginHorizontal: 0,
          marginBottom: 0,
        }}
        visible={isAttributeFilterModal}
        onRequestClose={() => setIsAttributeFilterModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
            paddingHorizontal: moderateScale(15),
            borderTopLeftRadius: moderateScale(12),
            borderTopRightRadius: moderateScale(12),
          }}>
          <TopHeader
            onPressLeft={() => setIsAttributeFilterModal(false)}
            onPressRight={onResetFilter}
          />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={{flexGrow: 1}}>
            <FlatList
              data={attributeInfo}
              keyboardShouldPersistTaps={'handled'}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: moderateScaleVertical(18),
                  }}
                />
              )}
              renderItem={renderAttributeOptions}
              // ListFooterComponent={listFooterComponent}
            />
            <View style={styles.btnStyle}>
              <ButtonWithLoader
                btnText="Apply Filter"
                btnStyle={{
                  flex: 0.48,
                  backgroundColor: themeColors.primary_color,
                  borderWidth: 0,
                }}
                btnTextStyle={{
                  textTransform: 'none',
                }}
              />
              <ButtonWithLoader
                btnText="Clear Filter"
                btnStyle={{
                  flex: 0.48,
                  borderColor: themeColors.primary_color,
                }}
                btnTextStyle={{
                  color: themeColors.primary_color,
                  textTransform: 'none',
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      {!!showModal && (
        <Modal isVisible={false} hasBackdrop={true}>
          <View style={styles.successModal}>
            <Image source={imagePath.check3} />
            <Text style={styles.success}>Car Uploaded Successfully</Text>
            <GradientButton
              btnText={'Ok'}
              containerStyle={{width: '50%'}}
              colorsArray={['#FC7049', '#FD312C']}
            />
          </View>
        </Modal>
      )}
    </WrapperContainer>
  );
};

export default P2pProducts;
