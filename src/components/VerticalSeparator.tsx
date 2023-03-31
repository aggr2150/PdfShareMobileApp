import React from 'react';
import {View, ViewStyle} from 'react-native';
import {makeStyles} from '@rneui/themed';

const VerticalSeparator: React.FC<{style?: ViewStyle}> = ({style}) => {
  const styles = useStyles();
  return <View style={[styles.separator, style]} />;
};

const useStyles = makeStyles(theme => ({
  separator: {
    backgroundColor: theme.colors.separator,
    width: 0.4,
    height: '100%',
    // marginVertical: 10,
  },
}));

export default VerticalSeparator;
