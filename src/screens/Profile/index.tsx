import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import ProfileListHeader from '@screens/Profile/ProfileListHeader';
import BookCard from '@components/BookCard';
import Spinner from '@components/Spinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {StackScreenProps} from '@react-navigation/stack';
import {
  selectById,
  setOneUser,
  updateManyUser,
  userSetMany,
} from '@redux/reducer/usersReducer';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {postAddedMany, postSetMany} from '@redux/reducer/postsReducer';
import {selectAll, setAllLike} from '@redux/reducer/likesReducer';
import {getSession} from '@redux/reducer/authReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SubscribingRow from '@components/SubscribingRow';
import {SheetManager} from 'react-native-actions-sheet';
import _ from 'underscore';
import {useSelector} from 'react-redux';

enum ETabIndex {
  'PDF',
  'Likes',
  'Follow',
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
    selectById(state.users, route.params?.id || session?.id || ''),
  );
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
    return tabData[selectedIndex].map(
      item => state.posts.entities[item._id] || item,
    );
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
    selectById(state.users, session?.id || ''),
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
          console.log('responseresponse', response.data.data);
          dispatch(setOneUser(response.data.data.user));
          dispatch(postSetMany(response.data.data.feeds));
          dispatch(setAllLike(response.data.data.likes));
          dispatch(userSetMany(response.data.data.subscribing));
          setTabData([
            response.data.data.feeds,
            response.data.data.likes,
            response.data.data.subscribing,
          ]);
          // if (response.data.data.feeds.length !== 0) {
          //   setTabData([
          //     response.data.data.feeds,
          //     response.data.data.likes,
          //     response.data.data.subscribing,
          //   ]);
          //   dispatch(postSetMany(response.data.data.feeds));
          // }
          // if (
          //   response.data.data.likes &&
          //   response.data.data.likes.length !== 0
          // ) {
          //   dispatch(setAllLike(response.data.data.likes));
          // }
        }
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
              response.data.data.likes,
              response.data.data.subscribing,
            ]);
            console.log(response.data.data.subscribing);
            dispatch(postSetMany(response.data.data.feeds));
          }
          if (
            response.data.data.likes &&
            response.data.data.likes.length !== 0
          ) {
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
        setRefreshing(false);
      });
  }, [dispatch, route.params?.id]);

  let data;
  const subscribe = useCallback(
    user => {
      console.log('subscribe', user, user.subscribeStatus);
      if (!session) {
        SheetManager.show('loginSheet', {payload: {closable: true}}).then();
      } else if (user && user._id !== session._id) {
        dispatch(
          updateManyUser([
            {
              id: user.id,
              changes: {
                subscribeStatus: !user.subscribeStatus,
                subscriberCounter:
                  user.subscriberCounter + (!user.subscribeStatus ? +1 : -1),
              },
            },
            ...(sessionUser
              ? [
                  {
                    id: sessionUser.id,
                    changes: {
                      subscribingCounter:
                        sessionUser.subscribingCounter +
                        (!user.subscribeStatus ? +1 : -1),
                    },
                  },
                ]
              : []),
          ]),
        );
        apiInstance
          .post<response>('/api/subscribe/' + user._id, {
            subscribeStatus: !user.subscribeStatus,
            _csrf: csrfToken,
          })
          .then(response => {
            console.log('response', response.data, user.subscribeStatus);
            if (response.data.code !== 200) {
              dispatch(
                updateManyUser([
                  {
                    id: user.id,
                    changes: {
                      subscribeStatus: user.subscribeStatus,
                      subscriberCounter:
                        user.subscriberCounter +
                        (user.subscribeStatus ? +1 : -1),
                    },
                  },
                  ...(sessionUser
                    ? [
                        {
                          id: sessionUser.id,
                          changes: {
                            subscribingCounter:
                              sessionUser.subscribingCounter +
                              (user.subscribeStatus ? +1 : -1),
                          },
                        },
                      ]
                    : []),
                ]),
              );
            }
          })
          .catch(() => {
            console.log('catch');
            dispatch(
              updateManyUser([
                {
                  id: user.id,
                  changes: {
                    subscribeStatus: user.subscribeStatus,
                    subscriberCounter:
                      user.subscriberCounter + (user.subscribeStatus ? +1 : -1),
                  },
                },
                ...(sessionUser
                  ? [
                      {
                        id: sessionUser.id,
                        changes: {
                          subscribingCounter:
                            sessionUser.subscribingCounter +
                            (user.subscribeStatus ? +1 : -1),
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
  const renderItem = useMemo<
    React.FC<{item: IPost; index: number}>
  >((): React.FC<{item: IPost; index: number}> => {
    switch (selectedIndex) {
      case ETabIndex.PDF:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
      case ETabIndex.Follow:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <SubscribingRow item={item} index={index} subscribe={subscribe} />
          </Animated.View>
        );
      case ETabIndex.Likes:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
    }
  }, [selectedIndex]);
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
      {!user ? (
        <Spinner />
      ) : (
        <FlatList<IPost>
          data={data}
          onRefresh={onRefresh}
          refreshing={refreshing}
          // extraData={data}
          // showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{right: 0}}
          // style={{width: '100%'}}
          // exiting={SlideOutLeft}
          // style={{overflow: 'visible'}}
          // contentContainerStyle={{width: '100%'}}
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
