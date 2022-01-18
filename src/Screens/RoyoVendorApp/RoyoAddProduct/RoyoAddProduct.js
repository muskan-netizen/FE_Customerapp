import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ToggleButton} from 'react-native-paper';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {customMarginBottom} from '../../../utils/constants/constants';
import ToggleSwitch from 'toggle-switch-react-native';

const RoyoAddProduct = (props) => {
  const {themeColors} = useSelector((state) => state?.initBoot);
  const [state, setState] = useState({
    stepPoints: [
      {
        id: 1,
        name: 'General  >',
      },
      {
        id: 2,
        name: 'Pricing   >',
      },
      {
        id: 3,
        name: 'Other Information',
      },
    ],
    currentStepIndex: 0,
    isOn: false,
  });
  const {stepPoints, currentStepIndex, isOn} = state;

  const updateState = (data) => {
    setState((state) => {
      return {...state, ...data};
    });
  };

  const customRight = () => {
    return (
      <GradientButton
        colorsArray={[themeColors.primary_color, themeColors.primary_color]}
        textStyle={styles.addProductBtn}
        marginTop={moderateScaleVertical(20)}
        marginBottom={moderateScaleVertical(20)}
        btnText={strings.SAVE}
        containerStyle={{height: moderateScale(30), width: moderateScale(60)}}
        btnStyle={{borderRadius: 5}}
      />
    );
  };

  const onStepChange = (itm, indx) => {
    updateState({
      currentStepIndex: indx,
    });
  };

  const renderStepIndicator = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => onStepChange(item, index)}
        style={{marginRight: moderateScale(12)}}>
        <Text
          style={{
            color:
              currentStepIndex >= index
                ? themeColors.primary_color
                : colors.black,
            fontSize: textScale(14),
            fontFamily: fontFamily.bold,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const _toggleOnOff = (isOn) => {
    updateState({
      isOn: isOn ? true : false,
    });
  };

  return (
    <WrapperContainer>
      <Header
        leftIcon={false}
        centerTitle={`Mango(Fruits)`}
        customRight={customRight}
      />
      <View style={{...styles.stepBarView, marginTop: moderateScale(10)}}>
        {stepPoints.map(renderStepIndicator)}
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        bounces={false}>
        {currentStepIndex == 0 ? (
          <View>
            <View style={styles.mainViewStyle}>
              <View
                style={{
                  ...styles.flexRowStyle,
                  marginTop: moderateScale(20),
                  marginHorizontal: moderateScale(15),
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`SKU ( a-z, A-Z,0-9,-,…)`}
                  labelStyle={styles.labelStyle}
                  placeholder={'xyz.LocalMarket.Tshirt'}
                  mainStyle={{flex: 0.48}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Url Slug'}
                  placeholder={'tshirt'}
                  mainStyle={{flex: 0.48}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
            <View
              style={{
                ...styles.stepBarView,
                marginTop: moderateScale(40),
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                }}>
                Product Information
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: moderateScale(10),
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,

                    marginRight: moderateScale(5),
                  }}>
                  English
                </Text>
                <Image source={imagePath.dropDownNew} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.mainViewStyle,
                paddingHorizontal: moderateScale(15),
              }}>
              <TextInputWithUnderlineAndLabel
                label={'Product Name'}
                placeholder={'tshirt'}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
                mainStyle={{
                  marginTop: moderateScale(20),
                }}
              />
              <TextInputWithUnderlineAndLabel
                label={'Product Description'}
                placeholder={'Lorem ipsum'}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <View style={styles.seoViewStyle}>
                <View
                  style={{
                    ...styles.flexRowStyle,
                    alignItems: 'center',
                  }}>
                  <Text>SEO</Text>
                  <Image source={imagePath.icUpArrow} />
                </View>
                <View
                  style={{
                    ...styles.flexRowStyle,
                    marginTop: moderateScale(20),
                  }}>
                  <TextInputWithUnderlineAndLabel
                    label={`Meta Title`}
                    labelStyle={styles.labelStyle}
                    placeholder={'xyz'}
                    mainStyle={{flex: 0.48}}
                    placeholderTextColor={colors.black}
                    txtInputStyle={styles.textInputStyle}
                  />
                  <TextInputWithUnderlineAndLabel
                    label={'Meta Keyword'}
                    placeholder={'xyz'}
                    mainStyle={{flex: 0.48}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.black}
                    txtInputStyle={styles.textInputStyle}
                  />
                </View>
                <TextInputWithUnderlineAndLabel
                  label={'Meta Descripton'}
                  placeholder={'Lorem ipsum'}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>

            <View
              style={{
                ...styles.stepBarView,
                marginTop: moderateScale(40),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                }}>
                Product Image
              </Text>
            </View>
            <View
              style={{
                ...styles.mainViewStyle,
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(10),
                alignItems: 'center',
              }}>
              <Image source={imagePath.icPlaceholder} />
            </View>
          </View>
        ) : currentStepIndex == 1 ? (
          <View
            style={{
              ...styles.mainViewStyle,
              paddingHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(20),
              }}>
              <TextInputWithUnderlineAndLabel
                label={`Price`}
                labelStyle={styles.labelStyle}
                placeholder={'645'}
                mainStyle={{flex: 0.2}}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <TextInputWithUnderlineAndLabel
                label={'Compare at price'}
                placeholder={'890'}
                mainStyle={{flex: 0.4}}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <View style={{flex: 0.31}}>
                <Text style={styles.labelStyle}>Track inventory</Text>
                <ToggleSwitch
                  isOn={isOn}
                  onColor={themeColors.primary_color}
                  offColor={colors.textGreyB}
                  size="medium"
                  onToggle={(isOn) => _toggleOnOff(isOn)}
                  animationSpeed={400}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.labelStyle}>Variant Information</Text>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.addProductBtn}
                marginTop={moderateScaleVertical(20)}
                marginBottom={moderateScaleVertical(20)}
                btnText={'Make variant set'}
                containerStyle={{
                  height: moderateScale(30),
                  width: moderateScale(130),
                }}
                btnStyle={{borderRadius: 5}}
              />
            </View>
            <Text style={styles.varientName}>Size</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScale(5),
              }}>
              <Image source={imagePath.icCheck1} />
              <Text style={styles.varientTypeTxt}>Small</Text>
            </TouchableOpacity>

            <View style={{height: 1, backgroundColor: colors.backgroundGrey}} />
            <View
              style={{
                ...styles.seoViewStyle,
                backgroundColor: 'rgba(68,215,182,0.17)',
                borderWidth: 0,
                marginTop: moderateScale(10),
              }}>
              <View
                style={{
                  ...styles.flexRowStyle,
                }}>
                <View style={{flex: 0.2}}>
                  <Text style={styles.labelStyle}>Image</Text>
                  <View>
                    <Image
                      source={imagePath.icPlaceholder}
                      style={{height: 20, width: 50}}
                    />
                  </View>
                </View>
                <TextInputWithUnderlineAndLabel
                  label={`Name`}
                  labelStyle={styles.labelStyle}
                  placeholder={'Tshirt'}
                  mainStyle={{flex: 0.35}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Quantity'}
                  placeholder={'76'}
                  mainStyle={{flex: 0.35}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
              <View
                style={{
                  ...styles.flexRowStyle,
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`Price`}
                  labelStyle={styles.labelStyle}
                  placeholder={'56'}
                  mainStyle={{flex: 0.2}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={`Cost price`}
                  labelStyle={styles.labelStyle}
                  placeholder={'235'}
                  mainStyle={{flex: 0.25}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Compare at price'}
                  placeholder={'120'}
                  mainStyle={{flex: 0.45}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              ...styles.mainViewStyle,
              paddingHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(20),
              }}>
              <TextInputWithUnderlineAndLabel
                label={`Select Add on set`}
                labelStyle={styles.labelStyle}
                placeholder={'645'}
                mainStyle={{flex: 0.45}}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <TextInputWithUnderlineAndLabel
                label={'Up sell products'}
                placeholder={'890'}
                mainStyle={{flex: 0.45}}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
            </View>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(10),
              }}>
              <TextInputWithUnderlineAndLabel
                label={`Cross sell products`}
                labelStyle={styles.labelStyle}
                placeholder={'645'}
                mainStyle={{flex: 0.45}}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <TextInputWithUnderlineAndLabel
                label={'Related products'}
                placeholder={'890'}
                mainStyle={{flex: 0.45}}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
            </View>

            <View
              style={{
                ...styles.seoViewStyle,
                borderWidth: 0,
                marginTop: moderateScale(10),
              }}>
              <View
                style={{
                  ...styles.flexRowStyle,
                  alignItems: 'center',
                  marginTop: moderateScale(20),
                }}>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>New</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>Featured</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>Inquiry only</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  marginTop: moderateScale(15),
                  marginBottom: moderateScale(35),
                  flexDirection: 'row',
                }}>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>Requires prescription</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>
                    Requires last mile delivery
                  </Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
              </View>

              <View
                style={{
                  ...styles.flexRowStyle,
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`Live`}
                  labelStyle={styles.labelStyle}
                  placeholder={'56'}
                  mainStyle={{flex: 0.31}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={`Brand`}
                  labelStyle={styles.labelStyle}
                  placeholder={'235'}
                  mainStyle={{flex: 0.31}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Tax Category'}
                  placeholder={'120'}
                  mainStyle={{flex: 0.31}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
              <View
                style={{
                  ...styles.flexRowStyle,
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`Select delay time`}
                  labelStyle={styles.labelStyle}
                  placeholder={'hrs'}
                  mainStyle={{flex: 0.45}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Up sell products'}
                  placeholder={'minutes'}
                  mainStyle={{flex: 0.45}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
};

export default RoyoAddProduct;

const styles = StyleSheet.create({
  container: {
    marginBottom: customMarginBottom(),
    flexGrow: 1,
  },
  mainViewStyle: {
    backgroundColor: colors.blackOpacity05,
    paddingBottom: moderateScale(20),
  },
  stepBarView: {
    height: moderateScale(45),
    backgroundColor: colors.blackOpacity10,
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },

  labelStyle: {
    fontFamily: fontFamily.bold,
    color: colors.blackOpacity43,
    fontSize: textScale(12),
    marginBottom: moderateScale(10),
  },
  textInputStyle: {
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: textScale(13),
  },
  seoViewStyle: {
    borderWidth: 0.7,
    borderColor: colors.blackOpacity20,
    borderRadius: moderateScale(5),
    backgroundColor: colors.white,
    padding: moderateScale(10),
  },
  flexRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addProductBtn: {
    textTransform: 'none',
  },
  varientTypeTxt: {
    fontSize: textScale(11),
    fontFamily: fontFamily.regular,
    marginLeft: moderateScale(5),
  },
  varientName: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
  },
});
