import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//custom components
import BorderTextInput from '../../../Components/BorderTextInput';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import WrapperContainer from '../../../Components/WrapperContainer';
//constants
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
//styling
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
//3rd party
import {isEmpty} from 'lodash';
import {MultiSelect} from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import actions from '../../../redux/actions';
import {checkValueExistInAry} from '../../../utils/commonFunction';
import {getImageUrl, showError} from '../../../utils/helperFunctions';
import FormLoader from '../../../Components/Loaders/FormLoader';

const PostCategory = ({}) => {
  const {
    appData,
    currencies,
    languages,
    appStyle,

    themeColors,
  } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});
  const [isAutofillModal, setIsAutofillModal] = useState(false);
  const [data, setData] = useState();
  const [isAttributesModal, setIsAttributesModal] = useState(false);
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [p2pCategories, setp2pCategories] = useState([]);
  const [selectedP2Pcategory, setP2Pcategory] = useState({});
  const [isLoadingP2pCategories, setLoadingP2pCategories] = useState(true);
  const [isP2pCategoriesRefreshing, setP2pCategoriesRefreshing] =
    useState(false);
  const [isLoadingAttributes, setLoadingAttributes] = useState(false);

  useEffect(() => {
    getP2Pcategories();
  }, []);

  const getP2Pcategories = () => {
    actions
      .homeData(
        {
          type: 'p2p',
          open_vendor: 0,
          close_vendor: 0,
          best_vendor: 0,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        setp2pCategories(res?.data?.categories || []);
        setLoadingP2pCategories(false);
        setP2pCategoriesRefreshing(false);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, '<===error in method');
    setLoadingP2pCategories(false);
    setP2pCategoriesRefreshing(false);
    showError(error?.message || error?.error);
  };

  const getListOfAvailableAttributes = () => {
    actions
      .getAvailableAttributes(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        setLoadingAttributes(false);
        setAttributeInfo(res?.data);
      })
      .catch((err) => {
        setLoadingAttributes(false);
        console.log(err, '<===error');
      });
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

  const onFillManaully = () => {
    setIsAutofillModal(false);
    setTimeout(() => {
      setIsAttributesModal(true);
      setLoadingAttributes(true);
    }, 500);
    getListOfAvailableAttributes();
  };

  const handleRefresh = () => {
    setP2pCategoriesRefreshing(true);
    getP2Pcategories();
  };

  const renderAttributeOptions = useCallback(
    ({item, index}) => {
      console.log(item?.values, 'dkslakjfsd');
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
              style={{
                height: moderateScaleVertical(40),
                backgroundColor: colors.blackOpacity05,
                borderRadius: moderateScale(5),
              }}
              labelField="title"
              valueField="id"
              value={!isEmpty(item?.values) ? item?.values : []}
              data={item?.option}
              onChange={(value) => onChangeDropDownOption(value, item)}
              placeholder={'Select value'}
              fontFamily={fontFamily.regular}
              placeholderStyle={{
                color: colors.black,
                paddingHorizontal: moderateScale(5),
                fontSize: textScale(12),
                fontFamily: fontFamily.regular,
              }}
            />
          ) : item?.type == 3 ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: moderateScaleVertical(5),
              }}>
              {item?.option?.map((itm) => renderRadioBtns(itm, item))}
            </View>
          ) : item?.type == 4 ? (
            <TextInput
              placeholder="Type here..."
              onChangeText={(text) => onChangeText(text, item)}
              style={styles.textInputStyle}
            />
          ) : (
            <View
              style={{
                flexDirection: 'row',

                flexWrap: 'wrap',
                marginTop: moderateScaleVertical(5),
              }}>
              {item?.option?.map((itm) => renderCheckBoxes(itm, item))}
            </View>
          )}
        </View>
      );
    },
    [attributeInfo],
  );

  const renderRadioBtns = useCallback(
    (item, data) => {
      return (
        <TouchableOpacity
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
    (item, data) => {
      return (
        <TouchableOpacity
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

  const renderP2Pcategories = useCallback(({item, index}) => {
    let imageURI = getImageUrl(
      item?.icon?.image_fit,
      item?.icon?.image_path,
      '160/160',
    );
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.categoryStyle}
          activeOpacity={0.7}
          onPress={() => {
            setP2Pcategory(item);
            setIsAutofillModal(true);
          }}>
          <FastImage
            style={{
              height: moderateScale(70),
              width: moderateScale(70),
              borderRadius: moderateScale(10),
            }}
            source={{
              uri: imageURI,
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
          />
          <Text style={styles.textStyle}>{item?.name || ''}</Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  const listFooterComponent = () => {
    return (
      <ButtonWithLoader
        btnText="Submit"
        btnStyle={{
          marginBottom: moderateScaleVertical(20),
          backgroundColor: themeColors.primary_color,
          borderWidth: 0,
        }}
        btnTextStyle={{
          textTransform: 'none',
        }}
      />
    );
  };

  const autoFillModalContent = () => {
    return (
      <View style={styles.modalViewStyle}>
        <Text style={styles.txtStyle}>Auto-fill your car details</Text>
        <Text style={styles.labelText}>Enter VIN / Chassis number</Text>
        <BorderTextInput
          onChangeText={(data) => setData(data)}
          containerStyle={{
            backgroundColor: colors.blackOpacity05,
            borderWidth: 0,
          }}
          textInputStyle={{
            paddingHorizontal: 16,
            fontSize: 18,
            fontFamily: fontFamily.regular,
          }}
          placeholder={''}
          value={data}
          autoCapitalize={'none'}
          autoFocus={true}
          returnKeyType={'next'}
        />

        <GradientButton
          containerStyle={{marginTop: moderateScale(18), width: '100%'}}
          colorsArray={['#FC7049', '#FD312C']}
          // onPress={_onLogin}
          btnText={strings.AUTO_FILL_DETAILS}
        />
        <TouchableOpacity
          style={styles.linkButton}
          activeOpacity={0.7}
          onPress={onFillManaully}>
          <Text style={styles.linkStyle}>{strings.FILL_MANUALLY}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const attributesModalContent = () => {
    return (
      <WrapperContainer>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
            paddingHorizontal: moderateScale(15),
          }}>
          <Header
            onPressLeft={() => setIsAttributesModal(false)}
            centerTitle={'Attribute Information'}
            leftIcon={imagePath.back1}
          />
          {true ? (
            <View>
              <FormLoader />
            </View>
          ) : (
            <View>
              <Text
                style={{
                  ...styles.attributeTitle,
                  marginTop: moderateScaleVertical(20),
                }}>
                Name
              </Text>
              <TextInput
                placeholder="Type here..."
                onChangeText={(text) => setName(text)}
                style={styles.textInputStyle}
              />

              <Text
                style={{
                  ...styles.attributeTitle,
                  marginTop: moderateScaleVertical(20),
                }}>
                Description
              </Text>
              <TextInput
                placeholder="Type here..."
                onChangeText={(text) => setDescription(text)}
                style={styles.textInputStyle}
              />

              <View
                style={{
                  flex: 1,
                  marginTop: moderateScaleVertical(16),
                }}>
                <FlatList
                  data={attributeInfo}
                  keyboardShouldPersistTaps={'handled'}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: moderateScaleVertical(18),
                      }}
                    />
                  )}
                  renderItem={renderAttributeOptions}
                  ListFooterComponent={listFooterComponent}
                />
              </View>
            </View>
          )}
        </View>
      </WrapperContainer>
    );
  };

  return (
    <WrapperContainer>
      <View style={{margin: moderateScale(18)}}>
        <Header leftIcon={imagePath.back1} />
        <Text style={styles.header}>{strings.SELECT_YOUR_CATEGORY}</Text>
        {isLoadingP2pCategories ? (
          <View>
            {['', '', '', ''].map(() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: moderateScale(10),
                }}>
                <HeaderLoader
                  widthLeft={width / 2.5}
                  rectWidthLeft={width / 2.5}
                  heightLeft={height / 6.5}
                  rectHeightLeft={height / 6.5}
                  isRight={false}
                  rx={15}
                  ry={15}
                />
                <HeaderLoader
                  widthLeft={width / 2.5}
                  rectWidthLeft={width / 2.5}
                  heightLeft={height / 6.5}
                  rectHeightLeft={height / 6.5}
                  isRight={false}
                  rx={15}
                  ry={15}
                />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={p2pCategories}
            renderItem={renderP2Pcategories}
            numColumns={2}
            keyExtractor={(item) => item.id}
            refreshing={isP2pCategoriesRefreshing}
            refreshControl={
              <RefreshControl
                refreshing={isP2pCategoriesRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
          />
        )}
      </View>
      <Modal
        style={styles.modalStyle}
        isVisible={isAutofillModal}
        onBackdropPress={() => setIsAutofillModal(false)}>
        {autoFillModalContent()}
      </Modal>
      <Modal
        style={{
          margin: 0,
        }}
        isVisible={isAttributesModal}
        onBackdropPress={() => setIsAttributesModal(false)}>
        {attributesModalContent()}
      </Modal>
    </WrapperContainer>
  );
};

export default PostCategory;

function stylesFunc({fontFamily, themeColors}) {
  const styles = StyleSheet.create({
    header: {
      marginTop: moderateScale(32),
      marginBottom: moderateScale(20),
      fontSize: 19,
      fontFamily: fontFamily.medium,
    },
    categoryStyle: {
      flex: 1,
      backgroundColor: colors.blackOpacity05,
      borderRadius: moderateScale(12),
      marginHorizontal: moderateScale(10),
      height: height / 6,
      width: width / 2.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: moderateScale(10),
    },
    textStyle: {
      fontFamily: fontFamily.medium,
      letterSpacing: 0.3,
      maxWidth: 100,
      marginTop: moderateScale(8),
      textAlign: 'center',
    },
    modalStyle: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: 0,
      marginBottom: 0,
    },
    modalViewStyle: {
      flex: 0.5,
      backgroundColor: 'white',
      padding: moderateScale(16),
      // alignItems: 'center',
      borderTopRightRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
    txtStyle: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      letterSpacing: 0.3,
      textAlign: 'center',
      marginVertical: moderateScale(18),
    },
    linkStyle: {
      color: colors.orange1,
      fontFamily: fontFamily.regular,
      fontSize: 16,
      marginTop: moderateScale(12),
      textAlign: 'center',
    },
    labelText: {
      textAlign: 'left',
      marginVertical: moderateScale(12),
      fontFamily: fontFamily.regular,
    },
    linkButton: {flex: 1, justifyContent: 'flex-end', marginBottom: '5%'},
    labelStyle: {
      fontFamily: fontFamily.bold,
      color: colors.blackOpacity43,
      fontSize: textScale(12),
      marginBottom: moderateScale(10),
    },
    attributeTitle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    textInputStyle: {
      backgroundColor: colors.blackOpacity05,
      height: moderateScaleVertical(40),
      marginTop: moderateScaleVertical(5),
      borderRadius: moderateScale(5),
      paddingHorizontal: moderateScale(5),
    },
  });
  return styles;
}
