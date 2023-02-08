import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {Button, ButtonGroup, makeStyles, Text} from '@rneui/themed';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import DotIcon from '@assets/icon/dot.svg';
import {Divider, Menu, Provider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusIcon from '@assets/icon/plus1.svg';
import BackButton from '@components/BackButton';
import Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {getSession, signOut} from '@redux/reducer/authReducer';
import {
  selectById,
  updateManyUser,
  updateUser,
} from '@redux/reducer/usersReducer';
import {SheetManager} from 'react-native-actions-sheet';

interface ProfileListHeaderProps {
  selectedIndex: number;
  setSelectedIndex: Dispatch<number>;
  user?: IUser;
  isMine: boolean;
}
const ProfileListHeader: React.FC<ProfileListHeaderProps> = ({
  selectedIndex,
  setSelectedIndex,
  user,
  isMine,
}) => {
  const styles = useStyles();
  const navigation = useNavigation();
  const route = useRoute();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const dispatch = useAppDispatch();
  const [csrfToken, setCsrfToken] = useState<string>();
  const authSession = useAppSelector(state => getSession(state));
  const sessionUser = useAppSelector(state =>
    selectById(state.users, authSession?.id || ''),
  );
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const insets = useSafeAreaInsets();
  const subscribe = useCallback(() => {
    if (user && authSession) {
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
  }, [authSession, csrfToken, dispatch, sessionUser, user]);
  return (
    // <Provider>
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}>
        <View
          style={{
            height: 32,
            // alignSelf: '',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // marginHorizontal: 15,
            // paddingTop: 10,
            paddingRight: insets.right || 15,
            paddingLeft: insets.left || 15,
          }}>
          {route.params?.id !== undefined ? (
            <BackButton onPress={() => navigation.goBack()} color={'white'} />
          ) : (
            <Pressable
              onPress={() => {
                navigation.navigate('Upload');
              }}>
              <PlusIcon fill={'white'} width={32} height={32} />
            </Pressable>
          )}
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={{backgroundColor: 'black'}}
            anchor={
              <TouchableOpacity
                onPress={openMenu}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <DotIcon fill={'white'} width={24} height={24} />
              </TouchableOpacity>
            }>
            {isMine ? (
              <>
                <Menu.Item
                  dense={true}
                  onPress={() => {
                    navigation.navigate('EditProfile', {
                      // id: '123',
                      // nickname: '123',
                      avatar: user?.avatar,
                      link: user?.link,
                      description: user?.description,
                      id: user?.id,
                      nickname: user?.nickname,
                    });
                    closeMenu();
                  }}
                  title={<Text style={styles.menuText}>프로필 수정</Text>}
                />
                <Menu.Item
                  dense={true}
                  onPress={() => {}}
                  title={<Text style={styles.menuText}>광고 수익</Text>}
                />
                <Divider />
                <Menu.Item
                  dense={true}
                  onPress={() => {
                    navigation.navigate('Settings', {
                      id: '123',
                      nickname: '123',
                      description: '123',
                    });
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
                  onPress={() => {}}
                  title={<Text style={styles.menuText}>신고하기</Text>}
                />
              </>
            )}

            <Menu.Item
              dense={true}
              onPress={() => {
                Toast.show({
                  type: 'error',
                  text1: '만료된 인증번호 입니다.',
                  position: 'bottom',
                });
              }}
              title={<Text style={styles.menuText}>테스트</Text>}
            />
          </Menu>
        </View>
        <View
          style={{
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Avatar avatar={user?.avatar} />
        </View>
        <View style={{marginBottom: 4}}>
          <Text style={styles.nicknameText}>{user?.nickname}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginHorizontal: 20}}>
            <Text style={styles.counterText}>
              구독자 {user?.subscriberCounter}명
            </Text>
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={styles.counterText}>PDF {user?.postCounter}개</Text>
          </View>
        </View>
        {!isMine && (
          <Button
            buttonStyle={{
              borderRadius: 24,
              paddingVertical: 15,
              paddingHorizontal: 60,
              marginVertical: 15,
              backgroundColor: user?.subscribeStatus ? '#99c729' : '#3a3a3a',
            }}
            onPress={subscribe}
            titleStyle={styles.subscribeButtonTitle}
            title={user?.subscribeStatus ? '구독중' : '구독하기'}
          />
        )}
      </View>
      {isMine && (
        <ButtonGroup
          buttons={['내 PDF', '좋아요', '구독중']}
          selectedIndex={selectedIndex}
          onPress={value => {
            setSelectedIndex(value);
          }}
          buttonContainerStyle={{margin: 0}}
          innerBorderStyle={{width: 0}}
          containerStyle={{
            borderWidth: 0,
            marginHorizontal: 0,
            marginVertical: 0,
            borderRadius: 0,
          }}
          buttonStyle={{backgroundColor: '#000'}}
        />
      )}
    </View>
    // </Provider>
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
export default ProfileListHeader;
