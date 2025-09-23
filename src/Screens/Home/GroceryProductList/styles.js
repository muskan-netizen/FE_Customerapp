import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../../styles/responsiveSize';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    // Left Category Sidebar Styles
    categoryContainer: {
        width: width * 0.22,
        paddingVertical: moderateScaleVertical(10),
    },
    categoryScrollContent: {
        paddingBottom: moderateScaleVertical(20),
    },
    categoryItem: {
        paddingVertical: moderateScaleVertical(6),
        paddingHorizontal: moderateScale(6),
    },
    categoryContent: {
        alignItems: 'center',
    },
    imageContainer: {
        borderRadius: moderateScale(16),
        backgroundColor: colors.white,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(6),
        marginBottom: moderateScale(8),
    },
    categoryImage: {
        width: moderateScale(40),
        height: moderateScale(40),
    },
    categoryText: {
        fontSize: textScale(12),
        fontFamily: fontFamily?.medium,
        color: colors.textGrey,
        textAlign: 'center',
        lineHeight: textScale(16),
    },
    // Right Product Grid Styles
    productContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: moderateScale(6),
    },
    productGrid: {
        paddingBottom: moderateScaleVertical(20),
    },
    productRow: {
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(4),
    },
    productSeparator: {
        height: moderateScaleVertical(12),
    },
});
