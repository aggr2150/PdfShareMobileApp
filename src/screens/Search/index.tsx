import React, {useState} from 'react';
import {StatusBar, View} from 'react-native';
import {makeStyles} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import ToggleBtn from '@components/ToggleBtn';
import Pages from '@components/Pages';
import FirstScene from '@screens/Search/FirstScene';
import SecondScene from '@screens/Search/SecondScene';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchBar} from '@rneui/themed';

enum EnumSelectedIndex {
  '전체',
  '구독중',
}

const Search = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState<EnumSelectedIndex>(
    EnumSelectedIndex['전체'],
  );
  const [keyword, setKeyword] = useState<string>('');
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <View
        style={{
          position: 'absolute',
          top: insets.top || 24,
          zIndex: 1,
          left: 0,
          right: 0,
          marginHorizontal: 30,
        }}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          // inputContainerStyle={{}}
          // style={{borderRadius: 20, overflow: 'hidden'}}
          inputStyle={{minHeight: 35, marginLeft: 0}}
          rightIconContainerStyle={{height: 35}}
          leftIconContainerStyle={{height: 35}}
          containerStyle={{
            maxWidth: 700,
            // width: '100%',
            borderRadius: 300,
            overflow: 'hidden',
            padding: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          platform={'default'}
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
export default Search;
