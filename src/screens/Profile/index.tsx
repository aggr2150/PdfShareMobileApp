import React, {useMemo, useState} from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import ToggleBtn from '@components/ToggleBtn';
import Avatar from '@components/Avatar';
import ProfileListHeader from '@screens/Profile/ProfileListHeader';
import BookCard from '@components/BookCard';
import {Provider} from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import {useAppSelector} from '@redux/store/RootStore';

const Profile = (p: IUser) => {
  // p.
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const user = useAppSelector(state => state.auth.session);
  console.log(user);
  let data;
  const renderItem = useMemo<React.FC<{item: TPlace; index: number}>>(() => {
    switch (selectedIndex) {
      case 0:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
      case 1:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
      case 2:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
    }
  }, [selectedIndex]);
  switch (selectedIndex) {
    case 0:
      data = [1, 2, 3, 4];
      break;
    case 1:
      data = Array(1);
      break;
    case 2:
      data = Array(3);
      break;
  }
  return (
    <Provider>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: '#000',
        }}>
        <Animated.FlatList<TPlace>
          renderScrollComponent={props => (
            <Animated.ScrollView
              exiting={SlideOutLeft}
              entering={SlideInRight}
              {...props}></Animated.ScrollView>
          )}
          data={[1]}
          extraData={data}
          // exiting={SlideOutLeft}
          contentContainerStyle={{width: '100%'}}
          ListHeaderComponent={() => (
            <ProfileListHeader
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          )}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${selectedIndex}${index}`}
        />
        {/*<Button*/}
        {/*  title={'navigate'}*/}
        {/*  onPress={() => navigation.navigate('Viewer')}*/}
        {/*/>*/}
      </View>
    </Provider>
  );
};

export default Profile;
