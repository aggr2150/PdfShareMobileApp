import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Pdf, {Source} from 'react-native-pdf';
// import {useAppDispatch, useAppSelector} from '@redux/store/ViewerStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

// import {setUIVisible} from '@redux/reducer/viewerReducer';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {makeStyles, Text} from '@rneui/themed';
import Avatar from '@components/Avatar';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import HeartIcon from '@assets/icon/heart.svg';
import HeartOutLineIcon from '@assets/icon/heart-outline.svg';
import CommentIcon from '@assets/icon/comment.svg';
import DotIcon from '@assets/icon/dot.svg';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import {StackScreenProps} from '@react-navigation/stack';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {
  postRemoveOne,
  postSetOne,
  selectById,
  updatePost,
} from '@redux/reducer/postsReducer';
import Spinner from '@components/Spinner';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {likeAdded, likeRemoved} from '@redux/reducer/likesReducer';
import BoxIcon from '@assets/icon/box.svg';
import {getSession} from '@redux/reducer/authReducer';
import TagText from '@components/TagText';
import reactStringReplace from 'react-string-replace';
import {humanizeDate} from '@utils/Humanize';
import {deletePost} from '@utils/models/post';
import Toast from 'react-native-toast-message';

type ViewerProps = StackScreenProps<RootStackParamList, 'Viewer'>;
const PdfViewer: React.FC<ViewerProps> = ({navigation, route}) => {
  console.log('params', route.params, route.params?.id || route.params._id);
  const isDarkMode = useColorScheme() === 'dark';
  const post = useAppSelector(state =>
    selectById(state.posts, route.params._id || route.params?.id),
  );
  const session = useAppSelector(state => getSession(state));
  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [csrfToken, setCsrfToken] = useState<string>('');

  // route.params.document.filepath
  const source: Source = {
    uri: post?.document.filepath,
    // uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    // uri: 'ile://src/assets/테스트.pdf',
    cache: true,
    // require("../../assets/테스트.pdf")
  };
  const {height, width} = useWindowDimensions();
  // const dispatch = useAppDispatch();
  // const UIVisible = useAppSelector(state => state.viewer.UIVisible);
  const [UIVisible, setUIVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const detailsActionSheetRef = useRef<ActionSheetRef>(null);
  const styles = useStyles();
  const dimensions = useWindowDimensions();
  const dispatch = useAppDispatch();
  useFocusEffect(
    useCallback(() => {
      getCsrfToken.then(token => setCsrfToken(token));
      // if (route.params?._id) {
      // }
      apiInstance
        .post<response<IPost>>(
          '/api/post/' + route.params?.id || route.params._id,
        )
        .then(response => {
          console.log(response.data);
          if (response.data.data) {
            console.log('response.data.data', response.data.data);
            dispatch(postSetOne(response.data.data));
          }
        });
    }, [dispatch, route.params._id]),
  );
  const likeCallback = useCallback(() => {
    if (!session) {
      console.log('session', session);
      SheetManager.show('loginSheet', {payload: {closable: true}}).then();
    } else if (post) {
      console.log(post.likeStatus);
      dispatch(
        updatePost({
          id: post._id,
          changes: {
            likeStatus: !post.likeStatus,
            likeCounter: !post.likeStatus
              ? post.likeCounter + 1
              : post.likeCounter - 1,
          },
        }),
      );
      apiInstance
        .post('/api/like/post/' + post._id, {
          likeStatus: !post.likeStatus,
          _csrf: csrfToken,
        })
        .then(response => {
          if (response.data.data.likeStatus) {
            dispatch(
              likeAdded({likeAt: response.data.data.likeAt, _id: post._id}),
            );
          } else {
            dispatch(likeRemoved(post._id));
          }
          console.log('response', response.data);
        });
    }
  }, [csrfToken, dispatch, post, session]);
  console.log('pppp', post);
  return !post ? (
    <Spinner />
  ) : (
    <View
      style={[
        backgroundStyle,
        {
          width: dimensions.width,
          height: dimensions.height,
        },
      ]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />
      <View
        style={[
          styles.container,
          {
            overflow: 'visible',
          },
        ]}>
        <Pdf
          fitPolicy={0}
          trustAllCerts={false}
          source={source}
          onPageSingleTap={() => setUIVisible(prevState => !prevState)}
          onLoadComplete={numberOfPages => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(uri);
            Linking.canOpenURL(uri).then(value => {
              value && Linking.openURL(uri);
            });
          }}
          style={[styles.pdf, {width, height}]}
        />
        {UIVisible && (
          <Animated.View
            entering={FadeIn.duration(100)}
            exiting={FadeOut.duration(100)}
            style={{
              position: 'absolute',
              // backgroundColor: 'red',
              top: insets.top || 15,
              left: insets.left || 15,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 36,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons
                  name={Platform.select({
                    android: 'arrow-back',
                    ios: 'ios-chevron-back',
                    default: 'ios-chevron-back',
                  })}
                  size={Platform.select({
                    android: 24,
                    ios: 30,
                    default: 30,
                  })}
                />
              </Pressable>
            </TouchableOpacity>
          </Animated.View>
        )}
        {UIVisible && (
          <Animated.View
            pointerEvents={'box-none'}
            style={{position: 'absolute', bottom: 0, right: 0, left: 0}}>
            <Animated.View
              entering={FadeIn.duration(100)}
              exiting={FadeOut.duration(100)}
              style={{
                marginRight: insets.right || 15,
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (!session) {
                    SheetManager.show('loginSheet', {
                      payload: {closable: true},
                    }).then();
                  } else {
                    SheetManager.show('appendToCollectionSheet', {
                      payload: {
                        postId: post._id,
                      },
                    }).then();
                  }
                }}
                style={{
                  width: 34,
                  height: 34,
                  marginBottom: 15,
                  backgroundColor: 'white',
                  // backgroundColor: '#99c729',
                  borderRadius: 34,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BoxIcon fill={'#99c729'} width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={likeCallback}
                style={{
                  width: 34,
                  height: 34,
                  marginBottom: 15,
                  backgroundColor: 'white',
                  // backgroundColor: '#99c729',
                  borderRadius: 34,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {post.likeStatus ? (
                  <HeartIcon fill={'#99c729'} width={32} height={32} />
                ) : (
                  <HeartOutLineIcon fill={'#99c729'} width={32} height={32} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Comments', {postId: post._id})
                }
                style={{
                  width: 34,
                  height: 34,
                  marginBottom: 15,
                  backgroundColor: 'white',
                  // backgroundColor: '#99c729',
                  borderRadius: 34,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CommentIcon fill={'#99c729'} width={32} height={32} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => actionSheetRef.current?.show()}
                style={{
                  width: 34,
                  height: 34,
                  marginBottom: 15,
                  backgroundColor: 'white',
                  // backgroundColor: '#99c729',
                  borderRadius: 34,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <DotIcon fill={'black'} width={24} height={24} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeIn.duration(100)}
              exiting={FadeOut.duration(100)}
              style={{
                // position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                // alignSelf: 'center',
              }}>
              <View
                style={[
                  styles.titleContainer,
                  {
                    paddingBottom: insets.bottom,
                    // alignSelf: 'center',
                    //   paddingBottom:
                    //     insets.bottom + styles.titleContainer.paddingHorizontal,
                  },
                ]}
                onPress={() => detailsActionSheetRef.current?.show()}>
                <Pressable
                  style={{
                    paddingLeft: 15,
                    paddingVertical: 8,
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    if (route.params?.author.id) {
                      if (!navigation.getState().routes[0].state) {
                        navigation.navigate('Tabs', {
                          screen: 'ProfileTab',
                          params: {
                            screen: 'Profile',
                            initial: false,
                            params: {
                              id: post.author.id,
                            },
                          },
                        });
                      } else {
                        navigation.navigate('ProfileTab');
                        navigation.dispatch(
                          StackActions.push('Profile', {
                            id: post.author.id,
                          }),
                        );
                      }
                    }
                  }}>
                  <Avatar style={{width: 20, height: 20, marginRight: 5}} />
                  <Text>{post.author.nickname} 님의 </Text>
                </Pressable>
                <Pressable
                  onPress={() => detailsActionSheetRef.current?.show()}
                  style={{
                    flex: 1,
                    paddingRight: 15,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                  }}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text
                      numberOfLines={1}
                      style={
                        {
                          // flex: 1,
                          // justifyContent: 'center',
                          // alignSelf: 'center',
                          // textAlignVertical: 'center',
                        }
                      }>
                      {post.title}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </View>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheetContainer}
        useBottomSafeAreaPadding={true}>
        <View style={{marginTop: 40}}>
          {session?._id === post.author._id ? (
            <>
              <Pressable
                style={{paddingVertical: 10}}
                onPress={() => {
                  actionSheetRef.current?.hide();
                  navigation.navigate('EditPost', post);
                }}>
                <Text>콘텐츠 수정</Text>
              </Pressable>
              <Pressable
                style={{paddingVertical: 10}}
                onPress={() => {
                  Alert.alert('삭제하시겠습니까?', undefined, [
                    {
                      text: '취소',
                      onPress: () => console.log('Ask me later pressed'),
                    },
                    {
                      text: '삭제',
                      onPress: () =>
                        deletePost({
                          csrfToken,
                          post,
                          callback: response => {
                            actionSheetRef.current?.hide();
                            if (response.data.code === 200) {
                              dispatch(postRemoveOne(post._id));
                              navigation.goBack();
                            } else {
                              Toast.show({
                                type: 'error',
                                text1: 'Unknown Error Occurred!',
                                position: 'bottom',
                              });
                            }
                          },
                          errorHandle: error => {
                            actionSheetRef.current?.hide();
                            console.log(error);
                            Toast.show({
                              type: 'error',
                              text1: 'Unknown Error Occurred!',
                              position: 'bottom',
                            });
                          },
                        }),
                      style: 'destructive',
                    },
                  ]);
                }}>
                <Text>콘텐츠 삭제</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={{paddingVertical: 10}}>
                <Text>콘텐츠 신고</Text>
              </Pressable>
              <Pressable style={{paddingVertical: 10}}>
                <Text>유저 차단</Text>
              </Pressable>
            </>
          )}
        </View>
      </ActionSheet>
      <ActionSheet
        ref={detailsActionSheetRef}
        useBottomSafeAreaPadding={true}
        headerAlwaysVisible={true}
        // drawUnderStatusBar={true}
        // statusBarTranslucent
        // snapPoints={[50]}
        containerStyle={styles.scrollSheetContainer}>
        <ScrollView>
          <View style={{paddingVertical: 25}}>
            <Text style={styles.titleLabel}>이 PDF의 정보</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styles.counterLabel}>
                조회수 {post.viewCounter}회
              </Text>
              <Text style={styles.counterLabel}>
                좋아요 {post.likeCounter}개
              </Text>
            </View>
            <Separator style={{marginVertical: 15}} />
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={styles.contentText}>제목 : {post.title}</Text>
              <Text style={styles.contentText}>
                날짜 :{' '}
                {humanizeDate(new Date(post.updatedAt || post.createdAt))}
              </Text>
              <Text style={styles.contentText}>
                설명 :{' '}
                {reactStringReplace(
                  reactStringReplace(
                    post.content,
                    // post.content,
                    // /#(\w+)/g,
                    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
                    link => (
                      <TagText
                        style={{
                          color: 'blue',
                          fontSize: 13,
                        }}
                        onPress={() => {
                          console.log('def');
                          // if (!navigation.getState().routes[0].state) {
                          //   navigation.navigate('Tabs', {
                          //     screen: 'SearchTab',
                          //     params: {
                          //       screen: 'SearchResult',
                          //       initial: false,
                          //       params: {
                          //         keyword: tag,
                          //       },
                          //     },
                          //   });
                          // } else {
                          //   navigation.navigate('SearchTab');
                          //   navigation.dispatch(
                          //     StackActions.push('SearchResult', {
                          //       keyword: tag,
                          //     }),
                          //   );
                          //   navigation.navigate('SearchResult', {
                          //     keyword: tag,
                          //   });
                          // }
                        }}>
                        {link}
                      </TagText>
                    ),
                  ),
                  /#([\p{L}|\p{N}]{1,20})(?=\s|#|$)/giu,

                  tag => (
                    <TagText
                      style={{
                        color: 'yellow',
                        fontSize: 13,
                      }}
                      onPress={() => {
                        console.log('abc');
                        // if (!navigation.getState().routes[0].state) {
                        //   navigation.navigate('Tabs', {
                        //     screen: 'SearchTab',
                        //     params: {
                        //       screen: 'SearchResult',
                        //       initial: false,
                        //       params: {
                        //         keyword: link,
                        //       },
                        //     },
                        //   });
                        // } else {
                        //   navigation.navigate('SearchTab');
                        //   navigation.dispatch(
                        //     StackActions.push('SearchResult', {
                        //       keyword: link,
                        //     }),
                        //   );
                        //   navigation.navigate('SearchResult', {
                        //     keyword: tag,
                        //   });
                        // }
                      }}>
                      #{tag}
                    </TagText>
                  ),
                )}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  sheetContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  scrollSheetContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    height: '60%',
    maxHeight: '60%',
  },
  titleLabel: {
    alignSelf: 'center',
    fontSize: 17,
    marginBottom: 10,
  },
  counterLabel: {
    marginHorizontal: 12,
    fontSize: 12,
  },
  contentText: {
    fontSize: 13,
  },
  container: {
    width: '100%',
    height: '100%',
    // flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // marginTop: 25,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  button: {
    width: 34,
    height: 34,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 34,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
}));

export default PdfViewer;
