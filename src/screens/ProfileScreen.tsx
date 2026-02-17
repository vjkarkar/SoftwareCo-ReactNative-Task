import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearStoredToken } from '../store/authSlice';
import { theme } from '../theme';
import { ChevronRightIcon } from '../components/icons';
import SubHeader from '../components/SubHeader';

const MENU_ITEMS = [
  { id: 'audio', label: 'Audio Recording', image: require('../assets/images/microphone-2.png'), screen: 'AudioRecording' },
  { id: 'notifications', label: 'Manage Notifications', image: require('../assets/images/notification-bing.png'), screen: 'ManageNotifications' },
];

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(clearStoredToken() as any),
      },
    ]);
  };

  const handleBack = () => {
    navigation.navigate('Home');
  };

  const handleItemPress = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert(item.label, 'This feature is coming soon.');
    }
  };

  return (
    <View style={styles.container}>
      <SubHeader
        title="Profile"
        onBack={handleBack}
        rightAction={
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        }
      />

      {/* Main: List items with icons */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {MENU_ITEMS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
          >
            <Image
              source={item.image}
              style={styles.menuIcon}
              resizeMode="contain"
            />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <ChevronRightIcon />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  logoutText: {
    fontSize: 14,
    color: theme.colors.error,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 100 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIcon: {
    width: 22,
    height: 22,
    marginRight: theme.spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
});

export default ProfileScreen;
