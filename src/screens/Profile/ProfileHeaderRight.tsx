import React, {useCallback, useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useLinkTo,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DotIcon from '@assets/icon/horizontalDots.svg';
import BellIcon from '@assets/icon/bell.svg';
import {Menu} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';
import {apiInstance, getCsrfToken, reportCallback} from '@utils/Networking';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {getSession, signOut} from '@redux/reducer/authReducer';
import {
  selectById as selectUserById,
  selectById,
  updateManyUser,
} from '@redux/reducer/usersReducer';
import {SheetManager} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import {
  blockUserAdded,
  blockUserRemoveOne,
  selectById as selectBlockUserById,
} from '@redux/reducer/blocksReducer';
import Clipboard from '@react-native-clipboard/clipboard';

const ProfileHeaderRight = () => {
  const styles = useStyles();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'ProfileTab'>>();
  const route =
    useRoute<RouteProp<ProfileStackScreenParams, 'Profile' | 'My'>>();
  const [visible, setVisible] = React.useState(false);
  const session = useAppSelector(state => getSession(state));
  const user = useAppSelector(state =>
    selectUserById(state.users, route.params?.id || session?.id || ''),
  );
  const block = useAppSelector(state =>
    selectBlockUserById(state.blocks, user?._id || ''),
  );
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const dispatch = useAppDispatch();
  const [csrfToken, setCsrfToken] = useState<string>();
  const sessionUser = useAppSelector(state =>
    selectById(state.users, session?.id || ''),
  );
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const insets = useSafeAreaInsets();
  const subscribe = useCallback(() => {
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
          if (response.data.code !== 200) {
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
          }
        })
        .catch(() =>
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
          ),
        );
    } else {
      SheetManager.show('loginSheet', {payload: {closable: true}}).then();
    }
  }, [session, csrfToken, dispatch, sessionUser, user]);
  const linkTo = useLinkTo();
  return (
    user && (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          // onPress={() =>
          //   linkTo('/post/644b7ff9e4ef40ea6cf9b44a/644c0703eb2a545bf55d309d')
          // }
          onPress={() => navigation.navigate('Notifications')}
          style={{
            // marginRight: 11,
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <BellIcon fill={'white'} width={24} height={24} />
        </TouchableOpacity>
        <Menu
          anchorPosition={'bottom'}
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{backgroundColor: 'black'}}
          anchor={
            <TouchableOpacity
              onPress={openMenu}
              style={{
                marginRight: 11,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <DotIcon fill={'white'} width={24} height={24} />
            </TouchableOpacity>
          }>
          <Menu.Item
            dense={true}
            onPress={() => {
              Clipboard.setString(`https://everypdf.cc/u/${user.id}`);
              Toast.show({
                text1: '클립보드에 복사되었습니다.',
                position: 'bottom',
              });
              closeMenu();
            }}
            title={<Text style={styles.menuText}>링크 복사</Text>}
          />
          {session?._id === user?._id ? (
            <>
              <Menu.Item
                dense={true}
                onPress={() => {
                  navigation.navigate('EditProfile', {
                    // id: '123',
                    // nickname: '123',
                    avatar: user.avatar,
                    link: user.link,
                    description: user.description,
                    id: user.id,
                    nickname: user.nickname,
                  });
                  closeMenu();
                }}
                title={<Text style={styles.menuText}>프로필 수정</Text>}
              />
              <Menu.Item
                dense={true}
                onPress={() => {
                  navigation.navigate('Revenue');
                  closeMenu();
                }}
                title={<Text style={styles.menuText}>광고 수익</Text>}
              />
              <Separator />
              {/*<Divider />*/}
              <Menu.Item
                dense={true}
                onPress={() => {
                  navigation.navigate('Settings');
                  closeMenu();
                }}
                title={<Text style={styles.menuText}>설정</Text>}
              />
              <Menu.Item
                dense={true}
                onPress={() => {
                  apiInstance.post('/api/auth/signOut').then();
                  Keychain.resetGenericPassword().then();
                  dispatch(signOut());
                  closeMenu();
                  navigation.dispatch(
                    CommonActions.reset({
                      // stale: true,
                      // stale: false,
                      // index: 0,
                      routes: [{name: 'SignIn'}],
                    }),
                  );
                }}
                title={<Text style={styles.menuText}>로그아웃</Text>}
              />
            </>
          ) : (
            <>
              <Menu.Item
                dense={true}
                onPress={() => {
                  closeMenu();
                  if (!session) {
                    SheetManager.show('loginSheet', {
                      payload: {closable: true},
                    }).then();
                  } else {
                    Alert.alert('신고하시겠습니까?', undefined, [
                      {
                        text: '취소',
                      },
                      {
                        text: '신고하기',
                        onPress: () => {
                          reportCallback({
                            csrfToken,
                            targetType: 'user',
                            targetId: user._id,
                          }).then();
                          Toast.show({
                            type: 'success',
                            text1: '신고가 접수되었습니다.',
                            position: 'bottom',
                          });
                        },
                        style: 'destructive',
                      },
                    ]);
                  }
                }}
                title={<Text style={styles.menuText}>신고하기</Text>}
              />
              <Menu.Item
                dense={true}
                onPress={() => {
                  if (!session) {
                    SheetManager.show('loginSheet', {
                      payload: {closable: true},
                    }).then();
                  } else {
                    Alert.alert(
                      block ? '차단해제하시겠습니까?' : '차단하시겠습니까?',
                      undefined,
                      [
                        {
                          text: '취소',
                          onPress: () => console.log('Ask me later pressed111'),
                        },
                        {
                          text: block ? '해제' : '차단',
                          onPress: () => {
                            closeMenu();
                            if (block) {
                              apiInstance
                                .post('/api/account/block/delete', {
                                  userId: user?._id,
                                })
                                .then(response => {
                                  if (response.data.code === 200) {
                                    dispatch(blockUserRemoveOne(user._id));
                                  }
                                });
                            } else {
                              apiInstance
                                .post('/api/account/block/append', {
                                  userId: user?._id,
                                })
                                .then(response => {
                                  if (response.data.code === 200) {
                                    dispatch(
                                      blockUserAdded({
                                        _id: user._id,
                                        id: user.id,
                                        nickname: user.nickname,
                                      }),
                                    );
                                  }
                                });
                            }
                          },
                          style: 'destructive',
                        },
                      ],
                    );
                  }
                }}
                title={
                  <Text style={styles.menuText}>
                    {block ? '차단해제' : '차단하기'}
                  </Text>
                }
              />
            </>
          )}
        </Menu>
      </View>
    )
  );
};

const useStyles = makeStyles(theme => ({
  subscribeButtonTitle: {
    fontFamily: 'Apple SD Gothic Neo',
    fontSize: 13,
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  counterText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    // alignSelf: 'stretch',
    textAlign: 'left',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 14,
    // color: theme.colors.white,
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.white,
  },
}));
export default ProfileHeaderRight;
