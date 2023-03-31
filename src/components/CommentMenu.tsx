import {Alert, TouchableOpacity} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import DotIcon from '@assets/icon/horizontalDots.svg';
import {Menu} from 'react-native-paper';
import {SheetManager} from 'react-native-actions-sheet';
import {apiInstance, getCsrfToken, reportCallback} from '@utils/Networking';
import {
  blockUserAdded,
  blockUserRemoveOne,
  selectById as selectBlockUserById,
} from '@redux/reducer/blocksReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import Toast from 'react-native-toast-message';

const CommentMenu: React.FC<{
  item: IComment;
  isMine: boolean;
  session: Nullable<ISession>;
  deleteCallback: (comment: IComment) => void;
}> = ({item, isMine, session, deleteCallback}) => {
  const styles = useStyles();
  const [visible, setVisible] = React.useState(false);
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);
  const [csrfToken, setCsrfToken] = useState<string>();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const block = useAppSelector(state =>
    selectBlockUserById(state.blocks, item.author._id || ''),
  );
  const dispatch = useAppDispatch();
  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      contentStyle={{backgroundColor: 'black'}}
      anchorPosition={'bottom'}
      anchor={
        <TouchableOpacity
          onPress={openMenu}
          style={{
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DotIcon fill={'white'} width={24} height={24} />
        </TouchableOpacity>
      }>
      {isMine ? (
        <>
          <Menu.Item
            dense={true}
            onPress={() => {
              deleteCallback(item);
              closeMenu();
            }}
            title={<Text style={styles.menuText}>삭제</Text>}
          />
        </>
      ) : (
        <>
          <Menu.Item
            dense={true}
            onPress={() => {
              closeMenu();
              if (!session) {
                SheetManager.show('loginSheet', {
                  payload: {closable: true},
                }).then();
              } else {
                Alert.alert('신고하시겠습니까?', undefined, [
                  {
                    text: '취소',
                  },
                  {
                    text: '신고하기',
                    onPress: () => {
                      reportCallback({
                        csrfToken,
                        targetType: 'comment',
                        targetId: item._id,
                      }).then();
                      Toast.show({
                        type: 'success',
                        text1: '신고가 접수되었습니다.',
                        position: 'bottom',
                      });
                    },
                    style: 'destructive',
                  },
                ]);
              }
            }}
            title={<Text style={styles.menuText}>신고</Text>}
          />
          <Menu.Item
            dense={true}
            onPress={() => {
              if (!session) {
                SheetManager.show('loginSheet', {
                  payload: {closable: true},
                }).then();
              } else {
                closeMenu();
                Alert.alert(
                  block ? '차단해제하시겠습니까?' : '차단하시겠습니까?',
                  undefined,
                  [
                    {
                      text: '취소',
                      onPress: () => console.log('Ask me later pressed111'),
                    },
                    {
                      text: block ? '해제' : '차단',
                      onPress: () => {
                        if (block) {
                          apiInstance
                            .post('/api/account/block/delete', {
                              userId: item.author._id,
                            })
                            .then(response => {
                              if (response.data.code === 200) {
                                dispatch(blockUserRemoveOne(item.author._id));
                              }
                            });
                        } else {
                          apiInstance
                            .post('/api/account/block/append', {
                              userId: item.author._id,
                            })
                            .then(response => {
                              if (response.data.code === 200) {
                                dispatch(
                                  blockUserAdded({
                                    _id: item.author._id,
                                    id: item.author.id,
                                    nickname: item.author.nickname,
                                  }),
                                );
                              }
                            });
                        }
                      },
                      style: 'destructive',
                    },
                  ],
                );
              }
            }}
            title={<Text style={styles.menuText}>차단</Text>}
          />
        </>
      )}
    </Menu>
  );
};

const useStyles = makeStyles(theme => ({
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
}));
export default CommentMenu;
