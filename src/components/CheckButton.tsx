import Ionicons from 'react-native-vector-icons/Ionicons';
import {ColorValue, Platform, Pressable} from 'react-native';
import React from 'react';

interface CheckButtonProps {
  onPress: () => void;
  color?: ColorValue;
  disabled?: boolean;
  size?: number;
}
const CheckButton: React.FC<CheckButtonProps> = ({
  onPress,
  color,
  disabled,
  size,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Ionicons color={color} name={'checkmark'} size={size || 30} />
    </Pressable>
  );
};

export default CheckButton;
