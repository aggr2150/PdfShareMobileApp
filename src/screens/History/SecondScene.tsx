import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import PlusButton from '@components/buttons/PlusButton2';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {apiInstance} from '@utils/Networking';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  collectionSetMany,
  removeCollection,
  selectAll,
} from '@redux/reducer/collectionsReducer';
import Spinner from '@components/Spinner';
import ListEmptyComponent from '@components/ListEmptyComponent';
import VerticalDotsButton from '@components/buttons/VerticalDotsButton';
import {Menu} from 'react-native-paper';

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
  const [visible, setVisible] = React.useState('');
  const closeMenu = () => setVisible('');
  // const openMenu = () => setVisible(true);
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
                minHeight: '100%',
                // minHeight: dimensions.height - tabBarHeight + 46 + 24,
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
              paddingLeft: 42,
              paddingRight: 24,
              paddingVertical: 42,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 14, flex: 1}}>{item.title}</Text>
            <Menu
              visible={visible === item._id}
              onDismiss={closeMenu}
              contentStyle={{backgroundColor: 'black'}}
              anchorPosition={'bottom'}
              anchor={
                <VerticalDotsButton
                  onPress={() => setVisible(item._id)}
                  size={24}
                  hitSlop={24}
                  color={'white'}
                />
              }>
              <Menu.Item
                dense={true}
                onPress={() => {
                  SheetManager.show<ICollection, boolean>(
                    'renameCollectionSheet',
                    {payload: item},
                  ).then(result => {
                    if (result) onRefresh();
                  });
                  closeMenu();
                }}
                title={<Text style={styles.menuText}>수정</Text>}
              />
              <Menu.Item
                dense={true}
                onPress={() => {
                  apiInstance
                    .post<response>('/api/collection/delete', {
                      collectionId: item._id,
                    })
                    .then(response => {
                      if (response.data.code === 200) {
                        dispatch(removeCollection(item._id));
                        closeMenu();
                      }
                    });
                }}
                title={<Text style={styles.menuText}>삭제</Text>}
              />
            </Menu>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            progressViewOffset={(insets.top || 24) + 46 + 12}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
              SheetManager.show('collectionSheet').then(r => {
                console.log(r);
                if (r) onRefresh();
              })
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
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
}));

export default SecondScene;
