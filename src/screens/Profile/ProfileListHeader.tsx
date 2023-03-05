import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button, ButtonGroup, makeStyles, Text} from '@rneui/themed';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {getSession} from '@redux/reducer/authReducer';
import {selectById, updateManyUser} from '@redux/reducer/usersReducer';
import {SheetManager} from 'react-native-actions-sheet';

interface ProfileListHeaderProps {
  selectedIndex?: number;
  setSelectedIndex?: Dispatch<number>;
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
  const navigation =
    useNavigation<NavigationProp<ProfileStackScreenParams, 'Profile' | 'My'>>();
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
      {user?.description && (
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Information', user)}>
          <Text
            style={{
              width: '100%',
              paddingHorizontal: 15,
              marginBottom: 15,
              textAlign: 'center',
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {user?.description}
          </Text>
        </TouchableOpacity>
      )}
      {isMine && setSelectedIndex && (
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
  headerText: {
    fontSize: 17,
    color: theme.colors.white,
  },
}));
export default ProfileListHeader;
