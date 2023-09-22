import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: 'light',
}

const theme = extendTheme({
    config,
    /*colors: {
        gray: {
            50: '#e6f3ff',
            100: '#c6d9ec',
            200: '#a5bfda',
            300: '#82a6c9',
            400: '#608cb9',
            500: '#4773a0',
            600: '#36597d',
            700: '#24405a',
            800: '#132639',
            900: '#000e19',
        }
    }*/
})

export default theme;