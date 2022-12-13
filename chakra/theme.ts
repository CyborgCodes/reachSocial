import {
  extendTheme,
  useColorModeValue,
  type ThemeConfig,
} from "@chakra-ui/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { Button } from "./button";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#276749",
    },
    config,
  },
  fonts: {
    body: "Open Sans, sans-serif",
    config,
  },
  styles: {
    global: () => ({
      body: {
        bg: useColorModeValue("gray.200", "gray.800"),
      },
    }),
  },
  components: {
    Button,
    config,
  },
});

export default theme;
