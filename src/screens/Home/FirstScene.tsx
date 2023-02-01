import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {makeStyles} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import BookCard from '@components/BookCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatList, TouchableOpacity, useWindowDimensions} from 'react-native';
import {apiInstance} from '@utils/Networking';
import _ from 'lodash';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {postAddedMany} from '@redux/reducer/postsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';

const FirstScene = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const dimensions = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance.post<response<IPost[]>>('/api/feeds/recent').then(response => {
      if (response.data.data.length !== 0) {
        setData(response.data.data.slice(0, 3));
        dispatch(postAddedMany(response.data.data));
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
            console.log(response.data, response.data.data.slice(0, 3));
            if (response.data.data.length !== 0) {
              if (initial) {
                setData(response.data.data);
              } else {
                setData(prevState => [
                  ...prevState,
                  ...response.data.data.slice(0, 3),
                ]);
              }
              dispatch(postAddedMany(response.data.data));
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            console.log('fin');
            setFetching(false);
            setRefreshing(false);
          });
      }),
    [dispatch],
  );
  const onEndReached = useCallback(() => {
    console.log(data, fetching);
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
  return (
    <FlatList<IPost>
      data={posts}
      contentContainerStyle={{
        width: '100%',
        paddingTop: insets.top + 46 + 24,
        minHeight: dimensions.height - tabBarHeight + 46 + 24,
      }}
      contentOffset={{y: insets.top + 46 + 24, x: 0}}
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
export default FirstScene;
