import React, {Dispatch, useState} from 'react';
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
import {apiInstance} from '@utils/Networking';

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
  console.log(
    navigation.getState().routes.length,
    navigation.getState().key,
    route.key,
  );

  const closeMenu = () => setVisible(false);
  const insets = useSafeAreaInsets();
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
            {isMine && (
              <Menu.Item
                dense={true}
                onPress={() => {
                  apiInstance.post('/api/auth/signOut').then();
                  Keychain.resetGenericPassword().then();
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
              backgroundColor: '#99c729',
            }}
            titleStyle={styles.subscribeButtonTitle}
            title={'구독중'}
          />
        )}
      </View>
      {isMine && (
        <ButtonGroup
          buttons={['내 PDF', '좋아요', '팔로우']}
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
