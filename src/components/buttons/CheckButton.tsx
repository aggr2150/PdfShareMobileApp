import {ColorValue, Platform, Pressable} from 'react-native';
import React from 'react';

import CheckIcon from '@src/assets/icon/check.svg';
import Svg, {Path} from 'react-native-svg';
import {Text} from '@rneui/themed';
interface BackButtonProps {
  onPress: () => void;
  color?: ColorValue;
  disabled?: boolean;
  size?: number;
  label?: string;
}
const CheckButton: React.FC<BackButtonProps> = ({
  onPress,
  color,
  disabled,
  size = 50,
  label = '작성',
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{alignItems: 'center'}}>
      <Svg viewBox={'0 0 148 148'} width={size} height={size}>
        <Path
          fill={color}
          d="M22.035791,63.605904c12.644053,19.198761,25.288107,38.39753,37.932159,57.596291
				c3.317619,5.037483,12.555592,5.452019,15.752003,0c14.749397-25.157593,29.498787-50.315193,44.248184-75.472786
				c2.064964-3.522137,4.129921-7.044273,6.194878-10.566414c5.397301-9.206017-10.339653-17.375788-15.751999-8.144108
				c-14.749397,25.157593-29.498795,50.315189-44.248184,75.472778c-2.064964,3.522141-4.129921,7.044273-6.194881,10.566414
				c5.250668,0,10.501331,0,15.752003,0c-12.644054-19.198761-25.288109-38.39753-37.932163-57.596291
				C31.881029,46.49295,16.108727,54.606232,22.035791,63.605904L22.035791,63.605904z"
        />
      </Svg>
      <Text style={{fontSize: 12}}>{label}</Text>
    </Pressable>
  );
};

export default CheckButton;
