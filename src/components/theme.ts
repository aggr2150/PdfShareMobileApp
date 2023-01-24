import {createTheme} from '@rneui/themed';

export default createTheme({
  components: {
    Button: {
      color: 'secondary',
    },
    Text: {
      style: {
        fontFamily: 'Apple SD Gothic Neo',
      },
    },
  },
  lightColors: {
    sheetsBackground: '#99c729',
    black: '#fff',
    white: '#262626',
    separator: '#fff',
    primary: '#99c729',
    background: '#000',
    secondary: '#1ba639',
    tertiary: '#60b630',
  },
});
