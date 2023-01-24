import React, {useState} from 'react';
import {Pressable, TextStyle, View, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {makeStyles, Text} from '@rneui/themed';

// function ThrottleFlatList<T>({
//   data,
// }): React.ReactElement<ThrottleFlatListProps<T>> {
//   return <FlatList data={data} renderItem={} />;
// }
interface AvatarProps {
  style?: ViewStyle;
}
const Avatar: React.FC<AvatarProps> = ({style}) => {
  return (
    <View
      style={[
        {
          width: 90,
          height: 90,
          borderRadius: 90,
          backgroundColor: '#60b630',
        },
        style,
      ]}>
      <View></View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  labelText: {
    flexWrap: 'nowrap',
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 15,
    color: theme.colors.white,
  },
}));

export default Avatar;
