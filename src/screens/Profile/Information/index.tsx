import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import Spinner from '@components/Spinner';
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
import {setAllLike} from '@redux/reducer/likesReducer';
import {getSession} from '@redux/reducer/authReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SheetManager} from 'react-native-actions-sheet';
import ListEmptyComponent from '@components/ListEmptyComponent';
import {Button, makeStyles, Text} from '@rneui/themed';
import {selectById as selectBlockUserById} from '@redux/reducer/blocksReducer';
import ScrollHeader from '@screens/Profile/Information/ScrollHeader';
import reactStringReplace from 'react-string-replace';
import TagText from '@components/TagText';

type ProfileProps = StackScreenProps<ProfileStackScreenParams, 'Information'>;
const Information: React.FC<ProfileProps> = ({navigation, route}) => {
  // const navigation = useNavigation();
  // const route = useRoute();
  // route.params.id
  const insets = useSafeAreaInsets();
  const session = useAppSelector(state => getSession(state));
  const user = useAppSelector(state =>
    selectUserById(state.users, route.params?.id || session?.id || ''),
  );
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const styles = useStyles();
  // const LikesData = useAppSelector(state => {
  //   // state.likes
  //   return tabData[selectedIndex].map(
  //     item => state.posts.entities[item._id] || item,
  //   );
  // });
  const sessionUser = useAppSelector(state =>
    selectUserById(state.users, session?.id || ''),
  );
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
  return (
    <View
      style={{
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
      ) : (
        <ScrollView style={{paddingHorizontal: 24}}>
          <ScrollHeader user={user} isMine={true} />
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={styles.contentText}>채널명 : {user?.nickname}</Text>
            <Text style={styles.contentText}>아이디 : {user?.id}</Text>
            <Text style={styles.contentText}>
              내 소개 :{' '}
              {reactStringReplace(
                reactStringReplace(
                  user?.description,
                  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
                  link => (
                    <TagText
                      style={{
                        color: 'blue',
                        fontSize: 13,
                      }}
                      onPress={() => {}}>
                      {link}
                    </TagText>
                  ),
                ),
                /#([\p{L}|\p{N}]{1,20})(?=\s|#|$)/giu,

                tag => (
                  <TagText
                    style={{
                      color: 'yellow',
                      fontSize: 13,
                    }}
                    onPress={() => {}}>
                    #{tag}
                  </TagText>
                ),
              )}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  contentText: {
    fontFamily: theme.fontFamily,
    fontSize: 13,
  },
}));

export default Information;
