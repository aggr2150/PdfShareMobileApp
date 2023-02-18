import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@rneui/themed';
import BookCard from '@components/BookCard';
import {FlatList, useWindowDimensions} from 'react-native';
import {apiInstance} from '@utils/Networking';
import _ from 'lodash';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {postSetMany} from '@redux/reducer/postsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';

const SecondScene: React.FC = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const dimensions = useWindowDimensions();
  const posts = useAppSelector(state => {
    return data.map(item => state.posts.entities[item._id] || item);
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post<response<IPost[]>>('/api/feeds/subscribe')
      .then(response => {
        if (response.data.data.length !== 0) {
          setData(prevState => [...prevState, ...response.data.data]);
          dispatch(postSetMany(response.data.data));
        }
      });
  }, [dispatch]);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, initial?) => {
        apiInstance
          .post<response<IPost[]>>('/api/feeds/subscribe')
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
  return (
    <FlatList<IPost>
      data={posts}
      contentContainerStyle={{
        paddingTop: (insets.top || 24) + 46 + 12,
        minHeight: dimensions.height + (insets.top || 24) + 46 + 12,
      }}
      contentOffset={{y: (insets.top ? insets.top + 6 : 46 + 24) + 12, x: 0}}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({item, index}) => <BookCard item={item} index={index} />}
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
export default SecondScene;
