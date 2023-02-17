import React, {useState} from 'react';
import {Pressable, TextStyle, View, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {makeStyles, Text} from '@rneui/themed';
import FastImage from 'react-native-fast-image';

// function ThrottleFlatList<T>({
//   data,
// }): React.ReactElement<ThrottleFlatListProps<T>> {
//   return <FlatList data={data} renderItem={} />;
// }
interface AvatarProps {
  style?: ViewStyle;
  avatar?: IFile;
}
const Avatar: React.FC<AvatarProps> = ({style, avatar}) => {
  return (
    <View
      style={[
        {
          width: 90,
          height: 90,
          borderRadius: 90,
          overflow: 'hidden',
          // backgroundColor: '#60b630',
        },
        style,
      ]}>
      <FastImage
        source={{
          uri: avatar?.filepath || 'https://cdn.everypdf.cc/static/every2.png',
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 90,
        }}
        fallback={true}
      />
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
