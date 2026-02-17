import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const ICON_SIZE = 24;

export const EnvelopeIcon: React.FC<{ color?: string }> = ({
  color = theme.colors.textMuted,
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 18, color }}>✉</Text>
  </View>
);

export const LockIcon: React.FC<{ color?: string }> = ({
  color = theme.colors.textMuted,
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 18, color }}>🔒</Text>
  </View>
);

export const UserIcon: React.FC<{ color?: string; size?: number }> = ({
  color = theme.colors.primary,
  size = ICON_SIZE,
}) => (
  <View style={[s.wrapper, { width: size, height: size }]}>
    <Text style={{ fontSize: size - 6, color }}>👤</Text>
  </View>
);

export const HomeIcon: React.FC<{ color?: string; filled?: boolean }> = ({
  color: _color = theme.colors.primary,
  filled = false,
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 20, opacity: filled ? 1 : 0.6 }}>🏠</Text>
  </View>
);

export const BellIcon: React.FC<{ color?: string; badge?: boolean }> = ({
  color: _color = theme.colors.textSecondary,
  badge = false,
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 20 }}>🔔</Text>
    {badge && <View style={s.badge} />}
  </View>
);

export const MicrophoneIcon: React.FC<{ color?: string }> = ({
  color: _color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 20 }}>🎤</Text>
  </View>
);

export const ChevronRightIcon: React.FC<{ color?: string }> = ({
  color = theme.colors.textMuted,
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 16, color }}>›</Text>
  </View>
);

export const PauseIcon: React.FC<{ color?: string }> = ({
  color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, s.pause, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <View style={[s.pauseBar, { backgroundColor: color }]} />
    <View style={[s.pauseBar, { backgroundColor: color }]} />
  </View>
);

export const StopIcon: React.FC<{ color?: string }> = ({
  color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <View style={[s.stopSquare, { backgroundColor: color }]} />
  </View>
);

export const SaveIcon: React.FC<{ color?: string }> = ({
  color: _color = '#FFFFFF',
}) => (
  <View style={[s.wrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
    <Text style={{ fontSize: 18 }}>💾</Text>
  </View>
);

export const StarIcon: React.FC<{ color?: string }> = ({
  color: _color = theme.colors.accent,
}) => (
  <View style={[s.wrapper, { width: 16, height: 16 }]}>
    <Text style={{ fontSize: 12 }}>★</Text>
  </View>
);

const s = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  stopSquare: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
});
