import React from 'react';
import { View, StyleSheet, Text, ColorValue } from 'react-native';

interface TabIconProps {
  name: 'today' | 'search' | 'recipe' | 'targets';
  focused: boolean;
  color?: ColorValue | string;
}

export const TabIcon: React.FC<TabIconProps> = ({ name, focused }) => {
  const getIconGlyph = () => {
    switch (name) {
      case 'today':
        return '⚡';
      case 'search':
        return '🔍';
      case 'recipe':
        return '🍲';
      case 'targets':
        return '🎯';
    }
  };

  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      <Text style={[styles.iconText, { opacity: focused ? 1 : 0.65 }]}>{getIconGlyph()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  focusedContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  iconText: {
    fontSize: 18,
  },
});
