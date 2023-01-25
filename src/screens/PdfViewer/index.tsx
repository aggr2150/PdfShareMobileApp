import React, {useRef, useState} from 'react';
import {
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
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {makeStyles, Text} from '@rneui/themed';
import Avatar from '@components/Avatar';
import {useNavigation} from '@react-navigation/native';
import HeartIcon from '@assets/icon/heart.svg';
import CommentIcon from '@assets/icon/comment.svg';
import DotIcon from '@assets/icon/dot.svg';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';

const PdfViewer: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const source: Source = {
    // uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    // uri: 'ile://src/assets/테스트.pdf',
    // cache: true,
    // require("../../assets/테스트.pdf")
  };
  const {height, width} = useWindowDimensions();
  // const dispatch = useAppDispatch();
  // const UIVisible = useAppSelector(state => state.viewer.UIVisible);
  const [UIVisible, setUIVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const detailsActionSheetRef = useRef<ActionSheetRef>(null);
  const styles = useStyles();
  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={[styles.container, {overflow: 'visible'}]}>
        <Pdf
          trustAllCerts={false}
          // source={source}
          source={require('../../assets/test_3.pdf')}
          onPageSingleTap={() => setUIVisible(prevState => !prevState)}
          onLoadComplete={(numberOfPages, filePath) => {
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
            entering={SlideInLeft}
            exiting={SlideOutLeft}
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
                // shadowColor: '#000',
                // shadowOffset: {
                //   width: 0,
                //   height: 1,
                // },
                // shadowOpacity: 0.22,
                // shadowRadius: 1.22,
                // elevation: 1,

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
              entering={SlideInRight}
              exiting={SlideOutRight}
              style={{
                marginRight: insets.right || 15,
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={
                  () => navigation.navigate('Comments')
                  // () => SheetManager.show('commentSheet')
                }
                style={{
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
                }}>
                <HeartIcon fill={'black'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  () => navigation.navigate('Comments')
                  // () => SheetManager.show('commentSheet')
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
                <HeartIcon fill={'#99c729'} width={32} height={32} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Comments')}
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
              entering={SlideInDown}
              exiting={SlideOutDown}
              style={{
                // position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                // alignSelf: 'center',
              }}>
              <Pressable
                style={[
                  styles.titleContainer,
                  {
                    paddingBottom:
                      insets.bottom + styles.titleContainer.paddingHorizontal,
                  },
                ]}
                onPress={() => detailsActionSheetRef.current?.show()}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('ProfileTab');
                    navigation.push('Profile');
                  }}>
                  <Avatar style={{width: 20, height: 20, marginRight: 5}} />
                </Pressable>
                <Text>123123 님의 무슨무슨 pdf</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        )}
      </View>
      <ActionSheet ref={actionSheetRef}>
        <View style={{backgroundColor: '#606060'}}>
          <Text>abcabc</Text>
        </View>
      </ActionSheet>
      <ActionSheet
        ref={detailsActionSheetRef}
        useBottomSafeAreaPadding={true}
        headerAlwaysVisible={true}
        // drawUnderStatusBar={true}
        // statusBarTranslucent
        // snapPoints={[50]}
        containerStyle={styles.sheetContainer}>
        <ScrollView>
          <View style={{paddingVertical: 25}}>
            <Text style={styles.titleLabel}>이 PDF의 정보</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styles.counterLabel}>조회수 99292023회</Text>
              <Text style={styles.counterLabel}>좋아요 22387398789개</Text>
            </View>
            <Separator style={{marginVertical: 15}} />
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={styles.contentText}>
                제목 : 므나읨느음나이ㅡ마ㅣ
              </Text>
              <Text style={styles.contentText}>날짜 : 219023912380</Text>
              <Text style={styles.contentText}>
                설명 :
                으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으
                아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느
                ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ
                {/*능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ*/}
                {/*나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으*/}
                {/*아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으*/}
                {/*ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으*/}
                {/*아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ*/}
                {/*능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아*/}
                {/*ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능*/}
                {/*미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣ*/}
                {/*ㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미*/}
                {/*ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ*/}
                {/*느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣ*/}
                {/*ㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ으ㅏ능미ㅏㅡ나미으아ㅣㅁ느ㅏㅣ*/}
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
    // paddingBottom: 100,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    // backgroundColor: 'blue',
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    paddingVertical: 8,
    paddingHorizontal: 15,
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
