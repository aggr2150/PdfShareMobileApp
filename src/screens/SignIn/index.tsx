import React, {PropsWithChildren} from 'react';
import {
  Dimensions,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Pdf from 'react-native-pdf';
import {Button, Input, makeStyles} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {SheetManager} from 'react-native-actions-sheet';

const SignIn: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const source = {
    uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    cache: true,
  };
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();

  const styles = useStyles();
  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <Button
          title={'navigate'}
          onPress={() => navigation.reset({routes: [{name: 'Home'}]})}
        />
        <Button
          title={'open'}
          onPress={() => SheetManager.show('loginSheet')}
        />
        <View
          style={{
            backgroundColor: 'red',
            width: 100,
            height: 100,
            position: 'absolute',
            bottom: 10,
            right: 10,
            alignSelf: 'flex-end',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
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
}));

export default SignIn;
