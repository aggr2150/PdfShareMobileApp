import {View} from 'react-native';
import Avatar from '@components/Avatar';
import {Text} from '@rneui/themed';
import React from 'react';

const Comment = () => {
  return (
    <View style={{marginVertical: 6}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 20,
            height: 20,
            maxWidth: 20,
            marginRight: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Avatar style={{width: 20, height: 20}} />
        </View>
        <Text style={{fontSize: 13}}>11111 님</Text>
      </View>
      <View style={{marginLeft: 24}}>
        <Text style={{fontSize: 13}}>궁시렁궁시렁</Text>
      </View>
    </View>
  );
};
export default Comment;
