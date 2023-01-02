import React, {useState} from 'react';
import {Header, StackHeaderProps} from '@react-navigation/stack';
import Animated, {SlideInUp, SlideOutUp} from 'react-native-reanimated';
import {Button} from '@rneui/themed';
import {View} from 'react-native';
import {useAppSelector} from '@redux/store/ViewerStore';

const ViewerHeader: React.FC<StackHeaderProps> = props => {
  const UIVisible = useAppSelector(state => state.viewer.UIVisible);
  return (
    <View>
      {UIVisible && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp.duration(1000)}
          style={{position: 'absolute', left: 0, right: 0}}>
          <Header {...props} />
        </Animated.View>
      )}
    </View>
  );
};
export default ViewerHeader;
