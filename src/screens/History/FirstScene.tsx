import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {makeStyles, Text} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import BookCard from '@components/BookCard';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {apiInstance} from '@utils/Networking';
import _ from 'lodash';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {postAddedMany, postSetMany} from '@redux/reducer/postsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import Book from '@components/Book';
import Separator from '@components/Seperator';
import {useNavigation} from '@react-navigation/native';
import {getHistoryNumColumns} from '@utils/Layout';
import VerticalSeparator from '@components/VerticalSeparator';

const FirstScene = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<IHistoryPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const dimensions = useWindowDimensions();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    apiInstance
      .post<response<IHistoryPost[]>>('/api/feeds/history')
      .then(response => {
        if (response.data.data.length !== 0) {
          setData(response.data.data);
          dispatch(postSetMany(response.data.data));
          setFetching(false);
        }
      });
  }, [dispatch]);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, initial?) => {
        apiInstance
          .post<response<IHistoryPost[]>>('/api/feeds/history', {pagingKey})
          .then(response => {
            if (response.data.data.length !== 0) {
              if (initial) {
                setData(response.data.data);
              } else {
                setData(prevState => [...prevState, ...response.data.data]);
              }
              dispatch(postSetMany(response.data.data));
            }
          })
          .catch(error => {
            console.log(error, 'his');
          })
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [dispatch],
  );
  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback(data[data.length - 1].timestamp);
    }
  }, [data, fetching, throttleEventCallback]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    throttleEventCallback.cancel();
    throttleEventCallback(undefined, true);
  }, [throttleEventCallback]);

  const posts = useAppSelector(state => {
    return data.map(item => state.posts.entities[item._id] || item);
  });
  const numColumns = getHistoryNumColumns(dimensions.width);
  return (
    // <SafeAreaView>
    <FlatList<IPost>
      data={posts}
      key={`#${numColumns}`}
      numColumns={numColumns}
      contentContainerStyle={{
        width: '100%',
        paddingTop: (insets.top || 24) + 46 + 12,
        minHeight: dimensions.height + (insets.top || 24) + 46 + 12,
      }}
      // style={{
      //   paddingTop: insets.top + 46 + 24,
      // }}
      // contentOffset={{y: (insets.top ? insets.top + 6 : 46 + 24) + 12, x: 0}}
      onEndReached={onEndReached}
      refreshing={refreshing}
      onRefresh={onRefresh}
      // ItemSeparatorComponent={VerticalSeparator}
      ItemSeparatorComponent={Separator}
      renderItem={({item, index}) => (
        <Pressable
          onPress={() => {
            navigation.navigate('Viewer', item);
          }}
          style={{
            backgroundColor: '#000',
            paddingHorizontal: 21,
            paddingVertical: 21,
            aspectRatio: 32 / 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1 / numColumns,
          }}>
          <View style={{flex: 0, paddingRight: 21}}>
            <Book
              author={item.author}
              title={item.title}
              thumbnail={item.thumbnail}
              color={'#603502'}
            />
          </View>
          <View style={{justifyContent: 'space-between', flex: 1}}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 22,
                textAlign: 'right',
                marginBottom: 37,
                color: '#fff',
              }}>
              {item.title}
            </Text>
            <Text style={{fontSize: 16, textAlign: 'right', color: '#9b9b9b'}}>
              {item.author.nickname}
            </Text>
          </View>
        </Pressable>
      )}
      refreshControl={
        <RefreshControl
          progressViewOffset={(insets.top || 24) + 46 + 12}
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={'#fff'}
        />
      }
    />
    // </SafeAreaView>
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
