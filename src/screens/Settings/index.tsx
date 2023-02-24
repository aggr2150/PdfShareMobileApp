import {
  Alert,
  Pressable,
  SectionList,
  SectionListRenderItem,
  View,
} from 'react-native';
import {Button, Text} from '@rneui/themed';
import React from 'react';
import Separator from '@components/Seperator';

interface SectionItem {
  labelText: string;
  onPress: () => void;
}
// const section = [{labelText: '회원탈퇴'}];
const Settings = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
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
                onPress: () => navigation.navigate('PasswordReset'),
              },
              {labelText: '1:1 문의'},
              {labelText: '차단 관리'},
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
