import {View, Text, FlatList} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../../styles/responsiveSize';
import Header from '../../../Components/Header';
import FormLoader from '../../../Components/Loaders/FormLoader';
import {TextInput} from 'react-native-gesture-handler';
import actions from '../../../redux/actions';

const AttributeInformation = () => {
  const [isAttributesModal, setIsAttributesModal] = useState(false);
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    getListOfAvailableAttributes();
  }, []);

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
