import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Header from '../components/Header';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const TabItem = ({
  focused,
  label,
  iconName,
}: {
  focused: boolean;
  label: string;
  iconName: string;
}) => {
  if (focused) {
    return (
      <View style={styles.activePill}>
        <Icon name={iconName} size={14} color="#fff" />
        <Text style={styles.activeLabel}>{label}</Text>
      </View>
    );
  }

  return (
    <Icon name={iconName} size={16} color="#0F172A" style={styles.inactiveIcon} />
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#F4F5F7',
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'SoftwareCo',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} label="Home" iconName="home-outline" />
          ),
          header: ({ options }) => (
            <Header title={options.title ?? 'SoftwareCo'} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} label="Profile" iconName="person-outline" />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activePill: {
    minWidth: 82,
    height: 30,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  inactiveIcon: {
    marginTop: 2,
  },
});

export default MainTabs;
