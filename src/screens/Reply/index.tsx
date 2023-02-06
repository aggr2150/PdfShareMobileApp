import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Input, makeStyles} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Comment from '@components/Comment';
import SendIcon from '@assets/icon/send.svg';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {commentAdded, commentAddedMany} from '@redux/reducer/commentsReducer';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import _ from 'lodash';
import {postAddedMany} from '@redux/reducer/postsReducer';
import {useHeaderHeight} from 'react-native-screens/native-stack';

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
  const comments = useAppSelector(state => {
    return data.map(item => state.comments.entities[item._id] as IComment);
  });
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
    apiInstance
      .post<response<IComment[]>>('/api/comment/list', {
        postId: route.params.postId,
        parentCommentId: route.params.parentCommentId,
      })
      .then(response => {
        if (response.data.data) {
          dispatch(commentAddedMany(response.data.data));
          setData(response.data.data);
        }
      });
  }, [dispatch, route.params.parentCommentId, route.params.postId]);
  const throttleEventCallback = useMemo(
    () =>
      _.throttle((pagingKey, initial?) => {
        apiInstance
          .post<response<IComment[]>>('/api/comment/list', {
            postId: route.params.postId,
            parentCommentId: route.params.parentCommentId,
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
              dispatch(commentAddedMany(response.data.data));
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            setFetching(false);
            setRefreshing(false);
          });
      }),
    [dispatch, route.params.parentCommentId, route.params.postId],
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
        parentCommentId: route.params.parentCommentId,
      })
      .then(response => {
        if (response.data.code === 200) {
          dispatch(commentAdded(response.data.data));
          setData(prev => [response.data.data, ...prev]);
          setContent('');
        }
      });
  }, [
    content,
    csrfToken,
    dispatch,
    route.params.parentCommentId,
    route.params.postId,
  ]);
  return (
    <SafeAreaView style={{flex: 1}}>
      {/*<View style={styles.header}>*/}
      {/*  <Text style={styles.headerText}>댓글</Text>*/}
      {/*</View>*/}
      <View style={{flex: 1, paddingHorizontal: 15}}>
        <FlatList
          scrollEnabled={true}
          data={comments}
          renderItem={Comment}
          inverted={true}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={'white'}
              titleColor={'white'}
            />
          }
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.bottom}
        style={{
          // flex: 0,
          width: '100%',
          // position: 'absolute',
          // top: 0,
          // bottom: 0,
          // left: 0,
          // right: 0,
          // width: 300,
          // height: 300,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: insets.bottom,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginLeft: 15,
              backgroundColor: 'white',
              flex: 1,
              borderRadius: 20,
              overflow: 'hidden',
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
              inputContainerStyle={{borderBottomWidth: 0}}
              renderErrorMessage={false}
              containerStyle={{paddingLeft: 10, flex: 1}}
              inputStyle={{margin: 0}}
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
