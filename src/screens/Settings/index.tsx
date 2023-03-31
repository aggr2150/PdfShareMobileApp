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

interface SectionItem {
  labelText: string;
  onPress: () => void;
}
// const section = [{labelText: '회원탈퇴'}];
const Settings = ({navigation}) => {
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
                labelText: '회원탈퇴',
                onPress: () =>
                  Alert.alert('탈퇴하시겠습니까?', undefined, [
                    {
                      text: '취소',
                      onPress: () => console.log('Ask me later pressed'),
                    },
                    {
                      text: '탈퇴',
                      onPress: () => console.log('Ask me later pressed'),
                      style: 'destructive',
                    },
                  ]),
              },
              {
                labelText: '비밀번호 변경',
                onPress: () => navigation.navigate('ChangePassword'),
              },
              {labelText: '1:1 문의'},
              {
                labelText: '차단 관리',
                onPress: () => navigation.navigate('BlockList'),
              },
              {
                labelText: '정보',
                onPress: () => navigation.navigate('Information'),
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
