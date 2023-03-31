import React, {useState} from 'react';
import {StatusBar, View} from 'react-native';
import {makeStyles} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import ToggleBtn from '@components/ToggleBtn';
import Pages from '@components/Pages';
import FirstScene from '@screens/Home/FirstScene';
import SecondScene from '@screens/Home/SecondScene';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

enum EnumSelectedIndex {
  '전체',
  '구독중',
}

const Home = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState<EnumSelectedIndex>(
    EnumSelectedIndex['전체'],
  );
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <View style={{position: 'absolute', top: insets.top || 24, zIndex: 1}}>
        <ToggleBtn
          labelText={['전체', '구독중']}
          textStyle={{fontSize: 10}}
          switchStyle={{borderRadius: 23, backgroundColor: '#262626'}}
          containerStyle={{
            height: 46,
            minWidth: 200,
            borderRadius: 23,
            backgroundColor: '#000',
          }}
          onPress={setSelectedIndex}
          splitCenter={true}
          selectedIndex={selectedIndex}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}>
        <Pages
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          SceneMap={[FirstScene, SecondScene]}
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
}));
export default Home;
