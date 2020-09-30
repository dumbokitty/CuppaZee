import { DarkTheme as PaperTheme } from 'react-native-paper';
import { DarkTheme as NavTheme } from '@react-navigation/native';

export default {
  ...PaperTheme,
  mode: "adaptive",
  colors: {
    ...PaperTheme.colors,
    primary: "#121212",
    accent: "#005627",
    text: "#ffffff",
    surface: "#000000",
    background: "#000000",
  },
  nav: {
    ...NavTheme,
    colors: {
      ...NavTheme.colors,
      background: "#000000",
      card: "#000000",
      text: "#ffffff",
      border: "#d3d3d3"
    }
  },
  drawer: {
    ...PaperTheme,
    mode: "exact",
    colors: {
      ...PaperTheme.colors,
      primary: "#000000",
      accent: "#005627",
      text: "#ffffff",
      surface: "#000000",
      background: "#000000",
    }
  }
}