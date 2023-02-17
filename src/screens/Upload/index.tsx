import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Book from '@components/Book';
import ProgressModal from '@screens/Upload/ProgressModal';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import BackButton from '@components/BackButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BookCover from '@components/BookCover';
import CheckButton from '@components/CheckButton';

type UploadProps = StackScreenProps<RootStackParamList, 'Upload'>;
const Upload: React.FC<UploadProps> = ({navigation, route}) => {
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
            style={{backgroundColor: '#99c729', height: dimensions.height / 3}}
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
            <View style={{padding: 5}}>
              <CheckButton
                onPress={submit}
                color={'white'}
                disabled={title.length === 0 && !thumbnail && !pdf}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View
              style={{
                // width: '50%',
                marginBottom: 20,
                height: dimensions.height / 3,
              }}>
              <Pressable onPress={openImagePicker}>
                <BookCover source={thumbnail} />
              </Pressable>
            </View>
            <Button
              onPress={openPdfPicker}
              buttonStyle={{
                borderRadius: 24,
                paddingVertical: 5,
                paddingHorizontal: 45,
                marginBottom: 24,
                backgroundColor: pdf ? '#3a3a3a' : '#99c729',
              }}
              title={
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 8}}></Text>
                  <Text style={{fontSize: 13}}>내 PDF 업로드</Text>
                  <Text style={{fontSize: 8}}>(최대 20MB)</Text>
                </View>
              }
            />
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
    // backgroundColor: '#fff',
    color: 'white',
    paddingHorizontal: 0,
    fontSize: 13,
    fontFamily: 'Apple SD Gothic Neo',
  },
  titleInput: {
    color: '#1ba639',
    textAlign: 'center',
    paddingHorizontal: 0,
    fontSize: 22,
    fontFamily: 'Apple SD Gothic Neo',
  },
  label: {
    marginTop: 3,
    fontSize: 12,
  },
}));
export default Upload;
