import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { notificationsApi } from '../api';
import { theme } from '../theme';

type NotificationPreference = {
  _id: string;
  displayText: string;
  description: string;
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
};

const ManageNotificationsScreen: React.FC = () => {
  const [items, setItems] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getNotifications();
      const list = Array.isArray(res) ? res : res?.data ?? [];
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const updateItem = (
    id: string,
    updater: (item: NotificationPreference) => NotificationPreference,
  ) => {
    setItems(prev => prev.map(item => (item._id === id ? updater(item) : item)));
  };

  const toggleMain = (id: string) => {
    updateItem(id, item => ({ ...item, enabled: !item.enabled }));
  };

  const toggleChannel = (
    id: string,
    channel: 'pushEnabled' | 'emailEnabled' | 'smsEnabled',
  ) => {
    updateItem(id, item => ({ ...item, [channel]: !item[channel] }));
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No notifications configured</Text>
        </View>
      ) : (
        items.map(item => (
          <View key={item._id} style={styles.card}>
            <View style={styles.titleRow}>
              <View style={styles.titleWrap}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.displayText}
                </Text>
                <Text style={styles.desc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleMain(item._id)}
                trackColor={{ false: '#D1D5DB', true: '#9DB7D6' }}
                thumbColor={item.enabled ? theme.colors.primary : '#8E8E93'}
              />
            </View>

            <View style={styles.divider} />

            <Text style={styles.channelHeading}>Notifications Channels</Text>
            <View style={styles.channelRow}>
              <TouchableOpacity
                style={styles.channelItem}
                onPress={() => toggleChannel(item._id, 'pushEnabled')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.pushEnabled && styles.checkboxChecked,
                  ]}
                >
                  {item.pushEnabled ? (
                    <Text style={styles.checkboxTick}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.channelLabel}>Push</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.channelItem}
                onPress={() => toggleChannel(item._id, 'emailEnabled')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.emailEnabled && styles.checkboxChecked,
                  ]}
                >
                  {item.emailEnabled ? (
                    <Text style={styles.checkboxTick}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.channelLabel}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.channelItem}
                onPress={() => toggleChannel(item._id, 'smsEnabled')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.smsEnabled && styles.checkboxChecked,
                  ]}
                >
                  {item.smsEnabled ? (
                    <Text style={styles.checkboxTick}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.channelLabel}>Sms</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  content: {
    padding: 12,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
  },
  emptyWrap: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8BEC7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1F2937',
  },
  desc: {
    marginTop: 2,
    fontSize: 11,
    color: '#9AA2AE',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 8,
  },
  channelHeading: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 10,
  },
  channelLabel: {
    fontSize: 14,
    color: '#374151',
  },
});

export default ManageNotificationsScreen;
