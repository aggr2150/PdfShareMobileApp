import React, {Dispatch, useEffect, useRef} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import PagerView from 'react-native-pager-view';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
interface PagesProps {
  selectedIndex: number;
  SceneMap: React.FC<{setClosable: Dispatch<boolean>}>[];
  setSelectedIndex: Dispatch<number>;
  setClosable: Dispatch<boolean>;
}

const Pages: React.FC<PagesProps> = ({
  selectedIndex,
  SceneMap,
  setSelectedIndex,
  setClosable,
}) => {
  const styles = useStyles();
  const pagerRef = useRef<PagerView>(null);
  const containerHeight = useSharedValue(65);
  const dimensions = useWindowDimensions();
  const animatedPagerStyles = useAnimatedStyle(() => {
    return {
      // width: '100%',
      height: containerHeight.value,
      // backgroundColor: 'yellow',
    };
  });
  useEffect(() => {
    pagerRef.current?.setPage(selectedIndex);
  }, [selectedIndex]);
  const parentViewRef = useRef(Array(SceneMap.length));
  const viewRef = useRef(Array(SceneMap.length));
  return (
    <Animated.View style={animatedPagerStyles}>
      <PagerView
        ref={pagerRef}
        style={{height: '100%'}}
        // style={animatedPagerStyles}
        scrollEnabled={false}
        initialPage={0}
        onPageSelected={event => {
          setSelectedIndex(event.nativeEvent.position);
          viewRef.current[event.nativeEvent.position].measureLayout(
            parentViewRef.current[event.nativeEvent.position],
            (left, top, width, height) => {
              containerHeight.value =
                dimensions.height > height ? height : dimensions.height;
              console.log('mmm', left, top, width, height);
            },
          );
        }}>
        {SceneMap.map((Scene, index) => (
          <View ref={el => (parentViewRef.current[index] = el)} key={index + 1}>
            <View ref={el => (viewRef.current[index] = el)}>
              {/*<Text style={{}}>assssjdanjk</Text>*/}
              {/*<Text>asmkl</Text>*/}
              <Scene setClosable={setClosable} />
            </View>
          </View>
        ))}
      </PagerView>
    </Animated.View>
  );
};

const useStyles = makeStyles(theme => ({
  pagerView: {
    width: '100%',
    // flex: 1,
    // backgroundColor: 'red',
  },
}));

export default Pages;
