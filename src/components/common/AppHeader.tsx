import React from 'react';
import {
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme';

type BackStyle = 'plain' | 'boxed';

export interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  centeredTitle?: boolean;
  backStyle?: BackStyle;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  centeredTitle = true,
  backStyle = 'plain',
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 16 : 0,
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }, containerStyle]}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.backBtn, backStyle === 'boxed' && styles.backBtnBoxed]}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={backStyle === 'plain' ? { top: 12, bottom: 12, left: 12, right: 12 } : undefined}
          >
            <Icon name="chevron-back" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.backPlaceholder, backStyle === 'boxed' && styles.backPlaceholderBoxed]} />
        )}
        <Text style={[styles.title, centeredTitle ? styles.titleCentered : styles.titleStart]} numberOfLines={1}>
          {title}
        </Text>
        {rightAction ?? <View style={styles.rightPlaceholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  backBtnBoxed: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  backPlaceholder: {
    width: 32,
  },
  backPlaceholderBoxed: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  titleCentered: {
    textAlign: 'center',
  },
  titleStart: {
    textAlign: 'left',
    marginLeft: 12,
  },
  rightPlaceholder: {
    width: 32,
  },
});

export default AppHeader;
