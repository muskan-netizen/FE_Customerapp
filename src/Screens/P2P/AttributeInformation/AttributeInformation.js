import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import Header from '../../../Components/Header';
import FormLoader from '../../../Components/Loaders/FormLoader';
import actions from '../../../redux/actions';
import imagePath from '../../../constants/imagePath';
import {useSelector} from 'react-redux';
import {showError} from '../../../utils/helperFunctions';
import {MultiSelect} from 'react-native-element-dropdown';
import {isEmpty} from 'lodash';
import {TouchableOpacity} from 'react-native';
import {
  cameraHandler,
  checkValueExistInAry,
} from '../../../utils/commonFunction';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import {Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import validations from '../../../utils/validations';
import {hitSlopProp} from '../../../styles/commonStyles';
import ActionSheet from 'react-native-actionsheet';
import strings from '../../../constants/lang';
import {v4 as uuidv4} from 'uuid';

const AttributeInformation = ({route, navigation}) => {
  let paramData = route?.params;
  console.log(paramData, '<===paramData');
  const {appData, currencies, languages, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAttributes, setLoadingAttributes] = useState(true);
  const [isLoadingSubmitAttributes, setLoadingSubmitAttributes] =
    useState(false);

  const [productImgs, setProductImgs] = useState([]);

  useEffect(() => {
    getListOfAvailableAttributes();
  }, []);

  const getListOfAvailableAttributes = () => {
    actions
      .getAvailableAttributes(
        `?category_id=${paramData?.category_id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===res');
        setLoadingAttributes(false);
        setAttributeInfo(res?.data || []);
      })
      .catch(errorMethod);
  };

  const isValidData = () => {
    const error = validations({
      productName: name,
      productDetail: description,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onSubmitAttributes = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    setLoadingSubmitAttributes(true);
    let formData = new FormData();
    formData.append('product_name', name);
    formData.append('body_html', description);
    productImgs.map((item) => {
      formData.append('file[]', item);
    });
    let apiObj = {};
    attributeInfo.map((item, index) => {
      let optionData = [];
      item?.option?.map((item, inx) => {
        optionData[inx] = {
          option_id: item?.id,
          option_title: item?.title,
        };
      });
      apiObj[item?.id] = {
        type: item?.type,
        id: item?.id,
        attribute_title: item?.title,
        option: optionData,
        value: item?.values,
      };
    });
    formData.append('attribute', JSON.stringify(apiObj));
    console.log(formData, '<===formData onSubmitAttributes');

    actions
      .submitProductWithAttributes(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        setLoadingSubmitAttributes(false);
        console.log(res, '<===response onSubmitAttributes');
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    setLoadingAttributes(false);
    setLoadingSubmitAttributes(false);

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

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const cameraHandle = (index) => {
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          if (res && (res?.sourceURL || res?.path)) {
            let file = {
              id: uuidv4(),
              name:
                Platform.OS == 'ios'
                  ? res?.filename
                  : res?.path.substring(res?.path.lastIndexOf('/') + 1),
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };
            setProductImgs([...productImgs, file]);
          }
        })
        .catch((err) => {});
    }
  };

  const removeProductImg = (item) => {
    console.log(item, 'item/....item');
    const productImgsData = [...productImgs];
    let itmIndx = productImgsData.findIndex((itm) => itm?.id == item?.uri);
    productImgsData.splice(itmIndx, 1);
    setProductImgs(productImgsData);
  };

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
              {item?.option?.map((itm) => renderRadioBtns(itm, item))}
            </View>
          ) : item?.type == 4 ? (
            <TextInput
              placeholder="Type here..."
              onChangeText={(text) => onChangeText(text, item)}
              style={styles.textInput}
            />
          ) : (
            <View style={styles.checkBox}>
              {item?.option?.map((itm) => renderCheckBoxes(itm, item))}
            </View>
          )}
        </View>
      );
    },
    [attributeInfo],
  );

  const listFooterComponent = () => {
    return (
      <ButtonWithLoader
        btnText="Submit"
        btnStyle={styles.submitBtn}
        onPress={onSubmitAttributes}
        isLoading={isLoadingSubmitAttributes}
        btnTextStyle={{
          textTransform: 'none',
        }}
      />
    );
  };

  return (
    <WrapperContainer>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <Header
          centerTitle={'Attribute Information'}
          leftIcon={imagePath.back1}
        />
        {isLoadingAttributes ? (
          <View style={{flex: 1}}>
            <FormLoader />
            <FormLoader
              loaderStyle={{
                marginTop: 10,
              }}
            />
            <FormLoader />
          </View>
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}>
            {!isEmpty(attributeInfo) ? (
              <View
                style={{
                  paddingHorizontal: moderateScale(20),
                }}>
                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Name
                </Text>
                <TextInput
                  placeholder="Enter name"
                  onChangeText={(text) => setName(text)}
                  style={styles.textInput}
                />

                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Description
                </Text>
                <TextInput
                  placeholder="Enter description"
                  onChangeText={(text) => setDescription(text)}
                  multiline
                  style={{
                    ...styles.textInput,
                    height: moderateScaleVertical(100),
                  }}
                />
                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Add Image
                </Text>
                {!isEmpty(productImgs) && (
                  <View
                    style={{
                      marginBottom: moderateScaleVertical(5),
                    }}>
                    {productImgs.map((itm) => (
                      <View>
                        <Image
                          source={{uri: itm?.uri}}
                          style={{
                            width: '96%',
                            height: moderateScaleVertical(100),
                            borderRadius: moderateScale(5),
                            marginTop: moderateScale(5),
                          }}
                        />
                        <TouchableOpacity
                          hitSlop={hitSlopProp}
                          onPress={() => removeProductImg(itm)}
                          style={{position: 'absolute', right: 4, top: -2}}>
                          <Image source={imagePath.icRemoveIcon} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity onPress={showActionSheet} activeOpacity={0.7}>
                  <Image
                    source={imagePath.icPlaceholder}
                    style={{
                      marginTop: moderateScaleVertical(5),
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    marginTop: moderateScaleVertical(16),
                  }}>
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
                    ListFooterComponent={listFooterComponent}
                  />
                  <View style={{height: moderateScaleVertical(65)}} />
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginTop: height / 3.5,
                  alignItems: 'center',
                }}>
                <Image source={imagePath.icEmptyCart} />
              </View>
            )}
          </KeyboardAwareScrollView>
        )}
      </View>
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
    </WrapperContainer>
  );
};

export default AttributeInformation;

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
      color: colors.black,
    },
    textInput: {
      backgroundColor: colors.blackOpacity05,
      height: moderateScaleVertical(40),
      marginTop: moderateScaleVertical(5),
      borderRadius: moderateScale(5),
      paddingHorizontal: moderateScale(5),
    },
    multiSelect: {
      height: moderateScaleVertical(40),
      backgroundColor: colors.blackOpacity05,
      borderRadius: moderateScale(5),
    },
    multiSelectPlaceholder: {
      color: colors.black,
      paddingHorizontal: moderateScale(5),
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
    },
    radioBtn: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: moderateScaleVertical(5),
    },
    checkBox: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: moderateScaleVertical(5),
    },
    submitBtn: {
      marginBottom: moderateScaleVertical(20),
      backgroundColor: themeColors.primary_color,
      borderWidth: 0,
    },
  });
  return styles;
}
