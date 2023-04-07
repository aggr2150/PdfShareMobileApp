import {
  Alert,
  Linking,
  Pressable,
  SectionList,
  SectionListRenderItem,
  View,
} from 'react-native';
import {Button, Text} from '@rneui/themed';
import React from 'react';
import Separator from '@components/Seperator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {apiInstance} from '@utils/Networking';
import {
  blockUserRemoveAll,
  blockUserRemoveOne,
} from '@redux/reducer/blocksReducer';
import {useAppDispatch} from '@redux/store/RootStore';
import {getSession, signOut} from '@redux/reducer/authReducer';
import Toast from 'react-native-toast-message';
import Keychain from 'react-native-keychain';

interface SectionItem {
  labelText: string;
  onPress: () => void;
}
// const section = [{labelText: '회원탈퇴'}];
const Settings = ({navigation}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{flex: 1, paddingLeft: insets.left, paddingRight: insets.right}}>
      <SectionList
        sections={[
          {
            title: 'Title1',
            data: [
              {
                labelText: '비밀번호 변경',
                onPress: () => navigation.navigate('ChangePassword'),
              },
              {
                labelText: '차단 관리',
                onPress: () => navigation.navigate('BlockList'),
              },
              {
                labelText: '정보',
                onPress: () => navigation.navigate('Information'),
              },
              {
                labelText: '1:1 문의',
                onPress: () => navigation.navigate('CustomerService'),
              },
              {
                labelText: '회원탈퇴',
                onPress: () =>
                  Alert.alert('탈퇴하시겠습니까?', undefined, [
                    {
                      text: '취소',
                      onPress: () => console.log('Ask me later pressed'),
                    },
                    {
                      text: '탈퇴',
                      onPress: () =>
                        apiInstance
                          .post('/api/account/terminate')
                          .then(response => {
                            if (response.data.code === 200) {
                              dispatch(signOut());
                              Keychain.resetGenericPassword().then();
                              navigation.reset({routes: [{name: 'SignIn'}]});
                              dispatch(blockUserRemoveAll());
                            } else {
                              Toast.show({
                                type: 'error',
                                text1: 'Unknown Error Occurred!',
                                position: 'bottom',
                              });
                            }
                          })
                          .catch(e => {
                            console.log(e);
                            Toast.show({
                              type: 'error',
                              text1: 'Unknown Error Occurred!',
                              position: 'bottom',
                            });
                          }),
                      style: 'destructive',
                    },
                  ]),
              },
            ],
            // renderItem: ListItem,
          },
        ]}
        ItemSeparatorComponent={Separator}
        renderItem={ListItem}
      />
      {/*<Button*/}
      {/*  color={'primary'}*/}
      {/*  title={'navigate'}*/}
      {/*  onPress={() => navigation.goBack()}*/}
      {/*/>*/}
    </View>
  );
};
const ListItem: SectionListRenderItem<SectionItem> = item => {
  return (
    <Pressable
      style={{paddingHorizontal: 20, paddingVertical: 12}}
      onPress={item.item.onPress}>
      <Text style={{fontSize: 13}}>{item.item.labelText}</Text>
    </Pressable>
  );
};
export default Settings;
