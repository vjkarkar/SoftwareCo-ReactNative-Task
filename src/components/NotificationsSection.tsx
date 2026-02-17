import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMain, toggleSubItem } from '../store/notificationsSlice';
import type { RootState } from '../store';
import type { NotificationItem } from '../types';

interface Props {
  loading: boolean;
}

const NotificationsSection: React.FC<Props> = ({ loading }) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.notifications.items);

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manage Notifications</Text>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Manage Notifications</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>No notifications configured</Text>
      ) : (
        items.map(item => (
          <NotificationCard
            key={item.id}
            item={item}
            onToggleMain={() => dispatch(toggleMain({ id: item.id }))}
            onToggleSub={subId =>
              dispatch(toggleSubItem({ mainId: item.id, subId }))
            }
          />
        ))
      )}
    </View>
  );
};

const NotificationCard: React.FC<{
  item: NotificationItem;
  onToggleMain: () => void;
  onToggleSub: (subId: string) => void;
}> = ({ item, onToggleMain, onToggleSub }) => {
  const opacity = item.enabled ? 1 : 0.5;
  return (
    <View style={[styles.card, { opacity }]}>
      <View style={styles.mainRow}>
        <Text style={styles.mainTitle}>{item.title}</Text>
        <Switch
          value={item.enabled}
          onValueChange={onToggleMain}
          trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
          thumbColor={item.enabled ? '#2563eb' : '#94a3b8'}
        />
      </View>
      {item.subItems && item.subItems.length > 0 && (
        <View style={styles.subList}>
          {item.subItems.map(sub => (
            <View key={sub.id} style={styles.subRow}>
              <Text style={styles.subTitle}>{sub.title}</Text>
              <Switch
                value={sub.enabled}
                onValueChange={() => onToggleSub(sub.id)}
                disabled={!item.enabled}
                trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                thumbColor={sub.enabled ? '#2563eb' : '#94a3b8'}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  loading: { color: '#64748b', paddingVertical: 16 },
  empty: { color: '#64748b', paddingVertical: 16 },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  subList: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default NotificationsSection;
