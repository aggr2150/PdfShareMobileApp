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
import {FlatList, TouchableOpacity} from 'react-native';
import {apiInstance} from '@utils/Networking';
import _ from 'lodash';

const FirstScene = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    apiInstance.post<response<IPost[]>>('/api/feeds/recent').then(response => {
      if (response.data.data.length !== 0) {
        setData(prevState => [...prevState, ...response.data.data]);
      }
    });
  }, []);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle(() => {
        apiInstance
          .post<response<IPost[]>>('/api/feeds/recent')
          .then(response => {
            console.log(response.data.data);
            if (response.data.data.length !== 0) {
              setData(prevState => [...prevState, ...response.data.data]);
            }
          })
          .finally(() => setFetching(false));
      }),
    [],
  );
  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback();
    }
  }, [fetching, throttleEventCallback]);

  return (
    <FlatList<IPost>
      data={data}
      contentContainerStyle={{width: '100%', marginTop: insets.top + 46 + 12}}
      contentOffset={{y: insets.top + 46 + 12, x: 0}}
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
