import {Pressable, TextProps, TextStyle} from 'react-native';
import {Text} from '@rneui/themed';
import React from 'react';

interface TagTextProps extends TextProps {
  onPress: () => void;
  style: TextStyle;
}
const TagText: React.FC<TagTextProps> = props => {
  return (
    <Text style={props.style} onPress={props.onPress}>
      {props.children}
    </Text>
  );
};
export default TagText;
