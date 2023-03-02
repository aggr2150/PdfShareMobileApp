import {
  Alert,
  FlatList,
  Pressable,
  SectionList,
  SectionListRenderItem,
  View,
} from 'react-native';
import {Button, Text} from '@rneui/themed';
import React, {useCallback} from 'react';
import Separator from '@components/Seperator';
import SubscribingRow from '@components/SubscribingRow';
import BlockUserRow from '@components/BlockUserRow';
import {apiInstance} from '@utils/Networking';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {
  blockUserAdded,
  blockUserRemoveOne,
  blockUserSetAll,
  selectAll,
} from '@redux/reducer/blocksReducer';

interface SectionItem {
  labelText: string;
  onPress: () => void;
}
// const section = [{labelText: '회원탈퇴'}];
const BlockList = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => selectAll(state.blocks));
  useFocusEffect(() => load());
  const load = useCallback(() => {
    apiInstance.post('/api/account/block/list').then(response => {
      if (response.data.code === 200) {
        if (response.data.data) {
          dispatch(blockUserSetAll(response.data.data));
        }
      }
    });
  }, [dispatch]);
  const callback = useCallback(
    (targetUser: IBlockUser) => {
      Alert.alert('차단해제하시겠습니까?', undefined, [
        {
          text: '취소',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: '해제',
          onPress: () => {
            apiInstance
              .post('/api/account/block/delete', {
                userId: targetUser?._id,
              })
              .then(response => {
                if (response.data.code === 200) {
                  dispatch(blockUserRemoveOne(targetUser._id));
                }
              });
          },
          style: 'destructive',
        },
      ]);
    },
    [dispatch],
  );
  return (
    <View style={{flex: 1}}>
      <FlatList<IBlockUser>
        data={data}
        ItemSeparatorComponent={Separator}
        renderItem={({item}) => (
          <BlockUserRow item={item} callback={callback} />
        )}
      />
    </View>
  );
};
export default BlockList;
