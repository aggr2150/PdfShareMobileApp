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
interface ToggleBtnProps {
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  switchStyle?: ViewStyle;
  splitCenter: boolean;
}
const ToggleBtn: React.FC<ToggleBtnProps> = ({
  textStyle = {},
  containerStyle = {},
  switchStyle = {},
  splitCenter = false,
}) =>
  // props
  {
    const [width, setWidth] = useState(0);
    const [selected, setSelected] = useState(false);
    const toggleValue = useSharedValue(0);
    const styles = useStyles();
    const animatedStyles = useAnimatedStyle(() => {
      const translateX = interpolate(
        toggleValue.value,
        [0, 1],
        [
          0,
          width / 2 -
            (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
        ],
      );

      return {
        transform: [{translateX: translateX}],
      };
    });
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
              toggleValue.value = withTiming(selected ? 0 : 1);
              setSelected(!selected);
            }}>
            <View
              style={{
                alignItems: 'center',
                paddingLeft:
                  (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
              }}>
              <Text style={[styles.labelText, textStyle]}>로그인</Text>
            </View>
          </Pressable>
          <Pressable
            style={{
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              toggleValue.value = withTiming(selected ? 0 : 1);
              setSelected(!selected);
            }}>
            <View
              style={{
                alignItems: 'center',
                paddingRight:
                  (containerStyle.borderRadius || 26) / (splitCenter ? 2 : 1),
              }}>
              <Text style={[styles.labelText, textStyle]}>회원가입</Text>
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
    color: theme.colors.white,
  },
}));

export default ToggleBtn;
