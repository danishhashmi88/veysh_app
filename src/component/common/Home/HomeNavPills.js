import { View, Image, Text, ScrollView } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { imagePath } from '../../../constant/imagePath';
import ScaleButton from '../animations/ScaleButton';

const HomeNavPills = ({ styles, handleNavigation }) => {
  const navItems = [
    { label: 'Planner', icon: imagePath.calenderEvent, color: '#F8AC08' },
    { label: 'Insights', icon: imagePath.charthistogram, color: '#2DD4BF' },
    { label: 'My Outfit', icon: imagePath.outfitHome1, color: '#3B82F6' },
    { label: 'Lookbook', icon: imagePath.lookbookHome, color: '#7100D7' },
  ];

  return (
    <View style={styles.navPillsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navPillsScrollContent}
      >
        {navItems.map((item, idx) => (
          <Animated.View
            key={idx}
            entering={FadeInRight.duration(400).delay(200 + idx * 90).springify().damping(16)}
          >
            <ScaleButton
              style={styles.navPill}
              onPress={() =>
                handleNavigation(
                  item.label === 'Planner'
                    ? 'MyPlanner'
                    : item.label === 'Insights'
                      ? 'ClosetInsightsScreen'
                      : item.label === 'My Outfit'
                        ? 'OutfitHome'
                        : 'MyLookbook',
                )
              }
            >
              <Image
                source={item.icon}
                style={[styles.navPillIcon, { tintColor: item.color }]}
                resizeMode="contain"
              />
              <Text style={styles.navPillText}>{item.label}</Text>
            </ScaleButton>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeNavPills;
