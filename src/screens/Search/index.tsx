import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import {makeStyles, SearchBar, Text} from '@rneui/themed';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BookCard from '@components/BookCard';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {apiInstance} from '@utils/Networking';
import {postAddedMany, postSetMany} from '@redux/reducer/postsReducer';
import _ from 'lodash';
import Spinner from '@components/Spinner';
import queryString from 'query-string';
import Book from '@components/book/Book';
import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import ColumnCard from '@components/book/ColumnCard';
import {getNumColumns} from '@utils/Layout';
const LIST_ITEM_COLORS = ['#5DB522', '#fc86b7', '#1751D9'];
type SearchProps = BottomTabScreenProps<BottomTabParamList, 'Search'>;
const Search: React.FC<SearchProps> = ({navigation, route}) => {
  const styles = useStyles();
  const [keyword, setKeyword] = useState<string>('');
  const insets = useSafeAreaInsets();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<IPost[]>([]);
  const [sample, setSample] = useState<IPost[]>([]);
  const dimensions = useWindowDimensions();
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post<response<IPost[]>>('/api/feeds/sample')
      .then(response => {
        if (response.data.data.length !== 0) {
          setSample(response.data.data);
          dispatch(postSetMany(response.data.data));
          // setFetching(false);
          // setInitialized(true);
        }
      })
      .finally(() => {
        setInitialized(true);
      });
  }, [dispatch]);
  const throttleKeywordEventCallback = useMemo(
    () =>
      _.throttle((q: string, pagingKey?, initial = false) => {
        apiInstance
          .post<response<IPost[]>>(
            '/api/search?' + queryString.stringify({q}),
            {pagingKey},
          )
          .then(response => {
            console.log('search', response.data.data);
            if (initial) {
              setData(response.data.data);
              dispatch(postSetMany(response.data.data));
            } else {
              if (response.data.data.length !== 0) {
                setData(prevState => [...prevState, ...response.data.data]);
                dispatch(postSetMany(response.data.data));
              }
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setLoading(false);
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [dispatch],
  );

  useEffect(() => {
    if (route.params?.keyword) {
      setKeyword(route.params.keyword);
      throttleKeywordEventCallback(route.params?.keyword, undefined, true);
    }
  }, [route.params, throttleKeywordEventCallback]);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle(() => {
        apiInstance
          .post<response<IPost[]>>('/api/feeds/sample')
          .then(response => {
            console.log('sample');
            if (response.data.data.length !== 0) {
              // if (initial) {
              setSample(response.data.data);
              // } else {
              //   setData(prevState => [...prevState, ...response.data.data]);
              // }
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
  const onChangeText = useCallback(
    (value: string) => {
      setKeyword(value);
      if (value.length === 0 || value === '#') {
        throttleKeywordEventCallback.cancel();
        // throttleEventCallback();
      } else {
        setLoading(true);
        throttleEventCallback.cancel();
        throttleKeywordEventCallback(value, undefined, true);
      }
    },
    [throttleEventCallback, throttleKeywordEventCallback],
  );
  const onEndReached = useCallback(() => {
    if (!fetching && keyword.length !== 0) {
      // data[data.length - 1]?._id
      throttleKeywordEventCallback(
        keyword,
        keyword.startsWith('#') ? data[data.length - 1]?._id : data.length,
      );
    }
  }, [data, fetching, keyword, throttleKeywordEventCallback]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (keyword.length !== 0) {
      throttleKeywordEventCallback(keyword, undefined, true);
    } else {
      apiInstance
        .post<response<IPost[]>>('/api/feeds/sample')
        .then(response => {
          if (response.data.data.length !== 0) {
            setSample(response.data.data);
            dispatch(postSetMany(response.data.data));
            // setFetching(false);
            setInitialized(true);
          }
        })
        .finally(() => {
          setFetching(false);
          setRefreshing(false);
        });
    }
  }, [dispatch, keyword, throttleKeywordEventCallback]);
  const posts = useAppSelector(state => {
    return data.map(item => state.posts.entities[item._id] || item);
  });
  const numColumns = getNumColumns(dimensions.width);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      {/*<TouchableOpacity*/}
      {/*  onPress={() => navigation.goBack()}*/}
      {/*  style={{*/}
      {/*    position: 'absolute',*/}
      {/*    top: insets.top || 24,*/}
      {/*    zIndex: 1,*/}
      {/*    left: 0,*/}
      {/*    width: 36,*/}
      {/*    height: 36,*/}
      {/*    borderRadius: 36,*/}
      {/*    backgroundColor: 'white',*/}
      {/*    shadowColor: '#000',*/}
      {/*    shadowOffset: {*/}
      {/*      width: 0,*/}
      {/*      height: 1,*/}
      {/*    },*/}
      {/*    shadowOpacity: 0.22,*/}
      {/*    shadowRadius: 2.22,*/}

      {/*    elevation: 3,*/}
      {/*    justifyContent: 'center',*/}
      {/*    alignItems: 'center',*/}
      {/*  }}>*/}
      {/*  <Pressable onPress={() => navigation.goBack()}>*/}
      {/*    <Ionicons*/}
      {/*      name={Platform.select({*/}
      {/*        android: 'arrow-back',*/}
      {/*        ios: 'ios-chevron-back',*/}
      {/*        default: 'ios-chevron-back',*/}
      {/*      })}*/}
      {/*      size={Platform.select({*/}
      {/*        android: 24,*/}
      {/*        ios: 30,*/}
      {/*        default: 30,*/}
      {/*      })}*/}
      {/*    />*/}
      {/*  </Pressable>*/}
      {/*</TouchableOpacity>*/}
      <View
        pointerEvents={'box-none'}
        style={{
          position: 'absolute',
          top: insets.top || 24,
          zIndex: 1,
          // width: '100%',
          left: 0,
          right: 0,
          marginHorizontal: 60,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            maxWidth: 500,
          }}>
          <SearchBar
            showLoading={loading}
            value={keyword}
            onChangeText={onChangeText}
            // inputContainerStyle={{}}
            // style={{borderRadius: 20, overflow: 'hidden'}}
            inputContainerStyle={{
              // height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red',
              // height: 46,
            }}
            inputStyle={{
              fontSize: 12,
              minHeight: 35,
              marginLeft: 0,
              // textAlignVertical: 'top',
              height: 46,
            }}
            rightIconContainerStyle={{
              height: 46,
            }}
            leftIconContainerStyle={{
              paddingHorizontal: 10,
              height: 46,
            }}
            style={{
              // width: '100%',
              height: 46,
            }}
            containerStyle={{
              // alignItems: 'center',
              justifyContent: 'center',
              height: 46,

              maxHeight: 46,
              maxWidth: 700,
              // width: '100%',
              borderRadius: 300,
              overflow: 'hidden',
              padding: 0,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            platform={'default'}
          />
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}>
        {!initialized ? (
          <Spinner />
        ) : (
          <FlatList<IPost>
            key={`#${numColumns}`}
            numColumns={numColumns}
            data={keyword.length === 0 || keyword === '#' ? sample : posts}
            contentContainerStyle={{
              // width: '100%',
              // paddingTop: (insets.top || 24) + 46,
              paddingTop: (insets.top || 24) + 46 + 12,
              minHeight: dimensions.height + (insets.top || 24) + 46 + 12,
            }}
            // contentOffset={{
            //   y: (insets.top ? insets.top + 6 : 43 + 24) + 12,
            //   x: 0,
            // }}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={props => (
              <ColumnCard {...props} numColumns={numColumns} />
            )}
            refreshControl={
              <RefreshControl
                progressViewOffset={(insets.top || 24) + 46 + 12}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
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
  titleLabel: {
    fontSize: 14,
    color: theme.colors.black,
  },
  authorLabel: {
    fontSize: 11,
    color: theme.colors.grey0,
  },
}));
export default Search;
