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
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const dimensions = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance.post<response<IPost[]>>('/api/feeds/recent').then(response => {
      if (response.data.data.length !== 0) {
        setData(prevState => [...prevState, ...response.data.data]);
        dispatch(postAddedMany(response.data.data));
      }
    });
  }, [dispatch]);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle(() => {
        apiInstance
          .post<response<IPost[]>>('/api/feeds/recent')
          .then(response => {
            if (response.data.data.length !== 0) {
              setData(prevState => [...prevState, ...response.data.data]);
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

  const posts = useAppSelector(state => {
    return data.map(item => state.posts.entities[item._id] || item);
  });
  return (
    <FlatList<IPost>
      data={posts}
      contentContainerStyle={{
        width: '100%',
        marginTop: insets.top + 46 + 24,
        minHeight: dimensions.height - tabBarHeight + 46 + 24,
      }}
      contentOffset={{y: insets.top + 46 + 24, x: 0}}
      onEndReached={onEndReached}
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
