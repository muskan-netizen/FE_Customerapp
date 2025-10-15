import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { moderateScale, textScale } from '../../styles/responsiveSize';

export default function stylesFunc({ fontFamily, themeColors, isDarkMode }) {
  return StyleSheet.create({
    headerBar: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(6)
    },
    headerTitle: { fontFamily: fontFamily?.bold, fontSize: textScale(20), color: isDarkMode ? colors.white : colors.black },
    sortChip: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderColor: colors.blackOpacity20, borderRadius: moderateScale(10), paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(10), backgroundColor: colors.white
    },
    sortChipIcon: {
      width: moderateScale(18), height: moderateScale(18),
      marginRight: moderateScale(8)
    },
    sortChipTxt: { fontFamily: fontFamily?.medium, fontSize: textScale(14), color: colors.black },
    sortChipArrow: {
      width: moderateScale(16), height: moderateScale(16),
      marginLeft: moderateScale(8), tintColor: colors.black
    },

    // Modal styles (reusing ecommerce sort styles)
    sortHeaderContainer: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', paddingTop: moderateScale(8)
    },
    sortHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
    sortTitle: {
      fontFamily: fontFamily?.bold, fontSize: textScale(18),
      color: isDarkMode ? colors.white : colors.black
    },
    sortIcon: {
      width: moderateScale(20), height: moderateScale(20),
      marginRight: moderateScale(8)
    },
    sortCloseBtn: {
      paddingHorizontal: moderateScale(6),
      paddingVertical: moderateScale(6), borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: colors.blackOpacity20
    },
    sortCloseTxt: {
      width: moderateScale(16),
      height: moderateScale(16)
    },
    divider: {
      height: 1,
      backgroundColor: colors.blackOpacity10,
      marginVertical: moderateScale(8)
    },
    sortOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: moderateScale(16)
    },
    sortOptionText: {
      fontSize: textScale(16),
      color: isDarkMode ? colors.white : colors.black, fontFamily: fontFamily?.semiBold
    },
    sortChevron: {
      width: moderateScale(14), height: moderateScale(14),
      tintColor: isDarkMode ? colors.white : colors.black
    },
    sortModalMain: {
      paddingHorizontal: moderateScale(16),
      paddingBottom: moderateScale(10)
    },
  });
}


