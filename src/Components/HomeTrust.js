import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

const ACCENT  = '#f97316';
const ACCENT2 = '#0f172a';
const SUBTLE  = '#64748b';
const GOLD    = '#f0a020';

const stats = [
  { value: '200K+', label: 'Services\nCompleted', iconBg: '#FFF7ED' },
  { value: '30K+',  label: 'Restaurants\nSaved',     iconBg: '#F0FDF4' },
  { value: '1000+', label: 'Verified\nExperts',       iconBg: '#EEF2FF' },
];

const HomeTrust = () => {
  return (
    <View style={styles.section}>

      {/* Header row — matches other sections */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Why Trust Us?</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓ Verified</Text>
        </View>
      </View>

      {/* Main card */}
      <View style={styles.card}>
        {/* Top accent strip */}
        <View style={styles.accentStrip} />

        {/* Icon + headline */}
        <View style={styles.top}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Text style={styles.headline}>
            With Restocare, you're not just hiring Restaurant staff, you're choosing{' '}
            <Text style={styles.highlight}>peace of mind!</Text>
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.iconBg }]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScaleVertical(20),
    marginBottom: moderateScaleVertical(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScaleVertical(10),
  },
  sectionTitle: {
    fontSize: textScale(13),
    fontWeight: '700',
    color: ACCENT2,
  },
  badge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(4),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeText: {
    fontSize: textScale(10),
    fontWeight: '600',
    color: '#16A34A',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  accentStrip: {
    height: moderateScaleVertical(3),
    backgroundColor: ACCENT,
  },
  top: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScaleVertical(20),
    paddingBottom: moderateScaleVertical(16),
  },
  iconCircle: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScaleVertical(14),
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  iconText: {
    fontSize: textScale(24),
    color: '#059669',
    fontWeight: '800',
  },
  headline: {
    fontSize: textScale(13),
    fontWeight: '700',
    color: ACCENT2,
    textAlign: 'center',
    lineHeight: moderateScaleVertical(20),
  },
  highlight: {
    color: GOLD,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: moderateScale(16),
  },
  statsRow: {
    flexDirection: 'row',
    padding: moderateScale(12),
    gap: moderateScale(8),
  },
  statCard: {
    flex: 1,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScaleVertical(12),
    paddingHorizontal: moderateScale(6),
    alignItems: 'center',
  },
  statValue: {
    fontSize: textScale(16),
    fontWeight: '800',
    color: ACCENT2,
    letterSpacing: -0.3,
    marginBottom: moderateScaleVertical(4),
  },
  statLabel: {
    fontSize: textScale(9),
    color: SUBTLE,
    textAlign: 'center',
    lineHeight: moderateScaleVertical(13),
    fontWeight: '600',
  },
});

export default React.memo(HomeTrust);
