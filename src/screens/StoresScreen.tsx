import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { storesApi } from '../api';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = 180;
const FALLBACK_IMAGE = require('../assets/images/slider1.png');

interface StoreItem {
  _id: string;
  name: string;
  category: string;
  location?: { address: string; lat: number; long: number };
  image: string | null;
}

const StoresScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStores = useCallback(async () => {
    try {
      const res = await storesApi.getStores();
      const list = Array.isArray(res) ? res : res?.data ?? res?.stores ?? [];
      setStores(list);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStores();
  };

  const handleStorePress = (storeId: string) => {
    navigation.navigate('StoreDetail', { storeId });
  };

  const getImageSource = (item: StoreItem) => {
    if (item.image && typeof item.image === 'string') {
      return { uri: item.image };
    }
    return FALLBACK_IMAGE;
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <View style={styles.starRow}>
        {Array.from({ length: full }).map((_, i) => (
          <Icon key={`f-${i}`} name="star" size={14} color={theme.colors.primaryLight} />
        ))}
        {half > 0 && (
          <Icon name="star-half" size={14} color={theme.colors.primaryLight} />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Icon key={`e-${i}`} name="star-outline" size={14} color={theme.colors.primaryLight} />
        ))}
        <Text style={styles.ratingText}> {rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderStoreCard = ({ item }: { item: StoreItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleStorePress(item._id)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrap}>
        <ImageBackground
          source={getImageSource(item)}
          style={styles.cardImage}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay} />
          <View style={styles.viewStoreBtn}>
            <Text style={styles.viewStoreText}>View Store</Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardMeta}>
          <View style={styles.nameCategoryWrap}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
          </View>
          {renderStars(4.5)}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={stores}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={renderStoreCard}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No stores available</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  card: {
    marginBottom: 16,
  },
  imageWrap: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    borderRadius: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  viewStoreBtn: {
    margin: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  viewStoreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  cardContent: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameCategoryWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardCategory: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default StoresScreen;
