import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import {SheetManager} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import ToggleBtn from '@components/ToggleBtn';
import PlusButton from '@components/buttons/PlusButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {apiInstance} from '@utils/Networking';
import {postAddedMany} from '@redux/reducer/postsReducer';
import {useAppDispatch} from '@redux/store/RootStore';
import {useNavigation} from '@react-navigation/native';

const SecondScene: React.FC = () => {
  const styles = useStyles();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [data, setData] = useState<ICollection[]>([]);
  const [fetching, setFetching] = useState(true);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post<response<ICollection[]>>('/api/collection/list')
      .then(response => {
        if (response.data.data.length !== 0) {
          setData(response.data.data);
          // dispatch(postAddedMany(response.data.data));
          setFetching(false);
        }
      });
  }, [dispatch]);
  return (
    <View>
      <ThrottleFlatList<ICollection>
        data={data}
        // style={{width: '100%'}}
        contentContainerStyle={{
          paddingTop: insets.top + 46 + 24,
        }}
        contentOffset={{y: insets.top + 46 + 24, x: 0}}
        ItemSeparatorComponent={Separator}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              navigation.navigate('Collection', {_id: item._id});
              // SheetManager.show('collectionSheet').then(r => console.log(r));
            }}
            style={{
              backgroundColor: '#282828',
              paddingHorizontal: 42,
              paddingVertical: 54,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14}}>{item.title}</Text>
          </Pressable>
        )}
      />

      <View style={styles.container}>
        <View style={{position: 'absolute', bottom: 20, zIndex: 1}}>
          <PlusButton
            onPress={() =>
              SheetManager.show('collectionSheet').then(r => console.log(r))
            }
            color={'white'}
          />
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: 'red',
  },
}));

export default SecondScene;
