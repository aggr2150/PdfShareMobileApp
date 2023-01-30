import React, {Dispatch, useEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import {SheetManager} from 'react-native-actions-sheet';
import Book from '@components/Book';

interface PagesProps {
  selectedIndex: number;
  SceneMap: React.ComponentType[];
  setSelectedIndex: Dispatch<number>;
  gesture?: boolean;
}

const Pages: React.FC<PagesProps> = ({
  selectedIndex,
  SceneMap,
  setSelectedIndex,
  gesture,
}) => {
  const styles = useStyles();
  const pagerRef = useRef<PagerView>(null);
  useEffect(() => {
    pagerRef.current?.setPage(selectedIndex);
  }, [selectedIndex]);
  return (
    <PagerView
      ref={pagerRef}
      style={styles.pagerView}
      scrollEnabled={false}
      initialPage={0}
      onPageSelected={event => setSelectedIndex(event.nativeEvent.position)}>
      {/*<View key="1">*/}
      {/*  <FirstSceneBk />*/}
      {/*</View>*/}
      {/*<View key="2">*/}
      {/*  <SecondScene />*/}
      {/*</View>*/}
      {SceneMap.map((Scene, index) => (
        <View key={index + 1}>
          <Scene />
        </View>
      ))}
    </PagerView>
  );
};

const useStyles = makeStyles(theme => ({
  pagerView: {
    flex: 1,
    // backgroundColor: 'red',
  },
}));

export default Pages;
