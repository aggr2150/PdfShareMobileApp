import React, {useEffect, useState} from 'react';
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
interface ToggleBtnProps {
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  switchStyle?: ViewStyle;
  splitCenter: boolean;
  labelText: [string, string];
  onPress?: (index: number) => void;
  selectedIndex: number;
}
const ToggleBtn: React.FC<ToggleBtnProps> = ({
  textStyle = {},
  containerStyle = {},
  switchStyle = {},
  splitCenter = false,
  labelText,
  onPress,
  selectedIndex,
}) => {
  const [width, setWidth] = useState(0);
  const toggleValue = useSharedValue(0);
  const styles = useStyles();
  const animatedStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      toggleValue.value,
      [0, 1],
      [
        0,
        width / 2 - (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
      ],
    );

    return {
      transform: [{translateX: translateX}],
    };
  });
  useEffect(() => {
    console.log('use', selectedIndex);
    if (toggleValue.value !== selectedIndex) {
      toggleValue.value = withTiming(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <View
      style={[
        {
          height: 54,
          backgroundColor: '#60b630',
          borderRadius: containerStyle.borderRadius || 26,
        },
        containerStyle,
      ]}
      onLayout={layout => setWidth(layout.nativeEvent.layout.width)}>
      <Animated.View
        pointerEvents={'none'}
        style={[
          animatedStyles,
          {
            backgroundColor: '#1ba639',
            width:
              width / 2 +
              (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
            height: containerStyle.height || 54,
            borderRadius: containerStyle.borderRadius || 26,
            position: 'absolute',
          },
          switchStyle,
        ]}
      />
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            flex: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            onPress && onPress(0);
            toggleValue.value = withTiming(0);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft:
                (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
            }}>
            <Text style={[styles.labelText, textStyle]}>{labelText[0]}</Text>
          </View>
        </Pressable>
        <Pressable
          style={{
            borderRadius: containerStyle.borderRadius || 26,
            flex: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            onPress && onPress(1);
            toggleValue.value = withTiming(1);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingRight:
                (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
            }}>
            <Text style={[styles.labelText, textStyle]}>{labelText[1]}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  labelText: {
    flexWrap: 'nowrap',
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 15,
    color: theme.colors.black,
  },
}));

export default ToggleBtn;
