import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {moderateScaleVertical} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.lightGreyBorder,
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScaleVertical(25),
      color: colors.textGreyB,
      alignSelf: 'center',
    },
    headerTextAll: {
      ...commonStyles.mediumFont14,
      color: colors.themeColor,
      alignSelf: 'center',
    },
  });
  return styles;
};
