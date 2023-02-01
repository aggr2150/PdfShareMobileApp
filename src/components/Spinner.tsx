import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import React from 'react';

const Spinner: React.FC = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <LottieView
      source={require('@assets/animations/spinner.json')}
      autoPlay
      speed={2}
      loop
      style={{
        width: 300,
      }}
      // autoSize={false}
    />
  </View>
);
export default Spinner;
