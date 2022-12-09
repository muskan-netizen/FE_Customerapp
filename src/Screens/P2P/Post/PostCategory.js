import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
//custom components
import WrapperContainer from '../../../Components/WrapperContainer';
import Header from '../../../Components/Header';
import BorderTextInput from '../../../Components/BorderTextInput';
import GradientButton from '../../../Components/GradientButton';
//constants
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
//styling
import {height, moderateScale, width} from '../../../styles/responsiveSize';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';
//3rd party
import Modal from 'react-native-modal';
import BorderTextInputWithLable from '../../../Components/BorderTextInputWithLable';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '8694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const PostCategory = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //callbacks
  const renderItem = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.categoryStyle}
          activeOpacity={0.7}
          onPress={toggleModal}>
          <Image source={imagePath.cabImage} />
          <Text style={styles.textStyle}>Accessories bikes</Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <WrapperContainer>
      <View style={{margin: moderateScale(18)}}>
        <Header leftIcon={imagePath.back1} />
        <Text style={styles.header}>{strings.SELECT_YOUR_CATEGORY}</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={DATA}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item) => item.id}
        />
      </View>
      <Modal
        style={styles.modalStyle}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}>
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
          <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
            <Text style={styles.linkStyle}>{strings.FILL_MANUALLY}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default PostCategory;

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
    flex: 0.4,
    backgroundColor: 'white',
    padding: moderateScale(16),
    // alignItems: 'center',
    borderRadius: moderateScale(24),
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
  linkButton: {flex: 1, justifyContent: 'flex-end', marginBottom: '10%'},
});
