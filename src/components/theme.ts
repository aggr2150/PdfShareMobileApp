import {createTheme} from '@rneui/themed';

export default createTheme({
  components: {
    Button: {
      color: 'secondary',
      titleStyle: {
        fontFamily: 'Apple SD Gothic Neo',
        fontSize: 15,
      },
    },
    Text: {
      style: {
        fontFamily: 'Apple SD Gothic Neo',
      },
    },
  },
  fontFamily: 'Apple SD Gothic Neo',
  lightColors: {
    sheetsBackground: '#60B630',
    black: '#fff',
    white: '#262626',
    separator: '#393939',
    primary: '#60B630',
    background: '#000',
    secondary: '#1ba639',
    tertiary: '#60b630',
    grey0: '#4c4c4c',
    grey1: '#3a3a3a',
  },
});
