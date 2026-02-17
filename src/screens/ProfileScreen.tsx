import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearStoredToken } from '../store/authSlice';
import { theme } from '../theme';
import SubHeader from '../components/SubHeader';
import ProfileMenuItem from '../components/ProfileMenuItem';

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
        showBack={false}
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
          <ProfileMenuItem
            key={item.id}
            label={item.label}
            image={item.image}
            onPress={() => handleItemPress(item)}
          />
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
});

export default ProfileScreen;
