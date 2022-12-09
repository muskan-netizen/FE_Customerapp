import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
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
import {TextInput} from 'react-native-gesture-handler';
import actions from '../../../redux/actions';
import imagePath from '../../../constants/imagePath';
import {useSelector} from 'react-redux';

const AttributeInformation = ({route, navigation}) => {
  let paramData = route?.params;

  const {
    appData,
    currencies,
    languages,
    appStyle,

    themeColors,
  } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const [isAttributesModal, setIsAttributesModal] = useState(false);
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAttributes, setLoadingAttributes] = useState(false);
  console.log(route, 'ROUTE HERE+++');

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
        setAttributeInfo(res?.data);
      })
      .catch((err) => {
        setLoadingAttributes(false);
        console.log(err, '<===error');
        // modalRef.current.showMessage({
        //   type: 'danger',
        //   icon: 'danger',
        //   message: err?.message,
        // });
      });
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
