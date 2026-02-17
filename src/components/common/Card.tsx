import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  onPress,
  activeOpacity = 0.9,
}) => {
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  if (!onPress) {
    return <View style={[styles.card, style]}>{content}</View>;
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
  },
  content: {},
});

export default Card;
