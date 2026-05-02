import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
export default function HomeScreen() {
  return (
    <view name="demoBar" style={{ flex: 1 }}>
      <Pressable style={{}}>
        <text>Go to explore</text>
      </Pressable>
      <Pressable
       style={{}}
       onPress={() => {}}
       >
        <text> Go to where </text>
       </Pressable>



    </view>
  );
}

const styles = StyleSheet.create({
  
});
