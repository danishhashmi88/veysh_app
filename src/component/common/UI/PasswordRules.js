import React, { useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';

const PasswordRules = ({
  password = '',
  onValidationChange = () => {},
  position = 'top',
}) => {
  const { t } = useTranslation();
  const ruleOrder = useMemo(
    () => [
      {
        key: 'capital',
        text: t('password_rule_capital'),
        regex: /[A-Z]/,
        check: pwd => /[A-Z]/.test(pwd),
      },
      {
        key: 'special',
        text: t('password_rule_special'),
        regex: /[^A-Za-z0-9]/,
        check: pwd => /[^A-Za-z0-9]/.test(pwd),
      },
      {
        key: 'length',
        text: t('password_rule_length'),
        regex: null,
        check: pwd => pwd.length >= 8,
      },
      {
        key: 'number',
        text: t('password_rule_number'),
        regex: /[0-9]/,
        check: pwd => /[0-9]/.test(pwd),
      },
    ],
    [],
  );

  const rules = useMemo(() => {
    const calculatedRules = {};
    ruleOrder.forEach(rule => {
      calculatedRules[rule.key] = rule.check(password);
    });
    return calculatedRules;
  }, [password, ruleOrder]);

  const isValid = Object.values(rules).every(Boolean);

  const dynamicTitle = useMemo(() => {
    const firstUnmetRule = ruleOrder.find(rule => !rules[rule.key]);
    if (firstUnmetRule) {
      return firstUnmetRule.text;
    }
    return 'Password strength: Strong!';
  }, [rules, ruleOrder]);

  const titleTextColor = useMemo(() => {
    return isValid ? Colors.green : Colors.grey950;
  }, [isValid]);

  const metRuleCount = useMemo(() => {
    return Object.values(rules).filter(Boolean).length;
  }, [rules]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const renderRule = (isValid, text) => (
    <View style={styles.ruleRow}>
      <Text
        style={[styles.dot, { color: isValid ? Colors.green : Colors.grey500 }]}
      >
        •
      </Text>
      <Text
        style={[
          styles.ruleText,
          { color: isValid ? Colors.green : Colors.grey500 },
        ]}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        position === 'top' ? { top: hp(7.4) } : { top: -hp(20) },
      ]}
    >
      <View
        style={[
          styles.cornorBox,
          position === 'top'
            ? { top: -wp(1.5), borderTopWidth: 1, borderLeftWidth: 1 }
            : { bottom: -wp(1.5), borderBottomWidth: 1, borderRightWidth: 1 },
        ]}
      />

      <Text style={[styles.titleText, { color: titleTextColor }]}>
        {dynamicTitle}
      </Text>

      <View style={[styles.lineIndicatorContainer]}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.lineSegment,
              {
                backgroundColor:
                  index < metRuleCount ? Colors.green : Colors.zink100,
              },
            ]}
          />
        ))}
      </View>

      {renderRule(rules.capital, t('password_rule_capital'))}
      {renderRule(rules.special, t('password_rule_special'))}
      {renderRule(rules.length, t('password_rule_length'))}
      {renderRule(rules.number, t('password_rule_number'))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    alignSelf: 'center',
    marginBottom: hp(3),
    marginTop: hp(2),
    borderWidth: 1,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    borderColor: Colors.zink100,
    backgroundColor: Colors.white,
    gap: hp(0.5),
    position: 'absolute',
    zIndex: 1000,
  },
  cornorBox: {
    width: wp(3),
    height: wp(3),
    backgroundColor: Colors.white,
    borderColor: Colors.zink100,
    position: 'absolute',
    transform: [{ rotateZ: '45deg' }],
    left: wp(4.5),
  },
  titleText: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_600,
    marginBottom: hp(1.5),
  },
  lineIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: hp(2),
    alignSelf: 'flex-start',
  },
  lineSegment: {
    height: 4,
    width: '22%', // Adjust width for 4 segments with small gaps
    borderRadius: 2,
    backgroundColor: Colors.zink100,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed marginBottom, relying on container's gap
  },
  dot: {
    fontSize: 18,
    lineHeight: 18,
    marginRight: 6,
    height: 18,
    textAlignVertical: 'center',
    paddingTop: 0,
  },
  ruleText: {
    fontSize: FontSize.FONT_12,
    fontWeight: FontWeight.FONT_400,
  },
});

export default PasswordRules;
