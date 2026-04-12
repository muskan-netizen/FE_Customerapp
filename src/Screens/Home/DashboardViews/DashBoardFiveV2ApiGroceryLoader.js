import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MyDarkTheme } from '../../../styles/theme';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import { getColorSchema } from '../../../utils/utils';

// Single shared shimmer animation
const useShimmer = () => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [anim]);
  return anim;
};

const SkeletonBox = ({ style, shimmer, isDarkMode }) => {
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });
  const bg = isDarkMode ? '#3a3a3a' : '#E0E0E0';
  return (
    <Animated.View style={[{ backgroundColor: bg, borderRadius: 8, opacity }, style]} />
  );
};

const DashBoardFiveV2ApiLoader = () => {
  const { themeColor, themeToggle } = useSelector(state => state?.initBoot);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const shimmer = useShimmer();
  const S = p => <SkeletonBox style={p.style} shimmer={shimmer} isDarkMode={isDarkMode} />;

  const CARD_W = width * 0.44;
  const SPOT_W = width * 0.44;

  return (
    <ScrollView
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff' }}>

      {/* Banner */}
      <S style={styles.banner} />

      {/* Category icons — 2 rows x 4 cols */}
      <View style={styles.categorySection}>
        {[0, 1].map(row => (
          <View key={row} style={styles.categoryRow}>
            {[0, 1, 2, 3].map(col => (
              <View key={col} style={styles.categoryItem}>
                <S style={styles.categoryIcon} />
                <S style={styles.categoryLabel} />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Section: Explore Services */}
      <View style={styles.sectionHeader}>
        <S style={styles.sectionTitle} />
        <S style={styles.seeAllBtn} />
      </View>
      <ScrollView horizontal scrollEnabled={false} style={styles.hScroll}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.serviceCard, { width: CARD_W, marginLeft: i === 0 ? moderateScale(16) : moderateScale(10) }]}>
            <S style={[styles.serviceCardImage, { width: CARD_W }]} />
            <View style={styles.serviceCardBody}>
              <S style={styles.cardTitle} />
              <S style={styles.cardPrice} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Section: Spotlight */}
      <View style={styles.sectionHeader}>
        <S style={styles.sectionTitle} />
        <S style={styles.seeAllBtn} />
      </View>
      <ScrollView horizontal scrollEnabled={false} style={styles.hScroll}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.serviceCard, { width: SPOT_W, marginLeft: i === 0 ? moderateScale(16) : moderateScale(10) }]}>
            <S style={[styles.serviceCardImage, { width: SPOT_W }]} />
            <View style={styles.serviceCardBody}>
              <S style={styles.cardTitle} />
              <S style={styles.cardPrice} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Section: Single Category */}
      <View style={styles.sectionHeader}>
        <S style={styles.sectionTitle} />
      </View>
      <ScrollView horizontal scrollEnabled={false} style={styles.hScroll}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={{ marginLeft: i === 0 ? moderateScale(16) : moderateScale(10) }}>
            <S style={styles.portraitCard} />
            <S style={[styles.cardTitle, { marginTop: moderateScaleVertical(6) }]} />
            <S style={[styles.cardPrice, { marginTop: moderateScaleVertical(4) }]} />
          </View>
        ))}
      </ScrollView>

      <View style={{ height: moderateScaleVertical(40) }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: moderateScaleVertical(180),
    marginHorizontal: moderateScale(16),
    marginTop: moderateScaleVertical(14),
    borderRadius: 12,
  },
  categorySection: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScaleVertical(18),
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScaleVertical(14),
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - moderateScale(32)) / 4,
  },
  categoryIcon: {
    width: moderateScale(54),
    height: moderateScaleVertical(54),
    borderRadius: 10,
  },
  categoryLabel: {
    width: moderateScale(44),
    height: moderateScaleVertical(10),
    borderRadius: 5,
    marginTop: moderateScaleVertical(7),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
    marginTop: moderateScaleVertical(18),
    marginBottom: moderateScaleVertical(10),
  },
  sectionTitle: {
    width: moderateScale(130),
    height: moderateScaleVertical(14),
    borderRadius: 6,
  },
  seeAllBtn: {
    width: moderateScale(56),
    height: moderateScaleVertical(24),
    borderRadius: 12,
  },
  hScroll: {
    overflow: 'hidden',
  },
  serviceCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  serviceCardImage: {
    height: moderateScaleVertical(124),
    borderRadius: 8,
  },
  serviceCardBody: {
    paddingHorizontal: moderateScale(6),
    paddingTop: moderateScaleVertical(7),
  },
  cardTitle: {
    width: '80%',
    height: moderateScaleVertical(11),
    borderRadius: 5,
  },
  cardPrice: {
    width: '50%',
    height: moderateScaleVertical(11),
    borderRadius: 5,
    marginTop: moderateScaleVertical(6),
  },
  portraitCard: {
    width: moderateScale(130),
    height: moderateScaleVertical(150),
    borderRadius: 8,
  },
});

export default React.memo(DashBoardFiveV2ApiLoader);
