import {ListRenderItem, useWindowDimensions, View} from 'react-native';
import {Input, makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import React, {useEffect, useRef, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Separator from '@components/Seperator';
import Avatar from '@components/Avatar';
import {FlatList} from 'react-native-gesture-handler';

const CommentSheet: React.FC<SheetProps> = props => {
  const styles = useStyles(props);
  const [orientation, setOrientation] = useState<string>();
  useEffect(() => {
    return Orientation.addOrientationListener(setOrientation);
  }, []);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {height, width} = useWindowDimensions();
  console.log(orientation);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  // const scrollHandlers = useScrollHandlers<FlatList>(
  //   'scrollview-1',
  //   actionSheetRef,
  // );
  return (
    <ActionSheet
      ref={actionSheetRef}
      // closable={false}
      id={props.sheetId}
      // snapPoints={[60]}
      // headerAlwaysVisible={true}
      // gestureEnabled={true}
      // CustomHeaderComponent={
      //   <View>
      //     <Text>123123s</Text>
      //   </View>
      // }
      statusBarTranslucent
      overdrawSize={0}
      isModal={true}
      backgroundInteractionEnabled={true}
      // indicatorStyle={{height: 100}}
      drawUnderStatusBar={false}
      useBottomSafeAreaPadding={true}
      containerStyle={{
        ...styles.container,
        // paddingBottom: insets.bottom + 100,
      }}>
      <View
        style={{
          paddingBottom: insets.bottom + 52,
        }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>댓글</Text>
        </View>
        <Separator style={{marginVertical: 10}} />
        <View
          style={
            {
              // position: 'absolute',
              // bottom: 0,
              // left: 0,
              // right: 0,
              // width: 300,
              // height: 300,
            }
          }>
          <Input
            style={styles.textInput}
            placeholder={'이메일 주소'}
            placeholderTextColor={'#60B630'}
            inputContainerStyle={{borderBottomWidth: 0}}
            renderErrorMessage={false}
            containerStyle={{paddingHorizontal: 0}}
            inputStyle={{margin: 0}}
          />
        </View>
        <FlatList
          style={{height: '90%'}}
          // scrollEnabled={true}
          data={Array(12)}
          // style={{height: '100%'}}
          renderItem={Comment}
        />
      </View>
    </ActionSheet>
  );
};
const Comment: ListRenderItem = ({index}) => {
  return (
    <View style={{marginVertical: 6}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 20,
            height: 20,
            maxWidth: 20,
            marginRight: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Avatar style={{width: 20, height: 20}} />
        </View>
        <Text style={{fontSize: 13}}>11111 님</Text>
      </View>
      <View style={{marginLeft: 24}}>
        <Text style={{fontSize: 13}}>궁시렁궁시렁{index}</Text>
      </View>
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
    // paddingBottom: 100,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    // alignSelf: 'stretch',
    textAlign: 'left',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 14,
    // color: theme.colors.white,
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },
}));
export default CommentSheet;
