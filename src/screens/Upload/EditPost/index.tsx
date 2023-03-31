import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, TextInput, useWindowDimensions, View} from 'react-native';
import {makeStyles} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProgressModal from '@screens/Upload/ProgressModal';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import BackButton from '@components/BackButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckButton from '@components/buttons/CheckButton';
import ThumbnailCover from '@components/ThumbnailCover';
import BookCover from '@components/BookCover';

type EditPostProps = StackScreenProps<RootStackParamList, 'EditPost'>;
const EditPost: React.FC<EditPostProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const [progressModalVisible, setProgressModalVisible] = useState(false);

  const [title, setTitle] = useState<string>(route.params.title);
  const [content, setContent] = useState<string>(route.params.content);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [thumbnail, setThumbnail] = useState<Image>();
  const [csrfToken, setCsrfToken] = useState<string>();
  const openImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      // cropping: true,
      multiple: false,
      writeTempFile: true,
      includeExif: true,
    }).then(setThumbnail);
  }, []);
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);

  const submit = useCallback(() => {
    setProgressModalVisible(true);
    let form = new FormData();
    form.append('postId', route.params._id);
    form.append('title', title);
    form.append('content', content);
    if (thumbnail) {
      form.append('thumbnail', {
        uri: thumbnail.path,
        type: thumbnail.mime,
        name:
          thumbnail.filename ||
          thumbnail.path.substring(
            thumbnail.path.lastIndexOf('/') + 1,
            thumbnail.path.length,
          ),
      });
    }
    form.append('_csrf', csrfToken);
    apiInstance
      .post('/api/post/edit', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        timeout: 180000,
      })
      .then(response => {
        console.log(response.data);
        setProgressModalVisible(false);
        setSubmitDisabled(false);
        navigation.navigate('Viewer', route.params);
      })
      .catch(error => {
        console.log('error', error);
        setProgressModalVisible(false);
      });
    // }
  }, [csrfToken, title, content, thumbnail, navigation]);
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, minHeight: '100%'}}
        bounces={false}>
        <View
          style={{
            // zIndex: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'black',
          }}>
          <View
            style={{backgroundColor: '#60B630', height: dimensions.height / 3}}
          />
        </View>
        <View>
          <View
            style={[
              styles.backButton,
              {
                justifyContent: 'space-between',
                paddingTop: insets.top || 11,
                paddingBottom: 11,
                alignItems: 'center',
              },
            ]}>
            {/*<HeaderBackButton*/}
            {/*  tintColor={'white'}*/}
            {/*  onPress={() => navigation.goBack()}*/}
            {/*/>*/}
            <View style={{padding: 5}}>
              <BackButton onPress={() => navigation.goBack()} color={'white'} />
            </View>
            <View style={{padding: 5, marginRight: insets.right || 5}}>
              <CheckButton
                onPress={submit}
                color={'white'}
                disabled={title.length === 0}
                size={28}
                label={'수정'}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View
              style={{
                // width: '50%',
                marginBottom: 20,
                height: 250,
              }}>
              <Pressable onPress={openImagePicker}>
                {/*<BookCover source={thumbnail} />*/}
                <View
                  style={{
                    // flex: 1,
                    aspectRatio: 3 / 4,
                    // backgroundColor: 'white',
                    height: '100%',
                  }}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                      position: 'absolute',
                      top: 12,
                      // right: 50,
                      left: 10,
                      backgroundColor: 'white',
                      // flex: 1,
                      height: '80%',
                      // width: '100%',
                      aspectRatio: 1 / Math.sqrt(2),
                    }}>
                    {/*<Book*/}
                    {/*  author={item?.author}*/}
                    {/*  document={item?.document}*/}
                    {/*  documentThumbnail={item?.documentThumbnail}*/}
                    {/*  thumbnail={item?.documentThumbnail}*/}
                    {/*  title={item?.title}*/}
                    {/*/>*/}
                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    width: '100%',*/}
                    {/*    height: '100%',*/}
                    {/*    backgroundColor: 'yellow',*/}
                    {/*  }}></View>*/}
                  </View>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                      position: 'absolute',
                      right: 10,
                      bottom: 12,
                      // backgroundColor: 'brown',
                      height: '80%',
                      aspectRatio: 1 / Math.sqrt(2),
                    }}>
                    <BookCover source={thumbnail} />
                  </View>
                </View>
              </Pressable>
            </View>
            <View style={styles.inputField}>
              <TextInput
                onChangeText={setTitle}
                style={styles.titleInput}
                placeholderTextColor={'#1ba639'}
                placeholder={'컨텐츠의 제목을 넣어주세요'}
                autoCorrect={false}
                value={title}
              />
              <TextInput
                style={styles.contentInput}
                scrollEnabled={false}
                placeholderTextColor={'white'}
                multiline={true}
                onChangeText={setContent}
                placeholder={
                  '자신의 아이디어, 문서, 프로젝트들을 이곳에 간단히 설명해 주세요. 해시 태그를 달아도 좋아요.'
                }
                value={content}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ProgressModal
        progressModalVisible={progressModalVisible}
        setProgressModalVisible={setProgressModalVisible}
      />
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  inputContainer: {
    // flex: 1,
    // backgroundColor: theme.colors.primary,
    paddingHorizontal: 35,
    alignItems: 'center',
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  counterText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  submitButton: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  backButton: {
    // alignSelf: 'flex-start',
    flexDirection: 'row',
    // paddingVertical: 11,
  },
  inputField: {
    // flex: 1,
    width: '100%',
    paddingTop: 3,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    // justifyContent: 'flex-start',
  },
  contentInput: {
    minHeight: 200,
    // backgroundColor: '#fff',
    color: 'white',
    // justifyContent: 'flex-start',
    // alignSelf: 'flex-start',
    // paddingHorizontal: 5,
    textAlignVertical: 'top',
    fontSize: 13,
    fontFamily: 'Apple SD Gothic Neo',
  },
  titleInput: {
    color: '#1ba639',
    textAlign: 'center',
    paddingHorizontal: 0,
    fontSize: 22,
    fontFamily: 'Apple SD Gothic Neo',
    paddingBottom: 9,
  },
  label: {
    marginTop: 3,
    fontSize: 12,
  },
}));
export default EditPost;
