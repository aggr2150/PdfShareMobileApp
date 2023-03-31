import React from 'react';
import {Pressable, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import {useAppSelector} from '@redux/store/RootStore';
import {selectById} from '@redux/reducer/usersReducer';

interface SubscribingRowProps {
  item: IUser;
  index: number;
  subscribe: (targetUser: IUser) => void;
}

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
//   // keywords: ['fashion', 'clothing'],
// });

// interstitial.load();
const SubscribingRow: React.FC<SubscribingRowProps> = ({
  item,
  index,
  subscribe,
}) => {
  const styles = useStyles();
  const navigation = useNavigation();
  const user = useAppSelector(state => selectById(state.users, item.id));
  console.log(item);
  return (
    <Pressable
      onPress={() => {
        // if (isLoaded) {
        //   show();
        // } else {
        //   load();
        // }
        navigation.navigate('Profile', {id: user?.id});
      }}
      style={{
        // aspectRatio: 16 / 9,
        // backgroundColor: getBackgroundColor(index),
        width: '100%',
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
      }}>
      <View>
        <Avatar avatar={item.avatar} style={{height: 36, width: 36}} />
      </View>
      <Text style={{flex: 1, marginLeft: 8}}>{item.nickname}</Text>
      <Button
        titleStyle={{fontSize: 13}}
        onPress={() => subscribe(user)}
        buttonStyle={{
          backgroundColor: user?.subscribeStatus ? '#3a3a3a' : '#60B630',
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 20,
        }}
        containerStyle={{
          borderRadius: 50,
        }}>
        {user?.subscribeStatus ? '취소' : '구독'}
      </Button>
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
}));
export default SubscribingRow;
