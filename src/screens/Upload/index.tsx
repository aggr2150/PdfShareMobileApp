import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, TextInput, useWindowDimensions, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProgressModal from '@screens/Upload/ProgressModal';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import BackButton from '@components/BackButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BookCover from '@components/BookCover';
// import CheckButton from '@components/CheckButton';
import Toast from 'react-native-toast-message';
import CheckButton from '@components/buttons/CheckButton';
import Book from '@components/Book';

type UploadProps = StackScreenProps<RootStackParamList, 'Upload'>;
// | BottomTabScreenProps<BottomTabParamList, 'UploadTab'>;
const Upload: React.FC<UploadProps> = ({navigation}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const [progressModalVisible, setProgressModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [thumbnail, setThumbnail] = useState<Image>();
  const [pdf, setPdf] = useState<DocumentPickerResponse>();
  const [csrfToken, setCsrfToken] = useState<string>();
  const openPdfPicker = useCallback(() => {
    DocumentPicker.pickSingle({
      type: DocumentPicker.types.pdf,
      allowMultiSelection: false,
      mode: 'import',
      copyTo: 'cachesDirectory',
    })
      .then(r => setPdf(r))
      .catch(reason => {
        console.log(reason);
      });
  }, []);
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
    // if (pdf) {
    // setSubmitDisabled(true);
    switch (true) {
      case title.length === 0:
        Toast.show({
          type: 'error',
          text1: '제목을 입력해주세요.',
          position: 'bottom',
        });
        return;
      case !pdf:
        Toast.show({
          type: 'error',
          text1: 'PDF 파일을 선택해주세요.',
          position: 'bottom',
        });
        return;
    }
    setProgressModalVisible(true);
    let form = new FormData();
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
    // form.append('pdf', pdf);
    form.append('pdf', {uri: pdf?.uri, type: pdf?.type, name: pdf?.name});
    form.append('_csrf', csrfToken);
    setPdf(undefined);
    apiInstance
      .post('/api/post/upload', form, {
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
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log('error', error);
        Toast.show({
          type: 'error',
          text1: 'Unknown Error Occurred!',
          position: 'bottom',
        });
        setProgressModalVisible(false);
      });
    // }
  }, [csrfToken, pdf, title, content, thumbnail, navigation]);
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
            style={{backgroundColor: '#60B630', height: 250 + insets.top}}
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
                size={28}
                // disabled={title.length === 0 && !thumbnail && !pdf}
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
            <Button
              onPress={openPdfPicker}
              buttonStyle={{
                paddingVertical: 5,
                paddingHorizontal: 45,
                backgroundColor: pdf ? '#3a3a3a' : '#60B630',
              }}
              containerStyle={{marginBottom: 8, borderRadius: 300}}
              title={
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  {/*<Text style={{fontSize: 8}}></Text>*/}
                  <Text style={{fontSize: 13, paddingVertical: 14}}>
                    {pdf ? 'PDF 선택완료' : '내 PDF 업로드'}
                  </Text>
                  {/*<Text style={{fontSize: 8}}></Text>*/}
                </View>
              }
            />
            <Text style={{fontSize: 10, marginBottom: 15, color: '#60B630'}}>
              (최대 20MB)
            </Text>
            <View style={styles.inputField}>
              <TextInput
                onChangeText={setTitle}
                style={styles.titleInput}
                placeholderTextColor={'#1ba639'}
                placeholder={'컨텐츠의 제목을 넣어주세요'}
                autoCorrect={false}
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
  submitButton: {
    alignSelf: 'flex-end',
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
  },
  contentInput: {
    minHeight: 200,
    // backgroundColor: '#fff',
    color: 'white',
    // paddingHorizontal: 5,
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
export default Upload;
