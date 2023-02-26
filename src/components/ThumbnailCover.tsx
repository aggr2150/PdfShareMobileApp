import {Text} from '@rneui/themed';
import {View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Image} from 'react-native-image-crop-picker';

interface ThumbnailCoverProps {
  title: string;
  author: IAuthor;
  thumbnail?: IFile;
  source?: Image;
}
const ThumbnailCover: React.FC<ThumbnailCoverProps> = ({
  title,
  author,
  thumbnail,
  source,
}) => {
  const [dimension, setDimension] = useState<{width: number; height: number}>({
    width: 0,
    height: 0,
  });
  return source || thumbnail ? (
    <FastImage
      resizeMode={'cover'}
      style={{width: '100%', height: '100%', aspectRatio: 1 / Math.sqrt(2)}}
      source={{uri: source?.path || thumbnail?.filepath}}
    />
  ) : (
    <View
      onLayout={layout => setDimension(layout.nativeEvent.layout)}
      style={{
        aspectRatio: 1 / Math.sqrt(2),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: dimension.width * 0.1,
        paddingTop: dimension.height * 0.15,
        paddingBottom: dimension.height * 0.2,
      }}>
      <Text
        style={{
          fontSize: dimension?.width / 9,
          textAlign: 'center',
          color: '#99c729',
        }}
        numberOfLines={2}>
        표지 이미지를 선택해 주세요
      </Text>
      <Text style={{fontSize: dimension?.width / 10}} numberOfLines={2}>
        {author?.nickname}
      </Text>
    </View>
  );
};

export default ThumbnailCover;
