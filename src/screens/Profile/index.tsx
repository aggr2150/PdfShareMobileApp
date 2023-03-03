import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import ProfileListHeader from '@screens/Profile/ProfileListHeader';
import BookCard from '@components/BookCard';
import Spinner from '@components/Spinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {StackScreenProps} from '@react-navigation/stack';
import {
  selectById as selectUserById,
  setOneUser,
  updateManyUser,
  userSetMany,
} from '@redux/reducer/usersReducer';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {postSetMany} from '@redux/reducer/postsReducer';
import {likeSetMany, selectAll, setAllLike} from '@redux/reducer/likesReducer';
import {getSession} from '@redux/reducer/authReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SubscribingRow from '@components/SubscribingRow';
import {SheetManager} from 'react-native-actions-sheet';
import _ from 'underscore';
import {throttle} from 'lodash';
import ListEmptyComponent from '@components/ListEmptyComponent';
import {Button} from '@rneui/themed';
import {selectById as selectBlockUserById} from '@redux/reducer/blocksReducer';

enum ETabIndex {
  'PDF',
  'Likes',
  'Subscribing',
}

type ProfileProps = StackScreenProps<
  ProfileStackScreenParams,
  'Profile' | 'My'
>;
const Profile: React.FC<ProfileProps> = ({navigation, route}) => {
  // const navigation = useNavigation();
  // const route = useRoute();
  // route.params.id
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState<ETabIndex>(ETabIndex.PDF);
  const session = useAppSelector(state => getSession(state));
  const user = useAppSelector(state =>
    selectUserById(state.users, route.params?.id || session?.id || ''),
  );
  const [showBlockUser, setShowBlockUser] = useState(false);

  const block = useAppSelector(state =>
    user ? selectBlockUserById(state.blocks, user._id) : null,
  );
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>();
  const [tabData, setTabData] = useState<[IPost[], ILikePost[], IUser[]]>([
    [],
    [],
    [],
  ]);
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const PDFData = useAppSelector(state => {
    return tabData[0]
      .filter(item => !!state.posts.entities[item._id])
      .map(item => state.posts.entities[item._id]);
  });
  // const LikesData = useAppSelector(state => {
  //   // state.likes
  //   return tabData[selectedIndex].map(
  //     item => state.posts.entities[item._id] || item,
  //   );
  // });
  const LikesData = useAppSelector(state => {
    return selectAll(state.likes).map(
      item => state.posts.entities[item._id] as ILikePost,
    );
  });

  const sessionUser = useAppSelector(state =>
    selectUserById(state.users, session?.id || ''),
  );
  const FollowData = useAppSelector(state => {
    return tabData[selectedIndex].map(
      item => state.users.entities[item._id] || item,
    );
  }, _.isEqual);
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post<
        response<{
          user?: IUser;
          feeds: IPost[];
          likes: ILikePost[];
          subscribing: IUser[];
        }>
      >('/api/user', {
        id: route.params?.id,
      })
      .then(response => {
        if (response.data.code === 200 && response.data.data.user) {
          dispatch(setOneUser(response.data.data.user));
          dispatch(postSetMany(response.data.data.feeds));
          if (response.data.data.likes) {
            dispatch(postSetMany(response.data.data.likes));
            dispatch(setAllLike(response.data.data.likes));
          }
          if (response.data.data.subscribing) {
            dispatch(userSetMany(response.data.data.subscribing));
          }
          setTabData([
            response.data.data.feeds,
            response.data.data.likes || [],
            response.data.data.subscribing || [],
          ]);
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, [dispatch, route.params?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    apiInstance
      .post<
        response<{
          user?: IUser;
          feeds: IPost[];
          likes: ILikePost[];
          subscribing: IUser[];
        }>
      >('/api/user', {
        id: route.params?.id,
      })
      .then(response => {
        if (response.data.code === 200 && response.data.data.user) {
          dispatch(setOneUser(response.data.data.user));
          if (response.data.data.feeds.length !== 0) {
            setTabData([
              response.data.data.feeds,
              response.data.data.likes || [],
              response.data.data.subscribing || [],
            ]);
            dispatch(postSetMany(response.data.data.feeds));
          }
          if (
            response.data.data.likes &&
            response.data.data.likes.length !== 0
          ) {
            dispatch(postSetMany(response.data.data.likes));
            dispatch(setAllLike(response.data.data.likes));
          }
          if (
            response.data.data.subscribing &&
            response.data.data.subscribing.length !== 0
          ) {
            dispatch(userSetMany(response.data.data.subscribing));
          }
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, [dispatch, route.params?.id]);

  let data;
  const subscribe = useCallback(
    (targetUser: IUser) => {
      if (!session) {
        SheetManager.show('loginSheet', {payload: {closable: true}}).then();
      } else if (targetUser && targetUser._id !== session._id) {
        dispatch(
          updateManyUser([
            {
              id: targetUser.id,
              changes: {
                subscribeStatus: !targetUser.subscribeStatus,
                subscriberCounter:
                  targetUser.subscriberCounter +
                  (!targetUser.subscribeStatus ? +1 : -1),
              },
            },
            ...(sessionUser
              ? [
                  {
                    id: sessionUser.id,
                    changes: {
                      subscribingCounter:
                        sessionUser.subscribingCounter +
                        (!targetUser.subscribeStatus ? +1 : -1),
                    },
                  },
                ]
              : []),
          ]),
        );
        apiInstance
          .post<response>('/api/subscribe/' + targetUser._id, {
            subscribeStatus: !targetUser.subscribeStatus,
            _csrf: csrfToken,
          })
          .then(response => {
            console.log('response', response.data, targetUser.subscribeStatus);
            if (response.data.code !== 200) {
              dispatch(
                updateManyUser([
                  {
                    id: targetUser.id,
                    changes: {
                      subscribeStatus: targetUser.subscribeStatus,
                      subscriberCounter:
                        targetUser.subscriberCounter +
                        (targetUser.subscribeStatus ? +1 : -1),
                    },
                  },
                  ...(sessionUser
                    ? [
                        {
                          id: sessionUser.id,
                          changes: {
                            subscribingCounter:
                              sessionUser.subscribingCounter +
                              (targetUser.subscribeStatus ? +1 : -1),
                          },
                        },
                      ]
                    : []),
                ]),
              );
            }
          })
          .catch(() => {
            dispatch(
              updateManyUser([
                {
                  id: targetUser.id,
                  changes: {
                    subscribeStatus: targetUser.subscribeStatus,
                    subscriberCounter:
                      targetUser.subscriberCounter +
                      (targetUser.subscribeStatus ? +1 : -1),
                  },
                },
                ...(sessionUser
                  ? [
                      {
                        id: sessionUser.id,
                        changes: {
                          subscribingCounter:
                            sessionUser.subscribingCounter +
                            (targetUser.subscribeStatus ? +1 : -1),
                        },
                      },
                    ]
                  : []),
              ]),
            );
          });
      } else {
        SheetManager.show('loginSheet', {payload: {closable: true}}).then();
      }
    },
    [session, dispatch, sessionUser, csrfToken],
  );

  const PDFThrottleEventCallback = useMemo(
    () =>
      throttle((pagingKey, initial?) => {
        setFetching(true);
        apiInstance
          .post<response<IPost[]>>('/api/feeds/user', {
            id: route.params?.id,
            pagingKey,
          })
          .then(response => {
            if (response.data.data.length !== 0) {
              if (initial) {
                setTabData(prevState => [
                  response.data.data,
                  prevState[1],
                  prevState[2],
                ]);
              } else {
                setTabData(prevState => [
                  [...prevState[0], ...response.data.data],
                  prevState[1],
                  prevState[2],
                ]);
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
    [dispatch, route.params?.id],
  );

  const LikesThrottleEventCallback = useMemo(
    () =>
      throttle(
        (pagingKey, initial?) => {
          setFetching(true);
          console.log('thth');
          apiInstance
            .post<response<ILikePost[]>>('/api/feeds/likes', {
              pagingKey,
            })
            .then(response => {
              console.log(response.data.data);
              if (response.data.data.length !== 0) {
                if (initial) {
                  setTabData(prevState => [
                    prevState[0],
                    response.data.data,
                    prevState[2],
                  ]);
                } else {
                  setTabData(prevState => [
                    prevState[0],
                    [...prevState[1], ...response.data.data],
                    prevState[2],
                  ]);
                }
                dispatch(postSetMany(response.data.data));
                dispatch(likeSetMany(response.data.data));
              }
            })
            .catch(error => console.log(error))
            .finally(() => {
              setFetching(false);
              setRefreshing(false);
            });
        },
        1000,
        // {leading: true, trailing: false},
      ),
    [dispatch],
  );

  const SubscribingThrottleEventCallback = useMemo(
    () =>
      throttle((pagingKey, initial?) => {
        setFetching(true);
        apiInstance
          .post<response<IUser[]>>('/api/user/subscribing', {
            pagingKey,
          })
          .then(response => {
            if (response.data.data.length !== 0) {
              if (initial) {
                setTabData(prevState => [
                  prevState[0],
                  prevState[1],
                  response.data.data,
                ]);
              } else {
                setTabData(prevState => [
                  prevState[0],
                  prevState[1],
                  [...prevState[2], ...response.data.data],
                ]);
              }
              dispatch(userSetMany(response.data.data));
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
      switch (selectedIndex) {
        case ETabIndex.PDF:
          PDFThrottleEventCallback(tabData[0][tabData[0].length - 1]?._id);
          break;
        case ETabIndex.Likes:
          LikesThrottleEventCallback(tabData[1][tabData[1].length - 1]?.likeAt);
          break;
        case ETabIndex.Subscribing:
          console.log(tabData[2]);
          SubscribingThrottleEventCallback(
            tabData[2][tabData[2].length - 1]?.subscribedAt,
          );
          break;
      }
    }
  }, [
    fetching,
    selectedIndex,
    PDFThrottleEventCallback,
    tabData,
    LikesThrottleEventCallback,
    SubscribingThrottleEventCallback,
  ]);

  const renderItem = useMemo<
    React.FC<{item: IPost | IUser; index: number}>
  >((): React.FC<{item: IPost | IUser; index: number}> => {
    switch (selectedIndex) {
      case ETabIndex.PDF:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item as IPost} index={index} />
          </Animated.View>
        );
      case ETabIndex.Likes:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item as IPost} index={index} />
          </Animated.View>
        );
      case ETabIndex.Subscribing:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <SubscribingRow
              item={item as IUser}
              index={index}
              subscribe={subscribe}
            />
          </Animated.View>
        );
    }
  }, [selectedIndex, subscribe]);
  switch (selectedIndex) {
    case 0:
      data = PDFData;
      break;
    case 1:
      data = LikesData;
      break;
    case 2:
      data = FollowData;
      break;
  }
  function emptyText(index: ETabIndex) {
    switch (index) {
      case ETabIndex.PDF:
        return '게시물이 없습니다.';
      case ETabIndex.Likes:
        return '좋아요 한 게시물이 없습니다.';
      case ETabIndex.Subscribing:
        return '구독중인 유저가 없습니다.';
    }
  }
  return (
    <View
      style={{
        paddingBottom: 0,
        paddingRight: insets.right,
        paddingLeft: insets.left,
        overflow: 'visible',
        flex: 1,
      }}>
      {!user && fetching ? (
        <Spinner />
      ) : !user && !route.params?.id ? (
        <ListEmptyComponent
          ExtraComponent={
            <Button
              style={{marginTop: 24}}
              title={'로그인'}
              onPress={() =>
                SheetManager.show('loginSheet', {
                  payload: {closable: true},
                }).then()
              }
            />
          }>
          아직 프로필이 없습니다. 로그인을 해 주세요!
        </ListEmptyComponent>
      ) : block && !showBlockUser ? (
        <ListEmptyComponent
          ExtraComponent={
            <Button
              // containerStyle={{}}
              containerStyle={{marginTop: 24}}
              buttonStyle={{
                paddingHorizontal: 32,
                paddingVertical: 12,
                borderRadius: 500,
              }}
              titleStyle={{fontSize: 12}}
              color="grey1"
              title={'보기'}
              onPress={() => setShowBlockUser(true)}
            />
          }>
          차단된 유저입니다.
        </ListEmptyComponent>
      ) : (
        <FlatList<IPost | IUser>
          data={data}
          // data={[]}
          onRefresh={onRefresh}
          refreshing={refreshing}
          // extraData={data}
          // showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{right: 0}}
          // style={{width: '100%'}}
          // exiting={SlideOutLeft}
          // style={{overflow: 'visible'}}
          // contentContainerStyle={{width: '100%'}}

          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={() =>
            fetching ? (
              <Spinner />
            ) : (
              <ListEmptyComponent>
                {user
                  ? emptyText(selectedIndex)
                  : '삭제된 아이디 또는 존재하지 않는 사용자입니다.'}
              </ListEmptyComponent>
            )
          }
          onEndReached={onEndReached}
          ListHeaderComponent={() => (
            <ProfileListHeader
              user={user}
              isMine={session?._id === user?._id}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          )}
          renderItem={renderItem}
          // keyExtractor={item => `${selectedIndex}${item._id}`}
        />
      )}
    </View>
  );
};

export default Profile;
