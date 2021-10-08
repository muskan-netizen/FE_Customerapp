import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

const MultiScreen = (props) => {
  const {
    screenName,
    mainViewStyle,
    selectedScreen,
    selectedScreenIndex,
    activeTintColor = colors.themeColor2,
    inActiveTintColor = colors.blackOpacity66,
    borderWidth = 1,
    tabTextStyle,
  } = props;
  return (
    <View
      style={styles.container}>
      <View style={{...styles.mainView, ...mainViewStyle}}>
        {screenName.map((value, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => selectedScreen(index)}>
              <Text
                style={[
                  styles.activeContractTextStyle,
                  {
                    textAlign: 'left',
                    fontFamily:
                      selectedScreenIndex == index
                        ? fontFamily.bold
                        : fontFamily.regular,
                    color:
                      selectedScreenIndex === index
                        ? activeTintColor
                        : inActiveTintColor,
                  },
                  tabTextStyle,
                ]}>
                {value}
              </Text>
              <View
                style={{
                  marginTop: moderateScaleVertical(5),
                  borderWidth: selectedScreenIndex === index ? borderWidth : 0,
                  borderColor: colors.themeColor2,
                  // width: 50,
                  flex: 1,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MultiScreen;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.blackOpacity20,
    borderBottomWidth: 0.5,
    marginBottom: moderateScaleVertical(16),
  },
  mainView: {
    flexDirection: 'row',
    maxWidth: 500,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  activeContractTextStyle: {
    fontSize: textScale(14),
    color: colors.blackOpacity43,
    fontFamily: fontFamily.bold,
    marginTop: moderateScaleVertical(20),
  },
});
