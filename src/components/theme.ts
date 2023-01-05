import {createTheme} from '@rneui/themed';

export default createTheme({
  components: {
    Button: {
      color: "secondary"
    },
    Text: {
      style: {
        fontFamily: 'Apple SD Gothic Neo',
      },
    },
  },
  lightColors: {
    sheetsBackground: '#99c729',
    black: '#262626',
    primary: '#99c729',
    background: '#000',
    secondary: '#1ba639'
  },
});
