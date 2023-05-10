import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Pdf, {Source} from 'react-native-pdf';
// import {useAppDispatch, useAppSelector} from '@redux/store/ViewerStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

// import {setUIVisible} from '@redux/reducer/viewerReducer';
import Animated, {FadeIn, FadeOut, runOnJS} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, makeStyles, Text} from '@rneui/themed';
import Avatar from '@components/Avatar';
import {
  StackActions,
  useFocusEffect,
  useLinkTo,
} from '@react-navigation/native';
import HeartIcon from '@assets/icon/heart.svg';
import HeartOutLineIcon from '@assets/icon/heart-outline.svg';
import CommentIcon from '@assets/icon/comment.svg';
import DotIcon from '@assets/icon/horizontalDots.svg';
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
import {apiInstance, getCsrfToken, reportCallback} from '@utils/Networking';
import {likeAdded, likeRemoved} from '@redux/reducer/likesReducer';
import BoxIcon from '@assets/icon/box.svg';
import {EAuthState, getAuthState, getSession} from '@redux/reducer/authReducer';
import TagText from '@components/TagText';
import reactStringReplace from 'react-string-replace';
import {humanizeDate} from '@utils/Humanize';
import {deletePost} from '@utils/models/post';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  blockUserAdded,
  blockUserRemoveOne,
  selectById as selectBlockUserById,
} from '@redux/reducer/blocksReducer';
import ListEmptyComponent from '@components/ListEmptyComponent';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type ViewerProps = StackScreenProps<PdfViewerStackParams, 'Viewer'>;
const PdfViewer: React.FC<ViewerProps> = ({navigation, route}) => {
  const isDarkMode = useColorScheme() === 'dark';
  console.log('PdfViewer', route.params, navigation.getState());
  const post = useAppSelector(state =>
    selectById(state.posts, route.params?._id || route.params?.id || ''),
  );
  const authState = useAppSelector(state => getAuthState(state));
  const session = useAppSelector(state => getSession(state));
  const backgroundStyle = {
    // flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [fetching, setFetching] = useState(true);

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
  const linkTo = useLinkTo();

  const block = useAppSelector(state =>
    selectBlockUserById(state.blocks, post?.author._id || ''),
  );
  useFocusEffect(
    useCallback(() => {
      console.log('aaa', route.params);
      if (
        authState !== EAuthState.INIT &&
        (route.params?.id ?? route.params?._id)
      ) {
        getCsrfToken.then(token => setCsrfToken(token));
        apiInstance
          .post<response<IPost>>(
            '/api/post/' + (route.params?.id ?? route.params._id),
          )
          .then(response => {
            console.log(
              'focus',
              response.data,
              '/api/post/' + (route.params?.id ?? route.params._id),
            );
            if (response.data.data) {
              dispatch(postSetOne(response.data.data));
            } else {
              dispatch(postRemoveOne(route.params?.id || route.params._id));
            }
            setFetching(false);
          })
          .catch(() => {
            console.log('error');
          });
      }
    }, [authState, dispatch, route.params._id, route.params.id]),
  );
  const likeCallback = useCallback(() => {
    if (!session) {
      SheetManager.show('loginSheet', {payload: {closable: true}}).then();
    } else if (post) {
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
        });
    }
  }, [csrfToken, dispatch, post, session]);
  const setUIVisibleCallback = () => setUIVisible(prevState => !prevState);
  const tap = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        .maxDuration(200)
        .maxDelay(100)
        .maxDistance(40)
        .onStart(() => runOnJS(setUIVisibleCallback)()),
    [setUIVisibleCallback],
  );
  return post === undefined && fetching ? (
    <Spinner />
  ) : !post ? (
    <View style={{flex: 1}}>
      <ListEmptyComponent
        ExtraComponent={
          <Button
            buttonStyle={{
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
            containerStyle={{
              marginTop: 24,
              borderRadius: 500,
            }}
            titleStyle={{fontSize: 12, lineHeight: 20}}
            title={'돌아가기'}
            onPress={() => navigation.goBack()}
          />
        }>
        Pdf 를 찾을 수 없습니다.
      </ListEmptyComponent>
    </View>
  ) : (
    <View
      style={[
        backgroundStyle,
        {
          // width: dimensions.width,
          // height: dimensions.height,
        },
      ]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />
      <View
        // onPress={() => setUIVisible(prevState => !prevState)}
        style={[
          styles.container,
          {
            overflow: 'visible',
          },
        ]}>
        <GestureDetector
          gesture={tap}
          // style={[
          //   styles.container,
          //   {
          //     overflow: 'visible',
          //   },
          // ]}
          // delayLongPress={500}
          // pointerEvents={UIVisible ? 'none' : undefined}
          // onPress={() => setUIVisible(prevState => !prevState)}
        >
          <Pdf
            fitPolicy={0}
            trustAllCerts={false}
            spacing={2}
            source={source}
            // onPageSingleTap={() => {
            //   setUIVisible(prevState => !prevState);
            //   console.log('onPageSingleTap');
            // }}
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
        </GestureDetector>
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
                shadowOpacity: 0.1,
                shadowRadius: 2.22,
                elevation: 2,
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
                  color={'black'}
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
              pointerEvents={'box-none'}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                // paddingBottom: 2,
                // alignSelf: 'center',
              }}>
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
                    // backgroundColor: '#60B630',
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
                  <BoxIcon fill={'#60B630'} width={24} height={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={e => {
                    // e.preventDefault();
                    e.stopPropagation();
                    likeCallback();
                  }}
                  style={{
                    width: 34,
                    height: 34,
                    marginBottom: 15,
                    backgroundColor: 'white',
                    // backgroundColor: '#60B630',
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
                    <HeartIcon fill={'#60B630'} width={32} height={32} />
                  ) : (
                    <HeartOutLineIcon fill={'#60B630'} width={32} height={32} />
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
                    // backgroundColor: '#60B630',
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
                  <CommentIcon fill={'#60B630'} width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => actionSheetRef.current?.show()}
                  style={{
                    width: 34,
                    height: 34,
                    marginBottom: 15,
                    backgroundColor: 'white',
                    // backgroundColor: '#60B630',
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
              <View
                style={[
                  styles.titleContainer,
                  {
                    paddingBottom: insets.bottom,
                    // alignSelf: 'center',
                    //   paddingBottom:
                    //     insets.bottom + styles.titleContainer.paddingHorizontal,
                  },
                ]}>
                <Pressable
                  style={{
                    paddingLeft: 15,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (post.author.id) {
                      if (
                        !navigation.getState().routes[0].state?.routes[4].state
                          ?.routes[0]
                      ) {
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
                  <Avatar
                    style={{width: 24, height: 24, marginRight: 5}}
                    avatar={post.author?.avatar}
                  />
                  <Text style={{lineHeight: 20}}>
                    {post.author.nickname} 님의{' '}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => detailsActionSheetRef.current?.show()}
                  style={{
                    flex: 1,
                    paddingRight: 15,
                    height: 20,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                  }}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        // flex: 1,
                        // justifyContent: 'center',
                        lineHeight: 20,
                        // alignSelf: 'center',
                        // textAlignVertical: 'center',
                      }}>
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
          <Pressable
            style={{paddingVertical: 10}}
            onPress={() => {
              Clipboard.setString(`https://everypdf.cc/post/${post._id}`);
              Toast.show({
                text1: '클립보드에 복사되었습니다.',
                position: 'bottom',
              });
              actionSheetRef.current?.hide();
            }}>
            <Text>링크 복사</Text>
          </Pressable>
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
                  actionSheetRef.current?.hide();
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
                              dispatch(likeRemoved(post._id));
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
              <Pressable
                style={{paddingVertical: 10}}
                onPress={() => {
                  actionSheetRef.current?.hide();
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
                            targetType: 'post',
                            targetId: post._id,
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
                }}>
                <Text>콘텐츠 신고</Text>
              </Pressable>
              <Pressable
                style={{paddingVertical: 10}}
                onPress={() => {
                  if (!session) {
                    SheetManager.show('loginSheet', {
                      payload: {closable: true},
                    }).then();
                  } else {
                    actionSheetRef.current?.hide();
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
                                  userId: post.author._id,
                                })
                                .then(response => {
                                  if (response.data.code === 200) {
                                    dispatch(
                                      blockUserRemoveOne(post.author._id),
                                    );
                                  }
                                });
                            } else {
                              apiInstance
                                .post('/api/account/block/append', {
                                  userId: post.author._id,
                                })
                                .then(response => {
                                  if (response.data.code === 200) {
                                    dispatch(
                                      blockUserAdded({
                                        _id: post.author._id,
                                        id: post.author.id,
                                        nickname: post.author.nickname,
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
                }}>
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
                    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
                    (link, index) => (
                      <TagText
                        key={`link${index}:${link}`}
                        style={{
                          color: '#60a4e6',
                        }}
                        onPress={async () => {
                          if (await Linking.canOpenURL(link)) {
                            try {
                              const url = link.replace(
                                /^(https:\/\/everypdf.cc)/,
                                '',
                              );
                              if (url.startsWith('/')) {
                                linkTo(url);
                              } else {
                                await Linking.openURL(url);
                              }
                            } catch (e) {
                              console.log('link', link);
                              await Linking.openURL(link);
                            }
                          }
                        }}>
                        {link}
                      </TagText>
                    ),
                  ),
                  /#([\p{L}|\p{N}]{1,20})(?=\s|#|$)/giu,

                  (tag, index) => (
                    <TagText
                      key={`tag${index}:${tag}`}
                      style={{
                        color: '#60a4e6',
                      }}
                      onPress={() => {
                        detailsActionSheetRef.current?.hide();
                        if (!navigation.getState().routes[0].state) {
                          navigation.navigate('Tabs', {
                            screen: 'Search',
                            params: {
                              keyword: '#' + tag,
                            },
                          });
                        } else {
                          navigation.navigate('Search', {
                            keyword: '#' + tag,
                          });
                        }
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
    fontSize: 14,
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
