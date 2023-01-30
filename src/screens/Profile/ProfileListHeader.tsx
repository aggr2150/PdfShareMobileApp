import React, {Dispatch, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {ButtonGroup, makeStyles, Text} from '@rneui/themed';
import {useNavigation, useRoute} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import DotIcon from '@assets/icon/dot.svg';
import {Button, Divider, Menu} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusIcon from '@assets/icon/plus1.svg';
import BackButton from '@components/BackButton';
import Keychain from 'react-native-keychain';

interface ProfileListHeaderProps {
  selectedIndex: number;
  setSelectedIndex: Dispatch<number>;
  user?: IUser;
}
const ProfileListHeader: React.FC<ProfileListHeaderProps> = ({
  selectedIndex,
  setSelectedIndex,
  user,
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
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: insets.top || 10,
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
                  description: '123',
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
                Keychain.resetGenericPassword().then();
                closeMenu();
              }}
              title={<Text style={styles.menuText}>로그아웃</Text>}
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
            <Text style={styles.counterText}>내 PDF {user?.postCounter}개</Text>
          </View>
        </View>
      </View>
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
    </View>
  );
};

const useStyles = makeStyles(theme => ({
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
