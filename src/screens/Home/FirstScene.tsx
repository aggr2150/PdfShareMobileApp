import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {makeStyles} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import BookCard from '@components/BookCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatList, TouchableOpacity} from 'react-native';

const FirstScene = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState(Array(20));
  return (
    <FlatList<TPlace>
      data={data}
      contentContainerStyle={{width: '100%', marginTop: insets.top + 46 + 12}}
      contentOffset={{y: insets.top + 46 + 12, x: 0}}
      onEndReached={() => {
        setData(prev => [...prev, 1, 2]);
      }}
      renderItem={({item, index}) => <BookCard item={item} index={index} />}
    />
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
export default FirstScene;
