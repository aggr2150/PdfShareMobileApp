import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import Spinner from '@components/Spinner';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance} from '@utils/Networking';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Book from '@components/book/Book';
import {Text} from '@rneui/themed';
import Separator from '@components/Seperator';
import _ from 'lodash';
import Orientation from 'react-native-orientation-locker';
// import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {FlatList} from '@stream-io/flat-list-mvcp';
import {useLinkTo} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import ListEmptyComponent from '@components/ListEmptyComponent';
import {INotification} from '@src/types/models';

type NotificationsProps = StackScreenProps<
  ProfileStackScreenParams,
  'Notifications'
>;
// type TSettlement = {
//   postViewCounter: number;
//   settledAmount: number;
//   settledViewCounter: number;
// };
const Notifications: React.FC<NotificationsProps> = () => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<INotification<any>[]>([]);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);
  useEffect(() => {
    apiInstance
      .post<response<INotification<any>[]>>('/api/account/notifications', {})
      .then(response => {
        if (response.data.code === 200 && response.data.data) {
          if (response.data.data.length !== 0) {
            setData(response.data.data);
          }
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, []);

  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, initial?) => {
        apiInstance
          .post<response<INotification<any>[]>>('/api/account/notifications', {
            pagingKey,
          })
          .then(response => {
            if (response.data.data.length !== 0) {
              if (initial) {
                setData(response.data.data);
              } else {
                setData(prevState => [...prevState, ...response.data.data]);
              }
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
      throttleEventCallback(data[data.length - 1]?._id);
    }
  }, [data, fetching, throttleEventCallback]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    throttleEventCallback.cancel();
    throttleEventCallback(undefined, true);
  }, [throttleEventCallback]);

  const linkTo = useLinkTo();
  const renderItem = useMemo<
    React.FC<{item: INotification<any>; index: number}>
  >((): React.FC<{item: INotification<any>; index: number}> => {
    return ({item}) => (
      <TouchableOpacity onPress={() => item.route && linkTo(item.route)}>
        {/*<BookCard item={item} index={index} />*/}
        {/*<Text style={{marginVertical: 20}}>테스트{item}</Text>*/}
        <View
          style={{
            flexDirection: 'row',
            minHeight: 120,
            maxHeight: 200,
            paddingHorizontal: 4,
            paddingRight: 24,
          }}>
          {item.fromUser && (
            <Pressable
              onPress={() => item.fromUser && linkTo(`/u/${item.fromUser.id}`)}>
              <Avatar
                style={{margin: 8, width: 24, height: 24}}
                avatar={item.fromUser.avatar}
              />
            </Pressable>
          )}
          <View
            style={{
              marginLeft: item.fromUser ? 0 : 32,
              marginVertical: 8,
              // justifyContent: 'space-between',
              // alignItems: 'flex-end',
              flex: 1,
            }}>
            {item.title && (
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                }}>
                {item.title}
              </Text>
            )}
            <Text style={{fontSize: 14}}>{item.body}</Text>
          </View>
          {item.post?._id && (
            <TouchableOpacity
              style={{marginLeft: 16, marginVertical: 15, flex: 0}}
              onPress={() => linkTo(`/post/${item.post?._id}`)}>
              <View style={{aspectRatio: 3 / 4, flex: 1}}>
                <Book
                  title={item.post.title}
                  author={item.post.author}
                  thumbnail={item.post.thumbnail}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [linkTo]);
  return (
    <View
      style={{
        paddingRight: insets.right,
        paddingLeft: insets.left,
        overflow: 'visible',
        flex: 1,
      }}>
      {
        <FlatList<INotification<any>>
          contentContainerStyle={{flexGrow: 1}}
          data={data}
          keyExtractor={item => item._id}
          // onStartReached={async () => {
          //   // flatListRef.current?.scrollToIndex({animated: false, index: 10});
          //   setData(prevState => [
          //     ...[
          //       'aaa' + prevState.length,
          //       'bbb' + prevState.length,
          //       'ccc' + prevState.length,
          //       'ddd' + prevState.length,
          //     ],
          //     ...prevState,
          //   ]);
          //   // flatListRef.current?.;
          // }}
          onRefresh={onRefresh}
          // onEndReachedThreshold={10}
          // onRefresh={onRefresh}
          // updateCellsBatchingPeriod={}
          // onContentSizeChange={() => {
          //   flatListRef.current.scrollToIndex({animated: true, index: 10});
          // }}
          // directionalLockEnabled={}
          // onViewableItemsChanged={({viewableItems, changed}) => {
          //   // console.log(viewableItems, changed);
          // }}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={() => {
          //       setData(prevState => [
          //         ...[
          //           'aaa' + prevState.length,
          //           'bbb' + prevState.length,
          //           'ccc' + prevState.length,
          //           'ddd' + prevState.length,
          //         ],
          //         ...prevState,
          //       ]);
          //     }}
          //   />
          // }
          refreshing={refreshing}
          onEndReached={onEndReached}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          // onViewableItemsChanged={}
          // extraData={data}
          // showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{right: 0}}
          // style={{width: '100%'}}
          // exiting={SlideOutLeft}
          // style={{overflow: 'visible'}}
          // contentContainerStyle={{width: '100%'}}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={() =>
            fetching ? (
              <Spinner />
            ) : (
              <ListEmptyComponent>알림이 없습니다.</ListEmptyComponent>
            )
          }
          renderItem={renderItem}
          // keyExtractor={item => `${item._id}`}
        />
      }
    </View>
  );
};

export default Notifications;
