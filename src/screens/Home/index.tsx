import React from 'react';
import {View} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import ToggleBtn from '@components/ToggleBtn';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{position: 'absolute', top: 24, zIndex: 1}}>
        <ToggleBtn
          textStyle={{fontSize: 10}}
          switchStyle={{borderRadius: 23, backgroundColor: '#161616'}}
          containerStyle={{
            height: 46,
            minWidth: 200,
            borderRadius: 23,
            backgroundColor: '#000',
          }}
          splitCenter={true}
        />
      </View>
      <ThrottleFlatList<TPlace>
        data={[1, 2, 3, 4]}
        contentContainerStyle={{width: '100%'}}
        renderItem={({item, index}) => (
          <View
            style={{
              aspectRatio: 16 / 9,
              backgroundColor: index % 2 === 0 ? '#1a3692' : '#e73f90',
              width: '100%',
            }}>
            <Text>{item._id}</Text>
          </View>
        )}
      />
      {/*<Button*/}
      {/*  title={'navigate'}*/}
      {/*  onPress={() => navigation.navigate('Viewer')}*/}
      {/*/>*/}
    </View>
  );
};
export default Home;
