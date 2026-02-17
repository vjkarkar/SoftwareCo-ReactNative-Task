import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

const NotificationsTabScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Notifications</Text>
      <TouchableOpacity
        style={styles.manageBtn}
        onPress={() => navigation.navigate('ManageNotifications')}
      >
        <Text style={styles.manageBtnText}>Manage Notifications</Text>
        <Text style={styles.manageBtnArrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg },
  title: {
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  manageBtnText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  manageBtnArrow: {
    fontSize: 20,
    color: theme.colors.textMuted,
  },
});

export default NotificationsTabScreen;
