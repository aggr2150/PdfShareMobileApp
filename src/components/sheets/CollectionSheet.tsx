import {Platform, useWindowDimensions, View} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useEffect, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ButtonGroup} from '@rneui/themed';
import ToggleBtn from '@components/ToggleBtn';
import {useNavigation} from '@react-navigation/native';
import Separator from '@components/Seperator';
import Avatar from '@components/Avatar';
import BoxIcon from '@assets/icon/box.svg';

const CollectionSheet: React.FC<SheetProps> = props => {
  const styles = useStyles(props);
  const [orientation, setOrientation] = useState<string>();
  useEffect(() => {
    return Orientation.addOrientationListener(setOrientation);
  }, []);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {height, width} = useWindowDimensions();
  console.log(orientation);
  return (
    <ActionSheet
      // closable={false}
      id={props.sheetId}
      // headerAlwaysVisible={false}
      gestureEnabled={true}
      CustomHeaderComponent={<></>}
      statusBarTranslucent
      overdrawSize={0}
      isModal={true}
      // indicatorStyle={{height: 100}}
      drawUnderStatusBar={true}
      useBottomSafeAreaPadding={true}
      containerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>콜렉션 생성</Text>
        </View>
        <Separator style={{marginVertical: 10}} />
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 15,
          }}>
          <Avatar style={{width: 20, height: 20, marginRight: 5}} />
          <Text>콜렉션 추가</Text>
        </View>
        <Separator style={{marginVertical: 10}} />
        <View
          style={{
            marginHorizontal: 15,
            marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <BoxIcon fill={'white'} width={30} height={30} />
          <View style={{marginHorizontal: 10}}>
            <Text>저장된 PDF 보기</Text>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  submitButton: {
    borderRadius: 20,
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
export default CollectionSheet;
