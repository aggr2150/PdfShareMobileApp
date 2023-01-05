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

const LoginSheet: React.FC<SheetProps> = props => {
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
      // isModal={true}
      backgroundInteractionEnabled={true}
      // indicatorStyle={{height: 100}}
      useBottomSafeAreaPadding={true}
      containerStyle={{...styles.container, paddingBottom: insets.bottom}}>
      <View style={{paddingBottom: 35}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hello World</Text>
        </View>
        <View
          style={{
            marginBottom: 7,
          }}>
          <ToggleBtn />
        </View>
        <View>
          <Input
            style={styles.textInput}
            placeholder={'이메일 주소'}
            placeholderTextColor={'#99c729'}
            inputContainerStyle={{borderBottomWidth: 0}}
            renderErrorMessage={false}
            containerStyle={{paddingHorizontal: 0}}
            inputStyle={{margin: 0}}
          />
          <Input
            style={styles.textInput}
            placeholder={'비밀번호'}
            placeholderTextColor={'#99c729'}
            inputContainerStyle={{borderBottomWidth: 0}}
            renderErrorMessage={false}
            containerStyle={{paddingHorizontal: 0, margin: 0}}
            inputStyle={{margin: 0}}
          />
        </View>
        <View>
          <Button
            containerStyle={styles.submitButton}
            onPress={() => {
              navigation.reset({routes: [{name: 'Home'}]});
              SheetManager.hideAll();
            }}>
            aaa
          </Button>
        </View>
      </View>
    </ActionSheet>
  );
};
const useStyles = makeStyles(theme => ({
  submitButton: {
    borderRadius: 20,
  },
  container: {
    backgroundColor: theme.colors.sheetsBackground,
    paddingHorizontal: 35,
    // justifyContent: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
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
    color: theme.colors.white,
  },
}));
export default LoginSheet;
