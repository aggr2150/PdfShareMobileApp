import React from 'react';
import {Pressable, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import {useAppSelector} from '@redux/store/RootStore';
import {selectById} from '@redux/reducer/usersReducer';

interface BlockUserRowProps {
  item: IBlockUser;
  callback: (targetUser: IBlockUser) => void;
}

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
//   // keywords: ['fashion', 'clothing'],
// });

// interstitial.load();
const BlockUserRow: React.FC<BlockUserRowProps> = ({item, callback}) => {
  const styles = useStyles();
  const navigation = useNavigation();
  const user = useAppSelector(state => selectById(state.users, item.id));
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Profile', {id: user?.id});
      }}
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
      }}>
      <Text style={{flex: 1, marginLeft: 8}}>{item.id}</Text>
      <Button
        titleStyle={{fontSize: 13}}
        onPress={() => callback(item)}
        buttonStyle={{
          backgroundColor: user?.subscribeStatus ? '#3a3a3a' : '#99c729',
          borderRadius: 50,
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 20,
        }}>
        {'차단해제'}
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
export default BlockUserRow;
