import {
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {makeStyles} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Comment from '@components/Comment';
import SendIcon from '@assets/icon/send.svg';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {
  commentAdded,
  commentAddedMany,
  removeComment,
  selectById,
  updateComment,
} from '@redux/reducer/commentsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import _ from 'lodash';
import {SheetManager} from 'react-native-actions-sheet';
import {getSession} from '@redux/reducer/authReducer';
import ListEmptyComponent from '@components/ListEmptyComponent';
import Spinner from '@components/Spinner';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Separator from '@components/Seperator';
import {FlatList} from '@stream-io/flat-list-mvcp';

type ReplyProps = StackScreenProps<PdfViewerStackParams, 'Replies'>;
const Reply: React.FC<ReplyProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [data, setData] = useState<IComment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const [viewHeight, setViewHeight] = useState(0);
  const parentComment = useAppSelector(state =>
    selectById(state.comments, route.params._id),
  );
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
  const flatListRef = useRef<FlatList<IComment>>(null);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, sort = -1, initial?) => {
        apiInstance
          .post<response<IComment[]>>('/api/comment/list', {
            postId: route.params.postId,
            parentCommentId: route.params.parentCommentId ?? route.params._id,
            sort,
            ...(initial ? {commentId: route.params.commentId} : {pagingKey}),
          })
          .then(response => {
            if (response.data.data.length !== 0) {
              dispatch(commentAddedMany(response.data.data));
              if (initial) {
                setData(response.data.data);
                const target = response.data.data.find(
                  value => value._id === route.params.commentId,
                );
                target && flatListRef.current?.scrollToItem({item: target});
              } else {
                setData(prevState => [...prevState, ...response.data.data]);
              }
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [
      dispatch,
      route.params._id,
      route.params.commentId,
      route.params.parentCommentId,
      route.params.postId,
    ],
  );
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
    throttleEventCallback(route.params.commentId, -1, true);
  }, [
    dispatch,
    route.params._id,
    route.params.postId,
    route.params.parentCommentId,
    route.params.commentId,
    throttleEventCallback,
  ]);
  const onEndReached = useCallback(() => {
    if (!fetching) {
      throttleEventCallback(data[data.length - 1]?._id);
    }
  }, [data, fetching, throttleEventCallback]);
  const onRefresh = useCallback(() => {
    if (!fetching) {
      setRefreshing(true);
      throttleEventCallback(data[0]?._id, 1);
    }
    // setRefreshing(true);
    // throttleEventCallback.cancel();
    // throttleEventCallback(undefined, true);
  }, [data, fetching, throttleEventCallback]);
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
    <View
      style={{flex: 1}}
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        setViewHeight(height);
      }}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <View style={{flex: 1}}>
        <FlatList<IComment>
          ref={flatListRef}
          contentContainerStyle={{flexGrow: 1}}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          data={comments}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 100));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          ListHeaderComponent={() => (
            <>
              <Comment
                navigation={navigation}
                session={session}
                isMine={session?._id === parentComment?.author._id}
                likeCallback={likeCallback}
                deleteCallback={deleteCallback}
                item={parentComment}
              />
              <Separator />
            </>
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
        style={{
          backgroundColor: 'black',
        }}
        keyboardVerticalOffset={dimensions.height - viewHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable
          pointerEvents={session ? 'box-none' : 'box-only'}
          onPress={() => {
            if (!session) {
              SheetManager.show('loginSheet', {
                payload: {closable: true},
              }).then();
            }
          }}
          style={{
            paddingBottom: insets.bottom,
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
                color: 'black',
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
            <SendIcon width={36} height={36} fill={'#60B630'} />
          </TouchableOpacity>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
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
