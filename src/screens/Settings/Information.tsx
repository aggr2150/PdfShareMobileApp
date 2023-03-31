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
const Information = () => {
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
                labelText: '서비스 이용 약관',
                onPress: () => Linking.openURL('https://everypdf.cc/legal/use'),
              },
              {
                labelText: '커뮤니티 가이드라인',
                onPress: () =>
                  Linking.openURL('https://everypdf.cc/legal/community'),
              },
              {
                labelText: '개인정보 처리방침',
                onPress: () =>
                  Linking.openURL('https://everypdf.cc/legal/privacy'),
              },
            ],
          },
        ]}
        ItemSeparatorComponent={Separator}
        renderItem={ListItem}
      />
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
export default Information;
