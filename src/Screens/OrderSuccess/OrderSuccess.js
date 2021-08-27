import React, {useState} from 'react';
import {Platform} from 'react-native';
import {Image, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import stylesFunc from './styles';
export default function OrderSuccess({navigation, route}) {
  const currentTheme = useSelector((state) => state.appTheme);
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const paramData = route?.params?.data;
  console.log(paramData, 'paramData');
  const [state, setState] = useState({});
  const {} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {themeColors, themeLayouts} = currentTheme;

  const viewOrderDetail = () => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: paramData?.orderDetail?.id,
    });
  };
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <KeyboardAwareScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
        <View style={styles.doneIconView}>
          <Image
            source={imagePath.successfulIcon}
            style={{marginBottom: moderateScaleVertical(30)}}
          />
          <Text style={styles.requestSubmitText}>
            {'Your order has been submitted!'}
          </Text>
          <Text style={styles.successfully}>successfully!</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginVertical: moderateScaleVertical(50),
          }}>
          <Text style={styles.yourAWBText}>
            {`Your order number is ${
              paramData && paramData?.orderDetail
                ? paramData?.orderDetail?.order_number
                : ''
            }`}
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          alignItems: 'center',
          marginBottom: moderateScaleVertical(90),
        }}>
        <ButtonComponent
          btnText={strings.VIEW_DETAIL}
          onPress={viewOrderDetail}
          textStyle={{color: colors.textBlue}}
          borderRadius={moderateScale(13)}
          containerStyle={{
            backgroundColor: 'rgba(67,162,231,0.3)',
            width: width / 1.2,
          }}
        />
      </View>
      {/* */}
    </WrapperContainer>
  );
}
