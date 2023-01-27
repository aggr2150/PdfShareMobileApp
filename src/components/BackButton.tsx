import Ionicons from 'react-native-vector-icons/Ionicons';
import {ColorValue, Platform, Pressable} from 'react-native';
import React from 'react';

interface BackButtonProps {
  onPress: () => void;
  color?: ColorValue;
}
const BackButton: React.FC<BackButtonProps> = ({onPress, color}) => {
  return (
    <Pressable onPress={onPress}>
      <Ionicons
        color={color}
        name={Platform.select({
          android: 'arrow-back',
          ios: 'ios-chevron-back',
          default: 'ios-chevron-back',
        })}
        size={Platform.select({
          android: 24,
          ios: 30,
          default: 30,
        })}
      />
    </Pressable>
  );
};

export default BackButton;
