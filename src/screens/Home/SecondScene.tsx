import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import BookCard from '@components/BookCard';
import {FlatList, useWindowDimensions} from 'react-native';
import {apiInstance} from '@utils/Networking';
import _ from 'lodash';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {postAddedMany} from '@redux/reducer/postsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';

const SecondScene: React.FC = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const dimensions = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
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
          dispatch(postAddedMany(response.data.data));
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
              dispatch(postAddedMany(response.data.data));
            }
          })
          .finally(() => setFetching(false));
      }),
    [dispatch],
  );
  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback();
    }
  }, [fetching, throttleEventCallback]);
  return (
    <FlatList<IPost>
      data={posts}
      onEndReached={onEndReached}
      contentContainerStyle={{
        marginTop: insets.top + 46 + 24,
        minHeight: dimensions.height - tabBarHeight + 46 + 24,
      }}
      contentOffset={{y: insets.top + 46 + 24, x: 0}}
      // contentContainerStyle={{width: '100%'}}
      renderItem={({item, index}) => <BookCard item={item} index={index} />}
    />
    // <ThrottleFlatList<TPlace>
    //   data={Array(20)}
    //   contentContainerStyle={{width: '100%'}}
    //   renderItem={BookCard}
    // />
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
