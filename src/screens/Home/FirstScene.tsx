import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@rneui/themed';
import BookCard from '@components/BookCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatList, RefreshControl, useWindowDimensions} from 'react-native';
import {apiInstance} from '@utils/Networking';
import _ from 'lodash';
import {postSetMany} from '@redux/reducer/postsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import ColumnCard from '@components/book/ColumnCard';
import {getNumColumns} from '@utils/Layout';

// const BACKGROUND_COLORS = ['#1750dd', '#60B630', '#fc86b7'];
const LIST_ITEM_COLORS = [
  {background: '#1751D9', book: '#fc86b7'},
  {background: '#60B630', book: '#1751D9'},
  {background: '#fc86b7', book: '#60B630'},
];
const FirstScene = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const dimensions = useWindowDimensions();
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance.post<response<IPost[]>>('/api/feeds/recent').then(response => {
      if (response.data.code === 200 && response.data.data?.length !== 0) {
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
          .post<response<IPost[]>>('/api/feeds/recent', {pagingKey})
          .then(response => {
            if (response.data.code === 200 && response.data.data.length !== 0) {
              if (initial) {
                setData(response.data.data);
              } else {
                setData(prevState => [...prevState, ...response.data.data]);
              }
              dispatch(postSetMany(response.data.data));
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [dispatch],
  );
  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback(data[data.length - 1]?._id);
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
  const numColumns = getNumColumns(dimensions.width);
  return numColumns === 3 ? (
    <FlatList<IPost>
      key={'#'}
      data={posts}
      contentContainerStyle={{
        // paddingTop: (insets.top || 24) + 46,
        paddingTop: (insets.top || 24) + 46 + 12,
        minHeight: dimensions.height + (insets.top || 24) + 46 + 12,
      }}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={item => item._id}
      renderItem={({item, index}) => (
        <BookCard item={item} index={index} colors={LIST_ITEM_COLORS} />
      )}
      refreshControl={
        <RefreshControl
          progressViewOffset={(insets.top || 24) + 46 + 12}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  ) : (
    <FlatList<IPost>
      key={`@${numColumns}`}
      numColumns={numColumns}
      data={posts}
      contentContainerStyle={{
        // paddingTop: (insets.top || 24) + 46,
        paddingTop: (insets.top || 24) + 46 + 12,
        minHeight: dimensions.height + (insets.top || 24) + 46 + 12,
      }}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={item => item._id}
      renderItem={props => (
        <ColumnCard {...props} numColumns={numColumns} />
        // <BookCard item={item} index={index} colors={LIST_ITEM_COLORS} />
      )}
      refreshControl={
        <RefreshControl
          progressViewOffset={(insets.top || 24) + 46 + 12}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
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
