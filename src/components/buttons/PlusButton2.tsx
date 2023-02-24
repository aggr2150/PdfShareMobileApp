import {ColorValue, Platform, Pressable} from 'react-native';
import React from 'react';

// import SendIcon from '@assets/icon/send.svg';
import PlusIcon from '@src/assets/icon/plus1.svg';
interface BackButtonProps {
  onPress: () => void;
  color?: ColorValue;
  disabled?: boolean;
}
const PlusButton: React.FC<BackButtonProps> = ({onPress, color, disabled}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <PlusIcon fill={color} width={50} height={50} />
    </Pressable>
  );
};

export default PlusButton;
