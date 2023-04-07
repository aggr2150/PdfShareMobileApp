import {Linking, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListEmptyComponent from '@components/ListEmptyComponent';
import {Button} from '@rneui/themed';

const CustomerService = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{flex: 1, paddingLeft: insets.left, paddingRight: insets.right}}>
      <ListEmptyComponent
        ExtraComponent={
          <Button
            title={'메일 열기'}
            buttonStyle={{
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
            titleStyle={{
              lineHeight: 23,
            }}
            containerStyle={{
              marginTop: 24,
              borderRadius: 500,
            }}
            onPress={() => Linking.openURL('mailto: support@everypdf.cc')}
          />
        }>
        {`1:1 문의는 support@everypdf.cc
이메일로 보내주세요.`}
      </ListEmptyComponent>
    </View>
  );
};
export default CustomerService;
