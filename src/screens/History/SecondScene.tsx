import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {SheetManager} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import PlusButton from '@components/buttons/PlusButton2';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {apiInstance} from '@utils/Networking';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {collectionSetMany, selectAll} from '@redux/reducer/collectionsReducer';
import Spinner from '@components/Spinner';
import ListEmptyComponent from '@components/ListEmptyComponent';

const SecondScene: React.FC = () => {
  const styles = useStyles();

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [fetching, setFetching] = useState(true);

  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'HistoryTab'>>();
  const dimensions = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post<response<ICollection[]>>('/api/collection/list')
      .then(response => {
        if (response.data.data.length !== 0) {
          // setData(response.data.data);
          dispatch(collectionSetMany(response.data.data));
          setFetching(false);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    apiInstance
      .post<response<ICollection[]>>('/api/collection/list')
      .then(response => {
        if (response.data.data.length !== 0) {
          dispatch(collectionSetMany(response.data.data));
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, [dispatch]);
  const collections = useAppSelector(state => selectAll(state.collections));
  console.log('ref', refreshing);
  return (
    <View style={{flex: 1}}>
      <FlatList<ICollection>
        data={collections}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={
          collections.length === 0
            ? {flexGrow: 1}
            : {
                paddingTop: (insets.top || 24) + 46 + 12,
                minHeight: dimensions.height - tabBarHeight + 46 + 24,
              }
        }
        // contentContainerStyle={{flexGrow: 1}}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={() =>
          fetching ? (
            <Spinner />
          ) : (
            <ListEmptyComponent>아직 콜렉션이 없습니다.</ListEmptyComponent>
          )
        }
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Collection', {_id: item._id})}
            style={{
              backgroundColor: '#3a3a3a',
              paddingHorizontal: 42,
              paddingVertical: 54,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14}}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <View>
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            zIndex: 1,
          }}>
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

const useStyles = makeStyles(() => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: 'red',
  },
}));

export default SecondScene;
