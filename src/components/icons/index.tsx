import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const ICON_SIZE = 24;

export const EnvelopeIcon: React.FC<{ color?: string }> = ({
  color: _color = theme.colors.textMuted,
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text18}>✉</Text>
  </View>
);

export const LockIcon: React.FC<{ color?: string }> = ({
  color: _color = theme.colors.textMuted,
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text18}>🔒</Text>
  </View>
);

export const UserIcon: React.FC<{ color?: string; size?: number }> = ({
  color: _color = theme.colors.primary,
  size: _size = ICON_SIZE,
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text18}>👤</Text>
  </View>
);

export const HomeIcon: React.FC<{ color?: string; filled?: boolean }> = ({
  color: _color = theme.colors.primary,
  filled = false,
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={[s.text20, !filled && s.iconFaded]}>🏠</Text>
  </View>
);

export const BellIcon: React.FC<{ color?: string; badge?: boolean }> = ({
  color: _color = theme.colors.textSecondary,
  badge = false,
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text20}>🔔</Text>
    {badge && <View style={s.badge} />}
  </View>
);

export const MicrophoneIcon: React.FC<{ color?: string }> = ({
  color: _color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text20}>🎤</Text>
  </View>
);

export const ChevronRightIcon: React.FC<{ color?: string }> = ({
  color: _color = theme.colors.textMuted,
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text16}>›</Text>
  </View>
);

export const PauseIcon: React.FC<{ color?: string }> = ({
  color: _color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, s.pause, s.iconSize]}>
    <View style={s.pauseBar} />
    <View style={s.pauseBar} />
  </View>
);

export const StopIcon: React.FC<{ color?: string }> = ({
  color: _color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <View style={s.stopSquare} />
  </View>
);

export const SaveIcon: React.FC<{ color?: string }> = ({
  color: _color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, s.iconSize]}>
    <Text style={s.text18}>💾</Text>
  </View>
);

export const StarIcon: React.FC<{ color?: string }> = ({
  color: _color = theme.colors.accent,
}) => (
  <View style={[s.wrapper, s.iconSizeSmall]}>
    <Text style={s.text12}>★</Text>
  </View>
);

const s = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSize: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconSizeSmall: {
    width: 16,
    height: 16,
  },
  text20: {
    fontSize: 20,
  },
  text18: {
    fontSize: 18,
  },
  text16: {
    fontSize: 16,
  },
  text12: {
    fontSize: 12,
  },
  iconFaded: {
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  pause: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  pauseBar: {
    width: 4,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  stopSquare: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
