import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {makeStyles} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Comment from '@components/Comment';
import SendIcon from '@assets/icon/send.svg';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {
  commentAdded,
  commentSetMany,
  removeComment,
  updateComment,
} from '@redux/reducer/commentsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import _ from 'lodash';
import {useHeaderHeight} from '@react-navigation/elements';
import {getSession} from '@redux/reducer/authReducer';
import {SheetManager} from 'react-native-actions-sheet';
import Spinner from '@components/Spinner';
import ListEmptyComponent from '@components/ListEmptyComponent';

type CommentsProps = StackScreenProps<RootStackParamList, 'Comments'>;
const Comments: React.FC<CommentsProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const [viewHeight, setViewHeight] = useState(0);
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
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
    console.log('ccc', route.params);
    apiInstance
      .post<response<IComment[]>>('/api/comment/list', {
        postId: route.params.postId,
      })
      .then(response => {
        if (response.data.data) {
          dispatch(commentSetMany(response.data.data));
          setData(response.data.data);
        }
      })
      .finally(() => {
        setFetching(false);
        setRefreshing(false);
      });
  }, [dispatch, route.params.postId]);
  const session = useAppSelector(state => getSession(state));
  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, initial?) => {
        apiInstance
          .post<response<IComment[]>>('/api/comment/list', {
            postId: route.params.postId,
            pagingKey,
          })
          .then(response => {
            console.log(response.data);
            if (response.data.data.length !== 0) {
              if (initial) {
                setData(response.data.data);
              } else {
                setData(prevState => [...prevState, ...response.data.data]);
              }
              dispatch(commentSetMany(response.data.data));
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }, 1000),
    [dispatch, route.params.postId],
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
  const submit = useCallback(() => {
    apiInstance
      .post<response<IComment>>('/api/comment/write', {
        postId: route.params.postId,
        content: content,
        _csrf: csrfToken,
      })
      .then(response => {
        if (response.data.code === 200) {
          dispatch(commentAdded(response.data.data));
          setData(prev => [response.data.data, ...prev]);
          setContent('');
        }
      });
  }, [content, csrfToken, dispatch, route.params.postId]);
  const deleteCallback = useCallback(
    (comment: IComment) => {
      if (!session) {
        SheetManager.show('loginSheet', {payload: {closable: true}}).then();
      } else if (comment && comment.author._id === session._id) {
        dispatch(removeComment(comment._id));
        apiInstance
          .post('/api/comment/delete' + comment._id, {
            commentId: !comment._id,
            _csrf: csrfToken,
          })
          .then(response => {
            if (response.data.code !== 200) {
              dispatch(commentAdded(comment));
            }
          })
          .catch(() => {
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
      <View style={{flex: 1}}>
        <FlatList<IComment>
          contentContainerStyle={{flexGrow: 1}}
          data={comments}
          // renderItem={props => <Comment item={props.item} />}
          renderItem={renderItem}
          // inverted={true}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={() =>
            fetching ? (
              <Spinner />
            ) : (
              <ListEmptyComponent>댓글이 없습니다.</ListEmptyComponent>
            )
          }
        />
      </View>
      <KeyboardAvoidingView
        style={{
          backgroundColor: 'black',
        }}
        // keyboardVerticalOffset={insets.bottom}
        // keyboardVerticalOffset={headerHeight}
        keyboardVerticalOffset={dimensions.height - viewHeight}
        // keyboardVerticalOffset={getDefaultHeaderHeight(
        //   {
        //     width: dimensions.width,
        //     height: dimensions.height,
        //   },
        //   true,
        //   getStatusBarHeight(),
        // )}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
            <TouchableOpacity
              onPress={() => {
                if (!session) {
                  SheetManager.show('loginSheet', {
                    payload: {closable: true},
                  }).then();
                }
              }}>
              <TextInput
                editable={!!session}
                style={styles.textInput}
                placeholder={'댓글 입력'}
                placeholderTextColor={'#606060'}
                value={content}
                textAlignVertical={'center'}
                onChangeText={setContent}
                multiline
              />
            </TouchableOpacity>
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
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },
}));
export default Comments;
