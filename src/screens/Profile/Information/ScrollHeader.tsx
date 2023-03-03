import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, TouchableOpacity, View} from 'react-native';
import {Button, ButtonGroup, makeStyles, Text} from '@rneui/themed';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import DotIcon from '@assets/icon/dot.svg';
import {Divider, Menu} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusIcon from '@assets/icon/plus1.svg';
import BackButton from '@components/BackButton';
import Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {getSession, signOut} from '@redux/reducer/authReducer';
import {selectById, updateManyUser} from '@redux/reducer/usersReducer';
import {SheetManager} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import {deletePost} from '@utils/models/post';
import {postRemoveOne} from '@redux/reducer/postsReducer';
import {
  blockUserAdded,
  blockUserRemoveOne,
  selectAll,
  selectById as selectBlockUserById,
} from '@redux/reducer/blocksReducer';

interface ProfileListHeaderProps {
  user?: IUser;
  isMine: boolean;
}
const ProfileListHeader: React.FC<ProfileListHeaderProps> = ({
  user,
  isMine,
}) => {
  const styles = useStyles();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'ProfileTab'>>();
  const route =
    useRoute<RouteProp<ProfileStackScreenParams, 'Profile' | 'My'>>();
  const [visible, setVisible] = React.useState(false);

  const blockList = useAppSelector(state => selectAll(state.blocks));
  const block = useAppSelector(state =>
    selectBlockUserById(state.blocks, user?._id || ''),
  );
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const dispatch = useAppDispatch();
  const [csrfToken, setCsrfToken] = useState<string>();
  const session = useAppSelector(state => getSession(state));
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
  return (
    // <Provider>
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          // marginBottom: 24,
        }}>
        <View
          style={{
            marginTop: 6,
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Avatar avatar={user?.avatar} />
        </View>
        <View style={{marginBottom: 4}}>
          <Text style={styles.nicknameText}>{user?.nickname}</Text>
        </View>
        {user && (
          <View style={{flexDirection: 'row', marginBottom: 15}}>
            <View style={{marginHorizontal: 20}}>
              <Text style={styles.counterText}>
                구독자 {user?.subscriberCounter}명
              </Text>
            </View>
            <View style={{marginHorizontal: 20}}>
              <Text style={styles.counterText}>PDF {user?.postCounter}개</Text>
            </View>
          </View>
        )}
        {!isMine && user && (
          <Button
            buttonStyle={{
              borderRadius: 24,
              paddingVertical: 15,
              paddingHorizontal: 60,
              marginVertical: 15,
              backgroundColor: user.subscribeStatus ? '#3a3a3a' : '#99c729',
            }}
            onPress={subscribe}
            titleStyle={styles.subscribeButtonTitle}
            title={user?.subscribeStatus ? '구독중' : '구독하기'}
          />
        )}
      </View>
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
