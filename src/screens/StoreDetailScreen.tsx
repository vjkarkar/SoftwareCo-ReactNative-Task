import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { storesApi } from '../api';
import { theme } from '../theme';
import { Card } from '../components/common';

const HEADER_HEIGHT = 280;
const FALLBACK_IMAGE = require('../assets/images/slider1.png');

type StoreDetailParams = {
  StoreDetail: { storeId: string };
};

interface StoreData {
  _id: string;
  name: string;
  category: string;
  location: { address: string; lat: number; long: number };
  image: string | null;
}

const StoreDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<StoreDetailParams, 'StoreDetail'>>();
  const storeId = route.params?.storeId;
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (storeId) {
      storesApi
        .getStoreById(storeId)
        .then((res) => {
          const s = res?.data ?? res;
          setStore(s || res);
          setError('');
        })
        .catch(() => {
          setError('Failed to load store details');
          setStore(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('No store selected');
    }
  }, [storeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !store) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Store not found'}</Text>
      </View>
    );
  }

  const initials = (store.name || 'S')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const imageSource = store.image
    ? { uri: store.image }
    : FALLBACK_IMAGE;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header: background image + overlay content */}
      <View style={styles.headerWrap}>
        <ImageBackground
          source={imageSource}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>{initials}</Text>
            </View>
            <Text style={styles.storeName} numberOfLines={2}>
              {store.name}
            </Text>
            <View style={styles.categoryPill}>
              <View style={styles.categoryDot} />
              <Text style={styles.categoryText}>{store.category}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Store section */}
      <Card style={styles.sectionCard} contentStyle={styles.sectionCardContent}>
        <Text style={styles.sectionTitle}>Store</Text>
        <View style={styles.addressRow}>
          <Icon
            name="location-outline"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.addressIcon}
          />
          <Text style={styles.addressText}>
            {store.location?.address || 'Address not available'}
          </Text>
        </View>
      </Card>

      {/* Map section */}
      <Card style={styles.sectionCard} contentStyle={styles.sectionCardContent}>
        <Text style={styles.sectionTitle}>Map</Text>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Icon name="map-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.mapPlaceholderText}>
              {store.location?.address || 'Location'}
            </Text>
            {store.location && (
              <Text style={styles.mapCoords}>
                {store.location.lat.toFixed(4)}, {store.location.long.toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 48 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  error: { color: theme.colors.error, fontSize: 16 },
  headerWrap: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerContent: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  storeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionCardContent: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  mapPlaceholder: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  mapCoords: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});

export default StoreDetailScreen;
