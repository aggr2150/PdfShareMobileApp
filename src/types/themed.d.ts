import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors {
    tertiary: string;
    accent: string;
    surface: string;
    sheetsBackground: string;
    separator: string;
  }
  export interface Theme {
    fontFamily: string;
  }
}
