import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

const ACCENT  = '#f97316';
const ACCENT2 = '#0f172a';
const SUBTLE  = '#64748b';

const faqItems = [
  {
    id: 'recurring-service',
    question: 'Can I book a recurring service?',
    answer: 'Yes, you can schedule recurring bookings with flexible frequency options.',
    icon: '🔄',
    iconBg: '#EEF2FF',
  },
  {
    id: 'trust-service',
    question: 'How can I trust your service?',
    answer: 'All professionals are verified, trained and reviewed by customers like you.',
    icon: '✅',
    iconBg: '#F0FDF4',
  },
  {
    id: 'provide-equipment',
    question: 'Do I need to provide cleaning equipment?',
    answer: 'No, most services include equipment and supplies unless otherwise noted.',
    icon: '🛠️',
    iconBg: '#FFF7ED',
  },
  {
    id: 'price-calculation',
    question: 'How are the prices calculated?',
    answer: 'Pricing is based on service type, duration, and any add-ons you select.',
    icon: '💰',
    iconBg: '#FFFBEB',
  },
  {
    id: 'support',
    question: 'How do I contact support?',
    answer: 'You can reach support through the app chat or the number listed in the menu.',
    icon: '💬',
    iconBg: '#F0F9FF',
  },
];

const FaqItem = ({ item, isOpen, onPress }) => {
  const anim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  const toggle = () => {
    Animated.timing(anim, {
      toValue: isOpen ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
    onPress();
  };

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggle}
      style={[styles.card, isOpen && styles.cardOpen]}>

      {/* Left accent bar when open */}
      {isOpen && <View style={styles.accentBar} />}

      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>

        <Text style={[styles.question, isOpen && styles.questionOpen]}>
          {item.question}
        </Text>

        <Animated.Text style={[styles.toggle, { transform: [{ rotate }] }]}>
          +
        </Animated.Text>
      </View>

      {isOpen && (
        <Text style={styles.answer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );
};

const HomeFaq = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Frequently Asked Questions</Text>
      </View>

      {faqItems.map(item => (
        <FaqItem
          key={item.id}
          item={item}
          isOpen={activeFaq === item.id}
          onPress={() => setActiveFaq(activeFaq === item.id ? null : item.id)}
        />
      ))}

      <View style={{ height: moderateScaleVertical(8) }} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: moderateScaleVertical(20),
    paddingHorizontal: moderateScale(16),
  },
  header: {
    marginBottom: moderateScaleVertical(12),
  },
  title: {
    fontSize: textScale(13),
    fontWeight: '700',
    color: ACCENT2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScaleVertical(13),
    marginBottom: moderateScaleVertical(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  cardOpen: {
    backgroundColor: '#FFFAF7',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: moderateScale(3),
    backgroundColor: ACCENT,
    borderTopLeftRadius: moderateScale(10),
    borderBottomLeftRadius: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(10),
  },
  iconText: {
    fontSize: textScale(16),
  },
  question: {
    flex: 1,
    fontSize: textScale(11),
    fontWeight: '600',
    color: ACCENT2,
    lineHeight: moderateScaleVertical(17),
  },
  questionOpen: {
    color: ACCENT,
  },
  toggle: {
    fontSize: textScale(20),
    fontWeight: '300',
    color: ACCENT2,
    marginLeft: moderateScale(8),
    lineHeight: moderateScaleVertical(24),
  },
  answer: {
    marginTop: moderateScaleVertical(10),
    marginLeft: moderateScale(44),
    fontSize: textScale(10.5),
    lineHeight: moderateScaleVertical(16),
    color: SUBTLE,
  },
});

export default React.memo(HomeFaq);
