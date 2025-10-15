import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { getImageUrl } from '../utils/helperFunctions';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';



// helper → split array into chunks of "size"
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const CategoryGrid = ({ data, onCategoryPress,isDarkMode }) => {
  if (!data?.children || data?.children.length === 0) {
    return null;
  }

  const singleRow = (data?.children?.length || 0) < 8;
  const rows = singleRow ? [data.children] : chunkArray(data.children, 2); // split into columns of 2 unless small

  const renderColumn = ({ item }) => (
    <View style={styles.column}>
      {item.map((child) => {
        const imageURI =
          child?.icon?.ext === 'gif'
            ? child?.icon?.image_path
            : getImageUrl(child?.icon?.image_fit, child?.icon?.image_path, '360/360');

        return (
          <TouchableOpacity
            key={child.id}
            style={styles.categoryItem}
            onPress={() => onCategoryPress(child)}
          >
            <View style={styles.imageContainer}>
              <FastImage
                source={{ uri: imageURI }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
            </View>
            <Text
              style={{...styles.categoryName,color:isDarkMode ? MyDarkTheme.colors.text : colors.textGrey}}
              numberOfLines={2}
            >
              {child?.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{...styles.sectionTitle,color:isDarkMode ? MyDarkTheme.colors.text : colors.textGrey}} >{data?.name}</Text>
      {singleRow ? (
        <FlatList
          horizontal
          data={data.children}
          renderItem={({item: child}) => {
            const imageURI =
              child?.icon?.ext === 'gif'
                ? child?.icon?.image_path
                : getImageUrl(child?.icon?.image_fit, child?.icon?.image_path, '360/360');
            return (
              <TouchableOpacity
                key={child.id}
                style={styles.categoryItem}
                onPress={() => onCategoryPress(child)}
              >
                <View style={styles.imageContainer}>
                  <FastImage source={{ uri: imageURI }} style={styles.categoryImage} resizeMode="cover" />
                </View>
                <Text style={{...styles.categoryName,color:isDarkMode ? MyDarkTheme.colors.text : colors.textGrey}} numberOfLines={2}>
                  {child?.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => String(item?.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: moderateScale(8), alignItems: 'flex-start' }}
        />
      ) : (
        <FlatList
          horizontal
          data={rows}
          renderItem={renderColumn}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: moderateScale(8), alignItems: 'flex-start' }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: moderateScale(12),
  },
  sectionTitle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.bold,
    color: colors.textGrey,
    marginBottom: moderateScale(10),
    textAlign: 'left',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (moderateScale(width) - moderateScale(48)) / moderateScale(4),
    marginBottom: moderateScale(2),
  },
  imageContainer: {
    borderRadius: moderateScale(16),
    width: moderateScale(70),
    height: moderateScale(70),
    backgroundColor: colors.lightGreyBg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(6),
    marginBottom: moderateScale(8),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(16),
  },
  categoryName: {
    fontSize: textScale(10),
    lineHeight: textScale(14),
    height: textScale(32),
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
  },
});

export default CategoryGrid;
