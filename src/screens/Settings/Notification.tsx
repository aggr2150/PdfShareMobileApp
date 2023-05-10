import {
  Alert,
  Pressable,
  SectionList,
  SectionListRenderItem,
  View,
} from 'react-native';
import {Switch, Text} from '@rneui/themed';
import React, {useCallback, useEffect, useState} from 'react';
import Separator from '@components/Seperator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {blockUserRemoveAll} from '@redux/reducer/blocksReducer';
import {useAppDispatch} from '@redux/store/RootStore';
import {signOut} from '@redux/reducer/authReducer';
import Toast from 'react-native-toast-message';
import Keychain from 'react-native-keychain';
import {StackScreenProps} from '@react-navigation/stack';

interface SectionItem {
  labelText: string;
  descriptionText: string;
  status: boolean;
  value: EActionType;
  onValueChange: (value: boolean, actionType: EActionType) => void;
}
type NotificationProps = StackScreenProps<SettingStackParams, 'Notification'>;
enum EActionType {
  'none' = 'none',
  'upload' = 'upload',
  'comment' = 'comment',
  'reply' = 'reply',
  'mention' = 'mention',
  'likePost' = 'likePost',
  'likeComment' = 'likeComment',
  'subscribe' = 'subscribe',
}
const Notification: React.FC<NotificationProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [unsubscribedActionType, setUnsubscribedActionType] = useState<
    EActionType[]
  >([]);
  useEffect(() => {
    apiInstance
      .post<response<EActionType[]>>('/api/account/notifications/settings')
      .then(response => {
        setUnsubscribedActionType(response.data.data);
      });
    getCsrfToken.then(token => setCsrfToken(token));
  });
  const onValueChange = useCallback(
    (status: boolean, value: EActionType) => {
      status
        ? setUnsubscribedActionType(prevState =>
            prevState.filter(element => element !== value),
          )
        : setUnsubscribedActionType(prevState => {
            prevState.unshift(value);
            return prevState;
          });
      apiInstance
        .post('/api/account/notifications/subscribeActionType', {
          status,
          _csrf: csrfToken,
          actionType: value,
        })
        .then(response => console.log(response.data));
    },
    [csrfToken],
  );
  return (
    <View
      style={{flex: 1, paddingLeft: insets.left, paddingRight: insets.right}}>
      <SectionList
        sections={[
          {
            title: 'Title1',
            unsubscribedActionType: unsubscribedActionType,
            data: [
              {
                labelText: '댓글',
                status: unsubscribedActionType.includes(EActionType.comment),
                descriptionText: '내 Pdf의 댓글에 대한 알림',
                value: EActionType.comment,
                onValueChange,
              },
              {
                labelText: '답글',
                status: unsubscribedActionType.includes(EActionType.reply),
                descriptionText: '내 댓글의 답글에 대한 알림',
                value: EActionType.reply,
                onValueChange,
              },
              {
                labelText: '댓글 좋아요',
                status: unsubscribedActionType.includes(
                  EActionType.likeComment,
                ),
                descriptionText: '내 댓글에 대한 좋아요 알림',
                value: EActionType.likeComment,
                onValueChange,
              },
              {
                labelText: '게시글 좋아요',
                status: unsubscribedActionType.includes(EActionType.likePost),
                descriptionText: '내 Pdf에 대한 좋아요 알림',
                value: EActionType.likePost,
                onValueChange,
              },
              {
                labelText: '멘션',
                status: unsubscribedActionType.includes(EActionType.mention),
                descriptionText: '다른 유저가 나를 언급하면 알림 수신',
                value: EActionType.mention,
                onValueChange,
              },
              {
                labelText: '구독',
                status: unsubscribedActionType.includes(EActionType.subscribe),
                descriptionText: '다른 유저가 나를 구독하면 알림 수신',
                value: EActionType.subscribe,
                onValueChange,
              },
            ],
            // renderItem: ListItem,
          },
        ]}
        renderItem={ListItem}
      />
      {/*<Button*/}
      {/*  color={'primary'}*/}
      {/*  title={'navigate'}*/}
      {/*  onPress={() => navigation.goBack()}*/}
      {/*/>*/}
    </View>
  );
};
const ListItem: SectionListRenderItem<SectionItem> = ({item, section}) => {
  // console.log(section, item.status);
  const [status, setStatus] = useState(
    !section.unsubscribedActionType.includes(item.value),
  );
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
      }}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 13}}>{item.labelText}</Text>
        <Text style={{fontSize: 12, color: '#bbb'}}>
          {item.descriptionText}
        </Text>
      </View>
      <Switch
        trackColor={{false: '#767577', true: '#60B630'}}
        value={status}
        thumbColor={'white'}
        onValueChange={value => {
          setStatus(value);
          item.onValueChange(value, item.value);
        }}
      />
    </View>
  );
};
export default Notification;
