import Ionicons from 'react-native-vector-icons/Ionicons';
import {ColorValue, Platform, Pressable} from 'react-native';
import React from 'react';

interface BackButtonProps {
  onPress: () => void;
  color?: ColorValue;
  disabled?: boolean;
  size?: number;
}
const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color,
  disabled,
  size,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Ionicons
        color={color}
        name={Platform.select({
          android: 'arrow-back',
          ios: 'ios-chevron-back',
          default: 'ios-chevron-back',
        })}
        size={size || 30}
      />
    </Pressable>
  );
};

export default BackButton;
