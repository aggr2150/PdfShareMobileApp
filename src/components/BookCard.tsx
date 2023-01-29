import React from 'react';
import {ListRenderItem, Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Book from '@src/components/Book';

interface BookCardProps {
  item: IPost;
  index: number;
}
const BookCard: React.FC<BookCardProps> = ({item, index}) => {
  const styles = useStyles();
  const navigation = useNavigation();
  console.log('author', item, index);
  return (
    <Pressable
      onPress={() => navigation.navigate('Viewer', item)}
      style={{
        aspectRatio: 16 / 9,
        backgroundColor: index % 2 === 0 ? '#1a3692' : '#e73f90',
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 24,
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1, margin: 8, justifyContent: 'space-between'}}>
          <Text style={{fontSize: 22, fontWeight: 'bold'}} numberOfLines={2}>
            {item?.title}
          </Text>
          <View>
            <Text style={{fontSize: 12}} numberOfLines={3}>
              올린이는 크리스마스 에세이에 대한 정보를 피드에 간단히 보여줄 수
              있 습니다.
              {item?.content}
            </Text>
            <Text style={{marginTop: 5, fontSize: 12, alignSelf: 'flex-end'}}>
              {item?.author?.nickname}
            </Text>
          </View>
        </View>
        <View
          style={{
            // flex: 1,
            marginLeft: 32,
            aspectRatio: 3 / 4,
            // backgroundColor: 'white',
            height: '100%',
          }}>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              position: 'absolute',
              top: 12,
              // right: 50,
              left: 10,
              backgroundColor: 'white',
              // flex: 1,
              height: '70%',
              // width: '100%',
              aspectRatio: 1 / Math.sqrt(2),
            }}>
            <Book
              author={item?.author}
              document={item?.document}
              documentThumbnail={item?.documentThumbnail}
              thumbnail={item?.documentThumbnail}
              title={item?.title}
            />
            {/*<View*/}
            {/*  style={{*/}
            {/*    width: '100%',*/}
            {/*    height: '100%',*/}
            {/*    backgroundColor: 'yellow',*/}
            {/*  }}></View>*/}
          </View>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              position: 'absolute',
              right: 10,
              bottom: 12,
              // backgroundColor: 'brown',
              height: '70%',
              aspectRatio: 1 / Math.sqrt(2),
            }}>
            <Book
              author={item?.author}
              document={item?.document}
              documentThumbnail={item?.documentThumbnail}
              thumbnail={item?.thumbnail}
              title={item?.title}
            />
          </View>
        </View>
        {/*<Text>{item._id}</Text>*/}
      </View>
    </Pressable>
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
export default BookCard;
