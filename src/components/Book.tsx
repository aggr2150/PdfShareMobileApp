import {Text} from '@rneui/themed';
import {View} from 'react-native';
import React, {useState} from 'react';

const Book = () => {
  const [dimension, setDimension] = useState<{width: number; height: number}>({
    width: 0,
    height: 0,
  });
  return (
    <View
      onLayout={layout => setDimension(layout.nativeEvent.layout)}
      style={{
        aspectRatio: 1 / Math.sqrt(2),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'brown',
        padding: dimension.width * 0.1,
        paddingTop: dimension.height * 0.15,
        paddingBottom: dimension.height * 0.2,
      }}>
      <Text
        style={{fontSize: dimension?.width / 9, textAlign: 'center'}}
        numberOfLines={2}>
        크리스마스가 어쩌고저쩌고
      </Text>
      <Text style={{fontSize: dimension?.width / 10}} numberOfLines={2}>
        작가가 누구
      </Text>
    </View>
  );
};

export default Book;
