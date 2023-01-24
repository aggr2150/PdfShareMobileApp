import React, {useState} from 'react';
import {makeStyles, Text} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import BookCard from '@components/BookCard';
import {FlatList, Pressable, useWindowDimensions, View} from 'react-native';
import Book from '@components/Book';
import {useNavigation} from '@react-navigation/native';

const FirstScene = () => {
  const styles = useStyles();
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState(Array(50));
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View
          style={{
            marginBottom: 30,
            marginHorizontal: 30,
          }}>
          <Text style={{fontSize: 17}}>히스토리</Text>
          {data.length === 0 && (
            <Text style={{fontSize: 12, marginTop: 3, color: '#ccc'}}>
              기록이 없습니다.
            </Text>
          )}
        </View>
        {data.length !== 0 && (
          <FlatList<TPlace>
            data={Array(50)}
            horizontal
            contentContainerStyle={{
              // aspectRatio: 16 / 9,
              // flex: 1,
              height: (width / 21) * 9,
              // width: width,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 3,
                }}
              />
            )}
            showsHorizontalScrollIndicator={true}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => navigation.navigate('Viewer')}
                style={{
                  // paddingRight: '5%',
                  flex: 1,
                  // backgroundColor: 'red',
                }}>
                <Book item={item} index={index} />
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
}));
export default FirstScene;
