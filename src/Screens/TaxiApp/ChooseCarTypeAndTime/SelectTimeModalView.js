import React, {useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import {getColorCodeWithOpactiyNumber} from '../../../utils/helperFunctions';

export default function SelectTimeModalView({
  isLoading = false,
  availAbleTimes = [],
  date = new Date(),
  onPressBack,
  selectedAvailableTimeOption = null,
  selectAvailAbleTime,
  _selectTime,
  _onDateChange,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const [state, setState] = useState({
    isTimerPickerModal: false,
  });

  const {isTimerPickerModal} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  const onDateChange = (value) => {
    console.log(value, 'value');
    _onDateChange(value);
  };

  const openCalenderPicker = (value) => {
    // _openCalenderPicker(value);
  };

  const openTimePicker = (value) => {
    updateState({
      isTimerPickerModal: true,
    });
    // _openTimePicker(value);
  };

  return (
    <View
      style={
        isDarkMode
          ? [
              styles.bottomView,
              {width: width, backgroundColor: MyDarkTheme.colors.background},
            ]
          : [styles.bottomView, {width: width}]
      }>
      <View style={{marginBottom: moderateScale(20)}}>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingTop: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={{flex: 0.2}} onPress={onPressBack}>
            <Image
              style={
                isDarkMode
                  ? {tintColor: MyDarkTheme.colors.text}
                  : {tintColor: null}
              }
              source={imagePath.backArrowCourier}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 0.6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={
                isDarkMode
                  ? [styles.carType, {color: MyDarkTheme.colors.text}]
                  : styles.carType
              }>
              {strings.SCHEDULE_TRIP}
            </Text>
          </View>
          <View style={{flex: 0.2}}></View>
        </View>

        <View
          style={{
            marginHorizontal: moderateScale(20),
            paddingTop: moderateScaleVertical(50),
          }}>
          <TextInputWithUnderlineAndLabel
            // onChangeText={_onChangeText('')}
            // value={email}
            label={strings.PICKUP_DATE}
            autoCapitalize={'none'}
            containerStyle={{marginVertical: moderateScaleVertical(10)}}
            txtInputStyle={{fontFamily: fontFamily.regular}}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{color: colors.textGrey}}
            lableViewStyle={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            isLableIcon={true}
            labelIconPath={imagePath.calendarB}
            labelIconStyle={{tintColor: themeColors.primary_color}}
            onPressLabel={openCalenderPicker}
          />
          <TextInputWithUnderlineAndLabel
            // onChangeText={_onChangeText('')}
            // value={email}
            label={strings.PICKUP_TIME}
            autoCapitalize={'none'}
            containerStyle={{marginVertical: moderateScaleVertical(10)}}
            txtInputStyle={{fontFamily: fontFamily.regular}}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{color: colors.textGrey}}
            mainStyle={{marginTop: moderateScaleVertical(30)}}
            lableViewStyle={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            isLableIcon={true}
            labelIconPath={imagePath.icTime}
            labelIconStyle={{tintColor: themeColors.primary_color}}
            onPressLabel={openTimePicker}
          />

          <Modal
            transparent={true}
            isVisible={isTimerPickerModal}
            animationType={'none'}
            style={styles.modalContainer}
            onLayout={(event) => {
              updateState({viewHeight: event.nativeEvent.layout.height});
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.black.substr(1),
                  50,
                ),
              }}>
              <View
                style={{
                  backgroundColor: themeColors.primary_color,
                  paddingTop: moderateScaleVertical(45),
                  overflow: 'hidden',
                  borderRadius: 12,
                }}>
                <DatePicker
                  date={date}
                  mode="time"
                  textColor={isDarkMode ? '#fff' : colors.blackB}
                  minimumDate={new Date()}
                  style={{
                    width: width / 1.5,
                    height: height / 3.2,
                    backgroundColor: colors.white,
                    alignSelf: 'center',
                  }}
                  // onDateChange={setDate}
                  onDateChange={(value) => onDateChange(value)}
                />
                <View
                  style={{
                    backgroundColor: colors.white,
                    paddingBottom: moderateScaleVertical(45),
                    overflow: 'hidden',
                  }}>
                  <Text>Cancel</Text>
                  <View></View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View
          style={{
            marginVertical: moderateScaleVertical(20),
            marginHorizontal: moderateScale(20),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{textTransform: 'none', fontSize: textScale(16)}}
            onPress={_selectTime}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.SCHEDULE}
          />
        </View>
      </View>
    </View>
  );
}
