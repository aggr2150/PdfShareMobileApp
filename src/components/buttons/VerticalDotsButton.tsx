import {ColorValue, Insets, Platform, Pressable} from 'react-native';
import React from 'react';

// import SendIcon from '@assets/icon/send.svg';
import VerticalDots from '@src/assets/icon/verticalDots.svg';
interface BackButtonProps {
  onPress: () => void;
  color?: ColorValue;
  disabled?: boolean;
  size?: number;
  hitSlop?: number | Insets | null;
}
const VerticalDotsButton: React.FC<BackButtonProps> = ({
  onPress,
  color,
  disabled,
  size = 50,
  hitSlop,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={hitSlop}>
      <VerticalDots fill={color} width={size} height={size} />
    </Pressable>
  );
};

export default VerticalDotsButton;
