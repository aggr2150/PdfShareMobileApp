import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import ThrottleFlatList from '@components/ThrottleFlatlist';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <ThrottleFlatList<TPlace>
        data={[]}
        renderItem={({item}) => (
          <View>
            <Text>{item._id}</Text>
          </View>
        )}
      />
      <Button
        title={'navigate'}
        onPress={() => navigation.navigate('Viewer')}
      />
    </View>
  );
};
export default Home;
