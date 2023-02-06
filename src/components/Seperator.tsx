import React from 'react';
import {View, ViewStyle} from 'react-native';
import {makeStyles} from '@rneui/themed';

const Separator: React.FC<{style?: ViewStyle}> = ({style}) => {
  const styles = useStyles();
  return <View style={[styles.separator, style]} />;
};

const useStyles = makeStyles(theme => ({
  separator: {
    backgroundColor: theme.colors.separator,
    height: 0.3,
    width: '100%',
    // marginVertical: 10,
  },
}));

export default Separator;
