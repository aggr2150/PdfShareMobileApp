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
  const callback = useCallback((targetUser: IBlockUser) => {
    apiInstance
      .post('/api/account/block/delete', {
        userId: targetUser?._id,
      })
      .then(response => {
        dispatch(blockUserRemoveOne(targetUser._id));
        console.log(response.data);
      });
  }, []);
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
