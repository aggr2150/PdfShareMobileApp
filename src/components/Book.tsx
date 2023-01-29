import {Text} from '@rneui/themed';
import {View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Image} from 'react-native-image-crop-picker';

interface BookProps {
  title: string;
  author: IAuthor;
  thumbnail?: IFile;
}
const Book: React.FC<BookProps> = ({title, author, thumbnail}) => {
  const [dimension, setDimension] = useState<{width: number; height: number}>({
    width: 0,
    height: 0,
  });
  return thumbnail ? (
    <FastImage
      resizeMode={'cover'}
      style={{width: '100%', height: '100%', aspectRatio: 1 / Math.sqrt(2)}}
      source={{uri: thumbnail.filepath}}
    />
  ) : (
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
        {title}
      </Text>
      <Text style={{fontSize: dimension?.width / 10}} numberOfLines={2}>
        {author?.nickname}
      </Text>
    </View>
  );
};

export default Book;
