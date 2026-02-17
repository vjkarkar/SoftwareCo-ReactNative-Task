import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { offersApi, storesApi, statisticsApi } from '../api';
import { theme } from '../theme';
import type { OfferItem, StoreItem, StatItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 32;
const SLIDER_HEIGHT = 180;
const CARD_WIDTH = 200;

const CHART_COLORS = ['#22C55E', '#38BDF8', '#A78BFA', '#FB923C', '#F87171'];

const FALLBACK_IMAGE = require('../assets/images/slider1.png');
const LIST_ITEM_SEPARATOR = () => <View style={styles.itemSeparator} />;

type StatsPeriod = 'daily' | 'weekly' | 'monthly';

interface SliderOffer {
    id: string;
    title: string;
    subtitle: string;
    image: string | number;
}

interface StoreCardItem extends StoreItem {
    id: string;
}

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState<SliderOffer[]>([]);
    const [stores, setStores] = useState<StoreCardItem[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('monthly');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const sliderRef = useRef<FlatList>(null);

    const periodLabel =
        statsPeriod === 'daily' ? 'Day' : statsPeriod === 'weekly' ? 'Week' : 'Monthly';

    const PERIOD_OPTIONS: { label: string; value: StatsPeriod }[] = [
        { label: 'Day', value: 'daily' },
        { label: 'Week', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ];

    const fetchOffers = useCallback(async () => {
        try {
            const res = await offersApi.getOffers();
            const list = res?.data ?? [];
            const active = (Array.isArray(list) ? list : []).filter(
                (o: OfferItem) => o.status === 'active'
            );
            setOffers(
                active.map((o: OfferItem) => ({
                    id: o._id,
                    title: o.title,
                    subtitle: o.description || '',
                    image: o.image || FALLBACK_IMAGE,
                }))
            );
        } catch {
            setOffers([]);
        }
    }, []);

    const fetchStores = useCallback(async () => {
        try {
            const res = await storesApi.getStores();
            const list = res?.data ?? res?.stores ?? [];
            const arr = Array.isArray(list) ? list : [];
            setStores(
                arr.map((s: StoreItem) => ({
                    ...s,
                    id: s._id,
                }))
            );
        } catch {
            setStores([]);
        }
    }, []);

    const fetchStatistics = useCallback(async (period: StatsPeriod) => {
        try {
            const res = await statisticsApi.getStatistics(period, true);
            const list = res?.data ?? [];
            const arr = Array.isArray(list) ? list : [];
            const byStore = new Map<string, number>();
            arr.forEach((s: StatItem) => {
                const curr = byStore.get(s.store_id) ?? 0;
                byStore.set(s.store_id, curr + s.percentage);
            });
            const percentages = Array.from(byStore.values());
            const total = percentages.reduce((a, b) => a + b, 0) || 1;
            const normalized = percentages.map((p) => (p / total) * 100);
            setChartData(normalized.length > 0 ? normalized : [100]);
        } catch {
            setChartData([100]);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const fetchOffersAndStores = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchOffers(), fetchStores()]);
        } finally {
            setLoading(false);
        }
    }, [fetchOffers, fetchStores]);

    useEffect(() => {
        fetchOffersAndStores();
    }, [fetchOffersAndStores]);

    useEffect(() => {
        setStatsLoading(true);
        fetchStatistics(statsPeriod);
    }, [statsPeriod, fetchStatistics]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchOffers(),
                fetchStores(),
                fetchStatistics(statsPeriod),
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    const onSliderScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = e.nativeEvent.contentOffset.x;
        const index = Math.round(offset / (SLIDER_WIDTH + 16));
        setSliderIndex(Math.min(index, Math.max(0, offers.length - 1)));
    };

    const getImageSource = (item: SliderOffer | StoreCardItem): { uri: string } | number => {
        const img = 'image' in item ? item.image : null;
        if (typeof img === 'string' && img) {
            return { uri: img };
        }
        return FALLBACK_IMAGE;
    };

    const renderSliderItem = ({ item }: { item: SliderOffer }) => (
        <TouchableOpacity style={styles.sliderCard} activeOpacity={1}>
            <ImageBackground
                source={getImageSource(item)}
                style={styles.sliderBg}
                resizeMode="cover"
            >
                <View style={styles.sliderOverlay} />
                <View style={styles.sliderInner}>
                    <View style={styles.sliderContent}>
                        <Text style={styles.sliderTitle}>{item.title}</Text>
                        <Text style={styles.sliderSubtitle}>{item.subtitle}</Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    const renderStoreItem = ({ item }: { item: StoreCardItem }) => (
        <TouchableOpacity
            style={styles.storeCard}
            onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
            activeOpacity={0.9}
        >
            <View style={styles.storeImageWrap}>
                <ImageBackground
                    source={getImageSource(item) as any}
                    style={styles.storeImage}
                    resizeMode="cover"
                >
                    <View style={styles.storeImageOverlay} />
                    <View style={styles.visitStoreBtn}>
                        <Text style={styles.visitStoreText}>Visit Store</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.storeCardContent}>
                <Text style={styles.storeName} numberOfLines={1}>
                    {item.name}
                </Text>
                <View style={styles.storeMeta}>
                    <Text style={styles.storeCategory}>{item.category}</Text>
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
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Hot deals slider */}
            <Text style={[styles.sectionTitle, styles.hotDealsTitle]}>Hot deals</Text>
            {offers.length > 0 ? (
                <>
                    <FlatList
                        ref={sliderRef}
                        data={offers}
                        horizontal
                        pagingEnabled
                        decelerationRate="fast"
                        snapToInterval={SLIDER_WIDTH + 16}
                        snapToAlignment="start"
                        showsHorizontalScrollIndicator={false}
                        onScroll={onSliderScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSliderItem}
                        contentContainerStyle={styles.sliderList}
                        ItemSeparatorComponent={LIST_ITEM_SEPARATOR}
                    />
                    <View style={styles.pagination}>
                        {offers.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    i === sliderIndex && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>
                </>
            ) : (
                <View style={styles.emptySection}>
                    <Text style={styles.emptyText}>No hot deals available</Text>
                </View>
            )}

            {/* Stores */}
            <View style={styles.storesHeader}>
                <Text style={styles.sectionTitle}>Stores</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Stores', { title: 'Stores' })}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            {stores.length > 0 ? (
                <FlatList
                    data={stores}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={renderStoreItem}
                    contentContainerStyle={styles.storesList}
                    ItemSeparatorComponent={LIST_ITEM_SEPARATOR}
                />
            ) : (
                <View style={styles.emptySection}>
                    <Text style={styles.emptyText}>No stores available</Text>
                </View>
            )}

            <View style={styles.statsSection}>
                <View style={styles.statsHeader}>
                    <Text style={styles.statsTitle}>Statistics</Text>
                    <View style={styles.periodTriggerRow}>
                        <Text style={styles.periodLabel}>{periodLabel}</Text>
                        <TouchableOpacity
                            style={styles.periodChevronBtn}
                            onPress={() => setDropdownOpen(!dropdownOpen)}
                            activeOpacity={0.8}
                        >
                            <Icon name="chevron-down" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                {dropdownOpen && (
                    <View style={styles.periodDropdownPanel}>
                        {PERIOD_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={styles.periodDropdownItem}
                                onPress={() => {
                                    setStatsPeriod(opt.value);
                                    setDropdownOpen(false);
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.periodDropdownItemLabel}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.donutWrap}>
                <View style={styles.donutChartContainer}>
                    <View style={styles.donutOuter}>
                        <Svg width={220} height={210} viewBox="0 0 220 220">
                            {chartData.reduce<{
                                offset: number;
                                circles: React.ReactNode[];
                            }>(
                                (acc, pct, i) => {
                                    const circumference = 2 * Math.PI * 90;
                                    const segmentLen = (pct / 100) * circumference;
                                    const gapLen = circumference - segmentLen;
                                    const dashOffset = -(acc.offset / 100) * circumference;
                                    acc.circles.push(
                                        <Circle
                                            key={i}
                                            cx="110"
                                            cy="110"
                                            r="90"
                                            fill="none"
                                            stroke={CHART_COLORS[i % CHART_COLORS.length]}
                                            strokeWidth={24}
                                            strokeDasharray={`${segmentLen} ${gapLen}`}
                                            strokeDashoffset={dashOffset}
                                            strokeLinecap="butt"
                                        />
                                    );
                                    acc.offset += pct;
                                    return acc;
                                },
                                { offset: 0, circles: [] }
                            ).circles}
                            <Circle
                                cx="110"
                                cy="110"
                                r="66"
                                fill={theme.colors.background}
                            />
                        </Svg>
                    </View>
                    <View style={styles.donutCenter}>
                        {statsLoading ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <View style={styles.donutCenterContent}>
                                <Text style={styles.totalSales}>₹ 1,800.00</Text>
                                <Text style={styles.totalLabel}>Total Sales</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { paddingBottom: 100 },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptySection: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    hotDealsTitle: {
        marginTop: 20,
    },
    sliderList: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    itemSeparator: {
        width: 16,
    },
    sliderCard: {
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        marginHorizontal: 0,
        borderRadius: 20,
        overflow: 'hidden',
    },
    sliderBg: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    sliderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sliderInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
    },
    sliderContent: { flex: 1 },
    sliderTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    sliderSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.border,
    },
    dotActive: {
        backgroundColor: theme.colors.primaryLight,
        width: 24,
    },
    storesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primaryLight,
        paddingHorizontal: 16,
    },
    storesList: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 16,
    },
    storeCard: {
        width: CARD_WIDTH,
    },
    storeImageWrap: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
    },
    storeImage: {
        width: CARD_WIDTH,
        height: 180,
        borderRadius: 16,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    storeImageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
    },
    visitStoreBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        margin: 12,
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        alignSelf: 'flex-end',
    },
    visitStoreText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    storeCardContent: {
        marginTop: 5,
        paddingHorizontal: 2,
    },
    storeName: {
        fontSize: 17,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        letterSpacing: 0.2,
    },
    storeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        flexWrap: 'wrap',
        gap: 4,
    },
    storeCategory: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    statsSection: {
        marginHorizontal: 16,
        marginBottom: 16,
        position: 'relative',
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    periodTriggerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    periodLabel: {
        fontSize: 14,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    periodChevronBtn: {
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    periodDropdownPanel: {
        position: 'absolute',
        top: 44,
        right: 0,
        minWidth: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 1000,
    },
    periodDropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    periodDropdownItemLabel: {
        fontSize: 14,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    donutWrap: {
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    donutChartContainer: {
        width: 210,
        height: 210,
        position: 'relative',
    },
    donutOuter: {
        width: 250,
        height: 250,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    donutCenter: {
        position: 'absolute',
        top: 40,
        left: 40,
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    donutCenterContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    totalSales: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    totalLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default HomeScreen;
