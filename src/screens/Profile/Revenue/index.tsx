import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import BookCard from '@components/BookCard';
import Spinner from '@components/Spinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {StackScreenProps} from '@react-navigation/stack';
import {selectById, setOneUser, userSetMany} from '@redux/reducer/usersReducer';
import {apiInstance} from '@utils/Networking';
import {postSetMany} from '@redux/reducer/postsReducer';
import {selectAll, setAllLike} from '@redux/reducer/likesReducer';
import {getSession} from '@redux/reducer/authReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RevenueListHeader from '@screens/Profile/RevenueListHeader';
import Book from '@components/Book';
import {Text} from '@rneui/themed';
import Separator from '@components/Seperator';
import _ from 'lodash';

type RevenueProps = StackScreenProps<ProfileStackScreenParams, 'Revenue'>;
// type TSettlement = {
//   postViewCounter: number;
//   settledAmount: number;
//   settledViewCounter: number;
// };
const Revenue: React.FC<RevenueProps> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const session = useAppSelector(state => getSession(state));
  const [refreshing, setRefreshing] = useState(false);
  const [settlement, setSettlement] = useState<TSettlement>();
  const [feeds, setFeeds] = useState<IPost[]>([]);
  const [fetching, setFetching] = useState(true);
  // const LikesData = useAppSelector(state => {
  //   // state.likes
  //   return tabData[selectedIndex].map(
  //     item => state.posts.entities[item._id] || item,
  //   );
  // });
  const user = useAppSelector(state =>
    selectById(state.users, session?.id || ''),
  );
  useEffect(() => {
    apiInstance
      .post<
        response<{
          feeds: IPost[];
          settlement: TSettlement;
        }>
      >('/api/account/revenue', {})
      .then(response => {
        if (response.data.code === 200 && response.data.data.settlement) {
          if (response.data.data.feeds.length !== 0) {
            setFeeds(response.data.data.feeds);
          }
          setSettlement(response.data.data.settlement);
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, []);

  const throttleEventCallback = useMemo(
    () =>
      _.throttle(pagingKey => {
        apiInstance
          .post<response<IPost[]>>('/api/account/revenue/feeds', {pagingKey})
          .then(response => {
            if (response.data.data.length !== 0) {
              setFeeds(prevState => [...prevState, ...response.data.data]);
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [],
  );

  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback(feeds[feeds.length - 1]?._id);
    }
  }, [feeds, fetching, throttleEventCallback]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    apiInstance
      .post<
        response<{
          feeds: IPost[];
          settlement: TSettlement;
        }>
      >('/api/account/revenue', {})
      .then(response => {
        if (response.data.code === 200 && response.data.data.settlement) {
          if (response.data.data.feeds.length !== 0) {
            setFeeds(response.data.data.feeds);
          }
          setSettlement(response.data.data.settlement);
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, []);

  const renderItem = useMemo<
    React.FC<{item: IPost; index: number}>
  >((): React.FC<{item: IPost; index: number}> => {
    return ({item, index}) => (
      <Animated.View entering={FadeIn}>
        {/*<BookCard item={item} index={index} />*/}
        <View style={{flexDirection: 'row', aspectRatio: 32 / 12, padding: 24}}>
          <View style={{marginRight: 24}}>
            <View style={{aspectRatio: 3 / 4}}>
              <Book
                title={item.title}
                author={item.author}
                thumbnail={item.thumbnail}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flex: 1,
            }}>
            <Text style={{fontSize: 20}}>{item.title}</Text>
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16}}>예상 수익</Text>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 20, textAlign: 'right', color: '#99c729'}}>
                  ₩ {(item.viewCounter * 0.5).toFixed(0)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/*<Book />*/}
        {/*    <Pressable*/}
        {/*      onPress={() => {*/}
        {/*        navigation.navigate('CollectionList');*/}
        {/*      }}*/}
        {/*      style={{*/}
        {/*        backgroundColor: '#282828',*/}
        {/*        paddingHorizontal: 42,*/}
        {/*        paddingVertical: 54,*/}
        {/*        justifyContent: 'center',*/}
        {/*      }}>*/}
        {/*      <Text style={{fontSize: 14}}>크리스마스어쩌고 저쩌고</Text>*/}
        {/*    </Pressable>*/}
      </Animated.View>
    );
  }, []);
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
        paddingLeft: insets.left,
        overflow: 'visible',
        flex: 1,
      }}>
      {!settlement ? (
        <Spinner />
      ) : (
        <FlatList<IPost>
          data={feeds}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={onEndReached}
          // extraData={data}
          // showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{right: 0}}
          // style={{width: '100%'}}
          // exiting={SlideOutLeft}
          // style={{overflow: 'visible'}}
          // contentContainerStyle={{width: '100%'}}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={() => (
            <RevenueListHeader settlement={settlement} user={user} />
          )}
          renderItem={renderItem}
          // keyExtractor={item => `${selectedIndex}${item._id}`}
        />
      )}
    </View>
  );
};

export default Revenue;
