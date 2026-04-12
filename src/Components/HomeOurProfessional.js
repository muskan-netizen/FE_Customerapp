import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

const ACCENT = '#f97316';
const ACCENT2 = '#0f172a';
const SUBTLE = '#64748b';

const CARD_W = width * 0.46;
const IMG_H = moderateScaleVertical(145);

const professionalWork = [
  {
    id: 'verified-pro',
    title: 'Verified Professionals',
    description: 'Trusted expert teams for every booking.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trained-team',
    title: 'Well Trained Teams',
    description: 'Quality checks for every service provider.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'reliable-service',
    title: 'Safe & Reliable',
    description: 'Consistent delivery for home and office.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  },
];

const HomeOurProfessional = () => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Professionals</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Our Work</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slider}>
        {professionalWork.map((item, index) => (
          <View
            key={item.id}
            style={[styles.card, { marginLeft: index === 0 ? 0 : moderateScale(10) }]}>
            {/* Orange accent top strip */}
            <View style={styles.accentStrip} />
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.cardDesc}>{item.description}</Text>
            </View>
          </View>
        ))}
        <View style={{ width: moderateScale(16) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: moderateScaleVertical(14),
    paddingHorizontal: moderateScale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(10),
  },
  sectionTitle: {
    fontSize: textScale(13),
    fontWeight: '700',
    color: ACCENT2,
  },
  seeAll: {
    fontSize: textScale(10),
    fontWeight: '600',
    color: ACCENT,
  },
  slider: {
    paddingVertical: moderateScaleVertical(4),
  },
  card: {
    width: CARD_W,
    backgroundColor: '#FDF8F4',
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  accentStrip: {
    height: moderateScaleVertical(3),
    width: '100%',
    backgroundColor: ACCENT,
  },
  cardImage: {
    width: CARD_W,
    height: IMG_H,
  },
  cardBody: {
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScaleVertical(8),
    paddingBottom: moderateScaleVertical(12),
    minHeight: moderateScaleVertical(62),
  },
  cardTitle: {
    fontSize: textScale(11),
    fontWeight: '700',
    color: ACCENT2,
    marginBottom: moderateScaleVertical(4),
    lineHeight: moderateScaleVertical(15),
  },
  cardDesc: {
    fontSize: textScale(9.5),
    color: SUBTLE,
    lineHeight: moderateScaleVertical(14),
  },
});

export default React.memo(HomeOurProfessional);
