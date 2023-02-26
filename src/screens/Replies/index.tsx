import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {makeStyles} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Comment from '@components/Comment';
import SendIcon from '@assets/icon/send.svg';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {
  commentAdded,
  commentAddedMany,
  removeComment,
  updateComment,
} from '@redux/reducer/commentsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import _ from 'lodash';
import {SheetManager} from 'react-native-actions-sheet';
import {getSession} from '@redux/reducer/authReducer';
import {useHeaderHeight} from '@react-navigation/elements';
import ListEmptyComponent from '@components/ListEmptyComponent';
import Spinner from '@components/Spinner';

type ReplyProps = StackScreenProps<RootStackParamList, 'Replies'>;
const Reply: React.FC<ReplyProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [data, setData] = useState<IComment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const headerHeight = useHeaderHeight();
  const comments = useAppSelector(state => {
    return data.reduce<IComment[]>((previousValue, currentValue) => {
      currentValue &&
        state.comments.entities[currentValue._id] &&
        previousValue.push(
          state.comments.entities[currentValue._id] as IComment,
        );
      return previousValue;
    }, []);
  });
  const session = useAppSelector(state => getSession(state));
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
    apiInstance
      .post<response<IComment[]>>('/api/comment/list', {
        postId: route.params.postId,
        parentCommentId: route.params._id,
      })
      .then(response => {
        if (response.data.data) {
          dispatch(commentAddedMany(response.data.data));
          setData(response.data.data);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [dispatch, route.params._id, route.params.postId]);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, initial?) => {
        apiInstance
          .post<response<IComment[]>>('/api/comment/list', {
            postId: route.params.postId,
            parentCommentId: route.params._id,
            pagingKey,
          })
          .then(response => {
            if (response.data.data.length !== 0) {
              if (initial) {
                setData(response.data.data);
              } else {
                setData(prevState => [...prevState, ...response.data.data]);
              }
              dispatch(commentAddedMany(response.data.data));
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [dispatch, route.params._id, route.params.postId],
  );
  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback(data[data.length - 1]?._id);
    }
  }, [data, fetching, throttleEventCallback]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    throttleEventCallback.cancel();
    throttleEventCallback(undefined, true);
  }, [throttleEventCallback]);
  // const headerHeight = useHeaderHeight();
  const submit = useCallback(() => {
    apiInstance
      .post<response<IComment>>('/api/comment/write', {
        postId: route.params.postId,
        content: content,
        _csrf: csrfToken,
        parentCommentId: route.params._id,
      })
      .then(response => {
        if (response.data.code === 200) {
          dispatch(commentAdded(response.data.data));
          setData(prev => [response.data.data, ...prev]);
          setContent('');
        }
      });
  }, [content, csrfToken, dispatch, route.params._id, route.params.postId]);

  const deleteCallback = useCallback(
    (comment: IComment) => {
      if (!session) {
        SheetManager.show('loginSheet', {payload: {closable: true}}).then();
      } else if (comment && comment.author._id === session._id) {
        dispatch(removeComment(comment._id));
        apiInstance
          .post('/api/comment/delete', {
            commentId: comment._id,
            _csrf: csrfToken,
          })
          .then(response => {
            if (response.data.code !== 200) {
              dispatch(commentAdded(comment));
            }
          })
          .catch(err => {
            console.log('error', err);
            dispatch(commentAdded(comment));
          });
      }
    },
    [csrfToken, dispatch, session],
  );
  const likeCallback = useCallback(
    (comment: IComment) => {
      if (!session) {
        console.log('session', session);
        SheetManager.show('loginSheet', {payload: {closable: true}}).then();
      } else if (comment) {
        dispatch(
          updateComment({
            id: comment._id,
            changes: {
              likeStatus: !comment.likeStatus,
              likeCounter: !comment.likeStatus
                ? comment.likeCounter + 1
                : comment.likeCounter - 1,
            },
          }),
        );
        apiInstance
          .post('/api/like/comment/' + comment._id, {
            likeStatus: !comment.likeStatus,
            _csrf: csrfToken,
          })
          .then(response => {
            if (response.data.code !== 200) {
              dispatch(
                updateComment({
                  id: comment._id,
                  changes: {
                    likeStatus: comment.likeStatus,
                    likeCounter:
                      comment.likeCounter + (comment.likeStatus ? +1 : -1),
                  },
                }),
              );
            }
          })
          .catch(() => {
            dispatch(
              updateComment({
                id: comment._id,
                changes: {
                  likeStatus: comment.likeStatus,
                  likeCounter:
                    comment.likeCounter + (comment.likeStatus ? +1 : -1),
                },
              }),
            );
          });
      }
    },
    [csrfToken, dispatch, session],
  );
  const renderItem = useMemo(
    () => {
      const render: ListRenderItem<IComment> = props => {
        return (
          <Comment
            navigation={navigation}
            session={session}
            isMine={session?._id === props.item.author._id}
            likeCallback={likeCallback}
            deleteCallback={deleteCallback}
            item={props.item}
          />
        );
      };
      return render;
    }, // props => <Comment {...props} />,
    [deleteCallback, likeCallback, navigation, session],
  );
  return (
    <SafeAreaView style={{flex: 1}} edges={['left', 'right', 'bottom']}>
      <View style={{flex: 1}}>
        <FlatList<IComment>
          data={comments}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={() => (
            <Comment
              navigation={navigation}
              session={session}
              isMine={session?._id === route.params.author._id}
              likeCallback={likeCallback}
              deleteCallback={deleteCallback}
              item={route.params}
            />
          )}
          ListEmptyComponent={() =>
            fetching ? (
              <Spinner />
            ) : (
              <ListEmptyComponent>답글이 없습니다.</ListEmptyComponent>
            )
          }
          renderItem={renderItem}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
      <KeyboardAvoidingView
        // keyboardVerticalOffset={insets.bottom}
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              marginLeft: 15,
              backgroundColor: 'white',
              flex: 1,
              borderRadius: 50,
              overflow: 'hidden',
              marginVertical: 5,
            }}>
            <TextInput
              style={{
                backgroundColor: 'white',
                paddingTop: 10,
                paddingBottom: 10,
                paddingHorizontal: 20,
              }}
              // style={styles.textInput}
              placeholder={'댓글 입력'}
              placeholderTextColor={'#606060'}
              // inputContainerStyle={{borderBottomWidth: 0}}
              // renderErrorMessage={false}
              // containerStyle={{paddingLeft: 10}}
              // inputStyle={{margin: 0}}
              value={content}
              textAlignVertical={'center'}
              // textAlign={'center'}
              // autoCorrect={false}
              // onSubmitEditing={submit}
              onChangeText={setContent}
              multiline
              // returnKeyType={'send'}
            />
          </View>
          <TouchableOpacity
            onPress={submit}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <SendIcon width={36} height={36} fill={'#99c729'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const useStyles = makeStyles(theme => ({
  submitButton: {
    borderRadius: 20,
  },
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  header: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: '#fff',
  },
  textInput: {
    flex: 1,
    width: '100%',
    height: 300,
    // flex: 1,
    // flex: 0.5,
    textAlignVertical: 'center',
    // marginVertical: 7,
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    // paddingTop: 0,
    // paddingBottom: 0,
    // alignSelf: 'stretch',
    textAlign: 'left',
    borderRadius: 20,
    // paddingVertical: 5,
    // paddingHorizontal: 20,
    fontSize: 14,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    // color: theme.colors.white,
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },
}));
export default Reply;
