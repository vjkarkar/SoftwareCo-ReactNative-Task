import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ChevronRightIcon } from './icons';
import { theme } from '../theme';

export interface ProfileMenuItemProps {
  label: string;
  image: number;
  onPress: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  label,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={image} style={styles.menuIcon} resizeMode="contain" />
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRightIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIcon: {
    width: 22,
    height: 22,
    marginRight: theme.spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
});

export default ProfileMenuItem;
